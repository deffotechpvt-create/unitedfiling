# United Filings - Frontend Application

## 📋 Overview

This is the frontend application for United Filings, a comprehensive business services platform offering GST registration, company incorporation, trademark registration, and various other legal and compliance services. Built with modern React ecosystem and beautiful UI components.

## 🚀 Technologies Used

- **Build Tool**: Vite 5.4.20
- **Framework**: React 18
- **Language**: TypeScript
- **UI Framework**: shadcn-ui (Radix UI Primitives)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Data Fetching**: @tanstack/react-query
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Authentication**: Supabase Auth
- **Animations**: tailwindcss-animate

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                   # shadcn-ui components
│   ├── admin/                # Admin dashboard components
│   │   ├── StatCard.tsx
│   │   └── DataTable.tsx
│   ├── [service-folders]/    # Service-specific components
│   ├── About.tsx
│   ├── CartDropdown.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Layout.tsx
│   └── ...
├── contexts/
│   ├── AdminContext.tsx      # Admin state management
│   ├── CartContext.tsx       # Shopping cart state
│   ├── UserContext.tsx       # User authentication state
│   ├── WishlistContext.tsx   # Wishlist state
│   ├── DashboardContext.tsx  # Dashboard data
│   ├── OrderManagementContext.tsx
│   ├── UserManagementContext.tsx
│   └── AnalyticsContext.tsx
├── hooks/
│   ├── use-mobile.tsx        # Responsive hook
│   ├── use-toast.ts          # Toast notifications
│   └── useExpertRequest.ts   # Expert consultation
├── integrations/supabase/
│   ├── client.ts             # Supabase client
│   └── types.ts              # Type definitions
├── lib/
│   ├── api.js                # API client wrapper
│   └── utils.ts              # Utility functions
├── pages/
│   ├── admin/                # Admin pages
│   │   ├── AdminDashboard.tsx
│   │   └── DashboardLayout.tsx
│   ├── [service-pages]/      # Service landing pages
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Profile.tsx
│   └── ...
├── utils/
│   └── serviceCategories.ts  # Service categorization
├── App.tsx                   # Main app component
├── main.tsx                  # Entry point
└── index.css                 # Global styles
```

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- Backend API running on `http://localhost:5000`

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=United Filings
VITE_APP_URL=http://localhost:8080
```

### 3. Start Development Server

```bash
npm run dev
```

The app will start on `http://localhost:8080`

## 📦 Available Scripts

```bash
npm run dev          # Start development server (port 8080)
npm run build        # Build for production
npm run build:dev    # Build for development
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🎨 UI Components

This project uses **shadcn-ui** components, which are:

- Built on Radix UI primitives
- Fully accessible (WAI-ARIA compliant)
- Customizable with Tailwind CSS
- Copy-paste friendly

### Available Components

- Button, Input, Checkbox, Select
- Dialog, Dropdown Menu, Popover
- Toast, Alert, Badge
- Card, Tabs, Accordion
- And many more...

### Adding New Components

```bash
npx shadcn-ui@latest add [component-name]
```

## 🔐 Authentication Flow

1. **User Registration** (`/signup`)
   - Form validation with Zod
   - Supabase authentication
   - Email verification
   - Toast notifications

2. **User Login** (`/login`)
   - JWT-based authentication
   - Google OAuth support
   - Remember me functionality
   - Auto-redirect based on role

3. **Protected Routes**
   - User Context checks authentication
   - Auto-redirect to login if not authenticated
   - Role-based access (admin/customer)

## 🛒 Key Features

### Customer Features
- **Service Catalog**: Browse 100+ business services
- **Shopping Cart**: Add multiple services
- **Wishlist**: Save services for later
- **Order Management**: Track order status
- **Payment Integration**: Razorpay gateway
- **Profile Management**: Update personal info
- **Expert Consultation**: Request expert callback

### Admin Features
- **Dashboard**: Real-time statistics and analytics
- **User Management**: View, search, delete users
- **Order Management**: Update order status, view details
- **Analytics**: Revenue charts, order trends
- **Filtering**: By status, payment, date range

## 🎯 Service Categories

Services are organized into categories:

- **Business Registration**: Company, LLP, Partnership, etc.
- **Tax & Compliance**: GST, Income Tax, TDS, etc.
- **Intellectual Property**: Trademark, Patent, Copyright
- **Licenses & Registrations**: FSSAI, ISO, Drug License, etc.
- **Foreign Services**: Setup Business in UAE, FDI Filing

## 📱 Responsive Design

The application is fully responsive:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Uses Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

## 🔔 Toast Notifications

Implemented with shadcn-ui toast system:

```tsx
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

