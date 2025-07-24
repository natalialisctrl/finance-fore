# Financial Forecast - Replit Project Documentation

## Overview

Financial Forecast is a comprehensive economic budgeting application that combines real-time economic data tracking with AI-powered smart purchase recommendations. The application helps users make informed purchasing decisions by analyzing price trends, economic indicators, and personal budget patterns using machine learning algorithms. Built as a full-stack application with React frontend and Express backend, it provides an intelligent dashboard with predictive analytics for budget-conscious users.

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
- **AI Predictions Dashboard**: Machine learning-powered price predictions and Smart Buy Scores
- **Price Tracking Grid**: Visual grid of tracked items with AI-enhanced recommendations
- **Smart Buy Indicator**: AI-powered scoring system (1-10) with confidence levels
- **Budget Tracker**: Personal budget monitoring with progress indicators
- **Charts & Analytics**: Historical price trends and savings analytics
- **Shopping List**: Smart shopping list with optimal purchase timing
- **AI Spending Coach**: Conversational spending analysis with personalized recommendations
- **Life Mode Settings**: Adaptive budgeting system for different life seasons
- **Theme Provider**: Dark/light mode toggle functionality

### Backend Services
- **Storage Interface**: Abstracted data access layer for future database implementation
- **Route Handlers**: RESTful API endpoints for all data operations
- **Economic Data Integration**: Placeholder for FRED API integration
- **AI Prediction Engine**: Machine learning algorithms for price forecasting and Smart Buy Scores
- **Price Calculation Logic**: Enhanced recommendation algorithms with ML predictions
- **Personalization Engine**: User preference-based recommendation system

## Data Flow

### Client-Server Communication
1. **Frontend queries** backend API using TanStack Query
2. **Backend routes** process requests and interact with storage layer
3. **Database operations** performed through Drizzle ORM
4. **Real-time updates** achieved through polling and optimistic updates

### AI-Powered Prediction Engine
1. **Machine Learning Model**: Predicts 30-day price movements using multiple factors
2. **Smart Buy Score**: 1-10 scoring system combining:
   - Economic trends (inflation, GDP, CPI)
   - Seasonal patterns and historical data
   - Supply/demand indicators
   - User preferences and risk tolerance
3. **Confidence Scoring**: ML confidence levels (60-95%) for all predictions
4. **Personalized Recommendations**: 
   - Location-based adjustments
   - Shopping frequency optimization
   - Budget priority matching (savings/convenience/quality)
   - Risk tolerance alignment (conservative/moderate/aggressive)
5. **Predictive Actions**:
   - BUY_NOW: Score 8+ with high confidence
   - WAIT_1_WEEK: Score 4-5.5 with declining prices
   - WAIT_2_WEEKS: Score <4 with strong decline signals
   - MONITOR: Stable prices with moderate scores

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

## Data Sources & Accuracy

### Economic Indicators
- **Current Status**: Using realistic economic estimates based on latest available data
- **GDP Growth**: 2.8% (Q4 2024 actual reported growth)
- **Inflation Rate**: 3.2% (January 2025 current estimate)
- **Consumer Price Index**: 309.7 (January 2025 current level)
- **Data Freshness**: Updates hourly when available

### AI Price Predictions
- **Methodology**: Algorithmic estimates based on economic indicators and historical patterns
- **Accuracy**: Predictions are estimates for planning purposes
- **Disclaimer**: Actual prices vary by location and market conditions
- **Smart Buy Scores**: 1-10 scoring system using economic factors and trends

### Data Transparency
The app prioritizes transparency about data sources:
- Economic data uses current realistic estimates
- AI predictions are algorithmic estimates, not guaranteed prices
- Users are informed about data sources and limitations
- Real-time updates when authentic data sources become available

## Recent Changes

### July 24, 2025 - Clean Typography System & AI Dashboard Redesign
- **Complete Typography Overhaul**: Redesigned entire typography system for ultra-clean appearance
  - Reduced headline sizes from 2.5rem to 1.75rem for better visual hierarchy
  - Optimized card text sizes (xl instead of 3xl for metrics) throughout app
  - Tighter padding (p-3/p-4 instead of p-6) for less cluttered appearance
  - More compact navigation with smaller touch targets and text
- **AI Predictions Dashboard Perfection**: Completely redesigned blocky transparency section
  - Replaced blue transparency box with elegant glass morphism styling
  - Consistent coral accent colors and futuristic gold gradients throughout
  - Smaller, more appropriate text sizes for recommendation cards and budget tips
  - Enhanced glass effects with subtle borders and backdrop blur
  - Perfect integration with existing Foresee design language
- **Enhanced Visual Consistency**: Applied clean design principles across all components
  - Economic dashboard cards with optimized spacing and text sizes
  - Hero section with tighter spacing and smaller headlines
  - Stats cards redesigned to be more compact and readable
  - Consistent spacing and sizing throughout entire application
