<script lang="ts">
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card"
  import * as Table from "$lib/components/ui/table"
  import { Button } from "$lib/components/ui/button"
  import { Input } from "$lib/components/ui/input"
  import { Search, ChevronLeft, ChevronRight } from "lucide-svelte"
  import { formatDate } from "$lib/utils"
  import { goto } from "$app/navigation"
  import type { PageData } from "./$types"

  let { data }: { data: PageData } = $props()

  let searchValue = $state(data.search)

  function handleSearch(event: Event) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (searchValue) {
      params.set("search", searchValue)
    }
    params.set("page", "1")
    goto(`/account/logs?${params.toString()}`)
  }

  function goToPage(page: number) {
    const params = new URLSearchParams()
    if (searchValue) {
      params.set("search", searchValue)
    }
    params.set("page", page.toString())
    goto(`/account/logs?${params.toString()}`)
  }

  function formatMetadata(metadata: any) {
    if (!metadata) return ""
    return JSON.stringify(metadata, null, 2)
  }

  function formatIpAddress(ip: string | null) {
    return ip || "N/A"
  }
</script>

<svelte:head>
  <title>Logs - EP Dealer Portal</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Logs</h1>
      <p class="text-muted-foreground mt-2">View all system activity logs</p>
    </div>
  </div>

  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <div>
          <CardTitle>Activity Logs</CardTitle>
          <CardDescription>
            {data.pagination.totalItems} total log entries
          </CardDescription>
        </div>
        <form onsubmit={handleSearch} class="flex gap-2">
          <div class="relative">
            <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search action or entity type..."
              bind:value={searchValue}
              class="pl-8 w-[300px]"
            />
          </div>
          <Button type="submit" variant="secondary">Search</Button>
          {#if data.search}
            <Button
              type="button"
              variant="outline"
              onclick={() => {
                searchValue = ""
                goto("/account/logs")
              }}
            >
              Clear
            </Button>
          {/if}
        </form>
      </div>
    </CardHeader>
    <CardContent>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Timestamp</Table.Head>
            <Table.Head>User</Table.Head>
            <Table.Head>Action</Table.Head>
            <Table.Head>Entity</Table.Head>
            <Table.Head>IP Address</Table.Head>
            <Table.Head>Metadata</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#if data.logs.length === 0}
            <Table.Row>
              <Table.Cell colspan={6} class="text-center text-muted-foreground py-8">
                No logs found
              </Table.Cell>
            </Table.Row>
          {:else}
            {#each data.logs as log}
              <Table.Row>
                <Table.Cell class="font-mono text-sm">
                  {formatDate(log.created_at)}
                </Table.Cell>
                <Table.Cell>
                  {#if log.profiles}
                    <div>
                      <div class="font-medium">{log.profiles.full_name || "Unknown"}</div>
                      {#if log.profiles.company_name}
                        <div class="text-xs text-muted-foreground">{log.profiles.company_name}</div>
                      {/if}
                    </div>
                  {:else}
                    <span class="text-muted-foreground">System</span>
                  {/if}
                </Table.Cell>
                <Table.Cell class="font-medium">{log.action}</Table.Cell>
                <Table.Cell>
                  {#if log.entity_type && log.entity_id}
                    <div class="text-sm">
                      <div class="font-medium">{log.entity_type}</div>
                      <div class="text-xs text-muted-foreground font-mono">{log.entity_id.substring(0, 8)}...</div>
                    </div>
                  {:else}
                    <span class="text-muted-foreground">N/A</span>
                  {/if}
                </Table.Cell>
                <Table.Cell class="font-mono text-sm">{formatIpAddress(log.ip_address)}</Table.Cell>
                <Table.Cell>
                  {#if log.metadata}
                    <details class="text-xs">
                      <summary class="cursor-pointer text-muted-foreground hover:text-foreground">
                        View details
                      </summary>
                      <pre class="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">{formatMetadata(log.metadata)}</pre>
                    </details>
                  {:else}
                    <span class="text-muted-foreground">-</span>
                  {/if}
                </Table.Cell>
              </Table.Row>
            {/each}
          {/if}
        </Table.Body>
      </Table.Root>

      {#if data.pagination.totalPages > 1}
        <div class="flex items-center justify-between mt-4">
          <div class="text-sm text-muted-foreground">
            Page {data.pagination.currentPage} of {data.pagination.totalPages}
            ({data.pagination.totalItems} total items)
          </div>
          <div class="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={data.pagination.currentPage === 1}
              onclick={() => goToPage(data.pagination.currentPage - 1)}
            >
              <ChevronLeft class="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={data.pagination.currentPage === data.pagination.totalPages}
              onclick={() => goToPage(data.pagination.currentPage + 1)}
            >
              Next
              <ChevronRight class="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      {/if}
    </CardContent>
  </Card>
</div>
