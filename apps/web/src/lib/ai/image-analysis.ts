// Enhanced Image Analysis Service for Laboratory AI Assistant
// Supports microscopy, gel electrophoresis, equipment monitoring, and general computer vision

import React, { useState, useMemo, useCallback, useEffect } from 'react';

export interface ImageAnalysisConfig {
  apiKey?: string;
  baseUrl?: string;
  maxFileSize: number;
  supportedFormats: string[];
  enableLocalProcessing: boolean;
  enableCloudProcessing: boolean;
  confidenceThreshold: number;
}

export interface ImageAnalysisResult {
  id: string;
  type: 'microscopy' | 'gel_electrophoresis' | 'equipment' | 'sample' | 'general';
  confidence: number;
  processingTime: number;
  detections: Detection[];
  measurements?: Measurement[];
  qualityAssessment?: QualityAssessment;
  recommendations?: string[];
  metadata: ImageMetadata;
  insights: string[];
  warnings?: string[];
}

export interface Detection {
  id: string;
  category: string;
  subcategory?: string;
  confidence: number;
  boundingBox: BoundingBox;
  properties: Record<string, any>;
  description: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Measurement {
  id: string;
  type: 'length' | 'area' | 'volume' | 'count' | 'intensity' | 'density';
  value: number;
  unit: string;
  confidence: number;
  method: string;
  calibration?: CalibrationInfo;
}

export interface CalibrationInfo {
  pixelsPerMicron?: number;
  magnification?: number;
  scaleFactor?: number;
  referenceObject?: string;
}

export interface QualityAssessment {
  overall: 'excellent' | 'good' | 'fair' | 'poor';
  focus: number; // 0-1
  brightness: number; // 0-1
  contrast: number; // 0-1
  noise: number; // 0-1
  saturation: number; // 0-1
  issues: string[];
  suggestions: string[];
}

export interface ImageMetadata {
  filename: string;
  fileSize: number;
  dimensions: { width: number; height: number };
  format: string;
  colorDepth: number;
  timestamp: number;
  exifData?: Record<string, any>;
  equipment?: EquipmentInfo;
}

export interface EquipmentInfo {
  type: string;
  model?: string;
  magnification?: number;
  illumination?: string;
  filters?: string[];
  settings?: Record<string, any>;
}

export interface MicroscopyAnalysis {
  cellCount?: number;
  cellViability?: number;
  contamination?: {
    detected: boolean;
    type?: string;
    severity: 'low' | 'medium' | 'high';
    confidence: number;
  };
  morphology?: {
    cellShape: string;
    cellSize: { min: number; max: number; average: number };
    clustering: boolean;
  };
  staining?: {
    type: string;
    quality: 'excellent' | 'good' | 'fair' | 'poor';
    distribution: 'uniform' | 'patchy' | 'uneven';
  };
}

export interface GelElectrophoresisAnalysis {
  laneCount: number;
  bandCount: number;
  bands: Array<{
    lane: number;
    position: number;
    intensity: number;
    estimatedSize?: number;
    confidence: number;
  }>;
  ladder?: {
    detected: boolean;
    type?: string;
    referenceMarkers?: number[];
  };
  quality: {
    resolution: 'excellent' | 'good' | 'fair' | 'poor';
    background: 'clean' | 'moderate' | 'noisy';
    streaking: boolean;
    smiling: boolean;
  };
}

export interface EquipmentMonitoring {
  equipmentType: string;
  status: 'normal' | 'warning' | 'error' | 'maintenance_required';
  indicators: Array<{
    type: 'led' | 'display' | 'gauge' | 'button';
    status: string;
    confidence: number;
    location: BoundingBox;
  }>;
  readings?: Array<{
    parameter: string;
    value: string;
    unit?: string;
    confidence: number;
  }>;
  issues?: string[];
}

class ImageAnalysisService {
  private config: ImageAnalysisConfig;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  constructor(config: Partial<ImageAnalysisConfig> = {}) {
    this.config = {
      maxFileSize: 50 * 1024 * 1024, // 50MB
      supportedFormats: ['image/jpeg', 'image/png', 'image/tiff', 'image/bmp', 'image/webp'],
      enableLocalProcessing: true,
      enableCloudProcessing: true,
      confidenceThreshold: 0.7,
      ...config
    };

    this.initializeCanvas();
  }

