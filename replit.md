# SalonCentric Store Planner

## Overview

This is a full-stack web application built for SalonCentric store managers to track daily operations, sales metrics, and staff scheduling. The application provides a comprehensive daily planner interface with analytics dashboard capabilities for retail store management.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom SalonCentric brand colors
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful APIs with JSON responses
- **Development**: Hot module replacement via Vite middleware

### Database Design
- **Primary Database**: PostgreSQL via Neon serverless
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Tables**:
  - `stores`: Store information (number, name, location, status)
  - `planner_entries`: Daily planner data with sales tracking and activity sections
  - `staff_schedules`: Employee scheduling data linked to planner entries
  - `store_analytics`: Performance analytics and metrics

## Key Components

### Store Management
- Store creation and listing functionality
- Active/inactive store status management
- Store-specific data isolation

### Daily Planner System
- Date-based planner entries with comprehensive tracking
- Sales metrics: daily sales, WTD/MTD/YTD actuals, NPS scores
- Activity tracking with checkboxes for daily operations, inventory, and store standards
- Staff scheduling with time slot management
- Today's plan content including contests, priorities, and todos

### Analytics Dashboard
- Sales trend analysis and performance metrics
- Staff performance tracking
- Store comparison capabilities
- Best practices recommendations

### User Interface
- Responsive design optimized for desktop and mobile
- Print-friendly layouts for physical planning documents
- Brand-consistent purple and pink color scheme
- Modern card-based layout with intuitive navigation

## Data Flow

1. **Initial Load**: Frontend queries stores and loads planner data for selected date/store
2. **Default Entry Creation**: If no planner entry exists for a date, server creates default template
3. **Real-time Updates**: Form changes trigger optimistic updates with server synchronization
4. **Data Persistence**: All changes are immediately persisted to PostgreSQL database
5. **Analytics Aggregation**: Performance data is calculated from historical planner entries

## External Dependencies

### Frontend Dependencies
- React ecosystem: React 18, React DOM, TanStack Query
- UI Framework: Radix UI primitives, Tailwind CSS, class-variance-authority
- Form handling: React Hook Form with Zod validation
- Charts: Recharts for analytics visualization
- Utilities: date-fns, clsx, lucide-react icons

### Backend Dependencies
- Server: Express.js with TypeScript support
- Database: Drizzle ORM, @neondatabase/serverless, node-postgres
- Development: tsx for TypeScript execution, esbuild for production builds
- Session management: connect-pg-simple for PostgreSQL session storage

### Development Tools
- TypeScript compiler and type checking
- Vite with React plugin and development middleware
- Drizzle Kit for database schema management
- PostCSS with Tailwind CSS processing

## Deployment Strategy

### Development Environment
- Local development with Vite dev server on port 5000
- Database connection via Neon serverless PostgreSQL
- Hot module replacement for rapid development iteration

### Production Build
- Frontend: Vite builds optimized React bundle to `dist/public`
- Backend: esbuild bundles Node.js server to `dist/index.js`
- Static file serving: Express serves built frontend assets
- Environment: Production mode with optimized builds

### Hosting Configuration
- Replit deployment target: autoscale
- Port mapping: internal 5000 to external 80
- Build command: `npm run build`
- Start command: `npm run start`
- Database: Neon PostgreSQL with connection pooling

## Changelog

- June 25, 2025. Initial setup
- June 26, 2025. Implemented role-based authentication system with three user types: Store Associates, District Managers, and Business Executives. Analytics dashboard restricted to management roles only.
- June 26, 2025. Added photo upload capability for store associates with categories, file validation, and secure storage.
- June 26, 2025. Created automated reporting system that aggregates data across all stores and activity areas for management roles with real-time analytics and exportable reports.
- June 26, 2025. Enhanced analytics dashboard with comprehensive live charts, performance metrics, and role-based data differentiation. District managers see regional analytics (2 stores), business executives see network-wide analytics (5 stores). Added real-time sales tracking, activity completion charts, and store performance comparisons.
- June 27, 2025. Fixed Super Admin authentication system with proper password hashing and memory-based session storage. Resolved critical database schema issues by adding missing district_manager_id column to stores table. All store management APIs now fully operational including store creation, listing, and assignment functionality.

## Authentication System

### User Roles
1. **Store Associates**: Access to daily planner, staff scheduling, and store operations
2. **District Managers**: All Store Associate access plus analytics dashboard for performance monitoring
3. **Business Executives**: Full system access including analytics for all 670+ stores

### Test Accounts
- Store Associate: username `store_associate`, password `password123`
- District Manager: username `district_manager`, password `password123`  
- Business Executive: username `business_executive`, password `password123`

### Security Features
- Password hashing with salt using Node.js crypto
- Session management with PostgreSQL storage
- Role-based route protection
- Automatic redirect to login for unauthenticated users

## User Preferences

Preferred communication style: Simple, everyday language.
Web page frame color: Dark lavender background for sophisticated visual appeal.