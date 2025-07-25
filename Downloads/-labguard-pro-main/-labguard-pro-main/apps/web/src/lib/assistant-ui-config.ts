// Assistant UI Configuration for Biomni AI
// Using the correct assistant-ui primitives instead of createAssistantUI

import { biomniClient } from './ai/biomni-client'

// Theme configuration for Biomni AI
export const biomniTheme = {
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    secondary: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    }
  },
  borderRadius: 'lg',
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  }
}

// Chat configuration
export const biomniChatConfig = {
  // Enable persistent memory
  memory: {
    enabled: true,
    type: 'localStorage', // or 'database' for server-side persistence
    key: 'biomni-chat-history',
    maxMessages: 1000,
    maxTokens: 10000,
  },

  // Auto-scroll and accessibility
  autoScroll: true,
  accessibility: {
    screenReader: true,
    keyboardNavigation: true,
    focusManagement: true,
  },

  // Message rendering
  messageRendering: {
    markdown: true,
    codeHighlighting: true,
    fileAttachments: true,
    imageSupport: true,
    latexSupport: true,
  },

  // Streaming configuration
  streaming: {
    enabled: true,
    chunkSize: 50,
    delay: 10,
  },

  // Tool calls configuration
  toolCalls: {
    enabled: true,
    humanApproval: false, // Set to true for sensitive operations
    autoExecute: true,
  },

  // Generative UI
  generativeUI: {
    enabled: true,
    components: {
      // Custom components for Biomni-specific features
      'protocol-design': {
        component: 'ProtocolDesigner',
        props: ['experiment', 'requirements', 'constraints'],
      },
      'data-analysis': {
        component: 'DataAnalyzer',
        props: ['data', 'analysisType', 'parameters'],
      },
      'equipment-calibration': {
        component: 'CalibrationWizard',
        props: ['equipment', 'standards', 'procedures'],
      },
      'compliance-check': {
        component: 'ComplianceChecker',
        props: ['regulations', 'procedures', 'evidence'],
      },
    }
  }
}

// API configuration
export const biomniAPIConfig = {
  baseUrl: '/api/ai',
  endpoints: {
    chat: '/chat',
    tools: '/tools',
    memory: '/memory',
    files: '/files',
  },
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  retries: 3,
}

// Biomni-specific configuration
export const biomniConfig = {
  client: biomniClient,
  features: {
    protocolDesign: true,
    genomicAnalysis: true,
    literatureReview: true,
    equipmentManagement: true,
    complianceMonitoring: true,
    hypothesisGeneration: true,
    workflowOptimization: true,
  },
  databases: [
    'PubMed',
    'GenBank',
    'UniProt',
    'PDB',
    'KEGG',
    'Reactome',
    'BioGRID',
    'STRING',
    'ChEMBL',
    'DrugBank',
  ],
  tools: [
    'BLAST',
    'ClustalW',
    'MUSCLE',
    'PhyML',
    'RAxML',
    'MrBayes',
    'BEAST',
    'GATK',
    'Samtools',
    'BWA',
    'Bowtie2',
    'TopHat',
    'Cufflinks',
    'DESeq2',
    'edgeR',
    'limma',
    'ggplot2',
    'R',
    'Python',
    'Bioconductor',
  ],
}

// UI Components customization
export const biomniComponents = {
  // Custom message components
  Message: {
    user: {
      className: 'bg-blue-50 border-blue-200',
      avatar: '👤',
    },
    assistant: {
      className: 'bg-green-50 border-green-200',
      avatar: '🧬',
    },
    system: {
      className: 'bg-gray-50 border-gray-200',
      avatar: '⚙️',
    },
  },

  // Input customization
  Input: {
    placeholder: 'Ask Biomni about protocols, analysis, equipment, or research...',
    className: 'border-2 border-gray-200 focus:border-blue-500',
    sendButton: {
      icon: '🧬',
      className: 'bg-blue-500 hover:bg-blue-600',
    },
  },

  // Tool call components
  ToolCall: {
    className: 'bg-yellow-50 border-yellow-200',
    executeButton: {
      className: 'bg-yellow-500 hover:bg-yellow-600',
    },
  },

  // File attachment components
  FileAttachment: {
    className: 'bg-purple-50 border-purple-200',
    preview: true,
    download: true,
  },
}

// Keyboard shortcuts
export const biomniShortcuts = {
  send: 'Enter',
  newChat: 'Ctrl+N',
  clearChat: 'Ctrl+K',
  toggleSidebar: 'Ctrl+B',
  focusInput: 'Ctrl+L',
  search: 'Ctrl+F',
}

// Analytics and monitoring
export const biomniAnalytics = {
  enabled: true,
  events: [
    'message_sent',
    'message_received',
    'tool_called',
    'file_uploaded',
    'error_occurred',
  ],
  provider: 'internal', // or 'google-analytics', 'mixpanel', etc.
}

// Error handling
export const biomniErrorHandling = {
  retryOnError: true,
  maxRetries: 3,
  fallbackMessage: 'I apologize, but I\'m experiencing technical difficulties. Please try again or contact support.',
  showErrorDetails: false, // Set to true in development
}

// Performance optimization
export const biomniPerformance = {
  virtualScrolling: true,
  messageLazyLoading: true,
  imageOptimization: true,
  codeSplitting: true,
}

// Export all configurations
export const biomniAssistantConfig = {
  theme: biomniTheme,
  chat: biomniChatConfig,
  api: biomniAPIConfig,
  biomni: biomniConfig,
  components: biomniComponents,
  shortcuts: biomniShortcuts,
  analytics: biomniAnalytics,
  errorHandling: biomniErrorHandling,
  performance: biomniPerformance,
} 