  // Initialize canvas for image processing
  private initializeCanvas() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  // Main analysis method
  async analyzeImage(
    imageFile: File, 
    analysisType: 'auto' | 'microscopy' | 'gel_electrophoresis' | 'equipment' | 'sample' = 'auto'
  ): Promise<ImageAnalysisResult> {
    console.log(`🔬 Starting ${analysisType} image analysis...`);

    // Validate file
    this.validateImageFile(imageFile);

    // Load and preprocess image
    const imageData = await this.loadImage(imageFile);
    
    // Determine analysis type if auto
    if (analysisType === 'auto') {
      analysisType = await this.detectImageType(imageData);
    }

    // Extract metadata
    const metadata = await this.extractMetadata(imageFile, imageData);

    // Perform specific analysis based on type
    let result: ImageAnalysisResult;
    
    switch (analysisType) {
      case 'microscopy':
        result = await this.analyzeMicroscopyImage(imageData, metadata);
        break;
      case 'gel_electrophoresis':
        result = await this.analyzeGelElectrophoresis(imageData, metadata);
        break;
      case 'equipment':
        result = await this.analyzeEquipmentImage(imageData, metadata);
        break;
      case 'sample':
        result = await this.analyzeSampleImage(imageData, metadata);
        break;
      default:
        result = await this.performGeneralAnalysis(imageData, metadata);
    }

    // Assess image quality
    result.qualityAssessment = await this.assessImageQuality(imageData);

    console.log(`✅ Image analysis completed with ${result.confidence} confidence`);
    return result;
  }

  // Microscopy image analysis
  private async analyzeMicroscopyImage(imageData: ImageData, metadata: ImageMetadata): Promise<ImageAnalysisResult> {
    const startTime = Date.now();
    
    // Detect cells and structures
    const cellDetections = await this.detectCells(imageData);
    const contaminationAnalysis = await this.detectContamination(imageData);
    const morphologyAnalysis = await this.analyzeCellMorphology(imageData, cellDetections);
    
    // Perform measurements
    const measurements = await this.performMicroscopyMeasurements(imageData, cellDetections);
    
    // Generate insights
    const insights = this.generateMicroscopyInsights(cellDetections, contaminationAnalysis, morphologyAnalysis);
    
    const microscopyData: MicroscopyAnalysis = {
      cellCount: cellDetections.length,
      cellViability: this.calculateCellViability(cellDetections),
      contamination: contaminationAnalysis,
      morphology: morphologyAnalysis,
      staining: this.analyzeStaining(imageData)
    };

    return {
      id: `microscopy-${Date.now()}`,
      type: 'microscopy',
      confidence: this.calculateOverallConfidence([...cellDetections]),
      processingTime: Date.now() - startTime,
      detections: cellDetections,
      measurements,
      metadata,
      insights,
      recommendations: this.generateMicroscopyRecommendations(microscopyData),
      warnings: this.generateMicroscopyWarnings(microscopyData)
    };
  }

  // Gel electrophoresis analysis
  private async analyzeGelElectrophoresis(imageData: ImageData, metadata: ImageMetadata): Promise<ImageAnalysisResult> {
    const startTime = Date.now();
    
    // Detect lanes and bands
    const laneDetections = await this.detectGelLanes(imageData);
    const bandDetections = await this.detectGelBands(imageData, laneDetections);
    const ladderAnalysis = await this.analyzeLadder(imageData, laneDetections);
    
    // Perform measurements
    const measurements = await this.performGelMeasurements(imageData, bandDetections);
    
    // Generate insights
    const insights = this.generateGelInsights(laneDetections, bandDetections, ladderAnalysis);
    
    const gelData: GelElectrophoresisAnalysis = {
      laneCount: laneDetections.length,
      bandCount: bandDetections.length,
      bands: bandDetections.map(band => ({
        lane: band.properties.lane,
        position: band.properties.position,
        intensity: band.properties.intensity,
        estimatedSize: band.properties.estimatedSize,
        confidence: band.confidence
      })),
      ladder: ladderAnalysis,
      quality: this.assessGelQuality(imageData, laneDetections, bandDetections)
    };

    return {
      id: `gel-${Date.now()}`,
      type: 'gel_electrophoresis',
      confidence: this.calculateOverallConfidence([...laneDetections, ...bandDetections]),
      processingTime: Date.now() - startTime,
      detections: [...laneDetections, ...bandDetections],
      measurements,
      metadata,
      insights,
      recommendations: this.generateGelRecommendations(gelData)
    };
  }

