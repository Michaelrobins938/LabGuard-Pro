'use client'

import React, { useState } from 'react'
import { 
  ArrowRight,
  Sparkles,
  FlaskConical,
  Shield,
  Calendar,
  MessageSquare,
  Phone
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PharmaceuticalCTA() {
  const [showTrialForm, setShowTrialForm] = useState(false);
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [trialForm, setTrialForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    company: '',
    preferredDate: '',
    message: ''
  });

  const handleTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Trial form submitted:', trialForm);
    alert('Thank you! We\'ll contact you within 24 hours to set up your pharmaceutical trial.');
    setShowTrialForm(false);
    setTrialForm({ name: '', email: '', company: '', phone: '', message: '' });
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Demo form submitted:', demoForm);
    alert('Thank you! We\'ll contact you within 24 hours to schedule your personalized demo.');
    setShowDemoForm(false);
    setDemoForm({ name: '', email: '', company: '', preferredDate: '', message: '' });
  };

  const handleInputChange = (form: 'trial' | 'demo', field: string, value: string) => {
    if (form === 'trial') {
      setTrialForm(prev => ({ ...prev, [field]: value }));
    } else {
      setDemoForm(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-blue-900 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-12 backdrop-blur-sm"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Transform Your Drug Development?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join leading pharmaceutical companies accelerating their drug development with LabGuard Pro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setShowTrialForm(true)}
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <FlaskConical className="w-5 h-5 mr-2" />
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                onClick={() => setShowDemoForm(true)}
                variant="outline"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all duration-300 backdrop-blur-sm"
              >
                <Shield className="w-5 h-5 mr-2" />
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Trial Form Modal */}
        {showTrialForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-white/20 rounded-2xl p-8 max-w-md w-full"
            >
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Start Free Trial</CardTitle>
                <p className="text-gray-300">Get started with a free 30-day trial</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTrialSubmit} className="space-y-4">
                  <Input
                    placeholder="Full Name"
                    value={trialForm.name}
                    onChange={(e) => handleInputChange('trial', 'name', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                  <Input
                    placeholder="Email Address"
                    type="email"
                    value={trialForm.email}
                    onChange={(e) => handleInputChange('trial', 'email', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                  <Input
                    placeholder="Company"
                    value={trialForm.company}
                    onChange={(e) => handleInputChange('trial', 'company', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                  <Input
                    placeholder="Phone Number"
                    value={trialForm.phone}
                    onChange={(e) => handleInputChange('trial', 'phone', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                  <Textarea
                    placeholder="Tell us about your pharmaceutical needs..."
                    value={trialForm.message}
                    onChange={(e) => handleInputChange('trial', 'message', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[100px]"
                    required
                  />
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600">
                      Start Trial
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowTrialForm(false)}
                      className="border-white/20 text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </motion.div>
          </div>
        )}

        {/* Demo Form Modal */}
        {showDemoForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-white/20 rounded-2xl p-8 max-w-md w-full"
            >
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Schedule Demo</CardTitle>
                <p className="text-gray-300">Book a personalized demo with our experts</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDemoSubmit} className="space-y-4">
                  <Input
                    placeholder="Full Name"
                    value={demoForm.name}
                    onChange={(e) => handleInputChange('demo', 'name', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                  <Input
                    placeholder="Email Address"
                    type="email"
                    value={demoForm.email}
                    onChange={(e) => handleInputChange('demo', 'email', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                  <Input
                    placeholder="Company"
                    value={demoForm.company}
                    onChange={(e) => handleInputChange('demo', 'company', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                  <Input
                    placeholder="Preferred Date (MM/DD/YYYY)"
                    value={demoForm.preferredDate}
                    onChange={(e) => handleInputChange('demo', 'preferredDate', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                  <Textarea
                    placeholder="Tell us about your specific needs..."
                    value={demoForm.message}
                    onChange={(e) => handleInputChange('demo', 'message', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[100px]"
                    required
                  />
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600">
                      Schedule Demo
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowDemoForm(false)}
                      className="border-white/20 text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  )
} 