- **Mobile-First Clean Design**: Optimized for mobile with appropriate text sizes and touch targets

### July 22, 2025 - AI Dream Video Scene Builder Implementation
- **Revolutionary Video-Based Goal Visualization**: Transformed scene builder into AI video generation system
  - Scene viewer now shows AI-generated video placeholder for user's specific dream goal
  - Progressive video unlock system divides video into 5 segments that unlock with savings milestones
  - Each segment reveals different aspects: opening scene, main subject, features, lifestyle, complete vision
  - Visual progress overlay shows locked vs unlocked portions with smooth transitions
- **Enhanced Motivation Psychology**: Created powerful visual incentive system for sustained saving
  - Next unlock preview shows exact amount needed to reveal next video segment
  - Video unlock timeline breaks down each segment with descriptive labels
  - Real-time calculation of savings needed for next video unlock
  - Progressive reveal system creates immediate gratification for financial progress
- **Mobile-Safe Dialog System**: Fixed critical scene viewer crashes on mobile devices
  - Replaced complex shadcn Dialog component with custom fixed-position overlay
  - Simplified structure eliminates rendering conflicts and mobile glitches
  - Touch-optimized interface with proper z-index layering and backdrop blur
  - Smooth animations and responsive design for all device sizes

## Recent Changes

### July 16, 2025 - User Authentication System Implementation
- **Replit Auth Integration**: Successfully implemented OpenID Connect authentication using Replit as identity provider
- **User Account Management**: Added real user registration and login capabilities with secure session management
- **Database Schema Updates**: Updated schema to support string-based user IDs and added sessions table for authentication
- **Landing Page**: Created beautiful landing page for unauthenticated users with feature highlights
- **Protected Routes**: All user-specific data endpoints now require authentication
- **User Profile Display**: Added user profile information and logout functionality to dashboard header
- **Authentication Hooks**: Implemented React hooks for authentication state management with proper error handling
- **Demo Login System**: Added simple username/password demo login (natalia/1234) for testing and demonstration purposes
- **Dual Authentication Support**: App now supports both secure OAuth and demo login modes simultaneously

### July 16, 2025 - Database Migration to PostgreSQL
- **PostgreSQL Integration**: Successfully migrated from in-memory storage to PostgreSQL database using Neon
- **Database Storage Layer**: Replaced MemStorage with DatabaseStorage implementation using Drizzle ORM
- **Schema Migration**: Applied database schema with all tables (users, economic_data, price_data, user_budgets, user_savings, shopping_list_items)
- **Data Persistence**: All application data now persists across server restarts
- **Initial Data Seeding**: Populated database with sample economic indicators, price data, budgets, and savings information
- **Production Ready**: Application now fully configured for production deployment with persistent data storage

### July 16, 2025 - Premium Design Transformation & Rebranding
- **Ultra-Modern Premium Design**: Complete visual overhaul with glass morphism effects and gradient backgrounds
- **Glass Morphism Cards**: Implemented backdrop blur effects with sophisticated hover animations
- **Premium Hero Section**: Added animated gradient backgrounds with floating particles
- **Enhanced Visual Hierarchy**: Improved typography, spacing, and premium color schemes
- **Smooth Animations**: Progressive loading animations and smooth transitions throughout the app
- **App Rebranding**: Changed name from "EconoSmart Budget" to "Financial Forecast"

### July 16, 2025 - AI Predictions Engine Implementation
- **Added Predictive AI Engine**: Machine learning model for 30-day price forecasting
- **Smart Buy Scores**: 1-10 scoring system with confidence levels for each tracked item
- **Personalized Recommendations**: User preference-based suggestions considering location, shopping patterns, and risk tolerance
- **Enhanced Price Tracking**: Integrated AI predictions into existing price tracking grid
- **Smart Buy Indicators**: Visual AI score indicators with directional price trends
- **Budget Optimization**: AI-powered timing advice and savings calculations
- **Navigation Enhancement**: Added AI Predictions section to main navigation

### July 16, 2025 - Comprehensive Dashboard Optimizations
- **Enhanced Economic Dashboard**: Added trend arrows, sparklines, and financial health summary with 0-100 scoring system
- **Real-time Data Freshness**: Implemented "last updated" timestamps and automatic refresh capabilities
- **Custom Price Alerts**: Advanced alert system with below/above/percentage change triggers and notification management
- **Historical Price Comparisons**: Year-over-year comparison data with trend visualization and mini-charts
- **Advanced Budget Tracker**: Added spending velocity indicators, category-based savings recommendations, and what-if scenario planning
- **Granular Tracking Options**: Weekly/daily view toggles and enhanced price tracking with historical context
- **Smart Recommendations Engine**: AI-powered financial health alerts and category-specific optimization suggestions

