'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle, AlertTriangle, Plus, FileText, Users, Zap, ArrowRight } from 'lucide-react'

const activities = [
  {
    id: 1,
    type: 'calibration_completed',
    title: 'Calibration Completed',
    description: 'Centrifuge #2 calibration completed successfully',
    timestamp: '2 hours ago',
    user: 'Dr. Sarah Chen',
    status: 'success',
    icon: CheckCircle,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10'
  },
  {
    id: 2,
    type: 'equipment_added',
    title: 'New Equipment Added',
    description: 'Spectrophotometer #3 added to inventory',
    timestamp: '4 hours ago',
    user: 'Mike Johnson',
    status: 'info',
    icon: Plus,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10'
  },
  {
    id: 3,
    type: 'alert',
    title: 'Maintenance Alert',
    description: 'Incubator #1 requires preventive maintenance',
    timestamp: '6 hours ago',
    user: 'System',
    status: 'warning',
    icon: AlertTriangle,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10'
  },
  {
    id: 4,
    type: 'report_generated',
    title: 'Monthly Report Generated',
    description: 'Compliance report for January 2024 created',
    timestamp: '1 day ago',
    user: 'AI Assistant',
    status: 'success',
    icon: FileText,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10'
  },
  {
    id: 5,
    type: 'user_joined',
    title: 'New Team Member',
    description: 'Dr. Emily Rodriguez joined the laboratory',
    timestamp: '2 days ago',
    user: 'Admin',
    status: 'info',
    icon: Users,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10'
  }
]

export function ActivityFeed() {
  return (
    <Card className="glass-card border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">Activity Feed</CardTitle>
              <CardDescription className="text-gray-400">
                Recent laboratory activities
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
        {activities.map((activity, index) => (
          <div 
            key={activity.id}
            className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10 hover:border-white/20"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-xl ${activity.bgColor}`}>
                <activity.icon className={`h-4 w-4 ${activity.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-white truncate">
                    {activity.title}
                  </h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      activity.status === 'success' ? 'border-emerald-500/30 text-emerald-400' :
                      activity.status === 'warning' ? 'border-yellow-500/30 text-yellow-400' :
                      activity.status === 'info' ? 'border-blue-500/30 text-blue-400' :
                      'border-gray-500/30 text-gray-400'
                    }`}
                  >
                    {activity.status}
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-400 leading-relaxed mb-2">
                  {activity.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>{activity.timestamp}</span>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 px-2 text-xs text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    View
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Quick Actions */}
        <div className="pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white/5 border-white/20 hover:bg-white/10 rounded-xl h-10"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white/5 border-white/20 hover:bg-white/10 rounded-xl h-10"
            >
              <Zap className="h-4 w-4 mr-2" />
              AI Analysis
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 