'use client'

import { useState, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ChevronDown, ChevronUp, ChevronsUpDown, Search, Filter,
  Download, RefreshCw, Eye, Edit, Trash2, Plus, MoreHorizontal,
  ArrowUpDown, Calendar, User, Settings, AlertTriangle, CheckCircle,
  Clock, Star, Zap, Database, FlaskConical, Microscope, TestTube
} from 'lucide-react'

export interface Column<T> {
  key: string
  header: string
  accessor: (item: T) => any
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, item: T) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

export interface FilterConfig {
  key: string
  value: string
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan'
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  error?: string | null
  onRefresh?: () => void
  onExport?: () => void
  onRowClick?: (item: T) => void
  onRowEdit?: (item: T) => void
  onRowDelete?: (item: T) => void
  onBulkAction?: (action: string, items: T[]) => void
  selectable?: boolean
  pagination?: {
    pageSize: number
    currentPage: number
    totalItems: number
    onPageChange: (page: number) => void
  }
  searchable?: boolean
  filterable?: boolean
  sortable?: boolean
  className?: string
  emptyMessage?: string
  loadingMessage?: string
}

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  loading = false,
  error = null,
  onRefresh,
  onExport,
  onRowClick,
  onRowEdit,
  onRowDelete,
  onBulkAction,
  selectable = false,
  pagination,
  searchable = true,
  filterable = true,
  sortable = true,
  className = '',
  emptyMessage = 'No data available',
  loadingMessage = 'Loading data...'
}: DataTableProps<T>) {
  const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set())
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [filters, setFilters] = useState<FilterConfig[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Filter data based on search term and filters
  const filteredData = useMemo(() => {
    let filtered = [...data]

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        columns.some(column => {
          const value = column.accessor(item)
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        })
      )
    }

    // Apply filters
    filters.forEach(filter => {
      filtered = filtered.filter(item => {
        const value = column.accessor(item)
        const filterValue = filter.value.toLowerCase()

        switch (filter.operator) {
          case 'contains':
            return value?.toString().toLowerCase().includes(filterValue)
          case 'equals':
            return value?.toString().toLowerCase() === filterValue
          case 'startsWith':
            return value?.toString().toLowerCase().startsWith(filterValue)
          case 'endsWith':
            return value?.toString().toLowerCase().endsWith(filterValue)
          case 'greaterThan':
            return Number(value) > Number(filterValue)
          case 'lessThan':
            return Number(value) < Number(filterValue)
          default:
            return true
        }
      })
    })

    return filtered
  }, [data, searchTerm, filters, columns])

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData

    return [...filteredData].sort((a, b) => {
      const column = columns.find(col => col.key === sortConfig.key)
      if (!column) return 0

      const aValue = column.accessor(a)
      const bValue = column.accessor(b)

      if (aValue === bValue) return 0

      const comparison = aValue < bValue ? -1 : 1
      return sortConfig.direction === 'asc' ? comparison : -comparison
    })
  }, [filteredData, sortConfig, columns])

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData

    const startIndex = (pagination.currentPage - 1) * pagination.pageSize
    const endIndex = startIndex + pagination.pageSize
    return sortedData.slice(startIndex, endIndex)
  }, [sortedData, pagination])

  // Handle sorting
  const handleSort = useCallback((key: string) => {
    if (!sortable) return

    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        }
      }
      return { key, direction: 'asc' }
    })
  }, [sortable])

  // Handle filtering
  const handleFilter = useCallback((key: string, value: string, operator: FilterConfig['operator'] = 'contains') => {
    setFilters(current => {
      const existing = current.find(f => f.key === key)
      if (existing) {
        return current.map(f => f.key === key ? { ...f, value, operator } : f)
      }
      return [...current, { key, value, operator }]
    })
  }, [])

  // Handle selection
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(paginatedData.map(item => item.id!)))
    } else {
      setSelectedItems(new Set())
    }
  }, [paginatedData])

  const handleSelectItem = useCallback((id: string | number, checked: boolean) => {
    setSelectedItems(current => {
      const newSet = new Set(current)
      if (checked) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }, [])

  // Handle bulk actions
  const handleBulkAction = useCallback((action: string) => {
    if (!onBulkAction) return

    const selectedData = data.filter(item => selectedItems.has(item.id!))
    onBulkAction(action, selectedData)
    setSelectedItems(new Set())
  }, [onBulkAction, data, selectedItems])

  // Get sort icon
  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ChevronsUpDown className="h-4 w-4" />
    }
    return sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  // Render cell value
  const renderCell = (column: Column<T>, item: T) => {
    const value = column.accessor(item)
    
    if (column.render) {
      return column.render(value, item)
    }

    // Default renderers for common data types
    if (typeof value === 'boolean') {
      return value ? (
        <Badge className="bg-green-500/20 border-green-500/30 text-green-400">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </Badge>
      ) : (
        <Badge className="bg-red-500/20 border-red-500/30 text-red-400">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Inactive
        </Badge>
      )
    }

    if (value instanceof Date) {
      return value.toLocaleDateString()
    }

    if (typeof value === 'number') {
      return value.toLocaleString()
    }

    return value?.toString() || '-'
  }

  const professionalStyles = "bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-300"

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400 mb-2">Error loading data</p>
        <p className="text-slate-400 text-sm">{error}</p>
        {onRefresh && (
          <Button onClick={onRefresh} className={`${professionalStyles} mt-4`}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with search and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700/50 text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          )}
          
          {filterable && (
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className={professionalStyles}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {onRefresh && (
            <Button
              onClick={onRefresh}
              disabled={loading}
              className={professionalStyles}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
          
          {onExport && (
            <Button
              onClick={onExport}
              className={professionalStyles}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && filterable && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columns.filter(col => col.filterable).map(column => (
              <div key={column.key}>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {column.header}
                </label>
                <Input
                  placeholder={`Filter ${column.header.toLowerCase()}...`}
                  onChange={(e) => handleFilter(column.key, e.target.value)}
                  className="bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk actions */}
      {selectable && selectedItems.size > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">
              {selectedItems.size} item(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => handleBulkAction('delete')}
                className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
              <Button
                onClick={() => handleBulkAction('export')}
                className={professionalStyles}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Selected
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700/50 border-b border-slate-600/50">
                {selectable && (
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === paginatedData.length && paginatedData.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                    />
                  </th>
                )}
                {columns.map(column => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-left text-sm font-medium text-slate-300 ${
                      column.sortable && sortable ? 'cursor-pointer hover:bg-slate-600/50' : ''
                    }`}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className={`flex items-center space-x-2 ${column.align === 'center' ? 'justify-center' : column.align === 'right' ? 'justify-end' : ''}`}>
                      <span>{column.header}</span>
                      {column.sortable && sortable && getSortIcon(column.key)}
                    </div>
                  </th>
                ))}
                {(onRowEdit || onRowDelete) && (
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-300">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0) + ((onRowEdit || onRowDelete) ? 1 : 0)} className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="text-slate-400">{loadingMessage}</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0) + ((onRowEdit || onRowDelete) ? 1 : 0)} className="px-4 py-8 text-center">
                    <div className="text-slate-400">
                      <Database className="h-12 w-12 mx-auto mb-4 text-slate-500" />
                      <p>{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className={`border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => onRowClick?.(item)}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id!)}
                          onChange={(e) => handleSelectItem(item.id!, e.target.checked)}
                          className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    {columns.map(column => (
                      <td
                        key={column.key}
                        className={`px-4 py-3 text-sm text-slate-300 ${
                          column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''
                        }`}
                      >
                        {renderCell(column, item)}
                      </td>
                    ))}
                    {(onRowEdit || onRowDelete) && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {onRowEdit && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                onRowEdit(item)
                              }}
                              className="p-1 hover:bg-slate-600/50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {onRowDelete && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                onRowDelete(item)
                              }}
                              className="p-1 hover:bg-red-500/20 text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-400">
            Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of{' '}
            {pagination.totalItems} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={professionalStyles}
            >
              Previous
            </Button>
            <span className="text-slate-300">
              Page {pagination.currentPage} of {Math.ceil(pagination.totalItems / pagination.pageSize)}
            </span>
            <Button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= Math.ceil(pagination.totalItems / pagination.pageSize)}
              className={professionalStyles}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}