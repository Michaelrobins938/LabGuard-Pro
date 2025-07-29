# TypeScript Error Summary for LabGuard Pro

## 🚨 CRITICAL ERRORS (80 total)

### 1. MSW (Mock Service Worker) Errors (40 errors)
**File**: `src/__tests__/mocks/server.ts` and `src/__tests__/setup.ts`
- **Error**: `Module '"msw"' has no exported member 'rest'`
- **Fix**: Replace `import { rest } from 'msw'` with `import { http } from 'msw'`
- **Additional**: Add proper type annotations for all handler parameters

### 2. Missing API Client Methods (20+ errors)
**Files**: `src/hooks/useAnalytics.ts`, `src/hooks/useEquipment.ts`
- **Error**: `Property 'dashboard' does not exist on type 'ApiClient'`
- **Error**: `Property 'analytics' does not exist on type 'ApiClient'`
- **Error**: `Property 'equipment' does not exist on type 'ApiClient'`
- **Fix**: Add missing methods to `src/lib/api.ts`

### 3. Type Annotation Errors (10+ errors)
**Files**: `src/lib/ai/biomni-integration.ts`, `src/lib/ai/openrouter-client.ts`, `src/lib/ai/voice-processing.ts`
- **Error**: `Variable 'insights' implicitly has type 'any[]'`
- **Error**: Type incompatibility with message roles
- **Error**: Index signature missing for model capabilities
- **Error**: Object is possibly 'null'
- **Fix**: Add proper type annotations and null checks

### 4. Iteration Errors (3 errors)
**Files**: `src/lib/ai/file-processing.ts`, `src/lib/ai/voice-processing.ts`
- **Error**: `Type 'Set<...>' can only be iterated through when using '--downlevelIteration'`
- **Error**: `Type 'Map<...>' can only be iterated through when using '--downlevelIteration'`
- **Fix**: Update TypeScript configuration or use alternative iteration methods

### 5. Authentication Type Errors (2 errors)
**File**: `src/lib/auth.ts`
- **Error**: Type mismatch between custom User type and NextAuth User type
- **Error**: Missing `laboratoryName` property in User type
- **Error**: Property 'password' does not exist on type
- **Fix**: Align User types and add missing properties

## 🔧 PRIORITY FIX ORDER

### Phase 1: Critical Build Blockers
1. **Fix MSW imports** - Update to v2 API
2. **Add missing API methods** - Extend ApiClient
3. **Fix type annotations** - Add proper types

### Phase 2: Type Safety
1. **Fix iteration errors** - Update TypeScript config
2. **Fix authentication types** - Align User interfaces
3. **Add null checks** - Handle nullable objects

### Phase 3: Import/Export Issues
1. **Fix wrong import paths** - Update `@/lib/api-service` to `@/lib/api`
2. **Add missing exports** - Export all required methods
3. **Update component props** - Fix invalid variants

## 📋 SPECIFIC FIXES NEEDED

### API Client Extensions
Add to `src/lib/api.ts`:
```typescript
// Dashboard methods
dashboard: {
  getMetrics: () => Promise<ApiResponse>,
  getStats: () => Promise<ApiResponse>,
  getOverview: () => Promise<ApiResponse>,
  getRecentActivity: () => Promise<ApiResponse>
},

// Analytics methods
analytics: {
  getUsage: () => Promise<ApiResponse>,
  getPerformance: () => Promise<ApiResponse>,
  getTrends: () => Promise<ApiResponse>,
  getInsights: () => Promise<ApiResponse>
},

// Equipment methods
equipment: {
  getAll: () => Promise<ApiResponse>,
  getById: (id: string) => Promise<ApiResponse>,
  create: (data: any) => Promise<ApiResponse>,
  update: (id: string, data: any) => Promise<ApiResponse>,
  delete: (id: string) => Promise<ApiResponse>
}
```

### MSW v2 Migration
Replace in test files:
```typescript
// OLD
import { rest } from 'msw'
rest.post('/api/auth/login', (req, res, ctx) => {})

// NEW
import { http } from 'msw'
http.post('/api/auth/login', ({ request }) => {})
```

### Type Annotations
Add proper types:
```typescript
// For insights array
const insights: Array<{
  id: string;
  type: string;
  message: string;
  priority: string;
}> = [];

// For model capabilities
const capabilities: Record<string, {
  maxTokens: number;
  modalities: string[];
  strengths: string[];
  bestFor: string[];
}> = {
  'anthropic/claude-3.5-sonnet': { /* ... */ }
};
```

## 🎯 SUCCESS CRITERIA
- [ ] No TypeScript compilation errors
- [ ] All imports resolve correctly
- [ ] All API methods are properly typed
- [ ] MSW tests work with v2 API
- [ ] Build completes successfully
- [ ] No runtime type errors

## 📝 NOTES FOR AGENT
- Preserve all existing functionality
- Use TypeScript best practices
- Add JSDoc comments for complex methods
- Maintain backward compatibility
- Test changes before moving to next file
- Focus on one error category at a time 