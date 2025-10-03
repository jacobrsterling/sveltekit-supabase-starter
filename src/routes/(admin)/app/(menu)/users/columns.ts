import type { ColumnDef } from "@tanstack/table-core"
import { formatDate } from "$lib/utils"
import { renderComponent } from "$lib/components/ui/data-table"
import RoleBadge from "$lib/components/role-badge.svelte"
import ActionsCell from "./actions-cell.svelte"

export type User = {
  id: string
  email: string | undefined
  created_at: string
  last_sign_in_at: string | undefined
  full_name: string | null
  company_name: string | null
  unsubscribed: boolean
  role_id: string | null
  role_name: string | null
  role_colour: string | null
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.getValue("email") || "-",
    meta: {
      cellClass: "font-medium"
    }
  },
  {
    accessorKey: "full_name",
    header: "Full Name",
    cell: ({ row }) => row.getValue("full_name") || "-",
  },
  {
    accessorKey: "company_name",
    header: "Company",
    cell: ({ row }) => row.getValue("company_name") || "-",
  },
  {
    accessorKey: "role_name",
    header: "Role",
    cell: ({ row }) => {
      const roleName = row.getValue("role_name") as string | null
      const roleColour = row.original.role_colour
      if (roleName) {
        return renderComponent(RoleBadge, { name: roleName, colour: roleColour })
      }
      return "-"
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => formatDate(row.getValue("created_at")),
    meta: {
      cellClass: "text-sm"
    }
  },
  {
    accessorKey: "last_sign_in_at",
    header: "Last Sign In",
    cell: ({ row }) => {
      const date = row.getValue("last_sign_in_at") as string | undefined
      return formatDate(date || null)
    },
    meta: {
      cellClass: "text-sm"
    }
  },
  {
    accessorKey: "unsubscribed",
    header: "Subscribed",
    cell: ({ row }) => {
      const unsubscribed = row.getValue("unsubscribed")
      return unsubscribed ? "No" : "Yes"
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return renderComponent(ActionsCell, { user: row.original })
    },
  },
]
