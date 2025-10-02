import { ThemeSupa } from "@supabase/auth-ui-shared"
import type { Provider } from "@supabase/supabase-js"

export const oauthProviders = ["github"] as Provider[]

// Updated to use shadcn color system
export const sharedAppearance = {
  theme: ThemeSupa,
  variables: {
    default: {
      colors: {
        brand: 'hsl(4 73% 44%)',  // Red primary color
        brandAccent: 'hsl(4 73% 35%)',  // Darker red for hover
      }
    }
  },
  style: {
    button: {
      backgroundColor: 'hsl(4 73% 44%)',
      color: 'white',
      borderRadius: 'calc(var(--radius) - 2px)',
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      height: '2.5rem',
      transition: 'all 150ms',
      border: 'none',
    },
    '.button:hover': {
      backgroundColor: 'hsl(4 73% 35%)',
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