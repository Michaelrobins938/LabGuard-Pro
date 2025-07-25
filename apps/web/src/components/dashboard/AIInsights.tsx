'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, TrendingUp, AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react'

const insights = [
  {
    id: 1,
    type: 'optimization',
    title: 'Equipment Efficiency',
    description: 'Centrifuge #2 shows 15% improved efficiency after recent calibration',
    impact: 'High',
    icon: TrendingUp,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10'
  },
  {
    id: 2,
    type: 'alert',
    title: 'Maintenance Alert',
    description: 'Spectrophotometer #1 requires preventive maintenance within 7 days',
    impact: 'Medium',
    icon: AlertTriangle,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10'
  },
  {
    id: 3,
    type: 'success',
    title: 'Compliance Milestone',
    description: 'All equipment passed monthly compliance check with 98.5% success rate',
    impact: 'High',
    icon: CheckCircle,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10'
  },
  {
    id: 4,
    type: 'schedule',
    title: 'Calibration Schedule',
    description: '3 calibrations scheduled for next week, all on track',
    impact: 'Low',
    icon: Clock,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10'
  }
]

export function AIInsights() {
  return (
    <Card className="glass-card border-0 h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">AI Insights</CardTitle>
              <CardDescription className="text-gray-400">
                Intelligent recommendations
              </CardDescription>
            </div>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-white/5 border-white/20 hover:bg-white/10 rounded-xl"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={insight.id}
            className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10 hover:border-white/20"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-xl ${insight.bgColor}`}>
                <insight.icon className={`h-4 w-4 ${insight.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-white truncate">
                    {insight.title}
                  </h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      insight.impact === 'High' ? 'border-emerald-500/30 text-emerald-400' :
                      insight.impact === 'Medium' ? 'border-yellow-500/30 text-yellow-400' :
                      'border-blue-500/30 text-blue-400'
                    }`}
                  >
                    {insight.impact}
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-400 leading-relaxed">
                  {insight.description}
                </p>
                
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">
                    AI Analysis
                  </span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 px-2 text-xs text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    View Details
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* AI Status */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">AI Assistant Active</p>
              <p className="text-xs text-gray-400">Monitoring 145 devices in real-time</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 