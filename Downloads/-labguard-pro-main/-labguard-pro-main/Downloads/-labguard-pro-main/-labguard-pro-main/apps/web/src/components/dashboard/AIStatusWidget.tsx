'use client'

import { useState, useEffect } from 'react';
import { Avatar3D } from '@/components/ai-assistant/Avatar3D';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AIStatusWidget() {
  const [status, setStatus] = useState<'monitoring' | 'alert' | 'analyzing'>('monitoring');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  useEffect(() => {
    // Simulate status changes
    const interval = setInterval(() => {
      const random = Math.random();
      if (random > 0.8) {
        setStatus('alert');
        setTimeout(() => setStatus('monitoring'), 5000);
      } else if (random > 0.6) {
        setStatus('analyzing');
        setTimeout(() => setStatus('monitoring'), 3000);
      }
      setLastUpdate(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = () => {
    switch (status) {
      case 'alert':
        return {
          title: 'AI Lab Monitor',
          description: '3 items need attention',
          color: 'text-red-400',
          badgeColor: 'bg-red-500',
          badgeText: 'Alert'
        };
      case 'analyzing':
        return {
          title: 'AI Lab Monitor',
          description: 'Analyzing lab data...',
          color: 'text-purple-400',
          badgeColor: 'bg-purple-500',
          badgeText: 'Analyzing'
        };
      default:
        return {
          title: 'AI Lab Monitor',
          description: 'All systems normal',
          color: 'text-green-400',
          badgeColor: 'bg-green-500',
          badgeText: 'Normal'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className="glass-card border-white/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg">{statusInfo.title}</CardTitle>
          <Badge className={`${statusInfo.badgeColor} text-white text-xs`}>
            {statusInfo.badgeText}
          </Badge>
        </div>
        <CardDescription className="text-gray-400">
          {statusInfo.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar3D 
            state={status === 'alert' ? 'concerned' : status === 'analyzing' ? 'analyzing' : 'idle'} 
            size="md"
          />
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Equipment</p>
                <p className="text-white font-medium">145 Total</p>
              </div>
              <div>
                <p className="text-gray-400">Operational</p>
                <p className="text-white font-medium">142 Active</p>
              </div>
              <div>
                <p className="text-gray-400">Calibrations</p>
                <p className="text-white font-medium">2 Due</p>
              </div>
              <div>
                <p className="text-gray-400">Compliance</p>
                <p className="text-white font-medium">98.5%</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 