  // Equipment monitoring analysis
  private async analyzeEquipmentImage(imageData: ImageData, metadata: ImageMetadata): Promise<ImageAnalysisResult> {
    const startTime = Date.now();
    
    // Detect equipment components
    const equipmentDetections = await this.detectEquipmentComponents(imageData);
    const statusIndicators = await this.detectStatusIndicators(imageData);
    const displayReadings = await this.readDisplayValues(imageData);
    
    // Generate insights
    const insights = this.generateEquipmentInsights(equipmentDetections, statusIndicators, displayReadings);
    
    const equipmentData: EquipmentMonitoring = {
      equipmentType: this.identifyEquipmentType(equipmentDetections),
      status: this.determineEquipmentStatus(statusIndicators),
      indicators: statusIndicators.map(indicator => ({
        type: indicator.properties.type,
        status: indicator.properties.status,
        confidence: indicator.confidence,
        location: indicator.boundingBox
      })),
      readings: displayReadings.map(reading => ({
        parameter: reading.properties.parameter,
        value: reading.properties.value,
        unit: reading.properties.unit,
        confidence: reading.confidence
      })),
      issues: this.identifyEquipmentIssues(statusIndicators, displayReadings)
    };

    return {
      id: `equipment-${Date.now()}`,
      type: 'equipment',
      confidence: this.calculateOverallConfidence([...equipmentDetections, ...statusIndicators]),
      processingTime: Date.now() - startTime,
      detections: [...equipmentDetections, ...statusIndicators],
      metadata,
      insights,
      recommendations: this.generateEquipmentRecommendations(equipmentData),
      warnings: this.generateEquipmentWarnings(equipmentData)
    };
  }

  // Sample image analysis
  private async analyzeSampleImage(imageData: ImageData, metadata: ImageMetadata): Promise<ImageAnalysisResult> {
    const startTime = Date.now();
    
    // Detect sample containers and contents
    const containerDetections = await this.detectContainers(imageData);
    const contentAnalysis = await this.analyzeSampleContents(imageData, containerDetections);
    const labelDetections = await this.detectLabels(imageData);
    
    // Generate insights
    const insights = this.generateSampleInsights(containerDetections, contentAnalysis, labelDetections);

    return {
      id: `sample-${Date.now()}`,
      type: 'sample',
      confidence: this.calculateOverallConfidence([...containerDetections, ...labelDetections]),
      processingTime: Date.now() - startTime,
      detections: [...containerDetections, ...labelDetections],
      metadata,
      insights,
      recommendations: this.generateSampleRecommendations(contentAnalysis)
    };
  }

  // General image analysis
  private async performGeneralAnalysis(imageData: ImageData, metadata: ImageMetadata): Promise<ImageAnalysisResult> {
    const startTime = Date.now();
    
    // General object detection
    const generalDetections = await this.performGeneralObjectDetection(imageData);
    const textDetections = await this.detectText(imageData);
    
    // Generate insights
    const insights = this.generateGeneralInsights(generalDetections, textDetections);

    return {
      id: `general-${Date.now()}`,
      type: 'general',
      confidence: this.calculateOverallConfidence([...generalDetections, ...textDetections]),
      processingTime: Date.now() - startTime,
      detections: [...generalDetections, ...textDetections],
      metadata,
      insights
    };
  }

  // Helper methods for image processing
  private validateImageFile(file: File): void {
    if (file.size > this.config.maxFileSize) {
      throw new Error(`File size (${file.size}) exceeds maximum allowed size (${this.config.maxFileSize})`);
    }

    if (!this.config.supportedFormats.includes(file.type)) {
      throw new Error(`Unsupported file format: ${file.type}`);
    }
  }

