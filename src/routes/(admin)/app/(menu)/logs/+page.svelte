<script lang="ts">
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card"
  import PageHeader from "$lib/components/page-header.svelte"
  import PageTitle from "$lib/components/page-title.svelte"
  import DataTable from "./data-table.svelte"
  import { columns } from "./columns"
  import type { PageData } from "./$types"

  let { data }: { data: PageData } = $props()
</script>

<PageTitle title="Logs" />

<div class="space-y-6">
  <PageHeader title="Logs" description="View all system activity logs" />

  <Card>
    <CardHeader>
      <CardTitle>Activity Logs</CardTitle>
      <CardDescription>
        {data.logs.length} total log entries
      </CardDescription>
    </CardHeader>
    <CardContent>
      <DataTable data={data.logs} {columns} />
    </CardContent>
  </Card>
</div>
