'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, AlertTriangle, Clock, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TableProps {
  children: ReactNode
  className?: string
}

export function Table({ children, className }: TableProps) {
  return (
    <div className={cn("w-full overflow-auto", className)}>
      <table className="w-full caption-bottom text-sm">
        {children}
      </table>
    </div>
  )
}

interface TableHeaderProps {
  children: ReactNode
  className?: string
}

export function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <thead className={cn("[&_tr]:border-b", className)}>
      {children}
    </thead>
  )
}

interface TableBodyProps {
  children: ReactNode
  className?: string
}

export function TableBody({ children, className }: TableBodyProps) {
  return (
    <tbody className={cn("[&_tr:last-child]:border-0", className)}>
      {children}
    </tbody>
  )
}

interface TableFooterProps {
  children: ReactNode
  className?: string
}

export function TableFooter({ children, className }: TableFooterProps) {
  return (
    <tfoot className={cn("bg-primary font-medium [&>tr]:last:border-b-0", className)}>
      {children}
    </tfoot>
  )
}

interface TableRowProps {
  children: ReactNode
  className?: string
}

export function TableRow({ children, className }: TableRowProps) {
  return (
    <tr className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}>
      {children}
    </tr>
  )
}

interface TableHeadProps {
  children: ReactNode
  className?: string
}

export function TableHead({ children, className }: TableHeadProps) {
  return (
    <th className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}>
      {children}
    </th>
  )
}

interface TableCellProps {
  children: ReactNode
  className?: string
}

export function TableCell({ children, className }: TableCellProps) {
  return (
    <td className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}>
      {children}
    </td>
  )
}

interface TableCaptionProps {
  children: ReactNode
  className?: string
}

export function TableCaption({ children, className }: TableCaptionProps) {
  return (
    <caption className={cn("mt-4 text-sm text-muted-foreground", className)}>
      {children}
    </caption>
  )
}

// Status Badge Component
interface StatusBadgeProps {
  status: 'success' | 'error' | 'warning' | 'pending' | 'info'
  children: ReactNode
  className?: string
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
      case 'pending':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
      case 'info':
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
    }
  }

  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
      getStatusStyles(),
      className
    )}>
      {children}
    </span>
  )
}

// Action Menu Component
interface ActionMenuProps {
  children: ReactNode
  className?: string
}

export function ActionMenu({ children, className }: ActionMenuProps) {
  return (
    <div className={cn("flex items-center justify-end", className)}>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Open menu</span>
      </Button>
      {children}
    </div>
  )
}

// Data Table with Search and Filters
interface DataTableProps {
  data: any[]
  columns: Array<{
    key: string
    title: string
    render?: (value: any, row: any) => ReactNode
  }>
  searchPlaceholder?: string
  className?: string
}

export function DataTable({ data, columns, searchPlaceholder = "Search...", className }: DataTableProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="h-9 w-64 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Filter
          </Button>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.title}</TableHead>
            ))}
                         <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </TableCell>
              ))}
                             <TableCell>
                 <ActionMenu>
                   <div className="hidden">Menu</div>
                 </ActionMenu>
               </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 