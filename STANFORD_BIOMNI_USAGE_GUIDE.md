# 🧬 Stanford Biomni Usage & Implementation Guide

## **Quick Start: 5 Steps to Use Stanford Biomni**

### **Step 1: Environment Configuration**

Create or update your `.env.local` file:

```bash
# Stanford Biomni AI Integration
NEXT_PUBLIC_BIOMNI_API_URL="https://biomni.stanford.edu/api"
BIOMNI_API_KEY="your-stanford-biomni-api-key-here"

# Optional: Demo Mode (when API key not available)
NEXT_PUBLIC_BIOMNI_DEMO_MODE="false"
NEXT_PUBLIC_BIOMNI_VERSION="1.0"
```

### **Step 2: Get Stanford Biomni API Access**

1. Visit [biomni.stanford.edu](https://biomni.stanford.edu)
2. Register for API access
3. Obtain your API key
4. Replace `your-stanford-biomni-api-key-here` with your actual key

### **Step 3: Test the Integration**

```bash
# Start your development server
npm run dev

# Visit the demo page
http://localhost:3000/stanford-biomni-demo
```

### **Step 4: Use in Your Components**

Here are practical examples of how to integrate Stanford Biomni into your web application:

## **🔧 IMPLEMENTATION EXAMPLES**

### **Example 1: Basic Task Execution**

```tsx
// components/BiomniTaskExecutor.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function BiomniTaskExecutor() {
  const [task, setTask] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const executeTask = async () => {
    if (!task.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/stanford-biomni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'execute',
          task: task.trim()
        })
      });

      const data = await response.json();
      setResult(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stanford Biomni Task Executor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter your biomedical research task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          rows={4}
        />
        <Button onClick={executeTask} disabled={isLoading}>
          {isLoading ? 'Executing...' : 'Execute Task'}
        </Button>
        
        {result && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### **Example 2: Genomic Analysis Component**

```tsx
// components/GenomicAnalyzer.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function GenomicAnalyzer() {
  const [dataPath, setDataPath] = useState('');
  const [analysisType, setAnalysisType] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeData = async () => {
    if (!dataPath || !analysisType) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/stanford-biomni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze_genomic',
          dataPath,
          analysisType
        })
      });

      const data = await response.json();
      setResult(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Genomic Data Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Data Path</label>
          <Input
            placeholder="/path/to/your/data"
            value={dataPath}
            onChange={(e) => setDataPath(e.target.value)}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Analysis Type</label>
          <Select value={analysisType} onValueChange={setAnalysisType}>
            <SelectTrigger>
              <SelectValue placeholder="Select analysis type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scRNA-seq annotation">scRNA-seq Annotation</SelectItem>
              <SelectItem value="CRISPR screen analysis">CRISPR Screen Analysis</SelectItem>
              <SelectItem value="pathway analysis">Pathway Analysis</SelectItem>
              <SelectItem value="variant calling">Variant Calling</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={analyzeData} disabled={isLoading || !dataPath || !analysisType}>
          {isLoading ? 'Analyzing...' : 'Analyze Data'}
        </Button>

        {result && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### **Example 3: Protocol Designer**

```tsx
// components/ProtocolDesigner.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ProtocolDesigner() {
  const [protocolType, setProtocolType] = useState('');
  const [parameters, setParameters] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const designProtocol = async () => {
    if (!protocolType) return;

    setIsLoading(true);
    try {
      const parsedParams = parameters ? JSON.parse(parameters) : {};
      
      const response = await fetch('/api/stanford-biomni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'design_protocol',
          protocolType,
          parameters: parsedParams
        })
      });

      const data = await response.json();
      setResult(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Protocol Designer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Protocol Type</label>
          <Input
            placeholder="e.g., CRISPR gene editing, PCR amplification"
            value={protocolType}
            onChange={(e) => setProtocolType(e.target.value)}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Parameters (JSON)</label>
          <Textarea
            placeholder='{"organism": "E. coli", "target": "specific gene"}'
            value={parameters}
            onChange={(e) => setParameters(e.target.value)}
            rows={3}
          />
        </div>

        <Button onClick={designProtocol} disabled={isLoading || !protocolType}>
          {isLoading ? 'Designing...' : 'Design Protocol'}
        </Button>

        {result && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### **Example 4: Literature Review Component**

```tsx
// components/LiteratureReviewer.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LiteratureReviewer() {
  const [topic, setTopic] = useState('');
  const [scope, setScope] = useState('comprehensive');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const conductReview = async () => {
    if (!topic) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/stanford-biomni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'literature_review',
          topic,
          scope
        })
      });

      const data = await response.json();
      setResult(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Literature Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Research Topic</label>
          <Input
            placeholder="e.g., COVID-19 vaccine development, cancer immunotherapy"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Review Scope</label>
          <Select value={scope} onValueChange={setScope}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="comprehensive">Comprehensive</SelectItem>
              <SelectItem value="focused">Focused</SelectItem>
              <SelectItem value="systematic">Systematic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={conductReview} disabled={isLoading || !topic}>
          {isLoading ? 'Conducting Review...' : 'Conduct Review'}
        </Button>

        {result && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### **Example 5: Dashboard Integration**

```tsx
// app/dashboard/biomni/page.tsx
'use client';

import { BiomniTaskExecutor } from '@/components/BiomniTaskExecutor';
import { GenomicAnalyzer } from '@/components/GenomicAnalyzer';
import { ProtocolDesigner } from '@/components/ProtocolDesigner';
import { LiteratureReviewer } from '@/components/LiteratureReviewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function BiomniDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">🧬 Stanford Biomni AI Dashboard</h1>
        <p className="text-muted-foreground">
          Access cutting-edge biomedical AI capabilities powered by Stanford Biomni
        </p>
      </div>

      <Tabs defaultValue="task-executor" className="space-y-4">
        <TabsList>
          <TabsTrigger value="task-executor">Task Executor</TabsTrigger>
          <TabsTrigger value="genomic-analyzer">Genomic Analysis</TabsTrigger>
          <TabsTrigger value="protocol-designer">Protocol Designer</TabsTrigger>
          <TabsTrigger value="literature-reviewer">Literature Review</TabsTrigger>
        </TabsList>

        <TabsContent value="task-executor">
          <BiomniTaskExecutor />
        </TabsContent>

        <TabsContent value="genomic-analyzer">
          <GenomicAnalyzer />
        </TabsContent>

        <TabsContent value="protocol-designer">
          <ProtocolDesigner />
        </TabsContent>

        <TabsContent value="literature-reviewer">
          <LiteratureReviewer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

## **🎯 COMMON USE CASES**

### **1. Bioinformatics Analysis**
```javascript
// Example: Analyze genomic data
const response = await fetch('/api/stanford-biomni', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'analyze_genomic',
    dataPath: '/path/to/scRNA-seq-data',
    analysisType: 'scRNA-seq annotation'
  })
});
```

### **2. Protocol Design**
```javascript
// Example: Design CRISPR protocol
const response = await fetch('/api/stanford-biomni', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'design_protocol',
    protocolType: 'CRISPR gene editing',
    parameters: {
      organism: 'E. coli',
      target: 'lacZ gene',
      delivery: 'electroporation'
    }
  })
});
```

### **3. Literature Review**
```javascript
// Example: Conduct literature review
const response = await fetch('/api/stanford-biomni', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'literature_review',
    topic: 'cancer immunotherapy',
    scope: 'comprehensive'
  })
});
```

### **4. Hypothesis Generation**
```javascript
// Example: Generate research hypotheses
const response = await fetch('/api/stanford-biomni', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'generate_hypothesis',
    dataPath: '/path/to/research-data',
    researchArea: 'neurodegenerative diseases'
  })
});
```

## **🔧 INTEGRATION TIPS**

### **1. Error Handling**
```typescript
const executeBiomniTask = async (task: string) => {
  try {
    const response = await fetch('/api/stanford-biomni', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'execute', task })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Stanford Biomni error:', error);
    throw error;
  }
};
```

### **2. Loading States**
```typescript
const [isLoading, setIsLoading] = useState(false);
const [result, setResult] = useState(null);

const handleTaskExecution = async () => {
  setIsLoading(true);
  try {
    const result = await executeBiomniTask(task);
    setResult(result);
  } catch (error) {
    // Handle error
  } finally {
    setIsLoading(false);
  }
};
```

### **3. Status Checking**
```typescript
const checkBiomniStatus = async () => {
  const response = await fetch('/api/stanford-biomni?action=status');
  const data = await response.json();
  return data.data.available;
};
```

## **🚀 NEXT STEPS**

1. **Get API Access**: Visit [biomni.stanford.edu](https://biomni.stanford.edu) to register
2. **Configure Environment**: Add your API key to `.env.local`
3. **Test Integration**: Visit `/stanford-biomni-demo` to test
4. **Build Components**: Use the examples above to create your own components
5. **Integrate**: Add Stanford Biomni capabilities to your existing pages

## **📞 SUPPORT**

- **Demo Page**: `http://localhost:3000/stanford-biomni-demo`
- **API Status**: `http://localhost:3000/api/stanford-biomni?action=status`
- **Documentation**: [https://github.com/snap-stanford/Biomni](https://github.com/snap-stanford/Biomni)

---

**Ready to accelerate your biomedical research with Stanford Biomni! 🧬** 