toast({
  title: "Success",
  description: "Your action was successful!",
});

// Error toast
toast({
  title: "Error",
  description: "Something went wrong",
  variant: "destructive",
});
```

## 🌐 API Integration

API calls are handled through a custom wrapper in `lib/api.js`:

```typescript
import { useApi } from '@/lib/api';

const { get, post, put, del } = useApi();

// Example usage
const response = await post('/auth/login', { email, password });
```

## 🎨 Styling Guidelines

- Use Tailwind utility classes
- Follow shadcn-ui component patterns
- Maintain consistent spacing (4, 6, 8, 12, 16)
- Color scheme: Green primary, Orange accent
- Gradient backgrounds for headers

## 🔧 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| VITE_SUPABASE_URL | Supabase project URL | Yes | - |
| VITE_SUPABASE_ANON_KEY | Supabase anonymous key | Yes | - |
| VITE_API_URL | Backend API URL | Yes | http://localhost:5000/api |
| VITE_APP_NAME | Application name | No | United Filings |
| VITE_APP_URL | Frontend URL | No | http://localhost:8080 |

## 🧪 Testing

**Note**: Test setup is pending. Will use:
- Vitest for unit tests
- React Testing Library for component tests
- Playwright/Cypress for E2E tests

## 📈 Performance Optimization

- **Code Splitting**: Lazy loading for routes
- **Image Optimization**: Proper sizing and formats
- **Bundle Analysis**: Regular bundle size monitoring
- **Caching**: React Query for data caching
- **Compression**: Vite build compression

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Output directory: `dist/`

### Preview Production Build

```bash
npm run preview
```

### Deployment Platforms

Recommended platforms:
- Vercel (recommended for Vite)
- Netlify
- AWS Amplify
- GitHub Pages

### Environment Variables in Production

Make sure to set all environment variables in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL` (production API URL)

## 🐛 Common Issues & Solutions

### 1. CORS Errors
- Ensure backend CORS is configured for your frontend URL
- Check `FRONTEND_URL` in backend `.env`
- Restart both frontend and backend servers

### 2. Toast Not Showing
- Ensure `<Toaster />` is in App.tsx
- Import from correct path: `@/hooks/use-toast`

### 3. Build Errors
- Clear node_modules and reinstall
- Check TypeScript errors: `npx tsc --noEmit`
- Update Vite cache: `rm -rf node_modules/.vite`

### 4. Supabase Connection
- Verify credentials in `.env`
- Check Supabase project is active
- Ensure correct URL format (includes https://)

## 📚 Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [shadcn-ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Supabase Docs](https://supabase.com/docs)

## 🤝 Contributing

1. Follow existing code style
2. Use TypeScript for type safety
3. Add proper error handling
4. Test changes before committing
5. Write meaningful commit messages

## 🚨 Important Notes

1. **NEVER commit `.env` file** - Contains sensitive keys
2. **Always use environment variables** for configuration
3. **Validate user input** before API calls
4. **Handle errors gracefully** with toast notifications
5. **Keep dependencies updated** regularly

## 📞 Support

For issues or questions, contact the development team.

