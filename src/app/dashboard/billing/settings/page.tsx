'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Settings,
  Save,
  X,
  CreditCard,
  Mail,
  Shield,
  Building,
  MapPin,
  FileText,
  Bell
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/lib/api-service'
import { toast } from 'react-hot-toast'

interface BillingSettings {
  id: string
  automaticPayments: boolean
  emailInvoices: boolean
  taxExempt: boolean
  taxId?: string
  billingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  invoiceSettings: {
    currency: string
    language: string
    includeTax: boolean
    includeNotes: boolean
  }
  notifications: {
    paymentReminders: boolean
    invoiceAlerts: boolean
    usageAlerts: boolean
    planChanges: boolean
  }
  updatedAt: string
}

export default function BillingSettingsPage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [settings, setSettings] = useState<BillingSettings | null>(null)

  // Fetch billing settings
  const { data: billingSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['billing-settings'],
    queryFn: async () => {
      const response = await apiService.billing.getBillingSettings()
      return response as BillingSettings
    },
    enabled: !!session
  })

  // Update local settings when data is fetched
  useEffect(() => {
    if (billingSettings) {
      setSettings(billingSettings)
    }
  }, [billingSettings])

  // Update billing settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (data: Partial<BillingSettings>) => apiService.billing.updateBillingSettings(data),
    onSuccess: () => {
      toast.success('Billing settings updated successfully')
      setIsEditing(false)
      queryClient.invalidateQueries({ queryKey: ['billing-settings'] })
    },
    onError: (error: any) => {
      toast.error('Failed to update billing settings')
    }
  })

  const handleSave = () => {
    if (!settings) return
    updateSettingsMutation.mutate(settings)
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (billingSettings) {
      setSettings(billingSettings)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    if (!settings) return
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      const parentValue = settings[parent as keyof BillingSettings]
      if (parentValue && typeof parentValue === 'object') {
        setSettings({
          ...settings,
          [parent]: {
            ...parentValue,
            [child]: value
          }
        })
      }
    } else {
      setSettings({
        ...settings,
        [field]: value
      })
    }
  }

  if (settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing Settings</h1>
          <p className="text-muted-foreground">
            Manage your billing preferences and payment settings
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={updateSettingsMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {updateSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Edit Settings
            </Button>
          )}
        </div>
      </div>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Settings
          </CardTitle>
          <CardDescription>
            Configure automatic payments and payment preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="automaticPayments">Automatic Payments</Label>
              <p className="text-sm text-muted-foreground">
                Automatically charge your payment method on billing due dates
              </p>
            </div>
            <Switch
              id="automaticPayments"
              checked={settings?.automaticPayments || false}
              onCheckedChange={(checked) => handleInputChange('automaticPayments', checked)}
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailInvoices">Email Invoices</Label>
              <p className="text-sm text-muted-foreground">
                Receive invoices via email when they are generated
              </p>
            </div>
            <Switch
              id="emailInvoices"
              checked={settings?.emailInvoices || false}
              onCheckedChange={(checked) => handleInputChange('emailInvoices', checked)}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tax Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Tax Settings
          </CardTitle>
          <CardDescription>
            Configure tax exemption and tax identification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="taxExempt">Tax Exempt</Label>
              <p className="text-sm text-muted-foreground">
                Indicate if your organization is tax exempt
              </p>
            </div>
            <Switch
              id="taxExempt"
              checked={settings?.taxExempt || false}
              onCheckedChange={(checked) => handleInputChange('taxExempt', checked)}
              disabled={!isEditing}
            />
          </div>

          {settings?.taxExempt && (
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID Number</Label>
              <Input
                id="taxId"
                placeholder="Enter your tax exemption ID"
                value={settings.taxId || ''}
                onChange={(e) => handleInputChange('taxId', e.target.value)}
                disabled={!isEditing}
              />
              <p className="text-sm text-muted-foreground">
                Provide your tax exemption certificate number
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Billing Address
          </CardTitle>
          <CardDescription>
            Address used for billing and tax purposes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="addressLine1">Address Line 1</Label>
            <Input
              id="addressLine1"
              placeholder="123 Main Street"
              value={settings?.billingAddress.line1 || ''}
              onChange={(e) => handleInputChange('billingAddress.line1', e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
            <Input
              id="addressLine2"
              placeholder="Suite 100"
              value={settings?.billingAddress.line2 || ''}
              onChange={(e) => handleInputChange('billingAddress.line2', e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="City"
                value={settings?.billingAddress.city || ''}
                onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                placeholder="State"
                value={settings?.billingAddress.state || ''}
                onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                placeholder="12345"
                value={settings?.billingAddress.postalCode || ''}
                onChange={(e) => handleInputChange('billingAddress.postalCode', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="United States"
                value={settings?.billingAddress.country || ''}
                onChange={(e) => handleInputChange('billingAddress.country', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Invoice Settings
          </CardTitle>
          <CardDescription>
            Configure invoice generation and formatting preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <select
                id="currency"
                value={settings?.invoiceSettings.currency || 'USD'}
                onChange={(e) => handleInputChange('invoiceSettings.currency', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <select
                id="language"
                value={settings?.invoiceSettings.language || 'en'}
                onChange={(e) => handleInputChange('invoiceSettings.language', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="includeTax">Include Tax in Invoices</Label>
                <p className="text-sm text-muted-foreground">
                  Show tax calculations on invoices
                </p>
              </div>
              <Switch
                id="includeTax"
                checked={settings?.invoiceSettings.includeTax || false}
                onCheckedChange={(checked) => handleInputChange('invoiceSettings.includeTax', checked)}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="includeNotes">Include Notes</Label>
                <p className="text-sm text-muted-foreground">
                  Add custom notes to invoices
                </p>
              </div>
              <Switch
                id="includeNotes"
                checked={settings?.invoiceSettings.includeNotes || false}
                onCheckedChange={(checked) => handleInputChange('invoiceSettings.includeNotes', checked)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Configure billing-related notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="paymentReminders">Payment Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Receive reminders before payment due dates
              </p>
            </div>
            <Switch
              id="paymentReminders"
              checked={settings?.notifications.paymentReminders || false}
              onCheckedChange={(checked) => handleInputChange('notifications.paymentReminders', checked)}
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="invoiceAlerts">Invoice Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Notify when new invoices are generated
              </p>
            </div>
            <Switch
              id="invoiceAlerts"
              checked={settings?.notifications.invoiceAlerts || false}
              onCheckedChange={(checked) => handleInputChange('notifications.invoiceAlerts', checked)}
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="usageAlerts">Usage Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Alert when approaching usage limits
              </p>
            </div>
            <Switch
              id="usageAlerts"
              checked={settings?.notifications.usageAlerts || false}
              onCheckedChange={(checked) => handleInputChange('notifications.usageAlerts', checked)}
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="planChanges">Plan Change Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Notify when subscription plans are modified
              </p>
            </div>
            <Switch
              id="planChanges"
              checked={settings?.notifications.planChanges || false}
              onCheckedChange={(checked) => handleInputChange('notifications.planChanges', checked)}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Data Encryption</h4>
              <p className="text-sm text-muted-foreground">
                All billing data is encrypted in transit and at rest using industry-standard protocols.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">PCI Compliance</h4>
              <p className="text-sm text-muted-foreground">
                Payment processing is handled by Stripe, a PCI DSS Level 1 certified provider.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Data Retention</h4>
              <p className="text-sm text-muted-foreground">
                Billing records are retained for 7 years to comply with tax regulations.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Access Control</h4>
              <p className="text-sm text-muted-foreground">
                Only authorized users can access and modify billing settings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 