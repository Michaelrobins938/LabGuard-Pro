'use client'

import { useState, useEffect } from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Save,
  Camera,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  timezone: string
  language: string
  bio?: string
  certifications: string[]
  skills: string[]
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  preferences: Record<string, any>
}

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    name: '',
    email: '',
    phone: '',
    timezone: 'UTC',
    language: 'en',
    bio: '',
    certifications: [],
    skills: [],
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    preferences: {}
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateProfile = (key: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }))
  }

  const updateEmergencyContact = (key: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact!,
        [key]: value
      }
    }))
  }

  const addCertification = () => {
    const cert = prompt('Enter certification name:')
    if (cert) {
      setProfile(prev => ({
        ...prev,
        certifications: [...prev.certifications, cert]
      }))
    }
  }

  const removeCertification = (index: number) => {
    setProfile(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }))
  }

  const addSkill = () => {
    const skill = prompt('Enter skill name:')
    if (skill) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }))
    }
  }

  const removeSkill = (index: number) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Save Status */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800">Profile saved successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Photo */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'personal', name: 'Personal Info', icon: User },
                  { id: 'professional', name: 'Professional', icon: Shield },
                  { id: 'emergency', name: 'Emergency Contact', icon: AlertTriangle }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Personal Information Tab */}
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => updateProfile('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => updateProfile('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profile.phone || ''}
                        onChange={(e) => updateProfile('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={profile.timezone}
                        onChange={(e) => updateProfile('timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                        <option value="Australia/Sydney">Sydney</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        value={profile.language}
                        onChange={(e) => updateProfile('language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="ja">Japanese</option>
                        <option value="zh">Chinese</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profile.bio || ''}
                      onChange={(e) => updateProfile('bio', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              )}

              {/* Professional Information Tab */}
              {activeTab === 'professional' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Certifications
                    </label>
                    <div className="space-y-2">
                      {profile.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                            {cert}
                          </span>
                          <button
                            onClick={() => removeCertification(index)}
                            className="px-2 py-1 text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addCertification}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        + Add Certification
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Skills & Expertise
                    </label>
                    <div className="space-y-2">
                      {profile.skills.map((skill, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                            {skill}
                          </span>
                          <button
                            onClick={() => removeSkill(index)}
                            className="px-2 py-1 text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addSkill}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        + Add Skill
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Emergency Contact Tab */}
              {activeTab === 'emergency' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Name
                      </label>
                      <input
                        type="text"
                        value={profile.emergencyContact?.name || ''}
                        onChange={(e) => updateEmergencyContact('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={profile.emergencyContact?.phone || ''}
                        onChange={(e) => updateEmergencyContact('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship
                      </label>
                      <input
                        type="text"
                        value={profile.emergencyContact?.relationship || ''}
                        onChange={(e) => updateEmergencyContact('relationship', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Spouse, Parent, Friend"
                      />
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span className="text-yellow-800 font-medium">Emergency Contact Information</span>
                    </div>
                    <p className="text-yellow-700 mt-1">
                      This information will only be used in emergency situations and is kept confidential.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveProfile}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </div>
    </div>
  )
} 