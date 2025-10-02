<script lang="ts">
  import { Auth } from "@supabase/auth-ui-svelte"
  import { sharedAppearance, oauthProviders } from "../login_config"
  import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card"

  let { data } = $props()
</script>

<svelte:head>
  <title>Forgot Password - EP Dealer Portal</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
  <Card class="w-[400px]">
    <CardHeader>
      <CardTitle class="text-2xl font-bold text-center">Reset Password</CardTitle>
    </CardHeader>
    <CardContent>
      <Auth
        supabaseClient={data.supabase}
        view="forgotten_password"
        redirectTo={`${data.url}/auth/callback?next=%2Faccount%2Fsettings%2Freset_password`}
        providers={oauthProviders}
        socialLayout="horizontal"
        showLinks={false}
        appearance={sharedAppearance}
        additionalData={undefined}
      />

      <div class="mt-4 text-center text-sm text-muted-foreground">
        Remember your password? <a class="text-primary hover:underline" href="/">Sign in</a>
      </div>
    </CardContent>
  </Card>
</div>
