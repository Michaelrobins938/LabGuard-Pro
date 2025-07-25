'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, FileText, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ComplianceTool {
  id: string;
  name: string;
  category: string;
  description: string;
  technicalSpec: string;
  complianceCriteria: string[];
  regulatoryStandards: string[];
  implementationDetails: string[];
  status: 'active' | 'beta' | 'planned';
}

const complianceTools: ComplianceTool[] = [
  // Equipment Calibration System
  {
    id: 'temperature-calibration',
    name: 'Temperature Calibration Validator',
    category: 'Equipment Calibration',
    description: 'Validates temperature-sensitive equipment calibration against regulatory standards',
    technicalSpec: 'ISO 17025:2017 Section 6.4.1, ASTM E220-19',
    complianceCriteria: [
      'Accuracy: ±0.1°C from NIST-traceable reference',
      'Stability: Drift rate < 0.05°C/hour',
      'Uncertainty: Expanded uncertainty ≤ 0.2°C (k=2)',
      'Calibration Interval: Maximum 12 months'
    ],
    regulatoryStandards: [
      'ISO 17025:2017 Section 6.4.1 (Equipment)',
      'ASTM E220-19 (Temperature Measurement)',
      'CLIA 42 CFR 493.1253 (Equipment Requirements)'
    ],
    implementationDetails: [
      'Reference Standard Validation: Cross-references against NIST SRM 1968',
      'Drift Analysis: Implements linear regression analysis for trend detection',
      'Uncertainty Calculation: Uses GUM methodology for uncertainty propagation',
      'Calibration Scheduling: Automated scheduling based on equipment type and usage'
    ],
    status: 'active'
  },
  {
    id: 'ph-calibration',
    name: 'pH Meter Calibration System',
    category: 'Equipment Calibration',
    description: 'Multi-point pH calibration system implementing NIST-traceable buffer solutions',
    technicalSpec: 'ISO 17025:2017, ASTM D1293-18',
    complianceCriteria: [
      'Slope: 95-105% of theoretical Nernst slope (59.16 mV/pH at 25°C)',
      'Offset: ±0.02 pH units from theoretical zero point',
      'Response Time: ≤ 30 seconds to 95% of final reading',
      'Reproducibility: Standard deviation ≤ 0.01 pH units'
    ],
    regulatoryStandards: [
      'ISO 17025:2017 Section 6.4.1',
      'ASTM D1293-18 (pH Measurement)',
      'EPA Method 150.1 (pH Determination)'
    ],
    implementationDetails: [
      'Multi-point Calibration: Minimum 3-point calibration with temperature compensation',
      'Slope Calculation: Linear regression analysis of mV vs pH',
      'Electrode Performance: Continuous monitoring of electrode response characteristics',
      'Temperature Compensation: Automatic temperature correction using Arrhenius equation'
    ],
    status: 'active'
  },
  {
    id: 'balance-calibration',
    name: 'Balance Calibration Validator',
    category: 'Equipment Calibration',
    description: 'Comprehensive balance validation system implementing OIML Class E2 standards',
    technicalSpec: 'ISO 17025:2017, OIML R76-1, ASTM E617-18',
    complianceCriteria: [
      'Repeatability: ≤ 0.5e (scale interval)',
      'Linearity: ≤ 1.0e across measurement range',
      'Eccentricity: ≤ 1.0e at 1/3 maximum capacity',
      'Sensitivity: ≤ 0.5e',
      'Uncertainty: Expanded uncertainty ≤ 2e (k=2)'
    ],
    regulatoryStandards: [
      'ISO 17025:2017 Section 6.4.1',
      'OIML R76-1 (Non-automatic Weighing Instruments)',
      'ASTM E617-18 (Standard Specification for Laboratory Weights)'
    ],
    implementationDetails: [
      'Multi-point Calibration: 0%, 10%, 25%, 50%, 75%, 100% of capacity',
      'Environmental Compensation: Temperature, humidity, and vibration monitoring',
      'Uncertainty Analysis: Type A and Type B uncertainty components',
      'Calibration Interval: Based on usage frequency and environmental conditions'
    ],
    status: 'active'
  },
  {
    id: 'pipette-calibration',
    name: 'Pipette Calibration System',
    category: 'Equipment Calibration',
    description: 'Gravimetric pipette calibration system implementing ISO 8655 standards',
    technicalSpec: 'ISO 8655-6:2002, ASTM E1154-14',
    complianceCriteria: [
      'Accuracy: ±1.0% for Class A, ±2.0% for Class B',
      'Precision: ≤ 0.5% CV for Class A, ≤ 1.0% CV for Class B',
      'Systematic Error: ≤ 0.5% for Class A, ≤ 1.0% for Class B',
      'Random Error: ≤ 0.3% for Class A, ≤ 0.6% for Class B'
    ],
    regulatoryStandards: [
      'ISO 8655-6:2002 (Piston-operated volumetric apparatus)',
      'ASTM E1154-14 (Standard Specification for Piston or Plunger Operated Volumetric Apparatus)',
      'CLIA 42 CFR 493.1253'
    ],
    implementationDetails: [
      'Gravimetric Method: Weighing dispensed water at 20°C',
      'Multi-volume Testing: 10%, 50%, 100% of nominal volume',
      'Temperature Compensation: Automatic density correction',
      'Statistical Analysis: 10 replicate measurements per volume'
    ],
    status: 'active'
  },
  {
    id: 'microscope-calibration',
    name: 'Microscope Calibration Validator',
    category: 'Equipment Calibration',
    description: 'Comprehensive microscope calibration system implementing stage micrometer validation',
    technicalSpec: 'ISO 19012-1:2013, ASTM E1951-14',
    complianceCriteria: [
      'Magnification Accuracy: ±2% of nominal magnification',
      'Stage Micrometer: ±1% accuracy over measurement range',
      'Resolution: Meets Abbe diffraction limit',
      'Illumination: Uniform illumination ±10% across field of view'
    ],
    regulatoryStandards: [
      'ISO 19012-1:2013 (Microscopes - Designation of microscope objectives)',
      'ASTM E1951-14 (Standard Guide for Calibrating Reticles and Light Microscope Magnifications)',
      'CLIA 42 CFR 493.1253'
    ],
    implementationDetails: [
      'Stage Micrometer: NIST-traceable stage micrometer (0.01 mm divisions)',
      'Objective Lenses: 4x, 10x, 40x, 100x oil immersion',
      'Eyepiece Reticle: Calibrated eyepiece micrometer',
      'Illumination System: Köhler illumination setup'
    ],
    status: 'active'
  },
  {
    id: 'centrifuge-calibration',
    name: 'Centrifuge Calibration System',
    category: 'Equipment Calibration',
    description: 'Centrifuge performance validation system implementing speed accuracy and safety compliance',
    technicalSpec: 'ISO 17025:2017, IEC 61010-2-020:2016',
    complianceCriteria: [
      'Speed Accuracy: ±2% of set speed',
      'Speed Stability: ±1% during operation',
      'Rotor Balance: Imbalance detection ≤ 0.1 g',
      'Temperature Control: ±1°C of set temperature',
      'Safety Features: Door interlock, rotor imbalance detection, overspeed protection'
    ],
    regulatoryStandards: [
      'ISO 17025:2017 Section 6.4.1',
      'IEC 61010-2-020:2016 (Safety requirements for laboratory centrifuges)',
      'CLIA 42 CFR 493.1253'
    ],
    implementationDetails: [
      'Speed Measurement: Optical tachometer with NIST traceability',
      'Rotor Balance: Dynamic balancing system',
      'Temperature Monitoring: Calibrated temperature sensors',
      'Safety Validation: Interlock system testing'
    ],
    status: 'active'
  },
  // Sample Handling System
  {
    id: 'sample-collection',
    name: 'Sample Collection Protocol Validator',
    category: 'Sample Handling',
    description: 'Comprehensive sample collection validation system implementing CLSI guidelines',
    technicalSpec: 'CLSI GP41-A2, ISO 15189:2012',
    complianceCriteria: [
      'Protocol Adherence: 100% compliance with approved SOPs',
      'Sample Integrity: No evidence of contamination or degradation',
      'Chain of Custody: Complete documentation of custody transfers',
      'Documentation: All required fields completed accurately',
      'Quality Indicators: Acceptable quality scores ≥ 95%'
    ],
    regulatoryStandards: [
      'CLSI GP41-A2 (Collection of Diagnostic Venous Blood Specimens)',
      'ISO 15189:2012 (Medical laboratories - Requirements for quality and competence)',
      'CLIA 42 CFR 493.1241 (Specimen requirements)'
    ],
    implementationDetails: [
      'Protocol Validation: Rule-based engine for SOP compliance',
      'Integrity Assessment: Multi-parameter integrity evaluation',
      'Custody Documentation: Blockchain-based custody tracking',
      'Quality Scoring: Weighted scoring algorithm for quality assessment'
    ],
    status: 'active'
  },
  {
    id: 'sample-storage',
    name: 'Sample Storage Compliance System',
    category: 'Sample Handling',
    description: 'Automated sample storage monitoring system implementing temperature and inventory management',
    technicalSpec: 'ISO 15189:2012, CLSI GP44-A4',
    complianceCriteria: [
      'Temperature Stability: ±2°C of set temperature',
      'Humidity Control: 30-70% relative humidity',
      'Inventory Accuracy: 99.9% inventory accuracy',
      'Expiration Management: No expired samples in active inventory',
      'Security Access: Controlled access with audit trail'
    ],
    regulatoryStandards: [
      'ISO 15189:2012 Section 5.3 (Facilities and environmental conditions)',
      'CLSI GP44-A4 (Storage and Retrieval of Frozen and Fresh-Frozen Human Plasma)',
      'CLIA 42 CFR 493.1241'
    ],
    implementationDetails: [
      'Environmental Monitoring: IoT sensors with real-time data transmission',
      'Inventory System: Barcode/RFID-based inventory management',
      'Expiration Tracking: Automated expiration date calculation and alerts',
      'Security System: Role-based access control with audit logging'
    ],
    status: 'active'
  },
  {
    id: 'sample-transport',
    name: 'Sample Transport Validation System',
    category: 'Sample Handling',
    description: 'Comprehensive sample transport validation system implementing IATA regulations',
    technicalSpec: 'IATA Dangerous Goods Regulations, CLSI GP40-A3',
    complianceCriteria: [
      'Packaging: IATA-compliant packaging for biological samples',
      'Temperature Control: Maintained within specified temperature range',
      'Time Monitoring: Transport time within acceptable limits',
      'Chain of Custody: Complete custody documentation',
      'Safety Compliance: All safety requirements met'
    ],
    regulatoryStandards: [
      'IATA Dangerous Goods Regulations (Category B Biological Substances)',
      'CLSI GP40-A3 (Clinical Laboratory Transport)',
      'DOT 49 CFR 173.199 (Category B Infectious Substances)'
    ],
    implementationDetails: [
      'Packaging Validation: Automated packaging compliance checking',
      'Temperature Monitoring: IoT temperature sensors with GPS tracking',
      'Time Tracking: Real-time transport time monitoring',
      'Documentation: Digital transport documentation system',
      'Safety Validation: Automated safety compliance checking'
    ],
    status: 'active'
  },
  {
    id: 'sample-preparation',
    name: 'Sample Preparation Protocol Validator',
    category: 'Sample Handling',
    description: 'Automated sample preparation validation system implementing standardized protocols',
    technicalSpec: 'ISO 15189:2012, CLSI EP05-A3',
    complianceCriteria: [
      'Protocol Adherence: 100% compliance with approved protocols',
      'Quality Control: All QC parameters within acceptable limits',
      'Contamination Prevention: No evidence of cross-contamination',
      'Documentation: Complete preparation documentation',
      'Performance Metrics: All performance indicators within specifications'
    ],
    regulatoryStandards: [
      'ISO 15189:2012 Section 5.4 (Pre-examination processes)',
      'CLSI EP05-A3 (Evaluation of Precision of Quantitative Measurement Procedures)',
      'CLIA 42 CFR 493.1241'
    ],
    implementationDetails: [
      'Protocol Engine: Rule-based protocol validation system',
      'QC Monitoring: Real-time QC parameter tracking',
      'Contamination Detection: Automated contamination screening',
      'Documentation System: Digital preparation documentation',
      'Performance Tracking: Real-time performance metric monitoring'
    ],
    status: 'active'
  },
  {
    id: 'sample-disposal',
    name: 'Sample Disposal Compliance System',
    category: 'Sample Handling',
    description: 'Automated sample disposal validation system implementing EPA and DOT regulations',
    technicalSpec: 'EPA 40 CFR 261, DOT 49 CFR 173',
    complianceCriteria: [
      'Waste Classification: Accurate waste classification',
      'Disposal Method: Approved disposal method for waste type',
      'Documentation: Complete disposal documentation',
      'Environmental Compliance: All environmental requirements met',
      'Safety Validation: All safety requirements met'
    ],
    regulatoryStandards: [
      'EPA 40 CFR 261 (Identification and Listing of Hazardous Waste)',
      'DOT 49 CFR 173 (Shippers - General Requirements for Shipments and Packagings)',
      'State-specific hazardous waste regulations'
    ],
    implementationDetails: [
      'Classification Engine: Automated waste classification system',
      'Method Selection: Approved disposal method database',
      'Documentation System: Digital disposal documentation',
      'Compliance Checking: Automated compliance validation',
      'Safety Validation: Automated safety requirement checking'
    ],
    status: 'active'
  },
  {
    id: 'sample-custody',
    name: 'Sample Chain of Custody Validator',
    category: 'Sample Handling',
    description: 'Digital chain of custody validation system implementing blockchain technology',
    technicalSpec: 'ASTM D4840-18, ISO 17025:2017',
    complianceCriteria: [
      'Custody Chain: Complete and unbroken custody chain',
      'Documentation: Complete custody documentation',
      'Audit Trail: Comprehensive audit trail',
      'Legal Compliance: All legal requirements met',
      'Integrity Validation: Sample integrity maintained throughout custody'
    ],
    regulatoryStandards: [
      'ASTM D4840-18 (Standard Guide for Sample Chain-of-Custody Procedures)',
      'ISO 17025:2017 Section 7.5 (Technical records)',
      'CLIA 42 CFR 493.1241'
    ],
    implementationDetails: [
      'Blockchain System: Secure blockchain-based custody tracking',
      'Documentation Engine: Digital custody documentation system',
      'Audit System: Comprehensive audit trail system',
      'Legal Engine: Legal compliance validation system',
      'Integrity Monitoring: Real-time integrity monitoring'
    ],
    status: 'active'
  },
  // Result Validation System
  {
    id: 'result-accuracy',
    name: 'Test Result Accuracy Validator',
    category: 'Result Validation',
    description: 'Comprehensive test result validation system implementing statistical analysis',
    technicalSpec: 'ISO 15189:2012, CLSI EP15-A3',
    complianceCriteria: [
      'Measurement Accuracy: Within acceptable accuracy limits',
      'Uncertainty: Expanded uncertainty within specifications',
      'Quality Control: All QC parameters within acceptable limits',
      'Statistical Analysis: Statistically valid results',
      'Performance Metrics: All performance indicators within specifications'
    ],
    regulatoryStandards: [
      'ISO 15189:2012 Section 5.6 (Examination processes)',
      'CLSI EP15-A3 (User Verification of Performance for Precision and Trueness)',
      'CLIA 42 CFR 493.1253'
    ],
    implementationDetails: [
      'Accuracy Engine: Automated accuracy validation system',
      'Uncertainty Calculator: GUM-based uncertainty calculation',
      'QC Monitor: Real-time QC parameter monitoring',
      'Statistical Engine: Comprehensive statistical analysis system',
      'Performance Tracker: Real-time performance monitoring'
    ],
    status: 'active'
  },
  {
    id: 'quality-control',
    name: 'Quality Control Compliance System',
    category: 'Result Validation',
    description: 'Advanced quality control validation system implementing Westgard rules',
    technicalSpec: 'CLSI EP05-A3, Westgard Rules',
    complianceCriteria: [
      'Westgard Rules: No Westgard rule violations',
      'Control Charts: All control points within acceptable limits',
      'Trend Analysis: No significant trends detected',
      'Performance Monitoring: All performance indicators within specifications',
      'Corrective Actions: Appropriate corrective actions implemented'
    ],
    regulatoryStandards: [
      'CLSI EP05-A3 (Evaluation of Precision of Quantitative Measurement Procedures)',
      'Westgard Rules (Statistical Quality Control)',
      'CLIA 42 CFR 493.1253'
    ],
    implementationDetails: [
      'Westgard Engine: Automated Westgard rule validation',
      'Chart Monitor: Real-time control chart monitoring',
      'Trend Detector: Automated trend detection system',
      'Performance Tracker: Real-time performance monitoring',
      'Action Recommender: Automated corrective action recommendations'
    ],
    status: 'active'
  },
  {
    id: 'method-validation',
    name: 'Method Validation Compliance System',
    category: 'Result Validation',
    description: 'Comprehensive method validation system implementing performance characteristic assessment',
    technicalSpec: 'ISO 15189:2012, CLSI EP06-A',
    complianceCriteria: [
      'Performance Characteristics: All performance characteristics within specifications',
      'Regulatory Compliance: All regulatory requirements met',
      'Validation Protocol: Complete validation protocol implementation',
      'Documentation: Complete validation documentation',
      'Acceptance Criteria: All acceptance criteria met'
    ],
    regulatoryStandards: [
      'ISO 15189:2012 Section 5.5 (Examination processes)',
      'CLSI EP06-A (Evaluation of the Linearity of Quantitative Measurement Procedures)',
      'CLIA 42 CFR 493.1253'
    ],
    implementationDetails: [
      'Performance Engine: Automated performance characteristic assessment',
      'Compliance Engine: Automated regulatory compliance validation',
      'Protocol Engine: Complete validation protocol implementation',
      'Documentation System: Complete validation documentation',
      'Criteria Engine: Acceptance criteria validation system'
    ],
    status: 'active'
  },
  {
    id: 'data-integrity',
    name: 'Data Integrity Validation System',
    category: 'Result Validation',
    description: 'Comprehensive data integrity validation system implementing FDA 21 CFR Part 11',
    technicalSpec: 'FDA 21 CFR Part 11, ISO 27001:2013',
    complianceCriteria: [
      'Data Completeness: Complete and accurate data',
      'Audit Trail: Comprehensive audit trail',
      'Security Validation: All security requirements met',
      'Backup Validation: Complete backup validation',
      'Access Control: Appropriate access control implementation'
    ],
    regulatoryStandards: [
      'FDA 21 CFR Part 11 (Electronic Records; Electronic Signatures)',
      'ISO 27001:2013 (Information Security Management)',
      'CLIA 42 CFR 493.1253'
    ],
    implementationDetails: [
      'Completeness Engine: Automated data completeness validation',
      'Audit System: Comprehensive audit trail system',
      'Security Engine: Automated security validation',
      'Backup System: Complete backup validation system',
      'Access Engine: Role-based access control system'
    ],
    status: 'active'
  },
  {
    id: 'report-generation',
    name: 'Report Generation Compliance System',
    category: 'Result Validation',
    description: 'Automated report generation validation system implementing standardized formats',
    technicalSpec: 'ISO 15189:2012, CLSI GP02-A6',
    complianceCriteria: [
      'Format Compliance: Standardized report format',
      'Content Validation: Complete and accurate content',
      'Regulatory Compliance: All regulatory requirements met',
      'Quality Assessment: High-quality report generation',
      'Delivery Validation: Secure and timely delivery'
    ],
    regulatoryStandards: [
      'ISO 15189:2012 Section 5.8 (Post-examination processes)',
      'CLSI GP02-A6 (Clinical Laboratory Reports)',
      'CLIA 42 CFR 493.1291'
    ],
    implementationDetails: [
      'Format Engine: Automated format compliance checking',
      'Content Engine: Complete content validation system',
      'Compliance Engine: Automated regulatory compliance validation',
      'Quality Engine: Automated quality assessment system',
      'Delivery Engine: Secure delivery validation system'
    ],
    status: 'active'
  },
  {
    id: 'result-interpretation',
    name: 'Result Interpretation Validator',
    category: 'Result Validation',
    description: 'Advanced result interpretation validation system implementing clinical significance assessment',
    technicalSpec: 'ISO 15189:2012, CLSI EP28-A3c',
    complianceCriteria: [
      'Clinical Significance: Accurate clinical significance assessment',
      'Reference Ranges: Validated reference ranges',
      'Interpretation Accuracy: Accurate result interpretation',
      'Clinical Guidance: Appropriate clinical guidance',
      'Quality Assessment: High-quality interpretation'
    ],
    regulatoryStandards: [
      'ISO 15189:2012 Section 5.8 (Post-examination processes)',
      'CLSI EP28-A3c (Defining, Establishing, and Verifying Reference Intervals)',
      'CLIA 42 CFR 493.1291'
    ],
    implementationDetails: [
      'Significance Engine: Automated clinical significance assessment',
      'Range Engine: Reference range validation system',
      'Accuracy Engine: Interpretation accuracy validation',
      'Guidance Engine: Automated clinical guidance generation',
      'Quality Engine: Automated quality assessment system'
    ],
    status: 'active'
  },
  // Audit Preparation System
  {
    id: 'documentation-compliance',
    name: 'Documentation Compliance Validator',
    category: 'Audit Preparation',
    description: 'Comprehensive documentation validation system implementing complete documentation review',
    technicalSpec: 'ISO 17025:2017, ISO 15189:2012',
    complianceCriteria: [
      'Completeness Assessment: Complete documentation review',
      'Regulatory Compliance: All regulatory requirements met',
      'Gap Analysis: Comprehensive gap analysis',
      'Corrective Actions: Appropriate corrective actions implemented',
      'Audit Readiness: Complete audit readiness assessment'
    ],
    regulatoryStandards: [
      'ISO 17025:2017 Section 7.5 (Technical records)',
      'ISO 15189:2012 Section 4.3 (Document control)',
      'CLIA 42 CFR 493.1253'
    ],
    implementationDetails: [
      'Completeness Engine: Automated completeness assessment',
      'Compliance Engine: Automated regulatory compliance validation',
      'Gap Engine: Comprehensive gap analysis system',
      'Action Engine: Automated corrective action planning',
      'Readiness Engine: Complete audit readiness assessment'
    ],
    status: 'active'
  },
  {
    id: 'personnel-qualification',
    name: 'Personnel Qualification Validator',
    category: 'Audit Preparation',
    description: 'Comprehensive personnel qualification validation system implementing qualification assessment',
    technicalSpec: 'ISO 17025:2017, ISO 15189:2012',
    complianceCriteria: [
      'Qualification Assessment: Complete qualification assessment',
      'Training Records: Complete training record management',
      'Certification Validation: Valid certification validation',
      'Competency Assessment: Comprehensive competency assessment',
      'Compliance Validation: All compliance requirements met'
    ],
    regulatoryStandards: [
      'ISO 17025:2017 Section 6.2 (Personnel)',
      'ISO 15189:2012 Section 5.1 (Personnel)',
      'CLIA 42 CFR 493.1441'
    ],
    implementationDetails: [
      'Qualification Engine: Automated qualification assessment',
      'Training Engine: Complete training record management',
      'Certification Engine: Automated certification validation',
      'Competency Engine: Comprehensive competency assessment',
      'Compliance Engine: Automated compliance validation'
    ],
    status: 'active'
  },
  {
    id: 'facility-compliance',
    name: 'Facility Compliance Validator',
    category: 'Audit Preparation',
    description: 'Comprehensive facility compliance validation system implementing facility requirement assessment',
    technicalSpec: 'ISO 17025:2017, ISO 15189:2012',
    complianceCriteria: [
      'Requirement Assessment: Complete requirement assessment',
      'Safety Compliance: All safety requirements met',
      'Maintenance Scheduling: Appropriate maintenance scheduling',
      'Inspection Tracking: Complete inspection tracking',
      'Compliance Reporting: Complete compliance reporting'
    ],
    regulatoryStandards: [
      'ISO 17025:2017 Section 6.3 (Facilities and environmental conditions)',
      'ISO 15189:2012 Section 5.3 (Facilities and environmental conditions)',
      'CLIA 42 CFR 493.1441'
    ],
    implementationDetails: [
      'Requirement Engine: Automated requirement assessment',
      'Safety Engine: Automated safety compliance validation',
      'Maintenance Engine: Automated maintenance scheduling',
      'Inspection Engine: Complete inspection tracking',
      'Reporting Engine: Complete compliance reporting'
    ],
    status: 'active'
  },
  {
    id: 'equipment-inventory',
    name: 'Equipment Inventory Validator',
    category: 'Audit Preparation',
    description: 'Comprehensive equipment inventory validation system implementing inventory tracking',
    technicalSpec: 'ISO 17025:2017, ISO 15189:2012',
    complianceCriteria: [
      'Inventory Tracking: Complete inventory tracking',
      'Maintenance Records: Complete maintenance record management',
      'Calibration Scheduling: Appropriate calibration scheduling',
      'Compliance Reporting: Complete compliance reporting',
      'Performance Monitoring: Complete performance monitoring'
    ],
    regulatoryStandards: [
      'ISO 17025:2017 Section 6.4 (Equipment)',
      'ISO 15189:2012 Section 5.3 (Facilities and environmental conditions)',
      'CLIA 42 CFR 493.1253'
    ],
    implementationDetails: [
      'Tracking Engine: Automated inventory tracking',
      'Maintenance Engine: Complete maintenance record management',
      'Calibration Engine: Automated calibration scheduling',
      'Reporting Engine: Complete compliance reporting',
      'Performance Engine: Complete performance monitoring'
    ],
    status: 'active'
  },
  {
    id: 'quality-management',
    name: 'Quality Management System Validator',
    category: 'Audit Preparation',
    description: 'Comprehensive quality management system validation implementing complete QMS assessment',
    technicalSpec: 'ISO 17025:2017, ISO 15189:2012',
    complianceCriteria: [
      'System Assessment: Complete system assessment',
      'Process Documentation: Complete process documentation',
      'Improvement Recommendations: Appropriate improvement recommendations',
      'Compliance Reporting: Complete compliance reporting',
      'Performance Monitoring: Complete performance monitoring'
    ],
    regulatoryStandards: [
      'ISO 17025:2017 Section 4 (Management requirements)',
      'ISO 15189:2012 Section 4 (Management requirements)',
      'CLIA 42 CFR 493.1441'
    ],
    implementationDetails: [
      'Assessment Engine: Automated system assessment',
      'Documentation Engine: Complete process documentation',
      'Recommendation Engine: Automated improvement recommendations',
      'Reporting Engine: Complete compliance reporting',
      'Performance Engine: Complete performance monitoring'
    ],
    status: 'active'
  },
  {
    id: 'audit-trail',
    name: 'Audit Trail Validator',
    category: 'Audit Preparation',
    description: 'Comprehensive audit trail validation system implementing complete audit trail maintenance',
    technicalSpec: 'FDA 21 CFR Part 11, ISO 17025:2017',
    complianceCriteria: [
      'Trail Completeness: Complete audit trail maintenance',
      'Integrity Validation: Complete integrity validation',
      'Compliance Certification: Valid compliance certification',
      'Security Validation: All security requirements met',
      'Performance Monitoring: Complete performance monitoring'
    ],
    regulatoryStandards: [
      'FDA 21 CFR Part 11 (Electronic Records; Electronic Signatures)',
      'ISO 17025:2017 Section 7.5 (Technical records)',
      'CLIA 42 CFR 493.1253'
    ],
    implementationDetails: [
      'Completeness Engine: Automated trail completeness validation',
      'Integrity Engine: Complete integrity validation',
      'Certification Engine: Automated compliance certification',
      'Security Engine: Automated security validation',
      'Performance Engine: Complete performance monitoring'
    ],
    status: 'active'
  }
];

