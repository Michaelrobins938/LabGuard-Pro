'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, MessageSquare, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function BiotechnologyCTA() {
  const [showTrialForm, setShowTrialForm] = useState(false);
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [trialForm, setTrialForm] = useState({
    name: '',
    email: '',
    company: '',
    researchArea: '',
    message: ''
  });
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    company: '',
    preferredDate: '',
    message: ''
  });
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });

  const handleTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Biotech trial form submitted:', trialForm);
    alert('Thank you! We\'ll contact you within 24 hours to set up your biotechnology trial.');
    setShowTrialForm(false);
    setTrialForm({ name: '', email: '', company: '', researchArea: '', message: '' });
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Biotech demo form submitted:', demoForm);
    alert('Thank you! We\'ll contact you within 24 hours to schedule your personalized demo.');
    setShowDemoForm(false);
    setDemoForm({ name: '', email: '', company: '', preferredDate: '', message: '' });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Biotech contact form submitted:', contactForm);
    alert('Thank you! We\'ll contact you within 24 hours to discuss your biotechnology needs.');
    setShowContactForm(false);
    setContactForm({ name: '', email: '', company: '', phone: '', message: '' });
  };

  const handleInputChange = (form: 'trial' | 'demo' | 'contact', field: string, value: string) => {
    if (form === 'trial') {
      setTrialForm(prev => ({ ...prev, [field]: value }));
    } else if (form === 'demo') {
      setDemoForm(prev => ({ ...prev, [field]: value }));
    } else {
      setContactForm(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Biotechnology Research?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join leading biotech companies that are already accelerating their research and development 
            with LabGuard Pro. Start your transformation today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={() => setShowTrialForm(true)}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center group"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              onClick={() => setShowDemoForm(true)}
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold transition-all duration-300"
            >
              Schedule Demo
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Schedule a Demo</h3>
              <p className="text-blue-100 text-sm mb-3">
                See LabGuard Pro in action with a personalized demo
              </p>
              <Button 
                onClick={() => setShowDemoForm(true)}
                variant="ghost"
                className="text-blue-200 hover:text-white text-sm font-medium"
              >
                Book Demo
              </Button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Talk to an Expert</h3>
              <p className="text-blue-100 text-sm mb-3">
                Speak with our biotech solutions specialists
              </p>
              <Button 
                onClick={() => setShowContactForm(true)}
                variant="ghost"
                className="text-blue-200 hover:text-white text-sm font-medium"
              >
                Contact Us
              </Button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Call Us</h3>
              <p className="text-blue-100 text-sm mb-3">
                Speak directly with our team
              </p>
              <a href="tel:+1-800-LABGUARD" className="text-blue-200 hover:text-white text-sm font-medium">
                +1 (800) LABGUARD
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              What Our Biotech Partners Say
            </h3>
            <div className="space-y-4">
              <div className="text-blue-100 italic">
                "LabGuard Pro has revolutionized our research workflow. We've reduced our experimental setup time by 60% and improved our data accuracy significantly."
              </div>
              <div className="text-white font-semibold">
                — Dr. Sarah Chen, Research Director, BioTech Innovations
              </div>
            </div>
          </motion.div>
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
              <CardTitle className="text-2xl font-bold text-white">Start Biotech Trial</CardTitle>
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
                  placeholder="Research Area"
                  value={trialForm.researchArea}
                  onChange={(e) => handleInputChange('trial', 'researchArea', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />
                <Textarea
                  placeholder="Tell us about your biotechnology needs..."
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
              <CardTitle className="text-2xl font-bold text-white">Schedule Biotech Demo</CardTitle>
              <p className="text-gray-300">Book a personalized demo with our biotech experts</p>
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
                  placeholder="Tell us about your biotech needs..."
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

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-slate-900 border border-white/20 rounded-2xl p-8 max-w-md w-full"
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Contact Biotech Expert</CardTitle>
              <p className="text-gray-300">Speak with our biotech solutions specialists</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <Input
                  placeholder="Full Name"
                  value={contactForm.name}
                  onChange={(e) => handleInputChange('contact', 'name', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />
                <Input
                  placeholder="Email Address"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />
                <Input
                  placeholder="Company"
                  value={contactForm.company}
                  onChange={(e) => handleInputChange('contact', 'company', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />
                <Input
                  placeholder="Phone Number"
                  value={contactForm.phone}
                  onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />
                <Textarea
                  placeholder="Tell us about your biotech needs..."
                  value={contactForm.message}
                  onChange={(e) => handleInputChange('contact', 'message', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[100px]"
                  required
                />
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600">
                    Contact Expert
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowContactForm(false)}
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
    </section>
  )
} 