  private async loadImage(file: File): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (!this.canvas || !this.ctx) {
          reject(new Error('Canvas not initialized'));
          return;
        }

        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.ctx.drawImage(img, 0, 0);
        
        const imageData = this.ctx.getImageData(0, 0, img.width, img.height);
        resolve(imageData);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  private async detectImageType(imageData: ImageData): Promise<'microscopy' | 'gel_electrophoresis' | 'equipment' | 'sample'> {
    // Analyze image characteristics to determine type
    const features = this.extractImageFeatures(imageData);
    
    if (features.hasCircularObjects && features.hasCellLikeStructures) {
      return 'microscopy';
    } else if (features.hasHorizontalBands && features.hasLanes) {
      return 'gel_electrophoresis';
    } else if (features.hasDisplays || features.hasButtons || features.hasLEDs) {
      return 'equipment';
    } else {
      return 'sample';
    }
  }

  private extractImageFeatures(imageData: ImageData): any {
    // Simple feature extraction for image type detection
    // In a real implementation, this would use more sophisticated computer vision
    
    const { width, height, data } = imageData;
    let circularObjects = 0;
    let horizontalBands = 0;
    let verticalStructures = 0;
    
    // Simple edge detection and shape analysis
    // This is a simplified implementation
    
    return {
      hasCircularObjects: circularObjects > 10,
      hasCellLikeStructures: circularObjects > 5,
      hasHorizontalBands: horizontalBands > 3,
      hasLanes: verticalStructures > 2,
      hasDisplays: false, // Would implement display detection
      hasButtons: false,  // Would implement button detection
      hasLEDs: false     // Would implement LED detection
    };
  }

  private async extractMetadata(file: File, imageData: ImageData): Promise<ImageMetadata> {
    return {
      filename: file.name,
      fileSize: file.size,
      dimensions: { width: imageData.width, height: imageData.height },
      format: file.type,
      colorDepth: 8, // Simplified
      timestamp: Date.now(),
      exifData: await this.extractExifData(file)
    };
  }

  private async extractExifData(file: File): Promise<Record<string, any> | undefined> {
    // EXIF data extraction would be implemented here
    // For now, return undefined
    return undefined;
  }

  // Mock implementations for specialized analysis functions
  // In a real implementation, these would use actual computer vision algorithms

  private async detectCells(imageData: ImageData): Promise<Detection[]> {
    // Mock cell detection
    return [
      {
        id: 'cell-1',
        category: 'cell',
        subcategory: 'viable',
        confidence: 0.85,
        boundingBox: { x: 100, y: 100, width: 50, height: 50 },
        properties: { viability: 'high', size: 25 },
        description: 'Viable cell with normal morphology'
      }
    ];
  }

  private async detectContamination(imageData: ImageData): Promise<any> {
    return {
      detected: false,
      type: undefined,
      severity: 'low',
      confidence: 0.9
    };
  }

  private async analyzeCellMorphology(imageData: ImageData, cells: Detection[]): Promise<any> {
    return {
      cellShape: 'round',
      cellSize: { min: 20, max: 30, average: 25 },
      clustering: false
    };
  }

  private async performMicroscopyMeasurements(imageData: ImageData, cells: Detection[]): Promise<Measurement[]> {
    return [
      {
        id: 'count-1',
        type: 'count',
        value: cells.length,
        unit: 'cells',
        confidence: 0.9,
        method: 'automated_detection'
      }
    ];
  }

  private generateMicroscopyInsights(cells: Detection[], contamination: any, morphology: any): string[] {
    const insights: string[] = [];
    
    if (cells.length > 0) {
      insights.push(`Detected ${cells.length} cells in the image`);
    }
    
    if (!contamination.detected) {
      insights.push('No contamination detected');
    }
    
    insights.push(`Average cell size: ${morphology.cellSize.average}μm`);
    
    return insights;
  }

  private generateMicroscopyRecommendations(data: MicroscopyAnalysis): string[] {
    const recommendations: string[] = [];
    
    if (data.contamination?.detected) {
      recommendations.push('Investigate contamination source and implement containment measures');
    }
    
    if (data.cellViability && data.cellViability < 0.8) {
      recommendations.push('Cell viability appears low, check culture conditions');
    }
    
    return recommendations;
  }

