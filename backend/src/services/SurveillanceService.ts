import * as sql from 'mssql';
import puppeteer, { Page } from 'puppeteer';
import { PrismaClient } from '@prisma/client';
import { AuditLogService } from './AuditLogService';
import type { AuditMeta } from './AuditLogService';
import { createObjectCsvWriter } from 'csv-writer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const auditLogService = new AuditLogService(prisma);

export interface LabWareConnection {
  server: string;
  database: string;
  username: string;
  password: string;
  port?: number;
}

export interface NEDSSAutomationData {
  countyCode: string;
  startDate: Date;
  endDate: Date;
  caseData: {
    patientId: string;
    sampleId: string;
    testType: string;
    result: string;
    collectionDate: string;
    location: string;
  }[];
}

export interface ArboNETUploadData {
  countyCode: string;
  weekEnding: Date;
  speciesData: {
    species: string;
    count: number;
    location: string;
    latitude?: number;
    longitude?: number;
    trapType: string;
    collectionDate: string;
  }[];
}

export interface ReportGenerationData {
  countyCode: string;
  weekEnding: Date;
  reportType: 'weekly' | 'monthly' | 'quarterly';
  includeMaps?: boolean;
  includeHistorical?: boolean;
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
}

export interface CountyReport {
  id: string;
  countyCode: string;
  weekEnding: Date;
  reportType: string;
  filePath: string;
  generatedAt: Date;
  generatedBy: string;
  summary: {
    totalSamples: number;
    positiveSamples: number;
    speciesBreakdown: Record<string, number>;
    locations: string[];
  };
}

