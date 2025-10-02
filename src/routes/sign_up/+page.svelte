<script lang="ts">
  import { Auth } from "@supabase/auth-ui-svelte"
  import { sharedAppearance, oauthProviders } from "../login_config"
  import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card"

  let { data } = $props()
</script>

<svelte:head>
  <title>Sign up - EP Dealer Portal</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
  <Card class="w-[400px]">
    <CardHeader>
      <CardTitle class="text-2xl font-bold text-center">Create Account</CardTitle>
    </CardHeader>
    <CardContent>
      <Auth
        supabaseClient={data.supabase}
        view="sign_up"
        redirectTo={`${data.url}/auth/callback`}
        showLinks={false}
        providers={oauthProviders}
        socialLayout="horizontal"
        appearance={sharedAppearance}
        additionalData={undefined}
      />

      <div class="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?
        <a href="/" class="text-primary hover:underline ml-1">
          Sign in
        </a>
      </div>
    </CardContent>
  </Card>
</div>