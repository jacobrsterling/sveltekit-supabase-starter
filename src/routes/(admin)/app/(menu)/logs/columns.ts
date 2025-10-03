import type { ColumnDef } from "@tanstack/table-core"
import { formatDate } from "$lib/utils"
import { renderComponent } from "$lib/components/ui/data-table"
import UserCell from "./user-cell.svelte"

export type LogEntry = {
  id: string
  created_at: string
  action: string
  entity_type: string | null
  entity_id: string | null
  ip_address: string | null
  metadata: any
  user_id: string | null
  profiles: {
    full_name: string | null
    company_name: string | null
  } | null
}

export const columns: ColumnDef<LogEntry>[] = [
  {
    accessorKey: "created_at",
    header: "Timestamp",
    cell: ({ row }) => formatDate(row.getValue("created_at")),
    meta: {
      cellClass: "font-mono text-sm"
    }
  },
  {
    accessorKey: "profiles",
    header: "User",
    cell: ({ row }) => {
      const profiles = row.getValue("profiles") as LogEntry["profiles"]
      return renderComponent(UserCell, { profiles })
    },
    filterFn: (row, columnId, filterValue) => {
      const profiles = row.getValue(columnId) as LogEntry["profiles"]
      if (!profiles) {
        return "system".includes(filterValue.toLowerCase())
      }
      const searchStr = `${profiles.full_name || ""} ${profiles.company_name || ""}`.toLowerCase()
      return searchStr.includes(filterValue.toLowerCase())
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => row.getValue("action"),
    meta: {
      cellClass: "font-medium"
    }
  },
  {
    accessorKey: "entity_type",
    header: "Entity",
    cell: ({ row }) => {
      const entityType = row.getValue("entity_type") as string | null
      const entityId = row.original.entity_id
      if (entityType && entityId) {
        return `${entityType} (${entityId.substring(0, 8)}...)`
      }
      return "N/A"
    },
  },
  {
    accessorKey: "ip_address",
    header: "IP Address",
    cell: ({ row }) => {
      const ip = row.getValue("ip_address") as string | null
      return ip || "N/A"
    },
    meta: {
      cellClass: "font-mono text-sm"
    }
  },
  {
    accessorKey: "metadata",
    header: "Metadata",
    cell: ({ row }) => {
      const metadata = row.getValue("metadata")
      if (metadata) {
        return JSON.stringify(metadata, null, 2)
      }
      return "-"
    },
    meta: {
      cellClass: "text-xs font-mono max-w-xs truncate"
    }
  },
]
