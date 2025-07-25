'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Database, 
  MessageSquare, 
  BarChart3, 
  Cloud, 
  Settings,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  category: 'LIMS' | 'ERP' | 'COMMUNICATION' | 'ANALYTICS' | 'CLOUD'
  description: string
  logo: string
  status: 'available' | 'connected' | 'configuring'
  popular: boolean
  enterprise: boolean
  features: string[]
}

const availableIntegrations: Integration[] = [
  {
    id: 'epic-beaker',
    name: 'Epic Beaker',
    category: 'LIMS',
    description: 'Sync equipment and calibration data with Epic Beaker LIMS',
    logo: '/integrations/epic.svg',
    status: 'available',
    popular: true,
    enterprise: true,
    features: ['Equipment sync', 'Calibration data', 'Patient safety']
  },
  {
    id: 'cerner-millennium',
    name: 'Cerner Millennium',
    category: 'LIMS',
    description: 'Connect with Cerner laboratory information system',
    logo: '/integrations/cerner.svg',
    status: 'available',
    popular: true,
    enterprise: true,
    features: ['Real-time sync', 'Compliance tracking', 'Audit trails']
  },
  {
    id: 'microsoft-teams',
    name: 'Microsoft Teams',
    category: 'COMMUNICATION',
    description: 'Get notifications and updates in Teams channels',
    logo: '/integrations/teams.svg',
    status: 'available',
    popular: true,
    enterprise: false,
    features: ['Channel notifications', 'Bot integration', 'File sharing']
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'COMMUNICATION',
    description: 'Receive alerts and collaborate in Slack',
    logo: '/integrations/slack.svg',
    status: 'connected',
    popular: true,
    enterprise: false,
    features: ['Real-time alerts', 'Channel integration', 'Custom workflows']
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'ANALYTICS',
    description: 'Sync customer data and support tickets',
    logo: '/integrations/salesforce.svg',
    status: 'available',
    popular: false,
    enterprise: true,
    features: ['Customer data', 'Support tickets', 'Analytics']
  },
  {
    id: 'power-bi',
    name: 'Power BI',
    category: 'ANALYTICS',
    description: 'Advanced analytics and reporting with Power BI',
    logo: '/integrations/powerbi.svg',
    status: 'available',
    popular: false,
    enterprise: true,
    features: ['Custom dashboards', 'Real-time data', 'Advanced analytics']
  },
  {
    id: 'aws-s3',
    name: 'AWS S3',
    category: 'CLOUD',
    description: 'Store and backup calibration data in AWS S3',
    logo: '/integrations/aws.svg',
    status: 'available',
    popular: false,
    enterprise: true,
    features: ['Secure storage', 'Backup automation', 'Compliance ready']
  },
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    category: 'COMMUNICATION',
    description: 'Integrate with Google Calendar and Drive',
    logo: '/integrations/google.svg',
    status: 'available',
    popular: true,
    enterprise: false,
    features: ['Calendar sync', 'Document sharing', 'Email integration']
  }
]

export function IntegrationsHub() {
  const [integrations, setIntegrations] = useState(availableIntegrations)
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  const categories = ['ALL', 'LIMS', 'ERP', 'COMMUNICATION', 'ANALYTICS', 'CLOUD']

  const filteredIntegrations = integrations.filter(integration => 
    selectedCategory === 'ALL' || integration.category === selectedCategory
  )

  const handleConnect = async (integrationId: string) => {
    // Open integration configuration modal
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, status: 'configuring' }
          : integration
      )
    )

    // Simulate connection process
    setTimeout(() => {
      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === integrationId 
            ? { ...integration, status: 'connected' }
            : integration
        )
      )
    }, 2000)
  }

  const handleDisconnect = async (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, status: 'available' }
          : integration
      )
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'LIMS': return <Database className="w-4 h-4" />
      case 'COMMUNICATION': return <MessageSquare className="w-4 h-4" />
      case 'ANALYTICS': return <BarChart3 className="w-4 h-4" />
      case 'CLOUD': return <Cloud className="w-4 h-4" />
      default: return <Settings className="w-4 h-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'configuring': return <AlertCircle className="w-4 h-4 text-yellow-600" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-gray-600">
          Connect LabGuard Pro with your existing laboratory systems
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {getCategoryIcon(category)}
            <span className="ml-2">{category.replace('_', ' ')}</span>
          </Button>
        ))}
      </div>

      {/* Connected Integrations */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Connected Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIntegrations
            .filter(integration => integration.status === 'connected')
            .map((integration) => (
            <Card key={integration.id} className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      {integration.logo ? (
                        <img 
                          src={integration.logo} 
                          alt={integration.name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        getCategoryIcon(integration.category)
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                        {getStatusIcon(integration.status)}
                      </div>
                    </div>
                  </div>
                  <Switch 
                    checked={true} 
                    onCheckedChange={() => handleDisconnect(integration.id)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{integration.description}</p>
                <div className="space-y-2">
                  {integration.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Available Integrations */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIntegrations
            .filter(integration => integration.status === 'available')
            .map((integration) => (
            <Card key={integration.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {integration.logo ? (
                        <img 
                          src={integration.logo} 
                          alt={integration.name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        getCategoryIcon(integration.category)
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <div className="flex flex-wrap gap-1">
                        {integration.popular && (
                          <Badge variant="outline" className="text-xs">Popular</Badge>
                        )}
                        {integration.enterprise && (
                          <Badge variant="outline" className="text-xs">Enterprise</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                <div className="space-y-2 mb-4">
                  {integration.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
                      {feature}
                    </div>
                  ))}
                  {integration.features.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{integration.features.length - 2} more features
                    </div>
                  )}
                </div>
                <Button 
                  className="w-full"
                  onClick={() => handleConnect(integration.id)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Need a Custom Integration?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Don't see your system listed? Our team can build custom integrations 
            for enterprise customers.
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-2">🔧</div>
                <h4 className="font-semibold">Custom Development</h4>
                <p className="text-sm text-gray-600">Tailored to your needs</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl mb-2">🛡️</div>
                <h4 className="font-semibold">Security Compliant</h4>
                <p className="text-sm text-gray-600">Enterprise-grade security</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-2">📞</div>
                <h4 className="font-semibold">24/7 Support</h4>
                <p className="text-sm text-gray-600">Dedicated assistance</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Request Custom Integration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 