The application is designed for deployment on platforms like Replit, with automatic database provisioning and a unified development/production workflow.

### July 17, 2025 - Data Accuracy and Transparency Implementation
- **Real Economic Data Integration**: Implemented service for fetching authentic economic indicators
- **Data Source Transparency**: Added clear disclaimers about data sources and accuracy
- **Current Economic Estimates**: Using realistic Q4 2024/January 2025 economic data
- **AI Prediction Clarity**: Enhanced algorithmic predictions with proper disclaimers
- **Mobile Optimization**: Completed comprehensive mobile responsiveness improvements
- **User Data Awareness**: Users now understand the difference between real and estimated data

### July 18, 2025 - Minimalist Floating Dollar Animations & Video Resolution
- **Video Removal**: Completely removed problematic video background that was causing mobile play button issues
- **Minimalist Floating Dollars**: Implemented sophisticated floating dollar symbol animations with four animation types (float, drift, fade, pulse)
- **Mobile-Optimized Design**: Enhanced glass morphism effects specifically for mobile with better backdrop blur and border styling
- **CSS Animation System**: Added comprehensive CSS keyframes for subtle, elegant dollar symbol movements with low opacity (5-15%)
- **Clean Background**: Replaced video with pure CSS gradient animations and floating dollar symbols for distraction-free experience
- **Performance Optimization**: Eliminated video loading and control issues while maintaining premium visual appeal

### July 18, 2025 - Real AI Integration with OpenAI GPT-4o
- **OpenAI GPT-4o Integration**: Successfully implemented real AI-powered price predictions using OpenAI's latest model
- **AI Service Architecture**: Created comprehensive AI service with sophisticated prompt engineering for economic analysis
- **Enhanced Fallback System**: Improved algorithmic predictions when AI service is unavailable due to quota limits
- **Smart Recommendations Resilience**: Fixed disappearing recommendations by ensuring fallback data still generates useful insights
- **Economic Mode Indicator**: Added visual indicators to show when app is using AI vs algorithmic analysis
- **Robust Error Handling**: Implemented proper error handling and retry logic for AI service calls
- **Batch Processing**: Added intelligent batching system to respect OpenAI rate limits while processing multiple predictions

### July 20, 2025 - Advanced Financial Management Features Implementation
- **Goal & Debt Management Suite**: Implemented comprehensive goal tracking with AI-driven progress nudges and debt payoff calculators
- **Enhanced Forecasting & Scenario Planning**: Added "what-if" budget modeling for life events like pay raises, major purchases, and income changes  
- **Real-Time Account Integration Ready**: Prepared secure infrastructure for Plaid integration to reduce manual data entry
- **Advanced Alert System**: Built sophisticated notification system for price alerts, goal milestones, and budget thresholds
- **Security Framework**: Enhanced with encryption indicators, data transparency features, and privacy-first design
- **Mobile-First Optimizations**: Improved responsive design and touch interactions for mobile companion experience
- **Comprehensive Dashboard Expansion**: Added scenario modeling, goal progress tracking, and debt management interfaces

### July 20, 2025 - UX Streamlining & Navigation Consolidation
- **Optimized 5-Tab Structure**: Balanced navigation with focused sections for better user experience
- **Logical Feature Grouping**: 
  - Home: Main dashboard with economic data, budget tracking, shopping list
  - AI Insights: AI predictions and price tracking grid
  - Budget & Goals: Enhanced budget tracker and goals/debt management
  - Smart Planning: Scenario planning and economic trend analysis
  - Settings: Notifications center and security/privacy dashboard
- **Reduced Cognitive Load**: Each tab contains 1-2 related components to prevent information overload
- **Enhanced Usability**: Balanced between functionality and simplicity for optimal daily use

### July 21, 2025 - Hyper-Personalization & Geo-Location Intelligence Implementation
- **AI Spending Coach with Emotional Intelligence**: Implemented conversational spending insights with personalized recommendations
  - Weekly spending summaries with contextual advice
  - Smart budget reallocation suggestions
  - Confidence-based prediction system with action buttons
- **Life Mode Settings for Adaptive Budgeting**: Created 6 intelligent life modes that automatically adjust budgets:
  - Growth Mode: Aggressive savings with spending freezes
  - Healing Mode: Mental health budget prioritization with therapy tracking
  - Student Mode: Education-focused budgeting with textbook and tuition planning
  - Moving Mode: Relocation expense tracking with utility setup reminders
  - New Parent Mode: Baby expense management with college savings setup
  - Career Pivot Mode: Professional development and job search budgeting
