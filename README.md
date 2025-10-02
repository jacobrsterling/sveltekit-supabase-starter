# EP Dealer Portal

A secure portal for dealers to access and manage their leads.

## Tech Stack

- **Frontend**: SvelteKit 2, Svelte 5, TailwindCSS, DaisyUI
- **Backend**: Supabase (Auth, Database)
- **Language**: TypeScript
- **Email**: Resend

## Project Structure

```
src/
├── routes/
│   ├── (admin)/          # Protected admin routes
│   │   └── account/      # Dashboard and user management
│   │       ├── (menu)/   # Main dashboard area
│   │       │   ├── +page.svelte        # Dashboard homepage
│   │       │   └── settings/           # User settings
│   │       ├── create_profile/         # Profile creation flow
│   │       └── sign_out/              # Sign out functionality
│   ├── sign_in/          # Login page
│   ├── sign_up/          # Registration page
│   └── +page.svelte      # Homepage (redirects to login or dashboard)
├── lib/
│   ├── mailer.ts         # Email functionality
│   └── load_helpers.ts   # Auth helpers
└── config.ts             # App configuration
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Format code
npm run format

# Lint code
npm run lint
```

## Environment Variables

Create a `.env` file with:

```env
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PRIVATE_SUPABASE_SERVICE_KEY=your_service_key
PRIVATE_RESEND_API_KEY=your_resend_key
PRIVATE_RESEND_DOMAIN=your_email_domain
```

## Database Schema

The app uses two main tables:

1. **profiles**: User profiles with dealer information
2. **contact_requests**: Contact form submissions (can be repurposed for leads)

## Authentication Flow

1. User lands on homepage (`/`)
2. If not authenticated → Show login options
3. If authenticated → Redirect to dashboard (`/account`)
4. New users create profile after first login
5. Dashboard shows dealer-specific content

## Next Steps

- [ ] Implement dealer-specific data models
- [ ] Add lead management functionality
- [ ] Create admin panel for managing dealers
- [ ] Add reporting and analytics features
- [ ] Implement role-based access control (dealer vs admin)