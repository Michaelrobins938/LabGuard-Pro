import * as sql from 'mssql';
import { PrismaClient } from '@prisma/client';
import { AuditLogService } from './AuditLogService';

const prisma = new PrismaClient();
const auditLogService = new AuditLogService(prisma);

export interface LabWareConnection {
  server: string;
  database: string;
  username: string;
  password: string;
  port?: number;
}

export interface LabWareSample {
  sampleId: string;
  patientId: string;
  testType: string;
  result: string;
  collectionDate: Date;
  location: string;
  species?: string;
  poolId?: string;
  countyCode?: string;
  trapType?: string;
  trapLocation?: string;
  weatherConditions?: string;
  notes?: string;
}

export interface LabWareExtractionResult {
  samples: LabWareSample[];
  totalCount: number;
  positiveCount: number;
  speciesBreakdown: Record<string, number>;
  locationBreakdown: Record<string, number>;
  dateRange: {
    start: Date;
    end: Date;
  };
}

export class LabWareIntegrationService {
  /**
   * Test connection to LabWare LIMS 7.2
   */
  static async testConnection(
    connection: LabWareConnection,
    laboratoryId: string
  ): Promise<{ success: boolean; message: string; tables?: string[]; schema?: any }> {
    try {
      const config = {
        server: connection.server,
        database: connection.database,
        user: connection.username,
        password: connection.password,
        port: connection.port || 1433,
        options: {
          encrypt: true,
          trustServerCertificate: true,
          requestTimeout: 30000
        }
      };

      const pool = await sql.connect(config);
      
      // Test query to get available tables
      const result = await pool.request().query(`
        SELECT 
          TABLE_NAME,
          TABLE_SCHEMA
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_TYPE = 'BASE TABLE'
        ORDER BY TABLE_SCHEMA, TABLE_NAME
      `);

      // Get sample data schema
      const schemaResult = await pool.request().query(`
        SELECT 
          COLUMN_NAME,
          DATA_TYPE,
          IS_NULLABLE,
          COLUMN_DEFAULT
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'Samples'
        ORDER BY ORDINAL_POSITION
      `);

      await pool.close();

      return {
        success: true,
        message: 'LabWare 7.2 connection successful',
        tables: result.recordset.map((row: any) => `${row.TABLE_SCHEMA}.${row.TABLE_NAME}`),
        schema: schemaResult.recordset
      };
    } catch (error) {
      console.error('LabWare connection error:', error);
      return {
        success: false,
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Extract weekly sample data for Friday reports
   * Addresses the 4-5 hour manual report generation pain point
   */
  static async extractWeeklySamples(
    laboratoryId: string,
    weekEnding: Date,
    countyCode?: string
  ): Promise<LabWareExtractionResult> {
    try {
      // Get LabWare credentials from laboratory settings
      const laboratory = await prisma.laboratory.findUnique({
        where: { id: laboratoryId }
      });

      if (!laboratory?.settings) {
        throw new Error('Laboratory settings not found');
      }

      const settings = laboratory.settings as any;
      if (!settings.labwareConnection) {
        throw new Error('LabWare connection not configured');
      }

      const connection = JSON.parse(settings.labwareConnection);
      const config = {
        server: connection.server,
        database: connection.database,
        user: connection.username,
        password: connection.password,
        port: connection.port || 1433,
        options: {
          encrypt: true,
          trustServerCertificate: true
        }
      };

      const pool = await sql.connect(config);

      // Calculate week start (Monday)
      const weekStart = new Date(weekEnding);
      weekStart.setDate(weekEnding.getDate() - weekEnding.getDay() + 1);
      weekStart.setHours(0, 0, 0, 0);

      // Build query for LabWare 7.2 schema
      let query = `
        SELECT 
          s.SampleID,
          s.PatientID,
          s.TestType,
          s.Result,
          s.CollectionDate,
          s.Location,
          s.Species,
          s.PoolID,
          s.CountyCode,
          s.TrapType,
          s.TrapLocation,
          s.WeatherConditions,
          s.Notes,
          s.PatientName -- Extract mosquito pool ID from patient name field
        FROM Samples s
        WHERE s.CollectionDate BETWEEN @weekStart AND @weekEnding
      `;

      if (countyCode) {
        query += ` AND s.CountyCode = @countyCode`;
      }

      query += ` ORDER BY s.CollectionDate, s.Location`;

      const request = pool.request();
      request.input('weekStart', sql.DateTime, weekStart);
      request.input('weekEnding', sql.DateTime, weekEnding);
      
      if (countyCode) {
        request.input('countyCode', sql.VarChar, countyCode);
      }

      const result = await request.query(query);
      await pool.close();

      const samples = result.recordset.map((row: any) => ({
        sampleId: row.SampleID,
        patientId: row.PatientID,
        testType: row.TestType,
        result: row.Result,
        collectionDate: row.CollectionDate,
        location: row.Location,
        species: row.Species,
        poolId: this.extractPoolIdFromPatientName(row.PatientName),
        countyCode: row.CountyCode,
        trapType: row.TrapType,
        trapLocation: row.TrapLocation,
        weatherConditions: row.WeatherConditions,
        notes: row.Notes
      }));

      // Calculate analytics
      const positiveSamples = samples.filter(s => s.result === 'Positive');
      const speciesBreakdown = samples.reduce((acc, sample) => {
        if (sample.species) {
          acc[sample.species] = (acc[sample.species] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const locationBreakdown = samples.reduce((acc, sample) => {
        acc[sample.location] = (acc[sample.location] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        samples,
        totalCount: samples.length,
        positiveCount: positiveSamples.length,
        speciesBreakdown,
        locationBreakdown,
        dateRange: {
          start: weekStart,
          end: weekEnding
        }
      };

    } catch (error) {
      console.error('Error extracting LabWare samples:', error);
      throw new Error(`Failed to extract samples: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract mosquito pool ID from patient name field
   * LabWare stores pool IDs in the patient name field for vector surveillance
   */
  private static extractPoolIdFromPatientName(patientName: string): string | undefined {
    if (!patientName) return undefined;
    
    // Common patterns for pool IDs in patient name field
    const poolPatterns = [
      /POOL-(\d+)/i,
      /POOL_(\d+)/i,
      /MP-(\d+)/i, // Mosquito Pool
      /(\d+)-POOL/i,
      /POOL(\d+)/i
    ];

    for (const pattern of poolPatterns) {
      const match = patientName.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return undefined;
  }

  /**
   * Generate species codes for ArboNET compatibility
   */
  static standardizeSpeciesForArboNET(species: string): string {
    const speciesMap: Record<string, string> = {
      'Culex pipiens': 'CULEX_PIPIENS',
      'Culex quinquefasciatus': 'CULEX_QUINQUEFASCIATUS',
      'Culex tarsalis': 'CULEX_TARSALIS',
      'Aedes aegypti': 'AEDES_AEGYPTI',
      'Aedes albopictus': 'AEDES_ALBOPICTUS',
      'Aedes vexans': 'AEDES_VEXANS',
      'Anopheles quadrimaculatus': 'ANOPHELES_QUADRIMACULATUS',
      'Anopheles punctipennis': 'ANOPHELES_PUNCTIPENNIS',
      'Psorophora columbiae': 'PSOROPHORA_COLUMBIAE',
      'Psorophora ferox': 'PSOROPHORA_FEROX',
      'Culiseta inornata': 'CULISETA_INORNATA',
      'Coquillettidia perturbans': 'COQUILLETTIDIA_PERTURBANS'
    };

    return speciesMap[species] || species.toUpperCase().replace(/\s+/g, '_');
  }

  /**
   * Get historical data for trend analysis
   */
  static async getHistoricalData(
    laboratoryId: string,
    startDate: Date,
    endDate: Date,
    countyCode?: string
  ): Promise<LabWareSample[]> {
    try {
      const laboratory = await prisma.laboratory.findUnique({
        where: { id: laboratoryId }
      });

      if (!laboratory?.settings) {
        throw new Error('Laboratory settings not found');
      }

      const settings = laboratory.settings as any;
      if (!settings.labwareConnection) {
        throw new Error('LabWare connection not configured');
      }

      const connection = JSON.parse(settings.labwareConnection);
      const config = {
        server: connection.server,
        database: connection.database,
        user: connection.username,
        password: connection.password,
        port: connection.port || 1433,
        options: {
          encrypt: true,
          trustServerCertificate: true
        }
      };

      const pool = await sql.connect(config);

      let query = `
        SELECT 
          s.SampleID,
          s.PatientID,
          s.TestType,
          s.Result,
          s.CollectionDate,
          s.Location,
          s.Species,
          s.PoolID,
          s.CountyCode,
          s.TrapType,
          s.TrapLocation,
          s.WeatherConditions,
          s.Notes
        FROM Samples s
        WHERE s.CollectionDate BETWEEN @startDate AND @endDate
      `;

      if (countyCode) {
        query += ` AND s.CountyCode = @countyCode`;
      }

      query += ` ORDER BY s.CollectionDate DESC`;

      const request = pool.request();
      request.input('startDate', sql.DateTime, startDate);
      request.input('endDate', sql.DateTime, endDate);
      
      if (countyCode) {
        request.input('countyCode', sql.VarChar, countyCode);
      }

      const result = await request.query(query);
      await pool.close();

      return result.recordset.map((row: any) => ({
        sampleId: row.SampleID,
        patientId: row.PatientID,
        testType: row.TestType,
        result: row.Result,
        collectionDate: row.CollectionDate,
        location: row.Location,
        species: row.Species,
        poolId: row.PoolID,
        countyCode: row.CountyCode,
        trapType: row.TrapType,
        trapLocation: row.TrapLocation,
        weatherConditions: row.WeatherConditions,
        notes: row.Notes
      }));

    } catch (error) {
      console.error('Error getting historical data:', error);
      throw new Error(`Failed to get historical data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Save LabWare connection settings
   */
  static async saveConnectionSettings(
    laboratoryId: string,
    connection: LabWareConnection,
    userId: string
  ): Promise<void> {
    try {
      // Test connection first
      const testResult = await this.testConnection(connection, laboratoryId);
      if (!testResult.success) {
        throw new Error(`Connection test failed: ${testResult.message}`);
      }

      // Update laboratory settings
      await prisma.laboratory.update({
        where: { id: laboratoryId },
        data: {
          settings: {
            labwareConnection: JSON.stringify(connection),
            labwareLastTested: new Date().toISOString()
          }
        }
      });

      // Log the configuration
      await auditLogService.logActivity({
        action: 'LABWARE_CONNECTION_CONFIGURED',
        userId,
        laboratoryId,
        metadata: {
          server: connection.server,
          database: connection.database,
          tablesFound: testResult.tables?.length || 0
        }
      });

    } catch (error) {
      console.error('Error saving LabWare connection settings:', error);
      throw new Error(`Failed to save connection settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 