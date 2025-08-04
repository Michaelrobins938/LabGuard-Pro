import puppeteer, { Page, Browser } from 'puppeteer';
import { PrismaClient } from '@prisma/client';
import { AuditLogService } from './AuditLogService';

const prisma = new PrismaClient();
const auditLogService = new AuditLogService(prisma);

export interface NEDSSCredentials {
  username: string;
  password: string;
  countyCode: string;
}

export interface NEDSSCaseData {
  patientId: string;
  sampleId: string;
  testType: string;
  result: string;
  collectionDate: string;
  location: string;
  countyCode: string;
  species?: string;
  poolId?: string;
  trapType?: string;
  notes?: string;
}

export interface NEDSSAutomationResult {
  success: boolean;
  processed: number;
  errors: string[];
  sessionId?: string;
  processingTime: number;
}

export interface NEDSSSession {
  browser: Browser;
  page: Page;
  isLoggedIn: boolean;
  lastActivity: Date;
  sessionId: string;
}

export class NEDSSAutomationService {
  private static activeSessions: Map<string, NEDSSSession> = new Map();
  private static readonly SESSION_TIMEOUT = 20 * 60 * 1000; // 20 minutes
  private static readonly RETRY_ATTEMPTS = 3;
  private static readonly DELAY_BETWEEN_CASES = 2000; // 2 seconds

