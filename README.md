# Harp Account Management & Authentication System

A modern, modular authentication system built with Next.js 15, designed to work as a frontend proxy to existing authentication APIs.

## Features

- 🔐 **Secure Authentication** - Email/password and social login (Google, Microsoft)
- 📱 **OTP Verification** - Email and SMS verification support
- 🎨 **Modern UI** - Clean, responsive design matching the "harp" aesthetic
- 🔄 **Progressive Profiling** - Gradual user data collection
- 📋 **KYC/KYB Ready** - Built-in verification workflows
- 🌙 **Dark/Light Mode** - Theme switching support
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🔌 **API Proxy** - Seamless integration with existing backends

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: NextAuth.js
- **UI Components**: TailwindCSS + ShadCN UI
- **Form Handling**: React Hook Form + Zod validation
- **State Management**: React Context API
- **Icons**: Lucide React
- **Themes**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+ 
- yarn
- Existing Harp authentication API endpoint

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd harp-accounts
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
HARP_CORE_API_URL=https://harp-core.vercel.app/api
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
# ... other variables
```

5. Run the development server:
```bash
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

For a detailed view of the project structure, see [project_structure.md](./project_structure.md).

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes and proxy
│   ├── auth/              # Authentication pages
│   └── profile/           # User profile pages
├── components/            # Reusable React components
│   ├── auth/             # Authentication components
│   ├── forms/            # Form components
│   ├── ui/               # UI components (ShadCN)
│   └── layout/           # Layout components
├── lib/                  # Utility functions and configurations
├── hooks/                # Custom React hooks
└── @types/                # TypeScript type definitions
```

## API Integration

The system uses a proxy pattern to forward requests to your existing authentication API:

```
Frontend → /api/auth/proxy → Harp Core API → Harp Core DB
```

### Supported Endpoints
- `POST /api/auth/proxy?action=signup` → Your `/auth/register`
- `POST /api/auth/proxy?action=login` → Your `/auth/login`
- `POST /api/auth/proxy?action=verify-otp` → Your `/auth/verify-otp`
- `POST /api/auth/proxy?action=reset-password` → Your `/auth/forgot-password`
- And more...

## Components

### Authentication Components
- `<LoginForm />` - Main login interface
- `<SignupForm />` - User registration form
- `<OTPVerification />` - OTP verification interface
- `<PasswordReset />` - Password reset functionality

### Reusable Components

- `<AuthInput />` - Styled input with validation
- `<AuthButton />` - Loading button with states
- `<SocialLogin />` - Social authentication buttons


### API Endpoints

Modify the endpoint mapping in `app/api/auth/proxy/route.ts`:

```typescript
const endpointMap: Record<string, string> = {
  'signup': '/your-custom-signup-endpoint',
  'login': '/your-custom-login-endpoint',
  // ... other mappings
}
```
 
## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_URL` | Your app URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes |
| `EXTERNAL_API_URL` | Your backend API URL | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Optional |
| `MICROSOFT_CLIENT_ID` | Microsoft OAuth client ID | Optional |
| `MICROSOFT_CLIENT_SECRET` | Microsoft OAuth client secret | Optional  |"# harp-accounts" 