  private generateMicroscopyWarnings(data: MicroscopyAnalysis): string[] {
    const warnings: string[] = [];
    
    if (data.contamination?.detected && data.contamination.severity === 'high') {
      warnings.push('⚠️ High level contamination detected - immediate action required');
    }
    
    return warnings;
  }

  // Similar mock implementations for other analysis types
  private async detectGelLanes(imageData: ImageData): Promise<Detection[]> { return []; }
  private async detectGelBands(imageData: ImageData, lanes: Detection[]): Promise<Detection[]> { return []; }
  private async analyzeLadder(imageData: ImageData, lanes: Detection[]): Promise<any> { return { detected: false }; }
  private async performGelMeasurements(imageData: ImageData, bands: Detection[]): Promise<Measurement[]> { return []; }
  private generateGelInsights(lanes: Detection[], bands: Detection[], ladder: any): string[] { return []; }
  private generateGelRecommendations(data: GelElectrophoresisAnalysis): string[] { return []; }
  private assessGelQuality(imageData: ImageData, lanes: Detection[], bands: Detection[]): any {
    return { resolution: 'good', background: 'clean', streaking: false, smiling: false };
  }

  private async detectEquipmentComponents(imageData: ImageData): Promise<Detection[]> { return []; }
  private async detectStatusIndicators(imageData: ImageData): Promise<Detection[]> { return []; }
  private async readDisplayValues(imageData: ImageData): Promise<Detection[]> { return []; }
  private generateEquipmentInsights(equipment: Detection[], indicators: Detection[], readings: Detection[]): string[] { return []; }
  private identifyEquipmentType(detections: Detection[]): string { return 'unknown'; }
  private determineEquipmentStatus(indicators: Detection[]): 'normal' | 'warning' | 'error' | 'maintenance_required' { return 'normal'; }
  private identifyEquipmentIssues(indicators: Detection[], readings: Detection[]): string[] { return []; }
  private generateEquipmentRecommendations(data: EquipmentMonitoring): string[] { return []; }
  private generateEquipmentWarnings(data: EquipmentMonitoring): string[] { return []; }

  private async detectContainers(imageData: ImageData): Promise<Detection[]> { return []; }
  private async analyzeSampleContents(imageData: ImageData, containers: Detection[]): Promise<any> { return {}; }
  private async detectLabels(imageData: ImageData): Promise<Detection[]> { return []; }
  private generateSampleInsights(containers: Detection[], contents: any, labels: Detection[]): string[] { return []; }
  private generateSampleRecommendations(contents: any): string[] { return []; }

  private async performGeneralObjectDetection(imageData: ImageData): Promise<Detection[]> { return []; }
  private async detectText(imageData: ImageData): Promise<Detection[]> { return []; }
  private generateGeneralInsights(objects: Detection[], text: Detection[]): string[] { return []; }

  // Utility methods
  private calculateCellViability(cells: Detection[]): number {
    const viableCells = cells.filter(cell => cell.properties.viability === 'high');
    return viableCells.length / cells.length;
  }

  private analyzeStaining(imageData: ImageData): any {
    return {
      type: 'unknown',
      quality: 'good',
      distribution: 'uniform'
    };
  }

  private calculateOverallConfidence(detections: Detection[]): number {
    if (detections.length === 0) return 0.5;
    const avgConfidence = detections.reduce((sum, det) => sum + det.confidence, 0) / detections.length;
    return avgConfidence;
  }

  private async assessImageQuality(imageData: ImageData): Promise<QualityAssessment> {
    // Simplified quality assessment
    return {
      overall: 'good',
      focus: 0.8,
      brightness: 0.7,
      contrast: 0.8,
      noise: 0.2,
      saturation: 0.7,
      issues: [],
      suggestions: ['Image quality is acceptable for analysis']
    };
  }

  // Batch processing
  async analyzeBatch(files: File[], analysisType: 'auto' | 'microscopy' | 'gel_electrophoresis' | 'equipment' | 'sample' = 'auto'): Promise<ImageAnalysisResult[]> {
    const results: ImageAnalysisResult[] = [];
    
    for (const file of files) {
      try {
        const result = await this.analyzeImage(file, analysisType);
        results.push(result);
      } catch (error) {
        console.error(`Failed to analyze ${file.name}:`, error);
        // Continue with other files
      }
    }
    
    return results;
  }

