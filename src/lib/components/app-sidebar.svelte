<script lang="ts">
  import { Home, Settings, LogOut, BarChart3, Users } from "lucide-svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { WebsiteName } from "../../config";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  interface Props {
    variant?: "sidebar" | "floating" | "inset";
  }

  let { variant = "sidebar" }: Props = $props();
  let currentPath = $derived($page.url.pathname);

  function navigate(url: string) {
    return (e: MouseEvent) => {
      e.preventDefault();
      goto(url);
    };
  }
</script>

<Sidebar.Root {variant}>
  <Sidebar.Header>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton size="lg">
          {#snippet child({ props })}
            <a href="/" onclick={navigate("/")} {...props}>
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BarChart3 class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{WebsiteName}</span>
                <span class="truncate text-xs text-muted-foreground">Dealer Portal</span>
              </div>
            </a>
          {/snippet}
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Header>

  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Navigation</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton isActive={currentPath === "/account"}>
              {#snippet child({ props })}
                <a href="/account" onclick={navigate("/account")} {...props}>
                  <Home class="size-4" />
                  <span>Dashboard</span>
                </a>
              {/snippet}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton isActive={currentPath.includes("/users")}>
              {#snippet child({ props })}
                <a href="/account/users" onclick={navigate("/account/users")} {...props}>
                  <Users class="size-4" />
                  <span>Users</span>
                </a>
              {/snippet}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton isActive={currentPath.includes("/settings")}>
              {#snippet child({ props })}
                <a href="/account/settings" onclick={navigate("/account/settings")} {...props}>
                  <Settings class="size-4" />
                  <span>Settings</span>
                </a>
              {/snippet}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>

  <Sidebar.Footer>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton>
          {#snippet child({ props })}
            <a href="/account/sign_out" onclick={navigate("/account/sign_out")} {...props}>
              <LogOut class="size-4" />
              <span>Sign Out</span>
            </a>
          {/snippet}
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Footer>
</Sidebar.Root>
