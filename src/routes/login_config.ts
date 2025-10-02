import { ThemeSupa } from "@supabase/auth-ui-shared"
import type { Provider } from "@supabase/supabase-js"

export const oauthProviders = ["github"] as Provider[]

// Updated to use shadcn color system
export const sharedAppearance = {
  theme: ThemeSupa,
  style: {
    button: {
      backgroundColor: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
      borderRadius: 'calc(var(--radius) - 2px)',
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      height: '2.5rem',
      transition: 'all 150ms',
    },
    anchor: {
      color: 'hsl(var(--primary))',
      fontSize: '0.875rem',
      textDecoration: 'underline',
      textUnderlineOffset: '4px',
    },
    label: {
      color: 'hsl(var(--foreground))',
      fontSize: '0.875rem',
      fontWeight: '500',
      marginBottom: '0.25rem',
      display: 'block',
    },
    input: {
      backgroundColor: 'transparent',
      borderColor: 'hsl(var(--input))',
      borderWidth: '1px',
      borderRadius: 'calc(var(--radius) - 2px)',
      fontSize: '0.875rem',
      padding: '0.5rem 0.75rem',
      color: 'hsl(var(--foreground))',
      height: '2.5rem',
    },
    divider: {
      backgroundColor: 'hsl(var(--border))',
    },
    message: {
      color: 'hsl(var(--foreground))',
      fontSize: '0.875rem',
    },
  }
}