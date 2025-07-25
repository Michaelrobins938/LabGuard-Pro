// Date utilities
export const formatDate = (date: Date | string): string => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date)
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidSerialNumber = (serialNumber: string): boolean => {
  return serialNumber.length >= 3 && /^[A-Za-z0-9\-_]+$/.test(serialNumber)
}

// Status utilities
export const getStatusColor = (status: string): string => {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'COMPLIANT':
    case 'COMPLETED':
      return 'green'
    case 'INACTIVE':
    case 'NON_COMPLIANT':
    case 'FAILED':
      return 'red'
    case 'MAINTENANCE':
    case 'CALIBRATION_DUE':
    case 'OVERDUE':
      return 'orange'
    case 'PENDING':
    case 'SCHEDULED':
      return 'yellow'
    default:
      return 'gray'
  }
}

export const getStatusText = (status: string): string => {
  return status.replace(/_/g, ' ').toLowerCase()
}

// Equipment utilities
export const getEquipmentTypeLabel = (type: string): string => {
  return type.replace(/_/g, ' ').toLowerCase()
}

export const getEquipmentTypeIcon = (type: string): string => {
  switch (type) {
    case 'ANALYTICAL_BALANCE':
      return '⚖️'
    case 'PIPETTE':
      return '🧪'
    case 'CENTRIFUGE':
      return '🌀'
    case 'INCUBATOR':
      return '🌡️'
    case 'AUTOCLAVE':
      return '🔥'
    case 'SPECTROPHOTOMETER':
      return '📊'
    case 'PCR_MACHINE':
      return '🧬'
    case 'MICROSCOPE':
      return '🔬'
    case 'WATER_BATH':
      return '💧'
    case 'REFRIGERATOR':
    case 'FREEZER':
      return '❄️'
    default:
      return '🔧'
  }
} 