'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  CreditCard,
  Plus,
  Trash2,
  Shield,
  Lock,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/lib/api-service'
import { toast } from 'react-hot-toast'

interface PaymentMethod {
  id: string
  type: 'card' | 'bank_account'
  last4: string
  brand?: string
  expMonth?: number
  expYear?: number
  isDefault: boolean
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
}

interface AddPaymentMethodData {
  cardNumber: string
  expMonth: string
  expYear: string
  cvc: string
  name: string
  isDefault: boolean
}

export default function PaymentMethodsPage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [formData, setFormData] = useState<AddPaymentMethodData>({
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    name: '',
    isDefault: false
  })

  // Fetch payment methods
  const { data: paymentMethods, isLoading: methodsLoading } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      const response = await apiService.billing.getPaymentMethods()
      return response as PaymentMethod[]
    },
    enabled: !!session
  })

  // Add payment method mutation
  const addMethodMutation = useMutation({
    mutationFn: (data: AddPaymentMethodData) => apiService.billing.addPaymentMethod(data),
    onSuccess: () => {
      toast.success('Payment method added successfully')
      setAddDialogOpen(false)
      setFormData({
        cardNumber: '',
        expMonth: '',
        expYear: '',
        cvc: '',
        name: '',
        isDefault: false
      })
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] })
    },
    onError: (error: any) => {
      toast.error('Failed to add payment method')
    }
  })

  // Delete payment method mutation
  const deleteMethodMutation = useMutation({
    mutationFn: (methodId: string) => apiService.billing.deletePaymentMethod(methodId),
    onSuccess: () => {
      toast.success('Payment method removed successfully')
      setDeleteDialogOpen(false)
      setSelectedMethod(null)
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] })
    },
    onError: (error: any) => {
      toast.error('Failed to remove payment method')
    }
  })

  // Set default payment method mutation
  const setDefaultMutation = useMutation({
    mutationFn: (methodId: string) => apiService.billing.setDefaultPaymentMethod(methodId),
    onSuccess: () => {
      toast.success('Default payment method updated')
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] })
    },
    onError: (error: any) => {
      toast.error('Failed to update default payment method')
    }
  })

  const handleAddMethod = () => {
    if (!formData.cardNumber || !formData.expMonth || !formData.expYear || !formData.cvc || !formData.name) {
      toast.error('Please fill in all required fields')
      return
    }
    addMethodMutation.mutate(formData)
  }

  const handleDeleteMethod = () => {
    if (!selectedMethod) return
    deleteMethodMutation.mutate(selectedMethod.id)
  }

  const handleSetDefault = (methodId: string) => {
    setDefaultMutation.mutate(methodId)
  }

  const formatCardNumber = (number: string) => {
    return number.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
  }

  const getCardBrand = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '')
    if (cleanNumber.startsWith('4')) return 'Visa'
    if (cleanNumber.startsWith('5')) return 'Mastercard'
    if (cleanNumber.startsWith('3')) return 'American Express'
    if (cleanNumber.startsWith('6')) return 'Discover'
    return 'Card'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (methodsLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
          <p className="text-muted-foreground">
            Manage your payment methods and billing information
          </p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                Add a new credit card for automatic billing
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({
                    ...formData,
                    cardNumber: formatCardNumber(e.target.value)
                  })}
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expMonth">Month</Label>
                  <Input
                    id="expMonth"
                    placeholder="MM"
                    value={formData.expMonth}
                    onChange={(e) => setFormData({
                      ...formData,
                      expMonth: e.target.value
                    })}
                    maxLength={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expYear">Year</Label>
                  <Input
                    id="expYear"
                    placeholder="YYYY"
                    value={formData.expYear}
                    onChange={(e) => setFormData({
                      ...formData,
                      expYear: e.target.value
                    })}
                    maxLength={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={formData.cvc}
                    onChange={(e) => setFormData({
                      ...formData,
                      cvc: e.target.value
                    })}
                    maxLength={4}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Cardholder Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    name: e.target.value
                  })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({
                    ...formData,
                    isDefault: e.target.checked
                  })}
                  className="rounded"
                />
                <Label htmlFor="isDefault">Set as default payment method</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddMethod}
                disabled={addMethodMutation.isPending}
              >
                {addMethodMutation.isPending ? 'Adding...' : 'Add Payment Method'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Security Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Secure Payment Processing</h3>
              <p className="text-sm text-blue-700 mt-1">
                Your payment information is encrypted and securely processed by Stripe. 
                We never store your full card details on our servers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Payment Methods</CardTitle>
          <CardDescription>
            Manage your saved payment methods for automatic billing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods?.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {method.brand || 'Card'} •••• {method.last4}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {method.expMonth && method.expYear && (
                        `Expires ${method.expMonth}/${method.expYear}`
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {method.isDefault && (
                    <Badge variant="default">Default</Badge>
                  )}
                  <Badge className={getStatusColor(method.status)}>
                    {method.status.toUpperCase()}
                  </Badge>
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                      disabled={setDefaultMutation.isPending}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMethod(method)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {paymentMethods?.length === 0 && (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Payment Methods</h3>
                <p className="text-muted-foreground mb-4">
                  Add a payment method to enable automatic billing
                </p>
                <Button onClick={() => setAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">PCI DSS Compliant</h4>
              <p className="text-sm text-muted-foreground">
                All payment processing is handled by Stripe, a PCI DSS Level 1 certified provider.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Encrypted Data</h4>
              <p className="text-sm text-muted-foreground">
                Your payment information is encrypted in transit and at rest using industry-standard protocols.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Tokenized Storage</h4>
              <p className="text-sm text-muted-foreground">
                We only store payment tokens, never your actual card details.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Fraud Protection</h4>
              <p className="text-sm text-muted-foreground">
                Advanced fraud detection and prevention measures are in place.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Payment Method</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this payment method? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteMethod}
              disabled={deleteMethodMutation.isPending}
            >
              {deleteMethodMutation.isPending ? 'Removing...' : 'Remove Payment Method'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 