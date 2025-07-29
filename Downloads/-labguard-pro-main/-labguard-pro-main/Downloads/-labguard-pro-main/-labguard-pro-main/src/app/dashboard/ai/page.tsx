'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedBiomniAssistant } from '@/components/ai-assistant/EnhancedBiomniAssistant';
import { Brain } from 'lucide-react';

export default function AIPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Laboratory Assistant</h1>
        <p className="text-gray-600">
          Get instant help with protocols, data analysis, and compliance
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            Enhanced Biomni Assistant
          </CardTitle>
          <CardDescription>
            AI-powered laboratory assistance with protocol generation and research capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnhancedBiomniAssistant />
        </CardContent>
      </Card>
    </div>
  );
} 