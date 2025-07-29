'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreditCard, Plus, Trash2, Shield, Lock, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { apiService } from '@/lib/api-service'
import { toast } from 'sonner'

interface PaymentMethod {
  id: string
  type: string
  last4: string
  brand: string
  expMonth: number
  expYear: number
  isDefault: boolean
  isExpired: boolean
}

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)

  useEffect(() => {
    loadPaymentMethods()
  }, [])

  const loadPaymentMethods = async () => {
    try {
      setLoading(true)
      const response = await apiService.billing.getPaymentMethods()
      setPaymentMethods(response.paymentMethods || [])
    } catch (error: any) {
      console.error('Failed to load payment methods:', error)
      toast.error('Failed to load payment methods')
    } finally {
      setLoading(false)
    }
  }

  const handleSetDefault = async (methodId: string) => {
    try {
      await apiService.billing.setDefaultPaymentMethod(methodId)
      toast.success('Default payment method updated')
      loadPaymentMethods()
    } catch (error: any) {
      console.error('Failed to set default payment method:', error)
      toast.error('Failed to update default payment method')
    }
  }

  const handleDeleteMethod = async (methodId: string) => {
    try {
      await apiService.billing.deletePaymentMethod(methodId)
      toast.success('Payment method removed')
      setDeleteDialogOpen(false)
      setSelectedMethod(null)
      loadPaymentMethods()
    } catch (error: any) {
      console.error('Failed to delete payment method:', error)
      toast.error('Failed to remove payment method')
    }
  }

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return '💳'
      case 'mastercard':
        return '💳'
      case 'amex':
        return '💳'
      case 'discover':
        return '💳'
      default:
        return '💳'
    }
  }

  const getStatusColor = (isDefault: boolean, isExpired: boolean) => {
    if (isExpired) return 'bg-red-500/20 text-red-400 border-red-500/30'
    if (isDefault) return 'bg-green-500/20 text-green-400 border-green-500/30'
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  const getStatusText = (isDefault: boolean, isExpired: boolean) => {
    if (isExpired) return 'Expired'
    if (isDefault) return 'Default'
    return 'Active'
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
          <h1 className="text-3xl font-bold text-white mb-2">Payment Methods</h1>
          <p className="text-gray-300">Manage your payment methods and billing information</p>
        </div>

        {/* Security Notice */}
        <Card className="bg-blue-500/10 border-blue-500/20 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold mb-2">Secure Payment Processing</h3>
                <p className="text-gray-300 text-sm">
                  Your payment information is encrypted and secure. We use Stripe for PCI-compliant payment processing. 
                  Your card details are never stored on our servers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getCardIcon(method.brand)}</div>
                    <div>
                      <h3 className="text-white font-semibold">
                        {method.brand} •••• {method.last4}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        Expires {method.expMonth}/{method.expYear}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(method.isDefault, method.isExpired)}>
                    {getStatusText(method.isDefault, method.isExpired)}
                  </Badge>
                </div>

                <div className="flex space-x-2">
                  {!method.isDefault && !method.isExpired && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                    onClick={() => {
                      setSelectedMethod(method)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add New Payment Method */}
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Card className="bg-white/5 border-white/10 border-dashed cursor-pointer hover:bg-white/10 transition-colors">
                <CardContent className="p-6 flex items-center justify-center h-full">
                  <div className="text-center">
                    <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <h3 className="text-white font-semibold">Add Payment Method</h3>
                    <p className="text-gray-300 text-sm">Add a new card or bank account</p>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="bg-white/10 border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">Add Payment Method</DialogTitle>
                <DialogDescription className="text-gray-300">
                  Add a new payment method to your account. Your payment information is secure and encrypted.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber" className="text-white">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry" className="text-white">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc" className="text-white">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="name" className="text-white">Cardholder Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setAddDialogOpen(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Add Payment Method
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Billing Information */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Billing Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-4">Billing Address</h4>
                <div className="space-y-2 text-gray-300">
                  <p>John Doe</p>
                  <p>123 Main Street</p>
                  <p>Apt 4B</p>
                  <p>New York, NY 10001</p>
                  <p>United States</p>
                </div>
                <Button variant="outline" className="mt-4 border-white/20 text-white hover:bg-white/10">
                  Update Address
                </Button>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Tax Information</h4>
                <div className="space-y-2 text-gray-300">
                  <p>Tax ID: 12-3456789</p>
                  <p>VAT Number: GB123456789</p>
                  <p>Tax Exempt: No</p>
                </div>
                <Button variant="outline" className="mt-4 border-white/20 text-white hover:bg-white/10">
                  Update Tax Info
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="bg-white/10 border-white/20">
            <DialogHeader>
              <DialogTitle className="text-white">Remove Payment Method</DialogTitle>
              <DialogDescription className="text-gray-300">
                Are you sure you want to remove this payment method? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={() => selectedMethod && handleDeleteMethod(selectedMethod.id)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Remove Payment Method
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 