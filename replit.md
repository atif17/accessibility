# AccessibilityPro - Web Accessibility Testing Platform
*A Zaf Technology Product*

## Overview

AccessibilityPro is a comprehensive web accessibility testing and education platform built with React, TypeScript, and Express.js. Developed by Zaf Technology, the application provides tools for automated accessibility scanning, WCAG guideline education, audit checklists, and knowledge base resources to help developers and organizations create more accessible web experiences.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON responses
- **Development**: Hot reloading with Vite middleware integration

## Key Components

### Database Schema
The application uses four main tables:
- **users**: User authentication and management
- **scan_results**: Stores accessibility scan results with scores, issues, and recommendations
- **checklist_items**: Customizable accessibility audit checklist items
- **knowledge_articles**: Educational content and best practices

### Core Features
1. **Accessibility Scanner**: Automated website scanning with detailed reporting
2. **WCAG Education**: Interactive learning modules for accessibility guidelines
3. **Audit Checklist**: Customizable checklists for manual accessibility testing
4. **Knowledge Base**: Searchable repository of accessibility best practices
5. **Report Generation**: PDF, CSV, and JSON export capabilities

### UI Components
- Comprehensive design system built on Radix UI primitives
- Accessible components including proper ARIA attributes and keyboard navigation
- Responsive design with mobile-first approach
- Dark mode support through CSS custom properties

## Data Flow

1. **User Interaction**: Users interact with React components in the browser
2. **API Requests**: TanStack Query manages API calls to Express.js backend
3. **Data Processing**: Express routes handle business logic and database operations
4. **Database Operations**: Drizzle ORM provides type-safe database queries
5. **Response Handling**: JSON responses are processed and cached by React Query
6. **UI Updates**: Components re-render with updated data

## External Dependencies

### Frontend Dependencies
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI primitive components
- **wouter**: Lightweight routing library
- **tailwindcss**: Utility-first CSS framework
- **react-hook-form**: Form state management with validation

### Backend Dependencies
- **drizzle-orm**: Type-safe SQL ORM
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **express**: Web application framework
- **zod**: Schema validation library

### Development Tools
- **TypeScript**: Static type checking
- **Vite**: Build tool and development server
- **ESBuild**: Fast JavaScript bundler for production
- **TSX**: TypeScript execution for development

## Deployment Strategy

### Development Environment
- Local development using Vite dev server with HMR
- Express server runs on port 5000 with automatic restarts
- PostgreSQL database hosted on Neon with connection pooling

### Production Build
- Frontend built using Vite with optimized bundles
- Backend bundled using ESBuild for Node.js execution
- Static assets served from Express with proper caching headers

### Replit Configuration
- Configured for Node.js 20 runtime environment
- Auto-deployment with build and start scripts
- PostgreSQL 16 module for database connectivity
- Port 5000 mapped to external port 80

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment mode (development/production)

## Changelog

```
Changelog:
- June 22, 2025. Initial setup
- June 22, 2025. Converted to public accessibility scanner with minimal data collection:
  * Replaced user accounts with anonymous public scanning
  * Only stores URL and IP address for each scan
  * Added report request system with contact form
  * Users must fill out contact form to receive detailed reports
  * Integrated PostgreSQL database with automatic seeding
  * Maintains educational content and interactive checklist
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```