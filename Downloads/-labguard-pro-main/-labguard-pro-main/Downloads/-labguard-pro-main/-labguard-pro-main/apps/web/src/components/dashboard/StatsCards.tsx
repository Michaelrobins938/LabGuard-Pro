'use client'

import { TrendingUp, AlertTriangle, CheckCircle, Clock, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

const stats = [
  {
    name: 'Compliance Rate',
    value: '98.5%',
    change: '+2.1%',
    changeType: 'positive',
    icon: CheckCircle,
    gradient: 'from-emerald-400 to-teal-500',
    description: 'Current month compliance',
    trend: [95, 96, 97, 98, 98.5]
  },
  {
    name: 'Equipment Online',
    value: '142',
    change: '98% operational',
    changeType: 'positive',
    icon: Activity,
    gradient: 'from-cyan-400 to-blue-500',
    description: 'Out of 145 total devices',
    trend: [138, 140, 141, 142, 142]
  },
  {
    name: 'Pending Calibrations',
    value: '12',
    change: '-3 from yesterday',
    changeType: 'positive',
    icon: Clock,
    gradient: 'from-yellow-400 to-orange-500',
    description: 'Due within 7 days',
    trend: [18, 16, 15, 15, 12]
  },
  {
    name: 'Critical Alerts',
    value: '3',
    change: 'Requires attention',
    changeType: 'negative',
    icon: AlertTriangle,
    gradient: 'from-red-400 to-pink-500',
    description: 'High priority issues',
    trend: [5, 4, 3, 3, 3]
  }
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={stat.name} 
          className="glass-card p-6 group hover:scale-105 transition-all duration-300 hover:shadow-2xl relative overflow-hidden"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Background gradient overlay */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-300",
            stat.gradient
          )} />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "p-3 rounded-2xl bg-gradient-to-br shadow-lg group-hover:shadow-xl transition-all duration-300",
                stat.gradient
              )}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                {stat.trend.map((point, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "w-1 rounded-full bg-gradient-to-t transition-all duration-300",
                      stat.gradient
                    )}
                    style={{ height: `${(point / Math.max(...stat.trend)) * 20 + 4}px` }}
                  />
                ))}
              </div>
            </div>
            
            {/* Content */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-400">{stat.name}</p>
              <p className="text-3xl font-bold text-white group-hover:text-gradient transition-all duration-300">
                {stat.value}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{stat.description}</p>
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  stat.changeType === 'positive' 
                    ? "text-emerald-400 bg-emerald-500/10" 
                    : "text-red-400 bg-red-500/10"
                )}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
          
          {/* Hover glow effect */}
          <div className={cn(
            "absolute -inset-0.5 bg-gradient-to-br rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-300",
            stat.gradient
          )} />
        </div>
      ))}
    </div>
  )
} 