  // Configuration
  updateConfig(newConfig: Partial<ImageAnalysisConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): ImageAnalysisConfig {
    return { ...this.config };
  }

  // Cleanup
  destroy(): void {
    if (this.canvas) {
      this.canvas.remove();
      this.canvas = null;
      this.ctx = null;
    }
  }
}

// React hook for image analysis
export function useImageAnalysis(config?: Partial<ImageAnalysisConfig>) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ImageAnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const imageService = useMemo(() => new ImageAnalysisService(config), []);

  const analyzeImage = useCallback(async (
    file: File, 
    type: 'auto' | 'microscopy' | 'gel_electrophoresis' | 'equipment' | 'sample' = 'auto'
  ) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await imageService.analyzeImage(file, type);
      setResults(prev => [...prev, result]);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageService]);

  const analyzeBatch = useCallback(async (
    files: File[], 
    type: 'auto' | 'microscopy' | 'gel_electrophoresis' | 'equipment' | 'sample' = 'auto'
  ) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const batchResults = await imageService.analyzeBatch(files, type);
      setResults(prev => [...prev, ...batchResults]);
      return batchResults;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageService]);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      imageService.destroy();
    };
  }, [imageService]);

  return {
    isAnalyzing,
    results,
    error,
    analyzeImage,
    analyzeBatch,
    clearResults,
    imageService
  };
}

export default ImageAnalysisService; 

export async function analyzeImageData(imageData: any): Promise<ImageAnalysisResult> {
  const insights: string[] = []
  const recommendations: string[] = []
  const warnings: string[] = []

  try {
    // Analyze cell morphology
    if (imageData.cells && Array.isArray(imageData.cells)) {
      const cells = imageData.cells
      insights.push(`Detected ${cells.length} cells in the image`)
      
      // Check for contamination
      const contaminatedCells = cells.filter((cell: any) => cell.contaminationLevel > 0.1)
      if (contaminatedCells.length === 0) {
        insights.push('No contamination detected')
      }
      
      // Calculate average cell size
      const cellSizes = cells.map((cell: any) => cell.size)
      const avgSize = cellSizes.reduce((sum: number, size: number) => sum + size, 0) / cells.length
      insights.push(`Average cell size: ${avgSize.toFixed(1)}μm`)
    }

    // Analyze cell viability
    if (imageData.viability) {
      const viability = imageData.viability
      if (viability.percentage < 80) {
        recommendations.push('Cell viability appears low, check culture conditions')
      }
    }

    // Check for contamination
    if (imageData.contamination) {
      const contamination = imageData.contamination
      if (contamination.level > 0.5) {
        recommendations.push('Investigate contamination source and implement containment measures')
      }
      
      if (contamination.level > 0.8) {
        warnings.push('⚠️ High level contamination detected - immediate action required')
      }
    }

    return {
      id: `img-${Date.now()}`,
      type: 'general',
      confidence: imageData.confidence || 0.85,
      processingTime: Date.now(),
      detections: [],
      metadata: {
        filename: 'analyzed-image',
        fileSize: 0,
        dimensions: { width: 0, height: 0 },
        format: 'unknown',
        colorDepth: 0,
        timestamp: Date.now()
      },
      insights,
      recommendations,
      warnings
    }
  } catch (error) {
    console.error('Error analyzing image data:', error)
    return {
      id: `img-error-${Date.now()}`,
      type: 'general',
      confidence: 0,
      processingTime: Date.now(),
      detections: [],
      metadata: {
        filename: 'error-image',
        fileSize: 0,
        dimensions: { width: 0, height: 0 },
        format: 'unknown',
        colorDepth: 0,
        timestamp: Date.now()
      },
      insights: ['Error processing image data'],
      recommendations: ['Review image format and try again'],
      warnings: ['Image analysis failed']
    }
  }
}

export async function processImageAnalysis(images: any[]): Promise<ImageAnalysisResult[]> {
  const results: ImageAnalysisResult[] = []
  
  for (const image of images) {
    const result = await analyzeImageData(image)
    results.push(result)
  }
  
  return results
} 