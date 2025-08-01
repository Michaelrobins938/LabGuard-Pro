'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search,
  Filter,
  Save,
  Download,
  MapPin,
  Calendar,
  Tag,
  Users,
  BarChart3,
  FileText,
  Settings,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Plus
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { apiService } from '@/lib/api-service'

interface SearchResult {
  id: string
  type: 'equipment' | 'calibration' | 'maintenance' | 'user' | 'report' | 'document'
  title: string
  description: string
  status: string
  location?: string
  date?: string
  tags: string[]
  relevance: number
  metadata: Record<string, any>
}

interface SavedSearch {
  id: string
  name: string
  query: string
  filters: Record<string, any>
  createdAt: string
  lastUsed: string
}

export default function SearchPage() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({})
  const [locationFilter, setLocationFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])

  // Search results
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['search', searchQuery, activeFilters],
    queryFn: async () => {
      const response = await apiService.search.globalSearch({
        query: searchQuery,
        filters: activeFilters,
        types: selectedTypes,
        dateRange,
        location: locationFilter,
        status: statusFilter
      })
      return response.data || []
    },
    enabled: !!session && (searchQuery.length > 0 || Object.keys(activeFilters).length > 0)
  })

  // Fetch saved searches
  const { data: savedSearchesData } = useQuery({
    queryKey: ['saved-searches'],
    queryFn: async () => {
      const response = await apiService.search.getSavedSearches()
      return response.data || []
    },
    enabled: !!session
  })

  useEffect(() => {
    if (savedSearchesData) {
      setSavedSearches(savedSearchesData)
    }
  }, [savedSearchesData])

  const handleSearch = () => {
    const filters: Record<string, any> = {}
    
    if (selectedTypes.length > 0) {
      filters.type = selectedTypes
    }
    if (dateRange.start || dateRange.end) {
      filters.dateRange = dateRange
    }
    if (locationFilter) {
      filters.location = locationFilter
    }
    if (statusFilter) {
      filters.status = statusFilter
    }

    setActiveFilters(filters)
  }

  const clearFilters = () => {
    setActiveFilters({})
    setSelectedTypes([])
    setDateRange({})
    setLocationFilter('')
    setStatusFilter('')
  }

  const saveSearch = async () => {
    const searchName = prompt('Enter a name for this search:')
    if (searchName) {
      try {
        const response = await apiService.search.saveSearch({
          name: searchName,
          query: searchQuery,
          filters: activeFilters
        })
        setSavedSearches([...savedSearches, response.data])
      } catch (error) {
        console.error('Failed to save search:', error)
      }
    }
  }

  const loadSavedSearch = (savedSearch: SavedSearch) => {
    setSearchQuery(savedSearch.query)
    setActiveFilters(savedSearch.filters)
    // Update other filter states based on saved filters
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'equipment':
        return <Settings className="h-4 w-4" />
      case 'calibration':
        return <Calendar className="h-4 w-4" />
      case 'maintenance':
        return <Activity className="h-4 w-4" />
      case 'user':
        return <Users className="h-4 w-4" />
      case 'report':
        return <BarChart3 className="h-4 w-4" />
      case 'document':
        return <FileText className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'compliant':
        return 'bg-green-100 text-green-800'
      case 'pending':
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const resultTypes = [
    { id: 'equipment', label: 'Equipment', icon: Settings },
    { id: 'calibration', label: 'Calibrations', icon: Calendar },
    { id: 'maintenance', label: 'Maintenance', icon: Activity },
    { id: 'user', label: 'Users', icon: Users },
    { id: 'report', label: 'Reports', icon: BarChart3 },
    { id: 'document', label: 'Documents', icon: FileText }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Global Search</h1>
          <p className="text-muted-foreground">
            Search across all equipment, calibrations, maintenance, and documents
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Search
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search equipment, calibrations, maintenance, users, reports, documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Advanced Filters</CardTitle>
            <CardDescription>
              Refine your search with specific criteria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Result Types */}
            <div>
              <h3 className="font-medium mb-3">Result Types</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {resultTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={selectedTypes.includes(type.id) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      if (selectedTypes.includes(type.id)) {
                        setSelectedTypes(selectedTypes.filter(t => t !== type.id))
                      } else {
                        setSelectedTypes([...selectedTypes, type.id])
                      }
                    }}
                    className="justify-start"
                  >
                    <type.icon className="h-4 w-4 mr-2" />
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Date From</label>
                <Input
                  type="date"
                  value={dateRange.start || ''}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Date To</label>
                <Input
                  type="date"
                  value={dateRange.end || ''}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Location and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  placeholder="Filter by location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md mt-1"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button onClick={handleSearch}>
                Apply Filters
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Searches</CardTitle>
            <CardDescription>
              Quick access to your frequently used searches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {savedSearches.map((savedSearch) => (
                <Button
                  key={savedSearch.id}
                  variant="outline"
                  size="sm"
                  onClick={() => loadSavedSearch(savedSearch)}
                >
                  {savedSearch.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchQuery && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Search Results</CardTitle>
                <CardDescription>
                  {searchLoading ? 'Searching...' : `${searchResults?.length || 0} results found`}
                </CardDescription>
              </div>
              {searchResults && searchResults.length > 0 && (
                <Button variant="outline" size="sm" onClick={saveSearch}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Search
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {searchLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <div key={result.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="p-2 bg-muted rounded-lg">
                      {getResultIcon(result.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{result.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {result.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(result.status)}>
                            {result.status}
                          </Badge>
                          <Badge variant="outline">
                            {result.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        {result.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {result.location}
                          </div>
                        )}
                        {result.date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(result.date)}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {result.tags.slice(0, 3).join(', ')}
                          {result.tags.length > 3 && ` +${result.tags.length - 3} more`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Results Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search Tips */}
      {!searchQuery && (
        <Card>
          <CardHeader>
            <CardTitle>Search Tips</CardTitle>
            <CardDescription>
              Make the most of your search with these tips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Quick Searches</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use quotes for exact phrases: "analytical balance"</li>
                  <li>• Search by serial number: AB-001</li>
                  <li>• Filter by location: Lab A</li>
                  <li>• Search by status: overdue, compliant</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Advanced Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use filters to narrow results</li>
                  <li>• Save frequent searches</li>
                  <li>• Export results for reporting</li>
                  <li>• Search across all data types</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 