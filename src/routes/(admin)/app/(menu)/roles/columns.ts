import type { ColumnDef } from "@tanstack/table-core"
import { formatDate } from "$lib/utils"
import { renderComponent } from "$lib/components/ui/data-table"
import RoleBadge from "$lib/components/role-badge.svelte"
import ActionsCell from "./actions-cell.svelte"

export type Role = {
  id: string
  name: string
  description: string | null
  colour: string | null
  created_at: string
}

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.getValue("name"),
    meta: {
      cellClass: "font-medium"
    }
  },
  {
    accessorKey: "colour",
    header: "Colour",
    cell: ({ row }) => {
      const name = row.original.name
      const colour = row.getValue("colour") as string | null
      return renderComponent(RoleBadge, { name, colour })
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.getValue("description") || "-",
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return renderComponent(ActionsCell, { role: row.original })
    },
  },
]
