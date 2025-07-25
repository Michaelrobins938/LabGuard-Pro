// File Storage System for Enhanced Biomni AI
// Handles cloud storage integration for multi-modal file uploads

export interface FileUploadConfig {
  maxFileSize: number; // in bytes
  allowedTypes: string[];
  maxFiles: number;
  compression?: boolean;
  encryption?: boolean;
}

export interface UploadedFile {
  id: string;
  originalName: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  metadata: {
    uploadedBy: string;
    laboratoryId: string;
    uploadDate: Date;
    processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
    analysisResult?: any;
  };
}

export interface FileAnalysisResult {
  fileId: string;
  analysisType: 'text' | 'image' | 'data' | 'sequence' | 'document';
  confidence: number;
  extractedData: any;
  insights: string[];
  processingTime: number;
  toolsUsed: string[];
}

class FileStorageManager {
  private config: FileUploadConfig;
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.config = {
      maxFileSize: 100 * 1024 * 1024, // 100MB
      allowedTypes: [
        // Text files
        'text/plain', 'text/csv', 'text/tab-separated-values',
        // Documents
        'application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        // Spreadsheets
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        // Images
        'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff',
        // Data files
        'application/json', 'application/xml', 'text/xml',
        // Sequence files
        'text/fasta', 'text/fastq', 'application/fasta', 'application/fastq',
        // Archives
        'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'
      ],
      maxFiles: 10,
      compression: true,
      encryption: true
    };