const categories = [
  'Equipment Calibration',
  'Sample Handling', 
  'Result Validation',
  'Audit Preparation'
];

export default function ComplianceToolsDocumentation() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTools = complianceTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.technicalSpec.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'beta':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />Beta</Badge>;
      case 'planned':
        return <Badge className="bg-gray-100 text-gray-800">Planned</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Compliance Tools Documentation
        </h1>
        <p className="text-gray-600">
          Comprehensive documentation for all 24 laboratory compliance validation tools
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tools by name, description, or technical specification..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Tools</p>
                <p className="text-2xl font-bold text-gray-900">{complianceTools.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Active Tools</p>
                <p className="text-2xl font-bold text-gray-900">
                  {complianceTools.filter(t => t.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Standards</p>
                <p className="text-2xl font-bold text-gray-900">24+</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tools by Category */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Tools</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category} value={category.toLowerCase().replace(' ', '-')}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{category}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTools
                  .filter(tool => tool.category === category)
                  .map(tool => (
                    <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{tool.name}</CardTitle>
                            <CardDescription className="mt-2">
                              {tool.description}
                            </CardDescription>
                          </div>
                          {getStatusBadge(tool.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">Technical Specification</h4>
                          <p className="text-sm text-gray-600">{tool.technicalSpec}</p>
                        </div>
                        
                        <Accordion type="single" collapsible>
                          <AccordionItem value="compliance-criteria">
                            <AccordionTrigger className="text-sm font-semibold">
                              Compliance Criteria
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                {tool.complianceCriteria.map((criteria, index) => (
                                  <li key={index}>{criteria}</li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="regulatory-standards">
                            <AccordionTrigger className="text-sm font-semibold">
                              Regulatory Standards
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                {tool.regulatoryStandards.map((standard, index) => (
                                  <li key={index}>{standard}</li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="implementation-details">
                            <AccordionTrigger className="text-sm font-semibold">
                              Implementation Details
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                {tool.implementationDetails.map((detail, index) => (
                                  <li key={index}>{detail}</li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Access Tool
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {categories.map(category => (
          <TabsContent key={category} value={category.toLowerCase().replace(' ', '-')} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTools
                .filter(tool => tool.category === category)
                .map(tool => (
                  <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{tool.name}</CardTitle>
                          <CardDescription className="mt-2">
                            {tool.description}
                          </CardDescription>
                        </div>
                        {getStatusBadge(tool.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Technical Specification</h4>
                        <p className="text-sm text-gray-600">{tool.technicalSpec}</p>
                      </div>
                      
                      <Accordion type="single" collapsible>
                        <AccordionItem value="compliance-criteria">
                          <AccordionTrigger className="text-sm font-semibold">
                            Compliance Criteria
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                              {tool.complianceCriteria.map((criteria, index) => (
                                <li key={index}>{criteria}</li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="regulatory-standards">
                          <AccordionTrigger className="text-sm font-semibold">
                            Regulatory Standards
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                              {tool.regulatoryStandards.map((standard, index) => (
                                <li key={index}>{standard}</li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="implementation-details">
                          <AccordionTrigger className="text-sm font-semibold">
                            Implementation Details
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                              {tool.implementationDetails.map((detail, index) => (
                                <li key={index}>{detail}</li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Access Tool
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Footer */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentation Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
          <div>
            <h4 className="font-semibold mb-2">Version Information</h4>
            <p>Version: 1.0</p>
            <p>Last Updated: January 2025</p>
            <p>Next Review: July 2025</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Compliance Standards</h4>
            <p>ISO 17025:2017</p>
            <p>ISO 15189:2012</p>
            <p>CLIA 42 CFR 493</p>
            <p>FDA 21 CFR Part 11</p>
          </div>
        </div>
      </div>
    </div>
  );
} 