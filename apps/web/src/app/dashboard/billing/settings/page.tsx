'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Settings, Bell, CreditCard, Shield, Mail, Globe, Download, AlertTriangle, CheckCircle } from 'lucide-react'
import { apiService } from '@/lib/api-service'
import { toast } from 'sonner'

interface BillingSettings {
  notifications: {
    paymentReminders: boolean
    usageAlerts: boolean
    planChanges: boolean
    invoiceReady: boolean
    paymentFailed: boolean
  }
  preferences: {
    autoRenewal: boolean
    paperlessBilling: boolean
    taxExempt: boolean
    currency: string
    language: string
  }
  contact: {
    primaryEmail: string
    billingEmail: string
    phone: string
    address: {
      line1: string
      line2: string
      city: string
      state: string
      postalCode: string
      country: string
    }
  }
  tax: {
    taxId: string
    vatNumber: string
    taxExempt: boolean
    exemptionReason: string
  }
}

export default function BillingSettingsPage() {
  const [settings, setSettings] = useState<BillingSettings>({
    notifications: {
      paymentReminders: true,
      usageAlerts: true,
      planChanges: true,
      invoiceReady: true,
      paymentFailed: true
    },
    preferences: {
      autoRenewal: true,
      paperlessBilling: true,
      taxExempt: false,
      currency: 'USD',
      language: 'en'
    },
    contact: {
      primaryEmail: 'john.doe@example.com',
      billingEmail: 'billing@example.com',
      phone: '+1 (555) 123-4567',
      address: {
        line1: '123 Main Street',
        line2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'US'
      }
    },
    tax: {
      taxId: '12-3456789',
      vatNumber: 'GB123456789',
      taxExempt: false,
      exemptionReason: ''
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      // In a real implementation, this would fetch from the API
      // const response = await apiService.billing.getSettings()
      // setSettings(response.settings)
    } catch (error: any) {
      console.error('Failed to load settings:', error)
      toast.error('Failed to load billing settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      // In a real implementation, this would save to the API
      // await apiService.billing.updateSettings(settings)
      toast.success('Billing settings updated successfully')
    } catch (error: any) {
      console.error('Failed to save settings:', error)
      toast.error('Failed to save billing settings')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      // In a real implementation, this would delete the account
      // await apiService.billing.deleteAccount()
      toast.success('Account deletion request submitted')
      setShowDeleteDialog(false)
    } catch (error: any) {
      console.error('Failed to delete account:', error)
      toast.error('Failed to delete account')
    }
  }

  const updateNotification = (key: keyof BillingSettings['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }))
  }

  const updatePreference = (key: keyof BillingSettings['preferences'], value: any) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }))
  }

  const updateContact = (key: keyof BillingSettings['contact'], value: any) => {
    setSettings(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [key]: value
      }
    }))
  }

  const updateAddress = (key: keyof BillingSettings['contact']['address'], value: string) => {
    setSettings(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        address: {
          ...prev.contact.address,
          [key]: value
        }
      }
    }))
  }

  const updateTax = (key: keyof BillingSettings['tax'], value: any) => {
    setSettings(prev => ({
      ...prev,
      tax: {
        ...prev.tax,
        [key]: value
      }
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded mb-4"></div>
            <div className="h-64 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Billing Settings</h1>
          <p className="text-gray-300">Manage your billing preferences and account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notifications */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Payment Reminders</Label>
                  <p className="text-gray-300 text-sm">Get notified before payments are due</p>
                </div>
                <Switch
                  checked={settings.notifications.paymentReminders}
                  onCheckedChange={(checked) => updateNotification('paymentReminders', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Usage Alerts</Label>
                  <p className="text-gray-300 text-sm">Get notified when approaching limits</p>
                </div>
                <Switch
                  checked={settings.notifications.usageAlerts}
                  onCheckedChange={(checked) => updateNotification('usageAlerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Plan Changes</Label>
                  <p className="text-gray-300 text-sm">Get notified about plan modifications</p>
                </div>
                <Switch
                  checked={settings.notifications.planChanges}
                  onCheckedChange={(checked) => updateNotification('planChanges', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Invoice Ready</Label>
                  <p className="text-gray-300 text-sm">Get notified when invoices are available</p>
                </div>
                <Switch
                  checked={settings.notifications.invoiceReady}
                  onCheckedChange={(checked) => updateNotification('invoiceReady', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Payment Failed</Label>
                  <p className="text-gray-300 text-sm">Get notified about payment failures</p>
                </div>
                <Switch
                  checked={settings.notifications.paymentFailed}
                  onCheckedChange={(checked) => updateNotification('paymentFailed', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Billing Preferences */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Billing Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Auto Renewal</Label>
                  <p className="text-gray-300 text-sm">Automatically renew subscriptions</p>
                </div>
                <Switch
                  checked={settings.preferences.autoRenewal}
                  onCheckedChange={(checked) => updatePreference('autoRenewal', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Paperless Billing</Label>
                  <p className="text-gray-300 text-sm">Receive invoices electronically</p>
                </div>
                <Switch
                  checked={settings.preferences.paperlessBilling}
                  onCheckedChange={(checked) => updatePreference('paperlessBilling', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Currency</Label>
                <Select value={settings.preferences.currency} onValueChange={(value) => updatePreference('currency', value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white/10 border-white/20">
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Language</Label>
                <Select value={settings.preferences.language} onValueChange={(value) => updatePreference('language', value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white/10 border-white/20">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Primary Email</Label>
                <Input
                  value={settings.contact.primaryEmail}
                  onChange={(e) => updateContact('primaryEmail', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Billing Email</Label>
                <Input
                  value={settings.contact.billingEmail}
                  onChange={(e) => updateContact('billingEmail', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Phone Number</Label>
                <Input
                  value={settings.contact.phone}
                  onChange={(e) => updateContact('phone', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </CardContent>
          </Card>

          {/* Billing Address */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Billing Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Address Line 1</Label>
                <Input
                  value={settings.contact.address.line1}
                  onChange={(e) => updateAddress('line1', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Address Line 2</Label>
                <Input
                  value={settings.contact.address.line2}
                  onChange={(e) => updateAddress('line2', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">City</Label>
                  <Input
                    value={settings.contact.address.city}
                    onChange={(e) => updateAddress('city', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">State</Label>
                  <Input
                    value={settings.contact.address.state}
                    onChange={(e) => updateAddress('state', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Postal Code</Label>
                  <Input
                    value={settings.contact.address.postalCode}
                    onChange={(e) => updateAddress('postalCode', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Country</Label>
                  <Input
                    value={settings.contact.address.country}
                    onChange={(e) => updateAddress('country', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tax Information */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Tax Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Tax ID</Label>
                <Input
                  value={settings.tax.taxId}
                  onChange={(e) => updateTax('taxId', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">VAT Number</Label>
                <Input
                  value={settings.tax.vatNumber}
                  onChange={(e) => updateTax('vatNumber', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Tax Exempt</Label>
                  <p className="text-gray-300 text-sm">Mark account as tax exempt</p>
                </div>
                <Switch
                  checked={settings.tax.taxExempt}
                  onCheckedChange={(checked) => updateTax('taxExempt', checked)}
                />
              </div>
              {settings.tax.taxExempt && (
                <div className="space-y-2">
                  <Label className="text-white">Exemption Reason</Label>
                  <Textarea
                    value={settings.tax.exemptionReason}
                    onChange={(e) => updateTax('exemptionReason', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Please provide the reason for tax exemption..."
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Account Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
                onClick={handleSaveSettings}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white/10 border-white/20">
                  <DialogHeader>
                    <DialogTitle className="text-white">Delete Account</DialogTitle>
                    <DialogDescription className="text-gray-300">
                      This action cannot be undone. This will permanently delete your account and all associated data.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteDialog(false)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 