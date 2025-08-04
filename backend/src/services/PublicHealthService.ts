import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PublicHealthService {
  // Chain of Custody Methods
  static async getChainOfCustodyRecords(laboratoryId: string) {
    try {
      const records = await prisma.chainOfCustodyRecord.findMany({
        where: { laboratoryId },
        orderBy: { createdAt: 'desc' },
        include: {
          transfers: {
            orderBy: { transferDateTime: 'desc' }
          }
        }
      });
      return records;
    } catch (error) {
      console.error('Error fetching chain of custody records:', error);
      throw new Error('Failed to fetch chain of custody records');
    }
  }

  static async createChainOfCustodyRecord(data: any) {
    try {
      const record = await prisma.chainOfCustodyRecord.create({
        data: {
          caseNumber: data.caseNumber,
          sampleId: data.sampleId,
          sampleType: data.sampleType,
          collectionOfficer: data.collectionOfficer,
          collectionDateTime: data.collectionDateTime,
          collectionLocation: data.collectionLocation,
          suspectedAgent: data.suspectedAgent,
          urgencyLevel: data.urgencyLevel,
          storageConditions: data.storageConditions,
          specialInstructions: data.specialInstructions,
          currentCustodian: data.currentCustodian,
          status: data.status,
          tamperSealsIntact: data.tamperSealsIntact,
          laboratoryId: data.laboratoryId,
          transfers: {
            create: data.transfers || []
          }
        },
        include: {
          transfers: true
        }
      });

      // If bioterrorism urgency, trigger immediate notification
      if (data.urgencyLevel === 'bioterrorism') {
        await this.triggerBioterrorismAlert({
          suspectedAgent: data.suspectedAgent || 'Unknown',
          location: data.collectionLocation,
          details: `Chain of custody initiated for bioterrorism suspect sample: ${data.sampleId}`,
          laboratoryId: data.laboratoryId,
          timestamp: new Date().toISOString()
        });
      }

      return record;
    } catch (error) {
      console.error('Error creating chain of custody record:', error);
      throw new Error('Failed to create chain of custody record');
    }
  }

  static async addCustodyTransfer(recordId: string, transferData: any) {
    try {
      // Get the record first to access laboratoryId
      const record = await prisma.chainOfCustodyRecord.findUnique({
        where: { id: recordId }
      });

      if (!record) {
        throw new Error('Chain of custody record not found');
      }

      const transfer = await prisma.custodyTransfer.create({
        data: {
          chainOfCustodyRecordId: recordId,
          fromPerson: transferData.fromPerson,
          toPerson: transferData.toPerson,
          transferDateTime: transferData.transferDateTime,
          purpose: transferData.purpose,
          condition: transferData.condition,
          signature: transferData.signature,
          witnessed: transferData.witnessed,
          witnessName: transferData.witnessName,
          laboratoryId: record.laboratoryId
        }
      });

      // Update current custodian
      await prisma.chainOfCustodyRecord.update({
        where: { id: recordId },
        data: { currentCustodian: transferData.toPerson }
      });

      return transfer;
    } catch (error) {
      console.error('Error adding custody transfer:', error);
      throw new Error('Failed to add custody transfer');
    }
  }

  static async generateCustodyForm(recordId: string) {
    try {
      const record = await prisma.chainOfCustodyRecord.findUnique({
        where: { id: recordId },
        include: {
          transfers: {
            orderBy: { transferDateTime: 'asc' }
          }
        }
      });

      if (!record) {
        throw new Error('Chain of custody record not found');
      }

      // Generate PDF using a library like puppeteer or jsPDF
      // This is a placeholder - you would implement actual PDF generation
      const pdfContent = this.generatePDFContent(record);
      
      // For now, return a simple text representation
      return Buffer.from(pdfContent, 'utf-8');
    } catch (error) {
      console.error('Error generating custody form:', error);
      throw new Error('Failed to generate custody form');
    }
  }

  private static generatePDFContent(record: any) {
    // This would be replaced with actual PDF generation
    return `
Chain of Custody Form
Case Number: ${record.caseNumber}
Sample ID: ${record.sampleId}
Collection Officer: ${record.collectionOfficer}
Collection Date: ${record.collectionDateTime}
Location: ${record.collectionLocation}
Urgency: ${record.urgencyLevel}
Status: ${record.status}

Transfers:
${record.transfers.map((transfer: any) => `
From: ${transfer.fromPerson}
To: ${transfer.toPerson}
Date: ${transfer.transferDateTime}
Purpose: ${transfer.purpose}
Condition: ${transfer.condition}
Signature: ${transfer.signature}
`).join('\n')}
    `;
  }

  // Sample Submission Methods
  static async submitClinicalSample(data: any) {
    try {
      const submission = await prisma.clinicalSubmission.create({
        data: {
          sampleId: data.sampleId,
          patientInfo: data.patientInfo,
          clinicalInfo: data.clinicalInfo,
          specimenInfo: data.specimenInfo,
          testingRequested: data.testingRequested,
          urgency: data.urgency,
          submittedAt: data.submittedAt,
          laboratoryId: data.laboratoryId
        }
      });

      // If bioterrorism urgency, trigger immediate notification
      if (data.urgency === 'bioterrorism') {
        await this.triggerBioterrorismAlert({
          suspectedAgent: data.clinicalInfo.suspectedAgent || 'Unknown',
          location: data.patientInfo.address || 'Unknown',
          details: `Clinical sample submitted with bioterrorism urgency: ${data.sampleId}`,
          laboratoryId: data.laboratoryId,
          timestamp: new Date().toISOString()
        });
      }

      return submission;
    } catch (error) {
      console.error('Error submitting clinical sample:', error);
      throw new Error('Failed to submit clinical sample');
    }
  }

  static async submitEnvironmentalSample(data: any) {
    try {
      const submission = await prisma.environmentalSubmission.create({
        data: {
          sampleId: data.sampleId,
          sampleInfo: data.sampleInfo,
          suspectedContamination: data.suspectedContamination,
          submitterInfo: data.submitterInfo,
          testingRequested: data.testingRequested,
          urgency: data.urgency,
          submittedAt: data.submittedAt,
          laboratoryId: data.laboratoryId
        }
      });

      // If bioterrorism urgency, trigger immediate notification
      if (data.urgency === 'bioterrorism') {
        await this.triggerBioterrorismAlert({
          suspectedAgent: data.suspectedContamination.agent || 'Unknown',
          location: data.sampleInfo.collectionSite,
          details: `Environmental sample submitted with bioterrorism urgency: ${data.sampleId}`,
          laboratoryId: data.laboratoryId,
          timestamp: new Date().toISOString()
        });
      }

      return submission;
    } catch (error) {
      console.error('Error submitting environmental sample:', error);
      throw new Error('Failed to submit environmental sample');
    }
  }

  // Emergency Response Methods
  static async getEmergencyResponseStatus(laboratoryId: string) {
    try {
      const status = {
        activeAlerts: 0,
        bioterrorismCases: 0,
        emergencyContacts: [
          { name: 'CDC Emergency', phone: '770-488-7100' },
          { name: 'FBI WMD', phone: '202-324-3000' },
          { name: 'Local Emergency', phone: '817-353-2020' }
        ],
        lastUpdated: new Date().toISOString()
      };

      // Count active bioterrorism cases
      const bioterrorismCases = await prisma.chainOfCustodyRecord.count({
        where: {
          laboratoryId,
          urgencyLevel: 'bioterrorism',
          status: 'active'
        }
      });

      status.bioterrorismCases = bioterrorismCases;
      status.activeAlerts = bioterrorismCases;

      return status;
    } catch (error) {
      console.error('Error fetching emergency response status:', error);
      throw new Error('Failed to fetch emergency response status');
    }
  }

  static async sendEmergencyNotification(data: any) {
    try {
      const notification = await prisma.emergencyNotification.create({
        data: {
          type: data.type,
          details: data.details,
          urgency: data.urgency,
          timestamp: data.timestamp,
          laboratoryId: data.laboratoryId
        }
      });

      // Send actual notifications (email, SMS, etc.)
      await this.sendActualNotifications(data);

      return notification;
    } catch (error) {
      console.error('Error sending emergency notification:', error);
      throw new Error('Failed to send emergency notification');
    }
  }

  private static async sendActualNotifications(data: any) {
    // This would integrate with actual notification services
    console.log('Sending emergency notification:', data);
    
    // Example integrations:
    // - Send SMS via Twilio
    // - Send email via SendGrid
    // - Send to CDC/FBI via their APIs
    // - Trigger local emergency response systems
  }

  // Bioterrorism Preparedness Methods
  static async getBioterrorismPreparednessStatus(laboratoryId: string) {
    try {
      const status: {
        readinessLevel: string;
        activeProtocols: string[];
        recentAlerts: any[];
        complianceStatus: string;
        lastDrill: string;
        nextDrill: string;
      } = {
        readinessLevel: 'HIGH',
        activeProtocols: [
          'CDC Bioterrorism Response Protocol',
          'FBI WMD Coordination',
          'ASM Guidelines Compliance',
          '24/7 Emergency Contact'
        ],
        recentAlerts: [],
        complianceStatus: 'COMPLIANT',
        lastDrill: '2024-01-15',
        nextDrill: '2024-04-15'
      };

      // Get recent bioterrorism alerts
      const recentAlerts = await prisma.bioterrorismAlert.findMany({
        where: {
          laboratoryId,
          timestamp: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        },
        orderBy: { timestamp: 'desc' },
        take: 5
      });

      status.recentAlerts = recentAlerts;

      return status;
    } catch (error) {
      console.error('Error fetching bioterrorism preparedness status:', error);
      throw new Error('Failed to fetch bioterrorism preparedness status');
    }
  }

  static async triggerBioterrorismAlert(data: any) {
    try {
      const alert = await prisma.bioterrorismAlert.create({
        data: {
          suspectedAgent: data.suspectedAgent,
          location: data.location,
          details: data.details,
          timestamp: data.timestamp,
          laboratoryId: data.laboratoryId
        }
      });

      // Immediate notifications
      await this.sendBioterrorismNotifications(data);

      return alert;
    } catch (error) {
      console.error('Error triggering bioterrorism alert:', error);
      throw new Error('Failed to trigger bioterrorism alert');
    }
  }

  private static async sendBioterrorismNotifications(data: any) {
    // Immediate notifications to CDC, FBI, and local authorities
    console.log('🚨 BIOTERRORISM ALERT TRIGGERED:', data);
    
    // This would include:
    // - CDC notification via their bioterrorism hotline
    // - FBI WMD Directorate notification
    // - Local emergency management notification
    // - State health department notification
    // - Internal laboratory emergency protocols
  }
} 