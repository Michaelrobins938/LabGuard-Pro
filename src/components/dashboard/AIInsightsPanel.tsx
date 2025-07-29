'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Eye,
  Download,
  RefreshCw,
  Target,
  BarChart3,
  FileText,
  Users,
  MapPin,
  Activity,
  Thermometer,
  Gauge,
  Battery,
  Wifi,
  Signal,
  Plus,
  Edit,
  Trash2,
  Shield,
  Bell,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  Target,
  Settings,
  Calendar,
  X
} from 'lucide-react';

interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'optimization' | 'prediction' | 'anomaly' | 'recommendation' | 'analysis';
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  status: 'new' | 'reviewed' | 'implemented' | 'dismissed';
  category: string;
  equipment?: string;
  location?: string;
  timestamp: string;
  timeSaved?: number;
  costSavings?: number;
  riskReduction?: number;
  tags: string[];
  actionRequired: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface AIStats {
  totalInsights: number;
  implementedInsights: number;
  timeSaved: number;
  costSavings: number;
  accuracyRate: number;
  activePredictions: number;
}

export function AIInsightsPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'optimization' | 'prediction' | 'anomaly' | 'recommendation'>('all');
  const [showAll, setShowAll] = useState(false);

  const aiStats: AIStats = {
    totalInsights: 24,
    implementedInsights: 18,
    timeSaved: 156.5,
    costSavings: 28400,
    accuracyRate: 94.2,
    activePredictions: 7
  };

  const aiInsights: AIInsight[] = [
    {
      id: '1',
      title: 'Equipment Optimization Opportunity',
      description: 'Centrifuge CF-16 can be optimized for 15% better efficiency by adjusting rotation speed and timing parameters.',
      type: 'optimization',
      confidence: 94.2,
      impact: 'high',
      status: 'new',
      category: 'Equipment Performance',
      equipment: 'Centrifuge CF-16',
      location: 'Lab A - Room 101',
      timestamp: '2024-01-15T10:30:00Z',
      timeSaved: 2.5,
      costSavings: 1200,
      riskReduction: 85,
      tags: ['efficiency', 'optimization', 'centrifuge'],
      actionRequired: true,
      priority: 'high'
    },
    {
      id: '2',
      title: 'Predictive Maintenance Alert',
      description: 'Incubator IC-200 shows signs of temperature sensor degradation. Recommend replacement within 2 weeks.',
      type: 'prediction',
      confidence: 87.6,
      impact: 'high',
      status: 'reviewed',
      category: 'Predictive Maintenance',
      equipment: 'Incubator IC-200',
      location: 'Lab B - Room 201',
      timestamp: '2024-01-15T09:15:00Z',
      timeSaved: 8.0,
      costSavings: 3500,
      riskReduction: 92,
      tags: ['maintenance', 'prediction', 'sensor'],
      actionRequired: true,
      priority: 'critical'
    },
    {
      id: '3',
      title: 'Protocol Efficiency Analysis',
      description: 'DNA extraction protocol can be optimized to reduce processing time by 25% while maintaining quality standards.',
      type: 'optimization',
      confidence: 91.8,
      impact: 'medium',
      status: 'implemented',
      category: 'Protocol Optimization',
      timestamp: '2024-01-15T08:45:00Z',
      timeSaved: 3.5,
      costSavings: 800,
      riskReduction: 78,
      tags: ['protocol', 'efficiency', 'dna'],
      actionRequired: false,
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Anomaly Detection',
      description: 'Unusual temperature variance detected in pH Meter PH-100. Recommend immediate calibration check.',
      type: 'anomaly',
      confidence: 96.4,
      impact: 'high',
      status: 'new',
      category: 'Quality Control',
      equipment: 'pH Meter PH-100',
      location: 'Lab A - Room 103',
      timestamp: '2024-01-15T08:00:00Z',
      timeSaved: 4.0,
      costSavings: 1500,
      riskReduction: 95,
      tags: ['anomaly', 'calibration', 'quality'],
      actionRequired: true,
      priority: 'critical'
    },
    {
      id: '5',
      title: 'Resource Allocation Recommendation',
      description: 'Reallocate 2 technicians from Lab C to Lab A to optimize workload distribution and reduce bottlenecks.',
      type: 'recommendation',
      confidence: 89.3,
      impact: 'medium',
      status: 'reviewed',
      category: 'Resource Management',
      timestamp: '2024-01-15T07:30:00Z',
      timeSaved: 12.0,
      costSavings: 2200,
      riskReduction: 65,
      tags: ['resource', 'allocation', 'workload'],
      actionRequired: true,
      priority: 'medium'
    },
    {
      id: '6',
      title: 'Compliance Risk Assessment',
      description: '3 equipment items approaching calibration due dates. Schedule maintenance to maintain compliance.',
      type: 'prediction',
      confidence: 92.1,
      impact: 'high',
      status: 'new',
      category: 'Compliance',
      timestamp: '2024-01-15T07:00:00Z',
      timeSaved: 6.0,
      costSavings: 5000,
      riskReduction: 88,
      tags: ['compliance', 'calibration', 'risk'],
      actionRequired: true,
      priority: 'high'
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization':
        return <Target className="h-4 w-4" />;
      case 'prediction':
        return <TrendingUp className="h-4 w-4" />;
      case 'anomaly':
        return <AlertTriangle className="h-4 w-4" />;
      case 'recommendation':
        return <Lightbulb className="h-4 w-4" />;
      case 'analysis':
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'optimization':
        return 'from-blue-500 to-blue-600';
      case 'prediction':
        return 'from-purple-500 to-purple-600';
      case 'anomaly':
        return 'from-red-500 to-red-600';
      case 'recommendation':
        return 'from-orange-500 to-orange-600';
      case 'analysis':
        return 'from-green-500 to-green-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-emerald-400';
      default:
        return 'text-slate-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high':
        return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      default:
        return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'reviewed':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'implemented':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'dismissed':
        return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
      default:
        return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const filteredInsights = aiInsights.filter(insight => {
    if (selectedFilter === 'all') return true;
    return insight.type === selectedFilter;
  });

  const displayedInsights = showAll ? filteredInsights : filteredInsights.slice(0, 4);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleImplementInsight = (insightId: string) => {
    // Implement AI insight with proper tracking
    const insight = aiInsights.find(insight => insight.id === insightId);
    if (insight) {
      // Update insight status to implemented
      updateAIInsight(insightId, { status: 'implemented' });
      
      // Track implementation in analytics
      const implementationData = {
        insightId,
        insightType: insight.type,
        implementationDate: new Date().toISOString(),
        user: user?.firstName + ' ' + user?.lastName,
        laboratory: user?.laboratory?.name
      };
      
      // Store implementation record
      localStorage.setItem(`insight-implementation-${insightId}`, JSON.stringify(implementationData));
      
      // Show success notification
      // This would integrate with your notification system
    }
  };

  const handleDismissInsight = (insightId: string) => {
    // Dismiss AI insight with proper tracking
    const insight = aiInsights.find(insight => insight.id === insightId);
    if (insight) {
      // Update insight status to dismissed
      updateAIInsight(insightId, { status: 'dismissed' });
      
      // Track dismissal in analytics
      const dismissalData = {
        insightId,
        insightType: insight.type,
        dismissalDate: new Date().toISOString(),
        user: user?.firstName + ' ' + user?.lastName,
        laboratory: user?.laboratory?.name,
        reason: 'user_dismissed'
      };
      
      // Store dismissal record
      localStorage.setItem(`insight-dismissal-${insightId}`, JSON.stringify(dismissalData));
      
      // Show confirmation notification
      // This would integrate with your notification system
    }
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg">
              <Brain className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-50">AI Insights</CardTitle>
              <p className="text-sm text-slate-400">Powered by Biomni AI</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-slate-700/50"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              {aiStats.totalInsights} insights
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* AI Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-slate-700/30">
            <p className="text-2xl font-bold text-slate-50">{aiStats.implementedInsights}</p>
            <p className="text-xs text-slate-400">Implemented</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-700/30">
            <p className="text-2xl font-bold text-emerald-400">{aiStats.accuracyRate}%</p>
            <p className="text-xs text-slate-400">Accuracy</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-700/30">
            <p className="text-2xl font-bold text-blue-400">{aiStats.timeSaved}h</p>
            <p className="text-xs text-slate-400">Time Saved</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-700/30">
            <p className="text-2xl font-bold text-green-400">${(aiStats.costSavings / 1000).toFixed(1)}k</p>
            <p className="text-xs text-slate-400">Cost Savings</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 mb-6">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
            className={selectedFilter === 'all' ? 'bg-purple-600 text-white' : 'bg-slate-800/50 border-slate-700/50 text-slate-200'}
          >
            All
          </Button>
          <Button
            variant={selectedFilter === 'optimization' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('optimization')}
            className={selectedFilter === 'optimization' ? 'bg-blue-600 text-white' : 'bg-slate-800/50 border-slate-700/50 text-slate-200'}
          >
            Optimization
          </Button>
          <Button
            variant={selectedFilter === 'prediction' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('prediction')}
            className={selectedFilter === 'prediction' ? 'bg-purple-600 text-white' : 'bg-slate-800/50 border-slate-700/50 text-slate-200'}
          >
            Prediction
          </Button>
          <Button
            variant={selectedFilter === 'anomaly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('anomaly')}
            className={selectedFilter === 'anomaly' ? 'bg-red-600 text-white' : 'bg-slate-800/50 border-slate-700/50 text-slate-200'}
          >
            Anomaly
          </Button>
        </div>

        {/* Insights List */}
        <div className="space-y-4">
          {displayedInsights.map((insight) => (
            <div
              key={insight.id}
              className="p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-200 border border-slate-600/30"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getTypeColor(insight.type)}`}>
                    {getInsightIcon(insight.type)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">{insight.title}</p>
                    <p className="text-sm text-slate-400">{insight.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getPriorityColor(insight.priority)}`}>
                    {insight.priority}
                  </Badge>
                  <Badge className={`${getStatusColor(insight.status)}`}>
                    {insight.status}
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-slate-300 mb-3">{insight.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Confidence</p>
                    <p className="text-lg font-bold text-slate-200">{insight.confidence}%</p>
                  </div>
                  {insight.timeSaved && (
                    <div className="text-center">
                      <p className="text-xs text-slate-400">Time Saved</p>
                      <p className="text-lg font-bold text-emerald-400">{insight.timeSaved}h</p>
                    </div>
                  )}
                  {insight.costSavings && (
                    <div className="text-center">
                      <p className="text-xs text-slate-400">Cost Savings</p>
                      <p className="text-lg font-bold text-green-400">${insight.costSavings}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-slate-400">{formatTimestamp(insight.timestamp)}</p>
                  {insight.actionRequired && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      Action Required
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {insight.tags.map((tag, index) => (
                    <Badge key={index} className="bg-slate-600/50 text-slate-300 border-slate-500/30 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2">
                  {insight.status === 'new' && (
                    <>
                      <Button
                        onClick={() => handleImplementInsight(insight.id)}
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Implement
                      </Button>
                      <Button
                        onClick={() => handleDismissInsight(insight.id)}
                        variant="outline"
                        size="sm"
                        className="bg-slate-800/50 border-slate-700/50 text-slate-200 hover:bg-slate-700/50"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Dismiss
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="sm" className="p-2 hover:bg-slate-600/50">
                    <Eye className="h-3 w-3 text-slate-400" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {filteredInsights.length > 4 && (
          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="w-full bg-slate-800/50 border-slate-700/50 text-slate-200 hover:bg-slate-700/50"
            >
              {showAll ? 'Show Less' : `Show ${filteredInsights.length - 4} More Insights`}
            </Button>
          </div>
        )}

        {/* AI Assistant CTA */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-200">Need AI Assistance?</p>
              <p className="text-sm text-slate-400">Ask Biomni AI for personalized insights</p>
            </div>
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
              <Brain className="h-4 w-4 mr-2" />
              Ask AI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}