  /**
   * Automate Texas NEDSS data entry with robust session management
   * Addresses the 20-minute timeout and 6-screen process issues
   */
  static async automateSubmission(
    cases: NEDSSCaseData[],
    laboratoryId: string,
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<NEDSSAutomationResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    let processed = 0;
    let sessionId: string | undefined;

    try {
      // Get NEDSS credentials from laboratory settings
      const credentials = await this.getNEDSSCredentials(laboratoryId);
      
      // Get or create session
      const session = await this.getOrCreateSession(credentials);
      sessionId = session.sessionId;

      // Process each case with retry logic
      for (const caseData of cases) {
        try {
          await this.processCase(session, caseData, credentials);
          processed++;
          
          // Wait between cases to avoid overwhelming the system
          await this.delay(this.DELAY_BETWEEN_CASES);
          
        } catch (error) {
          const errorMsg = `Case ${caseData.patientId}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          errors.push(errorMsg);
          
          // If session expired, try to recreate
          if (this.isSessionExpiredError(error)) {
            await this.closeSession(sessionId);
            const newSession = await this.getOrCreateSession(credentials);
            sessionId = newSession.sessionId;
          }
        }
      }

      // Log the automation activity
      await auditLogService.logActivity({
        action: 'NEDSS_AUTOMATION_COMPLETED',
        userId,
        laboratoryId,
        ipAddress,
        userAgent,
        metadata: {
          processed,
          errors: errors.length,
          processingTime: Date.now() - startTime,
          sessionId
        }
      });

      return {
        success: processed > 0,
        processed,
        errors,
        sessionId,
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      console.error('NEDSS automation error:', error);
      
      // Clean up session on error
      if (sessionId) {
        await this.closeSession(sessionId);
      }

      throw new Error(`NEDSS automation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process a single case through the 6-screen NEDSS process
   */
  private static async processCase(
    session: NEDSSSession,
    caseData: NEDSSCaseData,
    credentials: NEDSSCredentials
  ): Promise<void> {
    const { page } = session;

    // Navigate to case entry form
    await page.goto('https://nedss.dshs.texas.gov/case-entry', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for form to load
    await page.waitForSelector('#case-form', { timeout: 15000 });

    // Screen 1: Basic patient information
    await this.fillScreen1(page, caseData, credentials);
    await page.click('#next-screen');
    await page.waitForSelector('#screen-2', { timeout: 10000 });

    // Screen 2: Test information
    await this.fillScreen2(page, caseData);
    await page.click('#next-screen');
    await page.waitForSelector('#screen-3', { timeout: 10000 });

    // Screen 3: Location information
    await this.fillScreen3(page, caseData);
    await page.click('#next-screen');
    await page.waitForSelector('#screen-4', { timeout: 10000 });

    // Screen 4: Clinical information (usually minimal for vector surveillance)
    await this.fillScreen4(page, caseData);
    await page.click('#next-screen');
    await page.waitForSelector('#screen-5', { timeout: 10000 });

    // Screen 5: Laboratory information
    await this.fillScreen5(page, caseData);
    await page.click('#next-screen');
    await page.waitForSelector('#screen-6', { timeout: 10000 });

    // Screen 6: Review and submit
    await this.fillScreen6(page, caseData);
    await page.click('#confirm-submit');

    // Wait for success message
    await page.waitForSelector('.success-message', { timeout: 15000 });

    // Update session activity
    session.lastActivity = new Date();
  }

  /**
   * Fill Screen 1: Basic patient information
   */
  private static async fillScreen1(
    page: Page,
    caseData: NEDSSCaseData,
    credentials: NEDSSCredentials
  ): Promise<void> {
    await page.type('#patient-id', caseData.patientId);
    await page.type('#sample-id', caseData.sampleId);
    await page.select('#county', credentials.countyCode);
    await page.type('#collection-date', caseData.collectionDate);
    
    if (caseData.species) {
      await page.select('#species', caseData.species);
    }
    
    if (caseData.poolId) {
      await page.type('#pool-id', caseData.poolId);
    }
  }

  /**
   * Fill Screen 2: Test information
   */
  private static async fillScreen2(page: Page, caseData: NEDSSCaseData): Promise<void> {
    await page.select('#test-type', caseData.testType);
    await page.select('#result', caseData.result);
    await page.type('#test-date', caseData.collectionDate);
    
    // Vector surveillance specific fields
    await page.select('#vector-type', 'MOSQUITO');
    await page.type('#trap-type', caseData.trapType || 'GRAVID');
  }

  /**
   * Fill Screen 3: Location information
   */
  private static async fillScreen3(page: Page, caseData: NEDSSCaseData): Promise<void> {
    await page.type('#location', caseData.location);
    await page.type('#trap-location', caseData.location);
    
    // Geocode address if needed
    if (caseData.location) {
      const coordinates = await this.geocodeAddress(caseData.location);
      if (coordinates) {
        await page.type('#latitude', coordinates.latitude.toString());
        await page.type('#longitude', coordinates.longitude.toString());
      }
    }
  }

  /**
   * Fill Screen 4: Clinical information
   */
  private static async fillScreen4(page: Page, caseData: NEDSSCaseData): Promise<void> {
    // For vector surveillance, clinical info is usually minimal
    await page.select('#case-status', 'CONFIRMED');
    await page.select('#disease-type', 'ARBOVIRAL');
    
    if (caseData.notes) {
      await page.type('#clinical-notes', caseData.notes);
    }
  }

  /**
   * Fill Screen 5: Laboratory information
   */
  private static async fillScreen5(page: Page, caseData: NEDSSCaseData): Promise<void> {
    await page.select('#lab-type', 'PUBLIC_HEALTH');
    await page.type('#lab-name', 'Vector Surveillance Laboratory');
    await page.type('#lab-id', caseData.sampleId);
  }

  /**
   * Fill Screen 6: Review and submit
   */
  private static async fillScreen6(page: Page, _caseData: NEDSSCaseData): Promise<void> {
    // Review all entered data
    await page.waitForSelector('#review-data', { timeout: 10000 });
    
    // Confirm submission
    await page.click('#confirm-submit');
  }

  /**
   * Get or create NEDSS session with timeout management
   */
  private static async getOrCreateSession(credentials: NEDSSCredentials): Promise<NEDSSSession> {
    // Check for existing valid session
    for (const [sessionId, session] of Array.from(this.activeSessions.entries())) {
      if (this.isSessionValid(session)) {
        return session;
      } else {
        // Clean up expired session
        await this.closeSession(sessionId);
      }
    }

    // Create new session
    return await this.createNewSession(credentials);
  }

  /**
   * Create new NEDSS session
   */
  private static async createNewSession(credentials: NEDSSCredentials): Promise<NEDSSSession> {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Navigate to login page
    await page.goto('https://nedss.dshs.texas.gov/login', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Login
    await page.type('#username', credentials.username);
    await page.type('#password', credentials.password);
    await page.click('#login-button');

    // Wait for login to complete
    await page.waitForSelector('.dashboard', { timeout: 30000 });

    const sessionId = `nedss_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: NEDSSSession = {
      browser,
      page,
      isLoggedIn: true,
      lastActivity: new Date(),
      sessionId
    };

    this.activeSessions.set(sessionId, session);
    return session;
  }

  /**
   * Check if session is still valid
   */
  private static isSessionValid(session: NEDSSSession): boolean {
    const timeSinceLastActivity = Date.now() - session.lastActivity.getTime();
    return timeSinceLastActivity < this.SESSION_TIMEOUT && session.isLoggedIn;
  }

  /**
   * Close NEDSS session
   */
  private static async closeSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      try {
        await session.browser.close();
      } catch (error) {
        console.error('Error closing browser session:', error);
      }
      this.activeSessions.delete(sessionId);
    }
  }

  /**
   * Get NEDSS credentials from laboratory settings
   */
  private static async getNEDSSCredentials(laboratoryId: string): Promise<NEDSSCredentials> {
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

    return JSON.parse(settings.nedssCredentials);
  }

  /**
   * Save NEDSS credentials
   */
  static async saveCredentials(
    laboratoryId: string,
    credentials: NEDSSCredentials,
    userId: string
  ): Promise<void> {
    try {
      // Test login with provided credentials
      const testResult = await this.testLogin(credentials);
      if (!testResult.success) {
        throw new Error(`Login test failed: ${testResult.message}`);
      }

      // Update laboratory settings
      await prisma.laboratory.update({
        where: { id: laboratoryId },
        data: {
          settings: {
            nedssCredentials: JSON.stringify(credentials),
            nedssLastTested: new Date().toISOString()
          }
        }
      });

      // Log the configuration
      await auditLogService.logActivity({
        action: 'NEDSS_CREDENTIALS_CONFIGURED',
        userId,
        laboratoryId,
        metadata: {
          username: credentials.username,
          countyCode: credentials.countyCode
        }
      });

    } catch (error) {
      console.error('Error saving NEDSS credentials:', error);
      throw new Error(`Failed to save credentials: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Test NEDSS login
   */
  private static async testLogin(credentials: NEDSSCredentials): Promise<{ success: boolean; message: string }> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      
      await page.goto('https://nedss.dshs.texas.gov/login', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      await page.type('#username', credentials.username);
      await page.type('#password', credentials.password);
      await page.click('#login-button');

      await page.waitForSelector('.dashboard', { timeout: 30000 });

      return {
        success: true,
        message: 'NEDSS login successful'
      };

    } catch (error) {
      return {
        success: false,
        message: `Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    } finally {
      await browser.close();
    }
  }

  /**
   * Check if error indicates session expiration
   */
  private static isSessionExpiredError(error: any): boolean {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return errorMessage.includes('timeout') || 
           errorMessage.includes('session') || 
           errorMessage.includes('login');
  }

  /**
   * Geocode address to get coordinates
   */
  private static async geocodeAddress(_address: string): Promise<{ latitude: number; longitude: number } | null> {
    // This would integrate with a geocoding service
    // For now, return null to indicate no geocoding
    return null;
  }

  /**
   * Utility function for delays
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clean up all active sessions
   */
  static async cleanupSessions(): Promise<void> {
    for (const sessionId of Array.from(this.activeSessions.keys())) {
      await this.closeSession(sessionId);
    }
  }
} 