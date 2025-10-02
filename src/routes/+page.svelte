<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card"
</script>

<svelte:head>
  <title>EP Dealer Portal - Login</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
  <Card class="w-[400px]">
    <CardHeader class="space-y-1">
      <CardTitle class="text-2xl font-bold text-center">EP Dealer Portal</CardTitle>
      <CardDescription class="text-center">
        Access your dealer dashboard
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="space-y-2">
        <h3 class="text-lg font-semibold">Welcome Back</h3>
        <Button href="/sign_in" class="w-full" size="lg">
          Sign In
        </Button>
      </div>

      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <span class="w-full border-t" />
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">New to the platform?</p>
        <Button href="/sign_up" variant="outline" class="w-full" size="lg">
          Create Account
        </Button>
      </div>
    </CardContent>
  </Card>
</div>