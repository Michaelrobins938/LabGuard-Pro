// Enhanced File Processing Service for Laboratory AI Assistant
// Supports FASTA, FASTQ, CSV, Excel, PDF, JSON, XML, and other laboratory file formats

export interface FileProcessingConfig {
  maxFileSize: number;
  supportedFormats: string[];
  enableBatchProcessing: boolean;
  enableCloudStorage: boolean;
  enableValidation: boolean;
  tempStoragePath?: string;
}

export interface FileProcessingResult {
  id: string;
  fileName: string;
  fileType: string;
  format: 'fasta' | 'fastq' | 'csv' | 'excel' | 'pdf' | 'json' | 'xml' | 'text' | 'binary' | 'unknown';
  processingTime: number;
  fileSize: number;
  recordCount?: number;
  data: any;
  metadata: FileMetadata;
  validation?: ValidationResult;
  insights: string[];
  warnings?: string[];
  recommendations?: string[];
}

export interface FileMetadata {
  fileName: string;
  fileSize: number;
  fileType: string;
  lastModified: number;
  encoding?: string;
  lineCount?: number;
  checksum?: string;
  schema?: SchemaInfo;
  headers?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: number; // 0-1
  suggestions: string[];
}

export interface ValidationError {
  line?: number;
  column?: number;
  field?: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationWarning {
  line?: number;
  column?: string;
  message: string;
  suggestion?: string;
}

export interface SchemaInfo {
  type: 'sequence' | 'tabular' | 'document' | 'structured' | 'binary';
  version?: string;
  fields?: FieldInfo[];
  constraints?: any;
}

export interface FieldInfo {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'sequence' | 'quality';
  required: boolean;
  constraints?: any;
  description?: string;
}

// Sequence-specific interfaces
export interface SequenceRecord {
  id: string;
  description?: string;
  sequence: string;
  quality?: string; // For FASTQ
  length: number;
  type: 'dna' | 'rna' | 'protein' | 'unknown';
  composition?: SequenceComposition;
}

export interface SequenceComposition {
  nucleotides?: { A: number; T: number; G: number; C: number; N: number };
  aminoAcids?: Record<string, number>;
  gcContent?: number;
}

// Tabular data interfaces
export interface TabularData {
  headers: string[];
  rows: any[][];
  rowCount: number;
  columnCount: number;
  dataTypes: Record<string, string>;
  summary?: DataSummary;
}

export interface DataSummary {
  numericalSummary?: Record<string, {
    min: number;
    max: number;
    mean: number;
    median: number;
    stdDev: number;
  }>;
  categoricalSummary?: Record<string, {
    uniqueValues: number;
    mostCommon: string;
    distribution: Record<string, number>;
  }>;
}

class FileProcessingService {
  private config: FileProcessingConfig;
  private supportedMimeTypes: Set<string>;

  constructor(config: Partial<FileProcessingConfig> = {}) {
    this.config = {
      maxFileSize: 500 * 1024 * 1024, // 500MB
      supportedFormats: [
        // Sequence formats
        'fasta', 'fas', 'fa', 'fastq', 'fq', 'fastq.gz', 'fq.gz',
        // Tabular formats
        'csv', 'tsv', 'xlsx', 'xls', 'ods',
        // Document formats
        'pdf', 'txt', 'md', 'rtf',
        // Structured data formats
        'json', 'xml', 'yaml', 'yml',
        // Laboratory-specific formats
        'ab1', 'abi', 'scf', 'phd', 'ace', 'caf', 'gbk', 'gff', 'gtf', 'bed', 'sam', 'bam', 'vcf'
      ],
      enableBatchProcessing: true,
      enableCloudStorage: false,
      enableValidation: true,
      ...config
    };

    this.supportedMimeTypes = new Set([
      'text/plain', 'text/csv', 'text/tab-separated-values',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/pdf', 'application/json', 'application/xml', 'text/xml',
      'application/octet-stream' // For binary formats
    ]);
  }