export class SurveillanceService {
  /**
   * Test connection to LabWare LIMS
   */
  static async testLabWareConnection(
    connection: LabWareConnection,
    laboratoryId: string
  ): Promise<{ success: boolean; message: string; tables?: string[] }> {
    try {
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
      
      // Test query to get available tables
      const result = await pool.request().query(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_TYPE = 'BASE TABLE'
        ORDER BY TABLE_NAME
      `);

      await pool.close();

      return {
        success: true,
        message: 'LabWare connection successful',
        tables: result.recordset.map((row: any) => row.TABLE_NAME)
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
   * Extract sample data from LabWare LIMS
   */
  static async extractLabWareSamples(
    laboratoryId: string,
    startDate?: Date,
    endDate?: Date,
    sampleType?: string
  ): Promise<LabWareSample[]> {
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

      // Build query based on LabWare schema
      let query = `
        SELECT 
          s.SampleID,
          s.PatientID,
          s.TestType,
          s.Result,
          s.CollectionDate,
          s.Location,
          s.Species,
          s.PoolID
        FROM Samples s
        WHERE s.CollectionDate BETWEEN @startDate AND @endDate
      `;

      if (sampleType) {
        query += ` AND s.TestType = @sampleType`;
      }

      const request = pool.request();
      request.input('startDate', sql.DateTime, startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
      request.input('endDate', sql.DateTime, endDate || new Date());
      
      if (sampleType) {
        request.input('sampleType', sql.VarChar, sampleType);
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
        poolId: row.PoolID
      }));
    } catch (error) {
      console.error('Error extracting LabWare samples:', error);
      throw new Error(`Failed to extract samples: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Automate Texas NEDSS data entry using web automation
   */
  static async automateNEDSSSubmission(
    data: NEDSSAutomationData,
    laboratoryId: string,
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ success: boolean; processed: number; errors: string[] }> {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const errors: string[] = [];
    let processed = 0;

    try {
      const page = await browser.newPage();
      
      // Navigate to Texas NEDSS login
      await page.goto('https://nedss.dshs.texas.gov/login');
      
      // Get NEDSS credentials from laboratory settings
      const laboratory = await prisma.laboratory.findUnique({
        where: { id: laboratoryId }
      });

      if (!laboratory?.settings) {
        throw new Error('Laboratory settings not found');
      }

      const settings = laboratory.settings as any;
      if (!settings.nedssCredentials) {
        throw new Error('NEDSS credentials not configured');
      }

      const credentials = JSON.parse(settings.nedssCredentials);

      // Login to NEDSS
      await page.type('#username', credentials.username);
      await page.type('#password', credentials.password);
      await page.click('#login-button');
      
      // Wait for login to complete
      await page.waitForSelector('.dashboard', { timeout: 30000 });

      // Process each case
      for (const caseData of data.caseData) {
        try {
          // Navigate to case entry form
          await page.goto('https://nedss.dshs.texas.gov/case-entry');
          await page.waitForSelector('#case-form', { timeout: 10000 });

          // Fill out the 6-screen process
          await this.fillNEDSSForm(page, caseData, data.countyCode);
          
          // Submit the case
          await page.click('#submit-case');
          await page.waitForSelector('.success-message', { timeout: 15000 });
          
          processed++;
          
          // Wait between submissions to avoid timeouts
          await page.waitForTimeout(2000);
          
        } catch (error) {
          errors.push(`Case ${caseData.patientId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Log the automation activity
      await auditLogService.logActivity({
        action: 'NEDSS_AUTOMATION',
        userId,
        laboratoryId,
        ipAddress,
        userAgent,
        metadata: {
          countyCode: data.countyCode,
          processed,
          errors: errors.length,
          dateRange: {
            start: data.startDate,
            end: data.endDate
          }
        }
      });

    } catch (error) {
      console.error('NEDSS automation error:', error);
      throw new Error(`NEDSS automation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      await browser.close();
    }

    return { success: processed > 0, processed, errors };
  }

  /**
   * Fill out NEDSS form screens
   */
  private static async fillNEDSSForm(
    page: Page,
    caseData: NEDSSAutomationData['caseData'][0],
    countyCode: string
  ): Promise<void> {
    // Screen 1: Basic patient information
    await page.type('#patient-id', caseData.patientId);
    await page.type('#sample-id', caseData.sampleId);
    await page.select('#county', countyCode);
    await page.click('#next-screen');

    // Screen 2: Test information
    await page.select('#test-type', caseData.testType);
    await page.type('#result', caseData.result);
    await page.type('#collection-date', caseData.collectionDate);
    await page.click('#next-screen');

    // Screen 3: Location information
    await page.type('#location', caseData.location);
    await page.click('#next-screen');

    // Screen 4: Clinical information
    await page.click('#next-screen');

    // Screen 5: Laboratory information
    await page.click('#next-screen');

    // Screen 6: Review and submit
    await page.click('#confirm-submit');
  }

  /**
   * Upload data to CDC ArboNET
   */
  static async uploadToArboNET(
    data: ArboNETUploadData,
    laboratoryId: string,
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ success: boolean; uploaded: number; errors: string[] }> {
    try {
      // Generate ArboNET CSV format
      const csvData = this.generateArboNETCSV(data);
      
      // Get ArboNET credentials from laboratory settings
      const laboratory = await prisma.laboratory.findUnique({
        where: { id: laboratoryId }
      });

      if (!laboratory?.settings) {
        throw new Error('Laboratory settings not found');
      }

      const settings = laboratory.settings as any;
      if (!settings.arboretCredentials) {
        throw new Error('ArboNET credentials not configured');
      }

      const credentials = JSON.parse(settings.arboretCredentials);

      // Upload to ArboNET via their API or web interface
      const uploadResult = await this.uploadToArboNETSystem(csvData, credentials);

      // Log the upload activity
      await auditLogService.logActivity({
        action: 'ARBORET_UPLOAD',
        userId,
        laboratoryId,
        ipAddress,
        userAgent,
        metadata: {
          countyCode: data.countyCode,
          weekEnding: data.weekEnding,
          speciesCount: data.speciesData.length,
          uploadResult
        }
      });

      return uploadResult;
    } catch (error) {
      console.error('ArboNET upload error:', error);
      throw new Error(`ArboNET upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate ArboNET CSV format
   */
  private static generateArboNETCSV(data: ArboNETUploadData): string {
    const csvWriter = createObjectCsvWriter({
      path: 'temp_arboret.csv',
      header: [
        { id: 'county', title: 'COUNTY' },
        { id: 'weekEnding', title: 'WEEK_ENDING' },
        { id: 'species', title: 'SPECIES' },
        { id: 'count', title: 'COUNT' },
        { id: 'location', title: 'LOCATION' },
        { id: 'latitude', title: 'LATITUDE' },
        { id: 'longitude', title: 'LONGITUDE' },
        { id: 'trapType', title: 'TRAP_TYPE' },
        { id: 'collectionDate', title: 'COLLECTION_DATE' }
      ]
    });

    const records = data.speciesData.map(species => ({
      county: data.countyCode,
      weekEnding: data.weekEnding.toISOString().split('T')[0],
      species: this.standardizeSpeciesName(species.species),
      count: species.count,
      location: species.location,
      latitude: species.latitude || '',
      longitude: species.longitude || '',
      trapType: species.trapType,
      collectionDate: species.collectionDate
    }));

    csvWriter.writeRecords(records);
    return fs.readFileSync('temp_arboret.csv', 'utf8');
  }

  /**
   * Standardize species names for ArboNET
   */
  private static standardizeSpeciesName(species: string): string {
    const speciesMap: Record<string, string> = {
      'Culex pipiens': 'CULEX_PIPIENS',
      'Culex quinquefasciatus': 'CULEX_QUINQUEFASCIATUS',
      'Aedes aegypti': 'AEDES_AEGYPTI',
      'Aedes albopictus': 'AEDES_ALBOPICTUS',
      'Anopheles quadrimaculatus': 'ANOPHELES_QUADRIMACULATUS'
    };

    return speciesMap[species] || species.toUpperCase().replace(/\s+/g, '_');
  }

  /**
   * Upload to ArboNET system
   */
  private static async uploadToArboNETSystem(
    csvData: string,
    credentials: any
  ): Promise<{ success: boolean; uploaded: number; errors: string[] }> {
    // This would integrate with ArboNET's actual API
    // For now, we'll simulate the upload
    return {
      success: true,
      uploaded: csvData.split('\n').length - 1, // Exclude header
      errors: []
    };
  }

  /**
   * Generate automated county reports
   */
  static async generateCountyReport(
    data: ReportGenerationData,
    laboratoryId: string,
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<CountyReport> {
    try {
      // Extract data from LabWare
      const samples = await this.extractLabWareSamples(
        laboratoryId,
        new Date(data.weekEnding.getTime() - 7 * 24 * 60 * 60 * 1000),
        data.weekEnding
      );

      // Generate report content
      const reportContent = await this.generateReportContent(samples, data);
      
      // Create PDF report
      const pdfBuffer = await this.createPDFReport(reportContent, data);
      
      // Save report file
      const fileName = `county_report_${data.countyCode}_${data.weekEnding.toISOString().split('T')[0]}.pdf`;
      const filePath = path.join(process.cwd(), 'reports', fileName);
      
      // Ensure reports directory exists
      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }
      
      fs.writeFileSync(filePath, pdfBuffer);

      // Save report record to database
      const report = await prisma.surveillanceReport.create({
        data: {
          countyCode: data.countyCode,
          weekEnding: data.weekEnding,
          reportType: data.reportType,
          filePath,
          generatedAt: new Date(),
          generatedBy: userId,
          laboratoryId,
          summary: {
            totalSamples: samples.length,
            positiveSamples: samples.filter(s => s.result === 'Positive').length,
            speciesBreakdown: this.getSpeciesBreakdown(samples),
            locations: [...new Set(samples.map(s => s.location))]
          }
        }
      });

      // Log the report generation
      await auditLogService.logActivity({
        action: 'COUNTY_REPORT_GENERATED',
        userId,
        laboratoryId,
        ipAddress,
        userAgent,
        metadata: {
          reportId: report.id,
          countyCode: data.countyCode,
          weekEnding: data.weekEnding,
          reportType: data.reportType
        }
      });

      return {
        id: report.id,
        countyCode: report.countyCode,
        weekEnding: report.weekEnding,
        reportType: report.reportType,
        filePath: report.filePath || '',
        generatedAt: report.generatedAt,
        generatedBy: report.generatedBy,
        summary: report.summary as any
      };
    } catch (error) {
      console.error('Error generating county report:', error);
      throw new Error(`Failed to generate county report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate report content
   */
  private static async generateReportContent(
    samples: LabWareSample[],
    data: ReportGenerationData
  ): Promise<any> {
    const positiveSamples = samples.filter(s => s.result === 'Positive');
    const speciesBreakdown = this.getSpeciesBreakdown(samples);
    
    return {
      title: `${data.countyCode} County Vector Surveillance Report`,
      weekEnding: data.weekEnding,
      summary: {
        totalSamples: samples.length,
        positiveSamples: positiveSamples.length,
        positiveRate: samples.length > 0 ? (positiveSamples.length / samples.length * 100).toFixed(1) : '0'
      },
      speciesBreakdown,
      locations: [...new Set(samples.map(s => s.location))],
      positiveSamples: positiveSamples.map(s => ({
        sampleId: s.sampleId,
        species: s.species,
        location: s.location,
        collectionDate: s.collectionDate
      }))
    };
  }

  /**
   * Create PDF report
   */
  private static async createPDFReport(content: any, data: ReportGenerationData): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const lineHeight = fontSize * 1.2;
    
    let y = height - 50;
    
    // Title
    page.drawText(content.title, {
      x: 50,
      y,
      size: 18,
      font,
      color: rgb(0, 0, 0)
    });
    y -= lineHeight * 2;
    
    // Summary
    page.drawText('Summary', {
      x: 50,
      y,
      size: 14,
      font,
      color: rgb(0, 0, 0)
    });
    y -= lineHeight;
    
    page.drawText(`Total Samples: ${content.summary.totalSamples}`, {
      x: 50,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0)
    });
    y -= lineHeight;
    
    page.drawText(`Positive Samples: ${content.summary.positiveSamples}`, {
      x: 50,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0)
    });
    y -= lineHeight;
    
    page.drawText(`Positive Rate: ${content.summary.positiveRate}%`, {
      x: 50,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0)
    });
    y -= lineHeight * 2;
    
    // Species breakdown
    page.drawText('Species Breakdown', {
      x: 50,
      y,
      size: 14,
      font,
      color: rgb(0, 0, 0)
    });
    y -= lineHeight;
    
    Object.entries(content.speciesBreakdown).forEach(([species, count]) => {
      page.drawText(`${species}: ${count}`, {
        x: 50,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0)
      });
      y -= lineHeight;
    });
    
    return Buffer.from(await pdfDoc.save());
  }

  /**
   * Get species breakdown from samples
   */
  private static getSpeciesBreakdown(samples: LabWareSample[]): Record<string, number> {
    const breakdown: Record<string, number> = {};
    
    samples.forEach(sample => {
      if (sample.species) {
        breakdown[sample.species] = (breakdown[sample.species] || 0) + 1;
      }
    });
    
    return breakdown;
  }

  /**
   * Get report generation history
   */
  static async getReportHistory(
    laboratoryId: string,
    options: {
      countyCode?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<CountyReport[]> {
    const reports = await prisma.surveillanceReport.findMany({
      where: {
        laboratoryId,
        ...(options.countyCode && { countyCode: options.countyCode }),
        ...(options.startDate && { weekEnding: { gte: options.startDate } }),
        ...(options.endDate && { weekEnding: { lte: options.endDate } })
      },
      orderBy: { generatedAt: 'desc' },
      take: options.limit || 50,
      skip: options.offset || 0
    });

    return reports.map((report: any) => ({
      id: report.id,
      countyCode: report.countyCode,
      weekEnding: report.weekEnding,
      reportType: report.reportType,
      filePath: report.filePath,
      generatedAt: report.generatedAt,
      generatedBy: report.generatedBy,
      summary: report.summary as any
    }));
  }

  /**
   * Get surveillance analytics summary
   */
  static async getAnalyticsSummary(
    laboratoryId: string,
    countyCode?: string,
    timeRange?: string
  ): Promise<any> {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Get samples for the period
    const samples = await this.extractLabWareSamples(
      laboratoryId,
      startDate,
      endDate
    );

    // Calculate analytics
    const positiveSamples = samples.filter(s => s.result === 'Positive');
    const speciesBreakdown = this.getSpeciesBreakdown(samples);
    const locationBreakdown = samples.reduce((acc, sample) => {
      acc[sample.location] = (acc[sample.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      period: { startDate, endDate },
      summary: {
        totalSamples: samples.length,
        positiveSamples: positiveSamples.length,
        positiveRate: samples.length > 0 ? (positiveSamples.length / samples.length * 100).toFixed(1) : '0'
      },
      speciesBreakdown,
      locationBreakdown,
      trends: {
        weekly: this.calculateWeeklyTrends(samples),
        monthly: this.calculateMonthlyTrends(samples)
      }
    };
  }

  /**
   * Calculate weekly trends
   */
  private static calculateWeeklyTrends(samples: LabWareSample[]): any[] {
    // Group samples by week and calculate trends
    const weeklyData = samples.reduce((acc, sample) => {
      const weekStart = new Date(sample.collectionDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!acc[weekKey]) {
        acc[weekKey] = { total: 0, positive: 0 };
      }
      
      acc[weekKey].total++;
      if (sample.result === 'Positive') {
        acc[weekKey].positive++;
      }
      
      return acc;
    }, {} as Record<string, { total: number; positive: number }>);

    return Object.entries(weeklyData).map(([week, data]) => ({
      week,
      total: data.total,
      positive: data.positive,
      positiveRate: data.total > 0 ? (data.positive / data.total * 100).toFixed(1) : '0'
    }));
  }

  /**
   * Calculate monthly trends
   */
  private static calculateMonthlyTrends(samples: LabWareSample[]): any[] {
    // Group samples by month and calculate trends
    const monthlyData = samples.reduce((acc, sample) => {
      const monthKey = sample.collectionDate.toISOString().slice(0, 7); // YYYY-MM format
      
      if (!acc[monthKey]) {
        acc[monthKey] = { total: 0, positive: 0 };
      }
      
      acc[monthKey].total++;
      if (sample.result === 'Positive') {
        acc[monthKey].positive++;
      }
      
      return acc;
    }, {} as Record<string, { total: number; positive: number }>);

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      total: data.total,
      positive: data.positive,
      positiveRate: data.total > 0 ? (data.positive / data.total * 100).toFixed(1) : '0'
    }));
  }

  /**
   * Set up equipment monitoring integration
   */
  static async setupEquipmentMonitoring(
    data: {
      equipmentType: string;
      integrationType: string;
      credentials: any;
    },
    laboratoryId: string,
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<any> {
    try {
      // Save equipment monitoring configuration
      const monitoring = await prisma.equipmentMonitoring.create({
        data: {
          equipmentType: data.equipmentType,
          integrationType: data.integrationType,
          credentials: data.credentials,
          laboratoryId,
          isActive: true
        }
      });

      // Log the setup activity
      await auditLogService.logActivity({
        action: 'EQUIPMENT_MONITORING_SETUP',
        userId,
        laboratoryId,
        ipAddress,
        userAgent,
        metadata: {
          equipmentType: data.equipmentType,
          integrationType: data.integrationType,
          monitoringId: monitoring.id
        }
      });

      return {
        id: monitoring.id,
        equipmentType: monitoring.equipmentType,
        integrationType: monitoring.integrationType,
        isActive: monitoring.isActive,
        createdAt: monitoring.createdAt
      };
    } catch (error) {
      console.error('Error setting up equipment monitoring:', error);
      throw new Error(`Failed to setup equipment monitoring: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}