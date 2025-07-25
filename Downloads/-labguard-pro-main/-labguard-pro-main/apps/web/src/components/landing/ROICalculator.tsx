'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Calculator, TrendingUp, DollarSign, Clock, Users } from 'lucide-react'
import { motion } from 'framer-motion'

export function ROICalculator() {
  const [labSize, setLabSize] = useState([50])
  const [complianceIssues, setComplianceIssues] = useState([5])
  const [equipmentFailures, setEquipmentFailures] = useState([3])

  const calculateROI = () => {
    const staff = labSize[0]
    const issues = complianceIssues[0]
    const failures = equipmentFailures[0]
    
    // Cost calculations
    const annualComplianceCost = issues * 25000 // $25k per compliance issue
    const annualEquipmentCost = failures * 50000 // $50k per equipment failure
    const annualStaffCost = staff * 80000 // $80k average staff cost
    const totalCurrentCost = annualComplianceCost + annualEquipmentCost + annualStaffCost
    
    // Savings with LabGuard Pro
    const complianceSavings = annualComplianceCost * 0.85 // 85% reduction
    const equipmentSavings = annualEquipmentCost * 0.70 // 70% reduction
    const staffSavings = annualStaffCost * 0.15 // 15% efficiency gain
    const totalSavings = complianceSavings + equipmentSavings + staffSavings
    
    const annualCost = 50000 + (staff * 100) // Base $50k + $100 per staff
    const netSavings = totalSavings - annualCost
    const roi = (netSavings / annualCost) * 100
    
    return {
      totalCurrentCost,
      totalSavings,
      annualCost,
      netSavings,
      roi
    }
  }

  const results = calculateROI()

  return (
    <section className="py-20 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full mb-6"
          >
            <Calculator className="h-4 w-4 text-teal-400" />
            <span className="text-sm font-medium text-gray-300">ROI Calculator</span>
          </motion.div>
          
          <h2 className="text-4xl font-bold text-white mb-4">
            Calculate Your Laboratory's ROI
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            See how LabGuard Pro can reduce costs and improve compliance across your laboratory operations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Calculator Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Users className="h-5 w-5 text-teal-400" />
                  <span>Laboratory Size</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Number of Staff</Label>
                  <Slider
                    value={labSize}
                    onValueChange={setLabSize}
                    max={200}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-center text-2xl font-bold text-white">{labSize[0]} Staff</div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  <span>Annual Compliance Issues</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Number of Issues</Label>
                  <Slider
                    value={complianceIssues}
                    onValueChange={setComplianceIssues}
                    max={20}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-center text-2xl font-bold text-white">{complianceIssues[0]} Issues</div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-purple-400" />
                  <span>Equipment Failures</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Annual Failures</Label>
                  <Slider
                    value={equipmentFailures}
                    onValueChange={setEquipmentFailures}
                    max={10}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-center text-2xl font-bold text-white">{equipmentFailures[0]} Failures</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-emerald-400" />
                  <span>Your ROI Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 glass-card rounded-xl">
                    <div className="text-2xl font-bold text-white">${(results.totalCurrentCost / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-gray-400">Current Annual Cost</div>
                  </div>
                  <div className="text-center p-4 glass-card rounded-xl">
                    <div className="text-2xl font-bold text-emerald-400">${(results.totalSavings / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-gray-400">Potential Savings</div>
                  </div>
                </div>

                <div className="text-center p-6 glass-card rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                  <div className="text-4xl font-bold text-emerald-400 mb-2">{results.roi.toFixed(0)}%</div>
                  <div className="text-lg text-white mb-2">Return on Investment</div>
                  <div className="text-sm text-gray-400">First Year</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">LabGuard Pro Annual Cost</span>
                    <span className="text-white font-semibold">${(results.annualCost / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Net Annual Savings</span>
                    <span className="text-emerald-400 font-semibold">${(results.netSavings / 1000000).toFixed(1)}M</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-4 rounded-xl">
                  Start Your Free Trial
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 