  // Main file processing method
  async processFile(file: File): Promise<FileProcessingResult> {
    console.log(`📄 Processing file: ${file.name}`);
    const startTime = Date.now();

    // Validate file
    this.validateFile(file);

    // Detect file format
    const format = this.detectFileFormat(file);
    console.log(`📋 Detected format: ${format}`);

    // Extract metadata
    const metadata = await this.extractFileMetadata(file);

    // Process based on format
    let data: any;
    let recordCount: number | undefined;
    let validation: ValidationResult | undefined;

    switch (format) {
      case 'fasta':
        const fastaResult = await this.processFASTA(file);
        data = fastaResult.sequences;
        recordCount = fastaResult.sequences.length;
        validation = fastaResult.validation;
        break;

      case 'fastq':
        const fastqResult = await this.processFASTQ(file);
        data = fastqResult.sequences;
        recordCount = fastqResult.sequences.length;
        validation = fastqResult.validation;
        break;

      case 'csv':
        const csvResult = await this.processCSV(file);
        data = csvResult.data;
        recordCount = csvResult.data.rowCount;
        validation = csvResult.validation;
        break;

      case 'excel':
        const excelResult = await this.processExcel(file);
        data = excelResult.data;
        recordCount = excelResult.data.rowCount;
        validation = excelResult.validation;
        break;

      case 'pdf':
        const pdfResult = await this.processPDF(file);
        data = pdfResult.content;
        validation = pdfResult.validation;
        break;

      case 'json':
        const jsonResult = await this.processJSON(file);
        data = jsonResult.data;
        validation = jsonResult.validation;
        break;

      case 'xml':
        const xmlResult = await this.processXML(file);
        data = xmlResult.data;
        validation = xmlResult.validation;
        break;

      default:
        const textResult = await this.processText(file);
        data = textResult.content;
        validation = textResult.validation;
    }

    // Generate insights
    const insights = this.generateInsights(format, data, metadata);
    const recommendations = this.generateRecommendations(format, data, validation);
    const warnings = this.generateWarnings(validation);

    const result: FileProcessingResult = {
      id: `file-${Date.now()}`,
      fileName: file.name,
      fileType: file.type,
      format,
      processingTime: Date.now() - startTime,
      fileSize: file.size,
      recordCount,
      data,
      metadata,
      validation,
      insights,
      warnings,
      recommendations
    };

    console.log(`✅ File processing completed in ${result.processingTime}ms`);
    return result;
  }

  // File format detection
  private detectFileFormat(file: File): 'fasta' | 'fastq' | 'csv' | 'excel' | 'pdf' | 'json' | 'xml' | 'text' | 'binary' | 'unknown' {
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop() || '';

    // Sequence formats
    if (['fasta', 'fas', 'fa'].includes(fileExtension)) return 'fasta';
    if (['fastq', 'fq'].includes(fileExtension)) return 'fastq';
    if (fileName.includes('.fastq.gz') || fileName.includes('.fq.gz')) return 'fastq';

    // Tabular formats
    if (['csv'].includes(fileExtension)) return 'csv';
    if (['xlsx', 'xls', 'ods'].includes(fileExtension)) return 'excel';

    // Document formats
    if (['pdf'].includes(fileExtension)) return 'pdf';

    // Structured data
    if (['json'].includes(fileExtension)) return 'json';
    if (['xml'].includes(fileExtension)) return 'xml';

    // Text formats
    if (['txt', 'md', 'rtf'].includes(fileExtension)) return 'text';

    // MIME type fallback
    if (file.type.includes('csv')) return 'csv';
    if (file.type.includes('excel') || file.type.includes('spreadsheet')) return 'excel';
    if (file.type.includes('pdf')) return 'pdf';
    if (file.type.includes('json')) return 'json';
    if (file.type.includes('xml')) return 'xml';
    if (file.type.includes('text')) return 'text';

    return 'unknown';
  }

  // FASTA file processing
  private async processFASTA(file: File): Promise<{ sequences: SequenceRecord[]; validation: ValidationResult }> {
    const content = await this.readFileAsText(file);
    const sequences: SequenceRecord[] = [];
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const lines = content.split('\n');
    let currentSequence: Partial<SequenceRecord> | null = null;
    let lineNumber = 0;

    for (const line of lines) {
      lineNumber++;
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('>')) {
        // Save previous sequence
        if (currentSequence && currentSequence.sequence) {
          sequences.push(this.completeFASTASequence(currentSequence));
        }

        // Start new sequence
        const header = trimmedLine.substring(1);
        const parts = header.split(/\s+/);
        currentSequence = {
          id: parts[0],
          description: parts.slice(1).join(' ') || undefined,
          sequence: ''
        };
      } else if (trimmedLine && currentSequence) {
        // Add to current sequence
        if (this.isValidSequence(trimmedLine)) {
          currentSequence.sequence += trimmedLine.toUpperCase();
        } else {
          errors.push({
            line: lineNumber,
            message: `Invalid sequence characters in line ${lineNumber}`,
            severity: 'error'
          });
        }
      } else if (trimmedLine && !currentSequence) {
        errors.push({
          line: lineNumber,
          message: `Sequence data found before header at line ${lineNumber}`,
          severity: 'error'
        });
      }
    }

