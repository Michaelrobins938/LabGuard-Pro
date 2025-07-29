'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Calendar, AlertCircle } from 'lucide-react'

const complianceData = [
  { month: 'Jan', rate: 94.2 },
  { month: 'Feb', rate: 95.8 },
  { month: 'Mar', rate: 96.1 },
  { month: 'Apr', rate: 97.3 },
  { month: 'May', rate: 97.8 },
  { month: 'Jun', rate: 98.5 },
]

const alerts = [
  { id: 1, type: 'warning', message: 'Centrifuge #3 calibration due in 2 days', equipment: 'Centrifuge #3' },
  { id: 2, type: 'info', message: 'New equipment added to inventory', equipment: 'Spectrophotometer #2' },
  { id: 3, type: 'success', message: 'Monthly compliance report generated', equipment: 'System' },
]

export function ComplianceChart() {
  return (
    <Card className="glass-card border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-white">Compliance Overview</CardTitle>
            <CardDescription className="text-gray-400">
              Monthly compliance trends and alerts
            </CardDescription>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-white/5 border-white/20 hover:bg-white/10 rounded-xl"
          >
            <Calendar className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Chart Area */}
        <div className="relative h-48 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 rounded-2xl p-4 border border-white/10">
          {/* Chart Grid */}
          <div className="absolute inset-4 flex items-end justify-between">
            {complianceData.map((data, index) => (
              <div key={data.month} className="flex flex-col items-center space-y-2">
                {/* Bar */}
                <div 
                  className="w-8 rounded-t-lg bg-gradient-to-t from-teal-400 to-cyan-500 transition-all duration-300 hover:from-teal-300 hover:to-cyan-400"
                  style={{ height: `${(data.rate / 100) * 120}px` }}
                />
                {/* Label */}
                <span className="text-xs text-gray-400">{data.month}</span>
              </div>
            ))}
          </div>
          
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
            <span>100%</span>
            <span>95%</span>
            <span>90%</span>
          </div>
          
          {/* Current rate indicator */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500"></div>
              <span className="text-sm font-medium text-white">Current: 98.5%</span>
            </div>
          </div>
        </div>
        
        {/* Alerts Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-white">Recent Alerts</h4>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-xs text-gray-400 hover:text-white"
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 group"
              >
                <div className={`
                  h-2 w-2 rounded-full ${
                    alert.type === 'warning' ? 'bg-yellow-400' :
                    alert.type === 'info' ? 'bg-blue-400' :
                    'bg-green-400'
                  }
                `} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{alert.message}</p>
                  <p className="text-xs text-gray-400 truncate">{alert.equipment}</p>
                </div>
                <AlertCircle className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors duration-200" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">98.5%</p>
            <p className="text-xs text-gray-400">Current Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">+2.1%</p>
            <p className="text-xs text-gray-400">This Month</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400">12</p>
            <p className="text-xs text-gray-400">Pending Tasks</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 