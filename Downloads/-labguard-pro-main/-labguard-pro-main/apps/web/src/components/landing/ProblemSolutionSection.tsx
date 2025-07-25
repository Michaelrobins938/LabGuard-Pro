import { AlertTriangle, Clock, DollarSign, FileText, CheckCircle, Zap, Shield, TrendingUp } from 'lucide-react'

export function ProblemSolutionSection() {
  const problems = [
    {
      icon: AlertTriangle,
      title: 'Equipment Failures Cost $10K-100K',
      description: 'Uncalibrated equipment leads to failed tests, rejected samples, and expensive re-work.'
    },
    {
      icon: Clock,
      title: 'Manual Compliance Takes 20+ Hours/Week',
      description: 'Technicians spend countless hours on paperwork instead of actual testing.'
    },
    {
      icon: FileText,
      title: 'CAP Audits Cause Panic & Stress',
      description: 'Scrambling to prepare compliance documentation before inspector visits.'
    },
    {
      icon: DollarSign,
      title: 'Non-Compliance Fines Up to $50K',
      description: 'Failed audits result in hefty fines, license suspension, and reputation damage.'
    }
  ]

  const solutions = [
    {
      icon: Zap,
      title: 'AI-Powered Automated Checking',
      description: 'Smart algorithms validate calibrations and catch issues before they become problems.',
      benefit: 'Prevent 95% of equipment failures'
    },
    {
      icon: Clock,
      title: 'One-Click Compliance Reports',
      description: 'Generate CAP-ready documentation instantly with comprehensive audit trails.',
      benefit: 'Save 15+ hours per week'
    },
    {
      icon: Shield,
      title: 'Real-Time Alert System',
      description: 'Get notified before calibrations expire and equipment goes out of compliance.',
      benefit: 'Never miss a deadline'
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Track compliance trends and optimize lab operations with data-driven insights.',
      benefit: 'Improve efficiency by 40%'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Problems Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Laboratory Compliance is <span className="text-red-600">Broken</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manual processes, human errors, and outdated systems are costing labs thousands in failures and fines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {problems.map((problem, index) => (
            <div key={index} className="flex items-start space-x-4 p-6 bg-red-50 rounded-xl border border-red-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <problem.icon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{problem.title}</h3>
                <p className="text-gray-600">{problem.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Solution Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            LabGuard Pro <span className="text-blue-600">Solves This</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered automation eliminates manual errors and ensures 99.9% compliance with zero stress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => (
            <div key={index} className="flex items-start space-x-4 p-6 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <solution.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h3>
                <p className="text-gray-600 mb-3">{solution.description}</p>
                <div className="inline-flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                  <CheckCircle className="w-3 h-3" />
                  <span>{solution.benefit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 cursor-pointer">
            <span>See How It Works</span>
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
      </div>
    </section>
  )
} 