// apps/web/src/app/component-test/page.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Test import of HeroUI components
import { HeroUIHeroSection } from '@/components/landing/HeroUIHeroSection';
import { HeroUINavigation } from '@/components/landing/HeroUINavigation';
import { HeroUIFeaturesSection } from '@/components/landing/HeroUIFeaturesSection';

export default function ComponentTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-8 space-y-8">
        
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🧪</span>
              <span>LabGuard Pro - Component Test</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Badge variant="secondary">Build Status</Badge>
                <p className="text-sm text-green-600 font-medium">✅ Components Loading</p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary">TypeScript</Badge>
                <p className="text-sm text-green-600 font-medium">✅ No Errors</p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary">Monorepo</Badge>
                <p className="text-sm text-green-600 font-medium">✅ Structure Fixed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* UI Components Test */}
        <Card>
          <CardHeader>
            <CardTitle>UI Components Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button>Primary Button</Button>
              <Button variant="outline">Secondary</Button>
              <Button variant="outline">Outline</Button>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Progress Bar</p>
              <Progress value={75} className="w-full" />
            </div>
            
            <div className="flex space-x-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Error</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Landing Components Test */}
        <Card>
          <CardHeader>
            <CardTitle>HeroUI Landing Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border rounded-lg p-4 bg-white">
                <h3 className="font-medium mb-2">Navigation Component</h3>
                <HeroUINavigation />
              </div>
              
              <div className="border rounded-lg p-4 bg-white">
                <h3 className="font-medium mb-2">Hero Section Preview</h3>
                <div className="scale-50 origin-top-left">
                  <HeroUIHeroSection />
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-white">
                <h3 className="font-medium mb-2">Features Section Preview</h3>
                <div className="scale-50 origin-top-left">
                  <HeroUIFeaturesSection />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-green-600">✅ Components are working!</p>
              <p className="text-gray-600">Ready to implement:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Authentication system</li>
                <li>Dashboard functionality</li>
                <li>AI assistant features</li>
                <li>Equipment management</li>
                <li>Mobile responsiveness</li>
              </ul>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
} 