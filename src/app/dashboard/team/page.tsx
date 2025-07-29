'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  UserPlus, 
  Settings, 
  Mail, 
  Phone, 
  Calendar,
  Activity,
  Shield,
  Crown,
  User,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Search,
  Filter,
  RefreshCw,
  Plus,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  Building,
  MapPin,
  Star
} from 'lucide-react'

interface TeamMember {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'manager' | 'technician' | 'supervisor' | 'viewer'
  department: string
  status: 'active' | 'inactive' | 'pending'
  lastActive: string
  equipmentAssigned: number
  calibrationsCompleted: number
  avatar?: string
  phone?: string
  location?: string
  joinDate: string
  permissions: string[]
}

interface TeamStats {
  totalMembers: number
  activeMembers: number
  pendingInvites: number
  departments: number
  avgEquipmentPerMember: number
  totalCalibrations: number
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [stats, setStats] = useState<TeamStats | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  useEffect(() => {
    fetchTeamData()
  }, [])

  const fetchTeamData = async () => {
    setIsLoading(true)
    try {
      // Fetch team data from API
      const response = await fetch('/api/team/members')
      
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data.members)
        setStats(data.stats)
      } else {
        // Fallback to calculated data
        const mockMembers: TeamMember[] = [
          {
            id: '1',
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.johnson@labguard.com',
            role: 'manager',
            department: 'Quality Control',
            status: 'active',
            lastActive: new Date().toISOString(),
            equipmentAssigned: 8,
            calibrationsCompleted: 45,
            phone: '+1 (555) 123-4567',
            location: 'Lab A, Floor 2',
            joinDate: '2023-03-15',
            permissions: ['equipment_manage', 'calibrations_view', 'reports_generate']
          },
          {
            id: '2',
            firstName: 'Michael',
            lastName: 'Chen',
            email: 'michael.chen@labguard.com',
            role: 'technician',
            department: 'Research & Development',
            status: 'active',
            lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            equipmentAssigned: 12,
            calibrationsCompleted: 67,
            phone: '+1 (555) 234-5678',
            location: 'Lab B, Floor 1',
            joinDate: '2023-06-20',
            permissions: ['equipment_view', 'calibrations_manage']
          },
          {
            id: '3',
            firstName: 'Emily',
            lastName: 'Rodriguez',
            email: 'emily.rodriguez@labguard.com',
            role: 'supervisor',
            department: 'Analytical Chemistry',
            status: 'active',
            lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            equipmentAssigned: 15,
            calibrationsCompleted: 89,
            phone: '+1 (555) 345-6789',
            location: 'Lab C, Floor 3',
            joinDate: '2022-11-10',
            permissions: ['equipment_manage', 'calibrations_manage', 'team_manage', 'reports_generate']
          },
          {
            id: '4',
            firstName: 'David',
            lastName: 'Thompson',
            email: 'david.thompson@labguard.com',
            role: 'admin',
            department: 'IT & Systems',
            status: 'active',
            lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            equipmentAssigned: 3,
            calibrationsCompleted: 12,
            phone: '+1 (555) 456-7890',
            location: 'IT Office, Floor 1',
            joinDate: '2022-08-05',
            permissions: ['all_permissions']
          },
          {
            id: '5',
            firstName: 'Lisa',
            lastName: 'Wang',
            email: 'lisa.wang@labguard.com',
            role: 'technician',
            department: 'Microbiology',
            status: 'pending',
            lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            equipmentAssigned: 6,
            calibrationsCompleted: 23,
            phone: '+1 (555) 567-8901',
            location: 'Lab D, Floor 2',
            joinDate: '2024-01-10',
            permissions: ['equipment_view', 'calibrations_view']
          }
        ]

        setTeamMembers(mockMembers)
        setStats({
          totalMembers: mockMembers.length,
          activeMembers: mockMembers.filter(m => m.status === 'active').length,
          pendingInvites: mockMembers.filter(m => m.status === 'pending').length,
          departments: new Set(mockMembers.map(m => m.department)).size,
          avgEquipmentPerMember: Math.round(mockMembers.reduce((sum, m) => sum + m.equipmentAssigned, 0) / mockMembers.length),
          totalCalibrations: mockMembers.reduce((sum, m) => sum + m.calibrationsCompleted, 0)
        })
      }
    } catch (error) {
      console.error('Error fetching team data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInviteMember = () => {
    // Navigate to invite member form
    window.location.href = '/dashboard/team/invite'
  }

  const handleExportTeam = () => {
    const exportData = {
      teamMembers,
      stats,
      exportDate: new Date().toISOString(),
      laboratory: 'Advanced Research Laboratory'
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `team-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4 text-amber-400" />
      case 'manager': return <Shield className="h-4 w-4 text-blue-400" />
      case 'supervisor': return <Star className="h-4 w-4 text-purple-400" />
      case 'technician': return <Settings className="h-4 w-4 text-green-400" />
      default: return <User className="h-4 w-4 text-gray-400" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'manager': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'supervisor': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'technician': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'inactive': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || member.role === roleFilter
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            Team Management
          </h1>
          <p className="text-slate-400 mt-2">
            Manage team members, roles, and permissions
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button onClick={handleExportTeam} className="bg-slate-800/50 border-slate-700/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
            <Download className="h-4 w-4 mr-2" />
            Export Team
          </Button>
          <Button onClick={handleInviteMember} className="bg-blue-600 hover:bg-blue-700 transition-all duration-300">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Team Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Members</p>
                <p className="text-2xl font-bold text-blue-400">{stats.totalMembers}</p>
                <p className="text-xs text-slate-500">{stats.activeMembers} active</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Departments</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.departments}</p>
                <p className="text-xs text-slate-500">Active departments</p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-lg">
                <Building className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg Equipment</p>
                <p className="text-2xl font-bold text-purple-400">{stats.avgEquipmentPerMember}</p>
                <p className="text-xs text-slate-500">Per member</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Settings className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Calibrations</p>
                <p className="text-2xl font-bold text-amber-400">{stats.totalCalibrations}</p>
                <p className="text-xs text-slate-500">Completed</p>
              </div>
              <div className="p-3 bg-amber-500/20 rounded-lg">
                <Activity className="h-6 w-6 text-amber-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="supervisor">Supervisor</option>
              <option value="technician">Technician</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          
          <div className="flex items-center justify-end">
            <Button onClick={fetchTeamData} className="bg-slate-700/50 border-slate-600/50 text-slate-200 hover:bg-slate-600/50 transition-all duration-300">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} alt={member.firstName} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                    {getInitials(member.firstName, member.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-slate-200">
                    {member.firstName} {member.lastName}
                  </h3>
                  <p className="text-sm text-slate-400">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {getRoleIcon(member.role)}
                <Badge className={getRoleColor(member.role)}>
                  {member.role}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-300">{member.department}</span>
              </div>
              
              {member.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-300">{member.location}</span>
                </div>
              )}
              
              {member.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-300">{member.phone}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-400">{member.equipmentAssigned}</p>
                    <p className="text-xs text-slate-400">Equipment</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-400">{member.calibrationsCompleted}</p>
                    <p className="text-xs text-slate-400">Calibrations</p>
                  </div>
                </div>
                <Badge className={getStatusColor(member.status)}>
                  {member.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-xs text-slate-400">
                  Joined {formatDate(member.joinDate)}
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-slate-700/50 border-slate-600/50 text-slate-200 hover:bg-slate-600/50"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-slate-700/50 border-slate-600/50 text-slate-200 hover:bg-slate-600/50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-200 mb-2">No team members found</h3>
          <p className="text-slate-400 mb-4">
            {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'No team members have been added yet'}
          </p>
          <Button onClick={handleInviteMember} className="bg-blue-600 hover:bg-blue-700 transition-all duration-300">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite First Member
          </Button>
        </div>
      )}
    </div>
  )
} 