    // Save last sequence
    if (currentSequence && currentSequence.sequence) {
      sequences.push(this.completeFASTASequence(currentSequence));
    }

    // Validation
    if (sequences.length === 0) {
      errors.push({
        message: 'No valid sequences found in FASTA file',
        severity: 'error'
      });
    }

    const validation: ValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings,
      score: errors.length === 0 ? 1.0 : Math.max(0, 1 - (errors.length / lineNumber)),
      suggestions: this.generateFASTASuggestions(sequences, errors)
    };

    return { sequences, validation };
  }

  // FASTQ file processing
  private async processFASTQ(file: File): Promise<{ sequences: SequenceRecord[]; validation: ValidationResult }> {
    const content = await this.readFileAsText(file);
    const sequences: SequenceRecord[] = [];
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    let lineNumber = 0;

    for (let i = 0; i < lines.length; i += 4) {
      lineNumber = i + 1;

      if (i + 3 >= lines.length) {
        errors.push({
          line: lineNumber,
          message: `Incomplete FASTQ record at line ${lineNumber}`,
          severity: 'error'
        });
        break;
      }

      const header = lines[i];
      const sequence = lines[i + 1];
      const separator = lines[i + 2];
      const quality = lines[i + 3];

      // Validate FASTQ format
      if (!header.startsWith('@')) {
        errors.push({
          line: lineNumber,
          message: `Invalid header format at line ${lineNumber}`,
          severity: 'error'
        });
        continue;
      }

      if (!separator.startsWith('+')) {
        errors.push({
          line: lineNumber + 2,
          message: `Invalid separator at line ${lineNumber + 2}`,
          severity: 'error'
        });
        continue;
      }

      if (sequence.length !== quality.length) {
        errors.push({
          line: lineNumber,
          message: `Sequence and quality length mismatch at line ${lineNumber}`,
          severity: 'error'
        });
        continue;
      }

      if (!this.isValidSequence(sequence)) {
        errors.push({
          line: lineNumber + 1,
          message: `Invalid sequence characters at line ${lineNumber + 1}`,
          severity: 'error'
        });
        continue;
      }

      // Create sequence record
      const id = header.substring(1).split(/\s+/)[0];
      const description = header.substring(1).split(/\s+/).slice(1).join(' ') || undefined;

      sequences.push({
        id,
        description,
        sequence: sequence.toUpperCase(),
        quality,
        length: sequence.length,
        type: this.determineSequenceType(sequence),
        composition: this.calculateSequenceComposition(sequence)
      });
    }

    const validation: ValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings,
      score: errors.length === 0 ? 1.0 : Math.max(0, 1 - (errors.length / (lines.length / 4))),
      suggestions: this.generateFASTQSuggestions(sequences, errors)
    };

    return { sequences, validation };
  }

  // CSV file processing
  private async processCSV(file: File): Promise<{ data: TabularData; validation: ValidationResult }> {
    const content = await this.readFileAsText(file);
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Parse CSV
    const lines = content.split('\n');
    const rows: any[][] = [];
    let headers: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const row = this.parseCSVLine(line);
      
      if (i === 0) {
        headers = row;
      } else {
        if (row.length !== headers.length) {
          warnings.push({
            line: i + 1,
            message: `Row ${i + 1} has ${row.length} columns, expected ${headers.length}`,
            suggestion: 'Check for missing or extra commas'
          });
        }
        rows.push(row);
      }
    }

    // Analyze data types
    const dataTypes = this.analyzeDataTypes(rows, headers);
    
    // Generate summary
    const summary = this.generateDataSummary(rows, headers, dataTypes);

    const data: TabularData = {
      headers,
      rows,
      rowCount: rows.length,
      columnCount: headers.length,
      dataTypes,
      summary
    };

    const validation: ValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings,
      score: Math.max(0, 1 - (warnings.length * 0.1)),
      suggestions: this.generateCSVSuggestions(data, warnings)
    };

    return { data, validation };
  }

  // Excel file processing (mock implementation)
  private async processExcel(file: File): Promise<{ data: TabularData; validation: ValidationResult }> {
    // In a real implementation, this would use a library like SheetJS
    // For now, return mock data
    const mockData: TabularData = {
      headers: ['Column1', 'Column2', 'Column3'],
      rows: [['A', '1', 'X'], ['B', '2', 'Y'], ['C', '3', 'Z']],
      rowCount: 3,
      columnCount: 3,
      dataTypes: { Column1: 'string', Column2: 'number', Column3: 'string' }
    };

    const validation: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      score: 1.0,
      suggestions: ['Excel file processing requires additional library integration']
    };

    return { data: mockData, validation };
  }

  // PDF file processing (mock implementation)
  private async processPDF(file: File): Promise<{ content: string; validation: ValidationResult }> {
    // In a real implementation, this would use a PDF parsing library
    const validation: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      score: 1.0,
      suggestions: ['PDF processing requires additional library integration']
    };

    return { 
      content: 'PDF content extraction requires additional libraries like pdf-lib or pdfjs-dist',
      validation 
    };
  }

  // JSON file processing
  private async processJSON(file: File): Promise<{ data: any; validation: ValidationResult }> {
    const content = await this.readFileAsText(file);
    const errors: ValidationError[] = [];

    let data: any;
    try {
      data = JSON.parse(content);
    } catch (error) {
      errors.push({
        message: `Invalid JSON format: ${error}`,
        severity: 'error'
      });
      data = null;
    }

    const validation: ValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings: [],
      score: errors.length === 0 ? 1.0 : 0,
      suggestions: errors.length > 0 ? ['Check JSON syntax and formatting'] : []
    };

    return { data, validation };
  }

  // XML file processing
  private async processXML(file: File): Promise<{ data: any; validation: ValidationResult }> {
    const content = await this.readFileAsText(file);
    const errors: ValidationError[] = [];

    // Basic XML validation (in a real implementation, use DOMParser or xml2js)
    let data: any = { content };
    
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, 'text/xml');
      
      const parseErrors = xmlDoc.getElementsByTagName('parsererror');
      if (parseErrors.length > 0) {
        errors.push({
          message: 'XML parsing error',
          severity: 'error'
        });
      }
    } catch (error) {
      errors.push({
        message: `XML validation error: ${error}`,
        severity: 'error'
      });
    }

    const validation: ValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings: [],
      score: errors.length === 0 ? 1.0 : 0,
      suggestions: errors.length > 0 ? ['Check XML syntax and structure'] : []
    };

    return { data, validation };
  }

  // Text file processing
  private async processText(file: File): Promise<{ content: string; validation: ValidationResult }> {
    const content = await this.readFileAsText(file);
    
    const validation: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      score: 1.0,
      suggestions: []
    };

    return { content, validation };
  }

  // Helper methods
  private validateFile(file: File): void {
    if (file.size > this.config.maxFileSize) {
      throw new Error(`File size ${file.size} exceeds maximum ${this.config.maxFileSize}`);
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension && !this.config.supportedFormats.includes(extension)) {
      throw new Error(`Unsupported file format: ${extension}`);
    }
  }

  private async readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  private async extractFileMetadata(file: File): Promise<FileMetadata> {
    return {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      lastModified: file.lastModified,
      encoding: 'utf-8' // Assume UTF-8 for now
    };
  }

  private isValidSequence(sequence: string): boolean {
    // Allow standard nucleotide and amino acid codes
    const nucleotidePattern = /^[ATCGRYSWKMBDHVN-]+$/i;
    const aminoAcidPattern = /^[ACDEFGHIKLMNPQRSTVWYUBZXJO*-]+$/i;
    
    return nucleotidePattern.test(sequence) || aminoAcidPattern.test(sequence);
  }

  private determineSequenceType(sequence: string): 'dna' | 'rna' | 'protein' | 'unknown' {
    const dnaPattern = /^[ATCGRYSWKMBDHVN-]+$/i;
    const rnaPattern = /^[AUCGRYSWKMBDHVN-]+$/i;
    const proteinPattern = /^[ACDEFGHIKLMNPQRSTVWYUBZXJO*-]+$/i;

    if (dnaPattern.test(sequence) && !sequence.toUpperCase().includes('U')) {
      return 'dna';
    } else if (rnaPattern.test(sequence) && sequence.toUpperCase().includes('U')) {
      return 'rna';
    } else if (proteinPattern.test(sequence)) {
      return 'protein';
    }
    
    return 'unknown';
  }

  private calculateSequenceComposition(sequence: string): SequenceComposition {
    const composition: SequenceComposition = {};
    const upperSeq = sequence.toUpperCase();

    // Nucleotide composition
    if (this.determineSequenceType(sequence) === 'dna' || this.determineSequenceType(sequence) === 'rna') {
      composition.nucleotides = {
        A: (upperSeq.match(/A/g) || []).length,
        T: (upperSeq.match(/T/g) || []).length,
        G: (upperSeq.match(/G/g) || []).length,
        C: (upperSeq.match(/C/g) || []).length,
        N: (upperSeq.match(/N/g) || []).length
      };
      
      const gcCount = composition.nucleotides.G + composition.nucleotides.C;
      const totalCount = sequence.length;
      composition.gcContent = totalCount > 0 ? gcCount / totalCount : 0;
    }

    // Amino acid composition for proteins
    if (this.determineSequenceType(sequence) === 'protein') {
      composition.aminoAcids = {};
      const aminoAcids = 'ACDEFGHIKLMNPQRSTVWY';
      for (const aa of aminoAcids) {
        composition.aminoAcids[aa] = (upperSeq.match(new RegExp(aa, 'g')) || []).length;
      }
    }

    return composition;
  }

  private completeFASTASequence(partial: Partial<SequenceRecord>): SequenceRecord {
    const sequence = partial.sequence || '';
    return {
      id: partial.id || 'unknown',
      description: partial.description,
      sequence,
      length: sequence.length,
      type: this.determineSequenceType(sequence),
      composition: this.calculateSequenceComposition(sequence)
    };
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  private analyzeDataTypes(rows: any[][], headers: string[]): Record<string, string> {
    const dataTypes: Record<string, string> = {};
    
    for (let col = 0; col < headers.length; col++) {
      const columnData = rows.map(row => row[col]).filter(val => val !== undefined && val !== '');
      
      if (columnData.every(val => !isNaN(Number(val)))) {
        dataTypes[headers[col]] = 'number';
      } else if (columnData.every(val => ['true', 'false'].includes(val?.toLowerCase()))) {
        dataTypes[headers[col]] = 'boolean';
      } else if (columnData.every(val => !isNaN(Date.parse(val)))) {
        dataTypes[headers[col]] = 'date';
      } else {
        dataTypes[headers[col]] = 'string';
      }
    }
    
    return dataTypes;
  }

  private generateDataSummary(rows: any[][], headers: string[], dataTypes: Record<string, string>): DataSummary {
    const summary: DataSummary = {
      numericalSummary: {},
      categoricalSummary: {}
    };

    for (let col = 0; col < headers.length; col++) {
      const header = headers[col];
      const columnData = rows.map(row => row[col]).filter(val => val !== undefined && val !== '');

      if (dataTypes[header] === 'number') {
        const numbers = columnData.map(val => Number(val)).filter(val => !isNaN(val));
        if (numbers.length > 0) {
          numbers.sort((a, b) => a - b);
          const sum = numbers.reduce((a, b) => a + b, 0);
          const mean = sum / numbers.length;
          const median = numbers[Math.floor(numbers.length / 2)];
          const variance = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numbers.length;
          
          summary.numericalSummary![header] = {
            min: Math.min(...numbers),
            max: Math.max(...numbers),
            mean,
            median,
            stdDev: Math.sqrt(variance)
          };
        }
      } else {
        const distribution: Record<string, number> = {};
        let mostCommon = '';
        let maxCount = 0;

        for (const val of columnData) {
          distribution[val] = (distribution[val] || 0) + 1;
          if (distribution[val] > maxCount) {
            maxCount = distribution[val];
            mostCommon = val;
          }
        }

        summary.categoricalSummary![header] = {
          uniqueValues: Object.keys(distribution).length,
          mostCommon,
          distribution
        };
      }
    }

    return summary;
  }

  private generateInsights(format: string, data: any, metadata: FileMetadata): string[] {
    const insights: string[] = [];
    
    insights.push(`Successfully processed ${format.toUpperCase()} file`);
    insights.push(`File size: ${(metadata.fileSize / 1024).toFixed(1)} KB`);
    
    if (format === 'fasta' || format === 'fastq') {
      const sequences = data as SequenceRecord[];
      insights.push(`Contains ${sequences.length} sequence(s)`);
      if (sequences.length > 0) {
        const avgLength = sequences.reduce((sum, seq) => sum + seq.length, 0) / sequences.length;
        insights.push(`Average sequence length: ${avgLength.toFixed(0)} bp`);
        
        const types = sequences.map(seq => seq.type);
        const uniqueTypes = [...new Set(types)];
        insights.push(`Sequence types: ${uniqueTypes.join(', ')}`);
      }
    } else if (format === 'csv' || format === 'excel') {
      const tabular = data as TabularData;
      insights.push(`Contains ${tabular.rowCount} rows and ${tabular.columnCount} columns`);
      insights.push(`Data types: ${Object.values(tabular.dataTypes).join(', ')}`);
    }
    
    return insights;
  }

  private generateRecommendations(format: string, data: any, validation?: ValidationResult): string[] {
    const recommendations: string[] = [];
    
    if (validation && !validation.isValid) {
      recommendations.push('Consider fixing validation errors before analysis');
    }
    
    if (format === 'fasta' || format === 'fastq') {
      recommendations.push('Ready for sequence analysis and bioinformatics processing');
    } else if (format === 'csv' || format === 'excel') {
      recommendations.push('Data can be used for statistical analysis and visualization');
    }
    
    return recommendations;
  }

  private generateWarnings(validation?: ValidationResult): string[] {
    const warnings: string[] = [];
    
    if (validation) {
      warnings.push(...validation.warnings.map(w => w.message));
      warnings.push(...validation.errors.filter(e => e.severity === 'warning').map(e => e.message));
    }
    
    return warnings;
  }

  private generateFASTASuggestions(sequences: SequenceRecord[], errors: ValidationError[]): string[] {
    const suggestions = [];
    
    if (errors.length > 0) {
      suggestions.push('Check for proper FASTA format with > headers');
    }
    
    if (sequences.length === 0) {
      suggestions.push('Ensure file contains valid sequence data');
    }
    
    return suggestions;
  }

  private generateFASTQSuggestions(sequences: SequenceRecord[], errors: ValidationError[]): string[] {
    const suggestions = [];
    
    if (errors.length > 0) {
      suggestions.push('Check for proper FASTQ format with 4 lines per record');
    }
    
    return suggestions;
  }

  private generateCSVSuggestions(data: TabularData, warnings: ValidationWarning[]): string[] {
    const suggestions = [];
    
    if (warnings.length > 0) {
      suggestions.push('Check for consistent column counts across all rows');
    }
    
    return suggestions;
  }

  // Batch processing
  async processBatch(files: File[]): Promise<FileProcessingResult[]> {
    const results: FileProcessingResult[] = [];
    
    for (const file of files) {
      try {
        const result = await this.processFile(file);
        results.push(result);
      } catch (error) {
        console.error(`Failed to process ${file.name}:`, error);
        // Continue with other files
      }
    }
    
    return results;
  }

  // Configuration
  updateConfig(newConfig: Partial<FileProcessingConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): FileProcessingConfig {
    return { ...this.config };
  }

  getSupportedFormats(): string[] {
    return [...this.config.supportedFormats];
  }
}

// React hook for file processing
export function useFileProcessing(config?: Partial<FileProcessingConfig>) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<FileProcessingResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fileService = useMemo(() => new FileProcessingService(config), []);

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await fileService.processFile(file);
      setResults(prev => [...prev, result]);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [fileService]);

  const processBatch = useCallback(async (files: File[]) => {
    setIsProcessing(true);
    setError(null);

    try {
      const batchResults = await fileService.processBatch(files);
      setResults(prev => [...prev, ...batchResults]);
      return batchResults;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [fileService]);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    isProcessing,
    results,
    error,
    processFile,
    processBatch,
    clearResults,
    fileService
  };
}

export default FileProcessingService; 