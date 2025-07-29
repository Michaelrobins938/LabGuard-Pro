'use client'

import { useState } from 'react'
import { Calculator, TrendingUp, DollarSign, Clock, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ROICalculatorSection() {
  const [labSize, setLabSize] = useState(10)
  const [equipmentCount, setEquipmentCount] = useState(50)
  const [monthlyFailures, setMonthlyFailures] = useState(2)
  const [hoursPerWeek, setHoursPerWeek] = useState(15)

  // Calculate ROI
  const calculateROI = () => {
    const annualSavings = {
      failurePrevention: monthlyFailures * 10000 * 12, // $10K per failure
      timeSavings: hoursPerWeek * 52 * 50, // $50/hour technician cost
      auditSavings: 5000, // Average audit preparation savings
      efficiencyGains: 20000 // Additional efficiency gains
    }
    
    const totalAnnualSavings = Object.values(annualSavings).reduce((a, b) => a + b, 0)
    const monthlyCost = labSize > 20 ? 1299 : labSize > 5 ? 599 : 299
    const annualCost = monthlyCost * 12
    const netSavings = totalAnnualSavings - annualCost
    const roi = ((netSavings / annualCost) * 100).toFixed(0)
    
    return {
      totalAnnualSavings,
      annualCost,
      netSavings,
      roi,
      breakdown: annualSavings
    }
  }

  const roi = calculateROI()

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Calculate Your <span className="text-blue-600">ROI</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See exactly how much LabGuard Pro can save your laboratory. Adjust the parameters below to match your lab's profile.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Calculator Inputs */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-center mb-6">
              <Calculator className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Lab Profile</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lab Size (Technicians)
                </label>
                <Input
                  type="number"
                  value={labSize}
                  onChange={(e) => setLabSize(Number(e.target.value))}
                  min="1"
                  max="100"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Items
                </label>
                <Input
                  type="number"
                  value={equipmentCount}
                  onChange={(e) => setEquipmentCount(Number(e.target.value))}
                  min="1"
                  max="1000"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Equipment Failures
                </label>
                <Input
                  type="number"
                  value={monthlyFailures}
                  onChange={(e) => setMonthlyFailures(Number(e.target.value))}
                  min="0"
                  max="20"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hours Spent on Compliance Weekly
                </label>
                <Input
                  type="number"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  min="0"
                  max="40"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Your ROI Results</h3>
            </div>

            <div className="space-y-6">
              {/* ROI Percentage */}
              <div className="text-center bg-green-50 rounded-xl p-6">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {roi.roi}% ROI
                </div>
                <div className="text-sm text-green-700">
                  Annual return on investment
                </div>
              </div>

              {/* Net Savings */}
              <div className="text-center bg-blue-50 rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ${roi.netSavings.toLocaleString()}
                </div>
                <div className="text-sm text-blue-700">
                  Net annual savings
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Savings Breakdown</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-red-600 mr-2" />
                      <span className="text-sm text-gray-600">Failure Prevention</span>
                    </div>
                    <span className="font-medium">${roi.breakdown.failurePrevention.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm text-gray-600">Time Savings</span>
                    </div>
                    <span className="font-medium">${roi.breakdown.timeSavings.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm text-gray-600">Audit Savings</span>
                    </div>
                    <span className="font-medium">${roi.breakdown.auditSavings.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-purple-600 mr-2" />
                      <span className="text-sm text-gray-600">Efficiency Gains</span>
                    </div>
                    <span className="font-medium">${roi.breakdown.efficiencyGains.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">Total Annual Savings</span>
                    <span className="font-bold text-lg">${roi.totalAnnualSavings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Annual Cost</span>
                    <span>${roi.annualCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Saving?
            </h3>
            <p className="text-gray-600 mb-6">
              Join hundreds of laboratories already experiencing these savings with LabGuard Pro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Start Free Trial
              </Button>
              <Button variant="outline">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 