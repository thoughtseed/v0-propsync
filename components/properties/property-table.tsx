"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal, ArrowUpDown, Edit, Trash, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// MVP: RoleGate removed - single admin user has full access
// For beta: restore RoleGate import from components/_archived/auth/role-gate
import { isCurrentUserAdminClient } from "@/lib/utils/auth-utils-client"

interface Property {
  id: string
  reference: string
  name: string
  unit: string
  type: string
  bedrooms: number
  bathrooms: number
  occupancy: number
  address: string
  completion: number
  status: string
  createdAt: string
  updatedAt: string
}

interface PropertyTableProps {
  properties: Property[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function PropertyTable({ properties, onEdit, onDelete }: PropertyTableProps) {
  const router = useRouter()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [sortField, setSortField] = useState<keyof Property>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isAdmin, setIsAdmin] = useState<boolean>(true) // MVP: Always true for authenticated users

  // MVP: Admin status check simplified - all authenticated users are admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      const adminStatus = await isCurrentUserAdminClient() // Always returns true for authenticated users
      setIsAdmin(adminStatus)
    }
    checkAdminStatus()
  }, [])

  // Format last updated date
  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) {
        return `${diffInDays}d ago`
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }
    }
  }

  const handleSort = (field: keyof Property) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedProperties = [...properties].sort((a, b) => {
    if (
      sortField === "completion" ||
      sortField === "bedrooms" ||
      sortField === "bathrooms" ||
      sortField === "occupancy"
    ) {
      return sortDirection === "asc" ? a[sortField] - b[sortField] : b[sortField] - a[sortField]
    }

    return sortDirection === "asc" ? a[sortField].localeCompare(b[sortField]) : b[sortField].localeCompare(a[sortField])
  })

  const handleSelectAll = () => {
    if (selectedRows.length === properties.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(properties.map((p) => p.id))
    }
  }

  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const handleRowClick = (id: string) => {
    router.push(`/properties/${id}`)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedRows.length === properties.length && properties.length > 0}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="w-[180px]">
              <div className="flex items-center cursor-pointer" onClick={() => handleSort("name")}>
                Property
                {sortField === "name" && (
                  <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "transform rotate-180" : ""}`} />
                )}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort("address")}>
                Address
                {sortField === "address" && (
                  <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "transform rotate-180" : ""}`} />
                )}
              </div>
            </TableHead>
            <TableHead className="w-[100px] text-center">
              <div className="flex items-center justify-center cursor-pointer" onClick={() => handleSort("bedrooms")}>
                Beds
                {sortField === "bedrooms" && (
                  <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "transform rotate-180" : ""}`} />
                )}
              </div>
            </TableHead>
            <TableHead className="w-[100px] text-center">
              <div className="flex items-center justify-center cursor-pointer" onClick={() => handleSort("bathrooms")}>
                Baths
                {sortField === "bathrooms" && (
                  <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "transform rotate-180" : ""}`} />
                )}
              </div>
            </TableHead>
            <TableHead className="w-[120px]">
              <div className="flex items-center cursor-pointer" onClick={() => handleSort("status")}>
                Status
                {sortField === "status" && (
                  <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "transform rotate-180" : ""}`} />
                )}
              </div>
            </TableHead>
            <TableHead className="w-[150px]">
              <div className="flex items-center cursor-pointer" onClick={() => handleSort("completion")}>
                Completion
                {sortField === "completion" && (
                  <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "transform rotate-180" : ""}`} />
                )}
              </div>
            </TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProperties.map((property) => (
            <TableRow
              key={property.id}
              className={selectedRows.includes(property.id) ? "bg-blue-50" : ""}
              onClick={() => handleRowClick(property.id)}
              style={{ cursor: "pointer" }}
            >
              <TableCell className="p-2" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedRows.includes(property.id)}
                  onCheckedChange={() => handleSelectRow(property.id)}
                  aria-label={`Select ${property.name}`}
                />
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{property.name}</div>
                  <div className="text-sm text-gray-500">Unit {property.unit}</div>
                </div>
              </TableCell>
              <TableCell className="truncate max-w-[200px]">{property.address}</TableCell>
              <TableCell className="text-center">{property.bedrooms}</TableCell>
              <TableCell className="text-center">{property.bathrooms}</TableCell>
              <TableCell>
                <Badge className="bg-gray-600 text-white">
                  Last updated {formatLastUpdated(property.updatedAt)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Progress value={property.completion} className="h-2" />
                  <div className="text-xs text-right">{property.completion}%</div>
                </div>
              </TableCell>
              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/properties/${property.id}`)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuItem
                          onClick={() => (onEdit ? onEdit(property.id) : router.push(`/properties/${property.id}/edit`))}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => onDelete && onDelete(property.id)}>
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {properties.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                No properties found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