    this.baseUrl = process.env.NEXT_PUBLIC_STORAGE_API_URL || '/api/storage';
    this.apiKey = process.env.NEXT_PUBLIC_STORAGE_API_KEY || '';
  }

  // Validate file before upload
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.config.maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds maximum limit of ${this.formatFileSize(this.config.maxFileSize)}`
      };
    }

    // Check file type
    if (!this.config.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not supported`
      };
    }

    return { valid: true };
  }

  // Upload single file
  async uploadFile(
    file: File, 
    userId: string, 
    laboratoryId: string,
    metadata?: Record<string, any>
  ): Promise<UploadedFile> {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('laboratoryId', laboratoryId);
    formData.append('metadata', JSON.stringify(metadata || {}));

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return await response.json();
  }

  // Upload multiple files
  async uploadFiles(
    files: File[], 
    userId: string, 
    laboratoryId: string,
    metadata?: Record<string, any>
  ): Promise<UploadedFile[]> {
    if (files.length > this.config.maxFiles) {
      throw new Error(`Maximum ${this.config.maxFiles} files allowed per upload`);
    }

    const uploadPromises = files.map(file => 
      this.uploadFile(file, userId, laboratoryId, metadata)
    );

    return Promise.all(uploadPromises);
  }

  // Get file by ID
  async getFile(fileId: string): Promise<UploadedFile> {
    const response = await fetch(`${this.baseUrl}/files/${fileId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get file: ${response.statusText}`);
    }

    return await response.json();
  }

  // Delete file
  async deleteFile(fileId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete file: ${response.statusText}`);
    }
  }

  // Analyze uploaded file
  async analyzeFile(fileId: string, analysisType?: string): Promise<FileAnalysisResult> {
    const response = await fetch(`${this.baseUrl}/files/${fileId}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({ analysisType })
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    return await response.json();
  }

  // Get file processing status
  async getProcessingStatus(fileId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress?: number;
    result?: FileAnalysisResult;
    error?: string;
  }> {
    const response = await fetch(`${this.baseUrl}/files/${fileId}/status`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get status: ${response.statusText}`);
    }

    return await response.json();
  }

  // Generate thumbnail for image files
  async generateThumbnail(fileId: string, width: number = 200, height: number = 200): Promise<string> {
    const response = await fetch(`${this.baseUrl}/files/${fileId}/thumbnail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({ width, height })
    });

    if (!response.ok) {
      throw new Error(`Failed to generate thumbnail: ${response.statusText}`);
    }

    const result = await response.json();
    return result.thumbnailUrl;
  }

  // Search files by metadata
  async searchFiles(
    query: string,
    filters?: {
      fileType?: string;
      dateRange?: { start: Date; end: Date };
      uploadedBy?: string;
      processingStatus?: string;
    }
  ): Promise<UploadedFile[]> {
    // Fix the URLSearchParams type issue
    const searchParams = new URLSearchParams();
    searchParams.append('q', query);
    
    // Handle filters properly
    if (filters?.fileType) searchParams.append('fileType', filters.fileType);
    if (filters?.uploadedBy) searchParams.append('uploadedBy', filters.uploadedBy);
    if (filters?.processingStatus) searchParams.append('processingStatus', filters.processingStatus);
    
    // Handle date range separately
    if (filters?.dateRange) {
      searchParams.append('startDate', filters.dateRange.start.toISOString());
      searchParams.append('endDate', filters.dateRange.end.toISOString());
    }

    const response = await fetch(`${this.baseUrl}/files/search?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    return await response.json();
  }

  // Get storage usage statistics
  async getStorageStats(laboratoryId: string): Promise<{
    totalFiles: number;
    totalSize: number;
    fileTypeBreakdown: Record<string, number>;
    recentUploads: UploadedFile[];
  }> {
    const response = await fetch(`${this.baseUrl}/stats/${laboratoryId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get stats: ${response.statusText}`);
    }

    return await response.json();
  }

  // Update file metadata
  async updateFileMetadata(
    fileId: string, 
    metadata: Record<string, any>
  ): Promise<UploadedFile> {
    const response = await fetch(`${this.baseUrl}/files/${fileId}/metadata`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(metadata)
    });

    if (!response.ok) {
      throw new Error(`Failed to update metadata: ${response.statusText}`);
    }

    return await response.json();
  }

  // Utility methods
  private formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Get file type category
  getFileTypeCategory(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('text/')) return 'text';
    if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet';
    if (mimeType.includes('json') || mimeType.includes('xml')) return 'data';
    if (mimeType.includes('fasta') || mimeType.includes('fastq')) return 'sequence';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) return 'archive';
    return 'other';
  }

  // Check if file type is supported for analysis
  isAnalyzable(mimeType: string): boolean {
    const analyzableTypes = [
      'text/plain', 'text/csv', 'application/pdf', 'image/jpeg', 'image/png',
      'application/json', 'text/fasta', 'text/fastq'
    ];
    return analyzableTypes.includes(mimeType);
  }
}

// Singleton instance
export const fileStorageManager = new FileStorageManager();

// React hook for file operations
export function useFileStorage() {
  const uploadFile = async (
    file: File, 
    userId: string, 
    laboratoryId: string,
    metadata?: Record<string, any>
  ) => {
    return await fileStorageManager.uploadFile(file, userId, laboratoryId, metadata);
  };

  const uploadFiles = async (
    files: File[], 
    userId: string, 
    laboratoryId: string,
    metadata?: Record<string, any>
  ) => {
    return await fileStorageManager.uploadFiles(files, userId, laboratoryId, metadata);
  };

  const analyzeFile = async (fileId: string, analysisType?: string) => {
    return await fileStorageManager.analyzeFile(fileId, analysisType);
  };

  const getProcessingStatus = async (fileId: string) => {
    return await fileStorageManager.getProcessingStatus(fileId);
  };

  const validateFile = (file: File) => {
    return fileStorageManager.validateFile(file);
  };

  const getFileTypeCategory = (mimeType: string) => {
    return fileStorageManager.getFileTypeCategory(mimeType);
  };

  const isAnalyzable = (mimeType: string) => {
    return fileStorageManager.isAnalyzable(mimeType);
  };

  return {
    uploadFile,
    uploadFiles,
    analyzeFile,
    getProcessingStatus,
    validateFile,
    getFileTypeCategory,
    isAnalyzable
  };
}

// Export the searchFiles function for the user's prompt
export function searchFiles(query: string, filters: any) {
  // Fix the URLSearchParams type issue
  const searchParams = new URLSearchParams();
  searchParams.append('q', query);
  
  // Handle filters properly
  if (filters.fileType) searchParams.append('fileType', filters.fileType);
  if (filters.uploadedBy) searchParams.append('uploadedBy', filters.uploadedBy);
  if (filters.processingStatus) searchParams.append('processingStatus', filters.processingStatus);
  
  // Handle date range separately
  if (filters.dateRange) {
    searchParams.append('startDate', filters.dateRange.start.toISOString());
    searchParams.append('endDate', filters.dateRange.end.toISOString());
  }
  
  return searchParams;
} 