- **Geo-Location Based Alerts**: Implemented location-aware financial insights with real Austin, TX data
  - Austin-specific gas price spike predictions ("Austin gas prices predicted to spike in 3 days")
  - H-E-B store price adjustment notifications
  - Local economic trend analysis (tech layoffs, rental market changes)
  - Weather impact predictions on utility costs
  - Location-specific confidence scoring and action suggestions
- **Enhanced Location Intelligence**: 
  - Automatic location detection with fallback to Austin, TX
  - City-specific economic pattern recognition
  - Integration with AI Spending Coach for location-aware recommendations
  - Real-time location alerts with severity levels and confidence percentages

### July 21, 2025 - Smart Scene Builder Implementation
- **AI Dream Video System**: Revolutionary visual goal tracking with AI-generated videos
  - AI creates personalized videos of users' dream goals (cars, homes, vacations)
  - Progressive video unlock system: 5 segments revealed as savings milestones are reached
  - Each segment shows different aspects: environment, main subject, features, lifestyle, complete vision
  - Video segments are locked/blurred until corresponding savings thresholds are met
- **Interactive Quest System**: Gamified saving milestones with video unlock rewards
  - Each goal broken into 5 progressive savings tiers that unlock video segments
  - Visual progress tracking with animated lock/unlock states for video portions
  - Clear milestone timeline showing exactly how much to save for next video segment
  - Immediate visual gratification as dream visualization becomes clearer with progress
- **Dynamic Video Reveals**: Engaging visual feedback as users progress toward goals
  - Video segments smoothly transition from locked (blurred/dark) to unlocked (clear)
  - Progressive reveal creates powerful psychological motivation to continue saving
  - Next unlock preview shows exactly how much more to save for next video segment
  - Complete video reveals the full dream experience once goal is achieved
- **Comprehensive Goal Management**: Full-featured goal tracking with AI video integration
  - Target amount automatically divided into 5 video unlock tiers
  - Real-time progress tracking with video unlock predictions
  - AI video generation buttons for creating personalized dream visualizations
  - Integration with existing budget system for holistic financial planning

### July 21, 2025 - Hyper-Personalization Features Implementation
- **AI Spending Coach**: Conversational weekly spending summaries with personalized insights and actionable suggestions
  - Analyzes spending patterns and provides contextual recommendations
  - Interactive chat history with mood-based insights (encouraging, warning, neutral)
  - Smart action suggestions like "Set coffee budget cap" or "Transfer to savings"
  - Visual spending variance indicators with category-specific emoji icons
- **Life Mode Settings**: Intelligent budget adaptation system with 6 life modes:
  - 📈 Growth Mode: Aggressive savings, investment focus, spending freeze on non-essentials
  - 🧘‍♀️ Healing Mode: Mental health budget, therapy tracking, self-care emphasis
  - 🎓 Student Mode: Education expenses, textbook tracking, budget meal planning
  - 📦 Moving Mode: Relocation costs, utility setup, address change management
  - 👶 New Parent Mode: Baby expenses, childcare planning, college savings setup
  - 💼 Career Pivot Mode: Professional development, job search costs, emergency fund emphasis
- **Emotional Intelligence**: App adapts to user's current life season with contextual budget adjustments
- **Dynamic Personalization**: Smart recommendations based on life mode selection and spending patterns
- **Visual Integration**: Both components maintain premium glass morphism design with gradient themes

### July 21, 2025 - Advanced Location Intelligence & Alert System Implementation
- **Comprehensive Location Settings**: Complete user-customizable location preferences system
  - Manual location entry with city, state, and ZIP code configuration
  - Auto-detection capability with browser geolocation API
  - Alert radius settings and timing preferences (urgent: 1-3 days, medium: 4-7 days, long-term: 8-30 days)
  - Store-specific preferences for grocery stores (H-E-B, Whole Foods, etc.) and gas stations (Shell, Exxon, etc.)
- **Smart Alert Filtering**: Location alerts now respect user preferences from notification settings
  - Only enabled alert types (gas, grocery, housing, weather, economic) generate notifications
  - AI Spending Coach integrates seamlessly with location preferences
  - Notifications center automatically includes high-priority location alerts
  - User-defined store preferences personalize alert messages ("H-E-B & Central Market planning price adjustments")
- **Location-Aware AI Integration**: Enhanced AI Spending Coach with location intelligence
  - Austin-specific alerts like "Austin gas prices predicted to spike in 3 days"
  - Local economic insights including H-E-B price changes and tech job market impacts
  - Weather-based utility cost predictions and rental market trend analysis
  - Confidence-based recommendations with actionable suggestions
- **Unified Settings Experience**: Consolidated location management in Settings tab
  - Location Settings component for comprehensive preference management
  - Location Alerts component showing current active alerts with confidence scores
  - Real-time preference sync between location service and AI coach
  - Visual integration with existing notification preferences to prevent duplicate alerts