# LabGuard Compliance Assistant - API Implementation Issue for Claude

## Context
I've successfully built the LabGuard Compliance Assistant into the dashboard with a clean, sleek UI that matches the existing layout aesthetic. The frontend components are working correctly, but the end-to-end tests are failing because the backend API endpoints are not implemented or not running.

## Current Status
- ✅ Frontend UI: Complete and integrated into dashboard
- ✅ Component tests: Created and working
- ✅ UI/UX: Clean, sleek design with Framer Motion animations
- ❌ Backend API endpoints: Missing or not running
- ❌ End-to-end tests: Failing due to API issues

## Failed API Endpoints
The following endpoints are returning "Unknown error" or failing to respond:

1. `/api/ai/chat` - AI Assistant chat functionality
2. `/api/compliance/pcr-verification` - PCR Verification system
3. `/api/compliance/media-validation` - Media Validation system  
4. `/api/compliance/result-validation` - Result Validation system
5. `/api/compliance/audit-preparation` - Audit Preparation system
6. `/api/compliance/cap-safety-incident` - CAP Safety Incident Verification

## Test Results
```
❌ FAIL: PCR Verification System - Unknown error
❌ FAIL: Media Validation System - Unknown error  
❌ FAIL: Result Validation System - Unknown error
❌ FAIL: Audit Preparation System - Unknown error
❌ FAIL: Error Handling - Expected 400 error for missing required fields
❌ FAIL: Performance Testing - Unknown error
❌ FAIL: Expired Media Detection - Unknown error
❌ FAIL: Compliance Score Calculation - Unknown error
```

## Required API Implementation

### 1. AI Chat Endpoint (`/api/ai/chat`)
```typescript
// Expected request format
{
  message: string,
  session: {
    user: {
      id: string,
      email: string,
      role: string,
      laboratoryId: string
    }
  }
}

// Expected response format
{
  response: string,
  complianceScore?: number,
  suggestions?: string[]
}
```

### 2. PCR Verification Endpoint (`/api/compliance/pcr-verification`)
```typescript
// Expected request format
{
  protocolName: string,
  reagents: Array<{
    name: string,
    lotNumber: string,
    expirationDate: string,
    concentration: string
  }>,
  temperatureSettings: {
    denaturation: string,
    annealing: string,
    extension: string
  },
  cycleCount: number,
  qualityControl: {
    positiveControl: string,
    negativeControl: string,
    internalControl: string
  }
}

// Expected response format
{
  isValid: boolean,
  violations: string[],
  recommendations: string[],
  complianceScore: number
}
```

### 3. Media Validation Endpoint (`/api/compliance/media-validation`)
```typescript
// Expected request format
{
  mediaType: string,
  lotNumber: string,
  expirationDate: string,
  storageConditions: {
    temperature: string,
    humidity: string
  },
  qualityControl: {
    sterilityTest: boolean,
    performanceTest: boolean,
    pH: number
  }
}

// Expected response format
{
  isValid: boolean,
  safetyAlerts: string[],
  expirationWarnings: string[],
  recommendations: string[]
}
```

### 4. Result Validation Endpoint (`/api/compliance/result-validation`)
```typescript
// Expected request format
{
  testType: string,
  result: string,
  referenceRange: {
    low: number,
    high: number
  },
  criticalValues: {
    low: number,
    high: number
  },
  qualityControl: {
    passed: boolean,
    details: string
  }
}

// Expected response format
{
  isValid: boolean,
  criticalAlerts: string[],
  qcEvaluation: string,
  recommendations: string[]
}
```

### 5. Audit Preparation Endpoint (`/api/compliance/audit-preparation`)
```typescript
// Expected request format
{
  auditType: 'CAP' | 'CLIA' | 'QMS',
  laboratoryId: string,
  testMenu: string[],
  lastInspectionDate: string,
  currentProcedures: string[]
}

// Expected response format
{
  checklist: string[],
  requiredDocuments: string[],
  riskAreas: string[],
  recommendations: string[],
  estimatedScore: number
}
```

## Project Structure
The project uses:
- Next.js 14 with App Router
- TypeScript
- Prisma for database
- NextAuth for authentication
- Shadcn UI components
- Framer Motion for animations

## Files to Implement
1. `apps/web/src/app/api/ai/chat/route.ts`
2. `apps/web/src/app/api/compliance/pcr-verification/route.ts`
3. `apps/web/src/app/api/compliance/media-validation/route.ts`
4. `apps/web/src/app/api/compliance/result-validation/route.ts`
5. `apps/web/src/app/api/compliance/audit-preparation/route.ts`
6. `apps/web/src/app/api/compliance/cap-safety-incident/route.ts`

## Testing Script
The end-to-end test script is located at `apps/web/scripts/test-compliance-assistant.js` and can be run with `npm run test:compliance`.

## Requirements
1. Implement all missing API endpoints with proper error handling
2. Ensure endpoints return appropriate HTTP status codes (200, 400, 500)
3. Add input validation for all endpoints
4. Implement proper TypeScript types for request/response
5. Add logging for debugging purposes
6. Ensure compatibility with the existing authentication system
7. Make sure all endpoints work with the test data provided in the test script

## Expected Outcome
After implementation, running `npm run test:compliance` should show all tests passing with green checkmarks instead of the current red failures.

Please implement these API endpoints so the LabGuard Compliance Assistant can function properly end-to-end. 