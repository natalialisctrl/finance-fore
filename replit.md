# EconoSmart Budget - Replit Project Documentation

## Overview

EconoSmart Budget is a comprehensive economic budgeting application that combines real-time economic data tracking with smart purchase recommendations. The application helps users make informed purchasing decisions by analyzing price trends, economic indicators, and personal budget patterns. Built as a full-stack application with React frontend and Express backend, it provides an intelligent dashboard for budget-conscious users.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with custom styling
- **Charts**: Recharts for data visualization
- **Theme**: Dark/light mode support with custom theme provider

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API endpoints
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Build System**: Vite for frontend bundling, esbuild for backend compilation

### Monorepo Structure
```
├── client/           # React frontend application
├── server/           # Express backend API
├── shared/           # Shared TypeScript types and schemas
├── migrations/       # Database migration files
└── attached_assets/  # Project documentation and assets
```

## Key Components

### Database Schema (shared/schema.ts)
- **Users**: User authentication and profiles
- **Economic Data**: Real-time economic indicators (inflation, GDP, CPI)
- **Price Data**: Item prices, trends, and recommendations
- **User Budgets**: Personal budget categories and spending tracking
- **User Savings**: Weekly savings calculations and purchase analytics
- **Shopping List Items**: Smart shopping list with purchase timing recommendations

### Frontend Components
- **Dashboard**: Main application interface with economic overview
- **Economic Dashboard**: Real-time economic indicators display
- **Price Tracking Grid**: Visual grid of tracked items with buy/wait recommendations
- **Budget Tracker**: Personal budget monitoring with progress indicators
- **Charts & Analytics**: Historical price trends and savings analytics
- **Shopping List**: Smart shopping list with optimal purchase timing
- **Theme Provider**: Dark/light mode toggle functionality

### Backend Services
- **Storage Interface**: Abstracted data access layer for future database implementation
- **Route Handlers**: RESTful API endpoints for all data operations
- **Economic Data Integration**: Placeholder for FRED API integration
- **Price Calculation Logic**: Smart recommendation algorithms

## Data Flow

### Client-Server Communication
1. **Frontend queries** backend API using TanStack Query
2. **Backend routes** process requests and interact with storage layer
3. **Database operations** performed through Drizzle ORM
4. **Real-time updates** achieved through polling and optimistic updates

### Smart Recommendation Algorithm
1. **Price Analysis**: Compare current prices to 30-day averages
2. **Economic Factors**: Factor in inflation rates and economic trends
3. **Recommendation Generation**: 
   - BUY_NOW: 15%+ below average price
   - CONSIDER: 5-15% below average price
   - WAIT: Above average price
4. **Savings Calculation**: Track potential savings from smart timing

### State Management
- **Server State**: Managed by TanStack Query with automatic caching
- **UI State**: Local React state for component interactions
- **Theme State**: Persisted in localStorage with context provider
- **Form State**: React Hook Form for complex form interactions

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver for Neon
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **recharts**: Chart library for data visualization
- **zod**: Runtime type validation
- **express**: Backend web framework

### Development Tools
- **drizzle-kit**: Database migration and introspection
- **vite**: Frontend build tool and dev server
- **typescript**: Type safety across the stack
- **tailwindcss**: Utility-first CSS framework
- **esbuild**: Fast JavaScript bundler for backend

### Planned Integrations
- **FRED API**: Federal Reserve Economic Data for real economic indicators
- **External Price APIs**: For real-time price data (currently using mock data)
- **Push Notifications**: Browser notifications for price alerts

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement for frontend development
- **Express Server**: Development server with automatic TypeScript compilation
- **Database**: PostgreSQL with automatic migrations via Drizzle
- **Environment Variables**: DATABASE_URL for database connection

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild compiles TypeScript server code to `dist/index.js`
- **Database**: Drizzle migrations ensure schema consistency
- **Deployment**: Single Node.js process serving both API and static files

### Key Environment Requirements
- Node.js runtime with ES modules support
- PostgreSQL database (Neon serverless recommended)
- Environment variable: `DATABASE_URL` for database connection

### Build Commands
- `npm run dev`: Start development servers
- `npm run build`: Build production assets
- `npm run start`: Start production server
- `npm run db:push`: Push database schema changes

The application is designed for deployment on platforms like Replit, with automatic database provisioning and a unified development/production workflow.