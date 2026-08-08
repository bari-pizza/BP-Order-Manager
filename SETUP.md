# Bari Pizza Order Manager - Setup Guide

## Prerequisites

- Node.js 16 or higher
- npm or yarn
- A Supabase account (free tier is sufficient)
- Git

## Initial Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd bari-pizza-order-manger
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully provisioned (2-3 minutes)
3. Go to Project Settings > API
4. Copy your project URL and anon/public key

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Test Credentials (for Playwright E2E tests)
# Create a test user in Supabase with Manager or Admin role
TEST_USER_EMAIL=your-test-user@example.com
TEST_USER_PASSWORD=your-secure-test-password

# Sentry (Production Error Monitoring - Optional)
# Leave empty in development - Sentry only runs in production builds
VITE_SENTRY_DSN=https://your-key@sentry.io/project-id
```

**Important:** Never commit your `.env` file to git. It's already in `.gitignore`.

### 5. (Optional) Set Up Sentry Error Monitoring

Sentry captures errors in production and sends them to a dashboard for monitoring.

**Setup:**
1. Go to [sentry.io](https://sentry.io) and create a free account
2. Create a new project → Select **React**
3. Copy your **DSN** (Data Source Name)
4. Add to `.env`: `VITE_SENTRY_DSN=https://your-key@sentry.io/project-id`

**Note:** Sentry is configured to run **only in production builds**, not in development or CI/tests.

### 6. Set Up Database Schema

The application requires specific tables in Supabase. You need to:

1. Go to your Supabase Dashboard > SQL Editor
2. Run the database migration scripts (if provided in `/supabase-functions/`)
3. Set up Row Level Security (RLS) policies for:
   - Profile table
   - Order table
   - Payment table
   - Drawer table
   - BusinessDayDriver table
   - OrderOrigin table
   - Resource table
   - AppSetting table
   - BusinessDaySummary table
   - CashTransfer table
   - Driver table

**Note:** Database schema files should be exported from your development Supabase instance.

### 6. Set Up Storage Buckets

Create the following storage buckets in Supabase:

1. `avatars` - For user profile pictures
2. `order_origins` - For order source logos (DoorDash, UberEats, etc.)
3. `resources` - For general resource files

Configure appropriate RLS policies for each bucket.

### 7. Seed Initial Data

Your application requires some initial data:

1. **App Settings** - Configure in `AppSetting` table:
   - `delivery_fee_in_cents` (e.g., 400 for $4.00)
   - `driver_starting_cash_in_cents`
   - `driver_hourly_wage_in_cents`
   - `register_starting_cash_in_cents`
   - `register_for_bank_transfers` (UUID of register drawer)
   - `register_for_cash_transfers` (UUID of register drawer)

2. **Drawers** - Create at least one register drawer in the `Drawer` table

3. **Admin User** - Create your first admin user:
   - Sign up through the app
   - Manually set `is_admin = true` in the Profile table

4. **Order Origins** - Add your order sources (Phone, In-Store, DoorDash, UberEats, etc.)

## Development

### Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests (requires development server running)
npx playwright test --project=dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Internationalization

The app supports English, Spanish, and Portuguese.

To update translations:

1. Edit files in `/messages/` folder
2. Run `npm run generate` to compile translations

## Project Structure

```
src/
├── api/              # API interaction hooks and mutations
├── assets/           # Static assets (icons, animations)
├── components/       # Reusable components
│   ├── Base/        # Basic UI components
│   ├── Order/       # Order-related components
│   └── ...
├── context/          # React Context providers
├── hooks/            # Custom React hooks
│   ├── data/        # Data fetching hooks
│   ├── navigation/  # Navigation hooks
│   ├── ui/          # UI-related hooks
│   └── upload/      # File upload hooks
├── pages/            # Page components
│   ├── Admin/       # Admin dashboard
│   ├── Manager/     # Manager dashboard
│   ├── Orders/      # Orders page
│   └── Profile/     # User profile
├── paraglide/        # Generated i18n files
├── theme/            # MUI theme configuration
├── toast/            # Toast notification utilities
├── types/            # TypeScript type definitions
├── App.tsx           # Main app component
├── main.tsx          # App entry point
├── supaClient.ts     # Supabase client configuration
├── supabaseQueries.ts # Database queries
└── typesAndValidators.ts # Type definitions and validators
```

## User Roles

The application has three user roles:

### 1. Admin
- Manage employees
- Manage order origins
- Manage resources
- Configure app settings

### 2. Manager
- View sales reports
- Manage drawers
- Close business day
- View order history

### 3. Driver/Employee
- Take orders
- Manage assigned orders
- View personal drawer summary
- Close personal drawer

## Common Issues

### Environment Variables Not Loading

Make sure your `.env` file is in the root directory and variables start with `VITE_`.

### Supabase Connection Issues

1. Verify your Supabase URL and anon key are correct
2. Check that your project is not paused (free tier)
3. Verify network connectivity

### Authentication Issues

1. Check Supabase Authentication settings
2. Verify email confirmation settings
3. Check RLS policies on Profile table

### Build Fails

1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Clear Vite cache: `rm -rf node_modules/.vite`

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions to various platforms.

## Support

For issues and questions:
- Check the [troubleshooting guide](./TROUBLESHOOTING.md)
- Review the [user documentation](./docs/)
- Contact: [your-email@example.com]

## License

[Specify your license]
