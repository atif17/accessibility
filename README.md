# AccessibilityPro - Public Web Accessibility Scanner
*A Zaf Technology Product*

A comprehensive web accessibility testing platform that provides anonymous scanning, WCAG education, and compliance guidance.

## Features

### 🔍 Anonymous Accessibility Scanning
- Test any website for accessibility compliance
- Get instant accessibility scores and issue reports
- No account required - completely anonymous
- Minimal data collection (URL and IP only)

### 📚 Interactive WCAG Education
- Level A, AA, and AAA guideline explanations
- Real-world examples and implementation tips
- Interactive learning modules
- Practical accessibility fixes

### ✅ Comprehensive Audit Checklist
- Organized by disability categories (Vision, Hearing, Motor, Cognitive)
- WCAG reference mapping
- Progress tracking
- Detailed implementation guidance

### 📖 Knowledge Base
- Searchable accessibility articles
- Best practices and case studies
- Legal compliance information
- Tools and resources guide

### 📊 Professional Reports
- Contact form for detailed report requests
- PDF, CSV, and JSON export options
- Executive summaries and technical details
- Actionable remediation plans

## Quick Start

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL 14.x or higher

### Installation

1. **Clone and setup**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   # Create .env file
   DATABASE_URL=postgresql://username:password@host:port/database
   NODE_ENV=development
   ```

3. **Initialize database**
   ```bash
   npm run db:push
   ```

4. **Start application**
   ```bash
   npm run dev
   ```

5. **Access application**
   - Open http://localhost:5000
   - Start scanning websites immediately

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **TanStack Query** for data management
- **Wouter** for lightweight routing

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Drizzle ORM
- **Neon Database** for serverless PostgreSQL
- **Zod** for schema validation

### Build & Deploy
- **Vite** for fast development and builds
- **ESBuild** for production bundling
- **TypeScript** for type safety

## API Endpoints

### Public Scanning
```bash
# Perform accessibility scan
POST /api/scan
{
  "url": "https://example.com",
  "scanType": "Full Page Scan"
}

# Get scan results
GET /api/scan-results
GET /api/scan-results/:id
```

### Educational Content
```bash
# Get checklist items
GET /api/checklist?category=vision

# Update checklist progress
PATCH /api/checklist/:id
{
  "isCompleted": true
}

# Search knowledge base
GET /api/knowledge?q=color+contrast
GET /api/knowledge?category=WCAG+Guidelines
```

### Report Requests
```bash
# Request detailed report
POST /api/request-report
{
  "scanId": 123,
  "name": "John Doe",
  "email": "john@company.com",
  "company": "Example Corp",
  "requestedFormat": "pdf"
}
```

## Database Schema

### Core Tables
- `public_scans` - Anonymous accessibility scan results
- `report_requests` - User requests for detailed reports
- `checklist_items` - Accessibility audit checklist
- `knowledge_articles` - Educational content

### Data Privacy
- No user accounts or authentication required
- Only URL and IP address stored for scans
- Contact information collected only for report requests
- Automatic database seeding with educational content

## Development

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── lib/          # Utilities and API
│   │   └── pages/        # Route components
├── server/           # Express backend
│   ├── routes.ts     # API endpoints
│   ├── storage.ts    # Database operations
│   └── seed.ts       # Database initialization
├── shared/           # Shared types and schemas
└── DEPLOYMENT.md     # Production deployment guide
```

### Available Scripts
```bash
npm run dev      # Development server with hot reload
npm run build    # Production build
npm start        # Production server
npm run db:push  # Update database schema
npm run check    # TypeScript type checking
```

### Development Guidelines
- Follow TypeScript strict mode
- Use Zod for runtime validation
- Implement proper error handling
- Maintain accessibility standards
- Test with real accessibility tools

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive production deployment instructions.

### Quick Deploy
```bash
# Build for production
npm run build

# Set environment variables
export DATABASE_URL=your_postgresql_url
export NODE_ENV=production

# Start production server
npm start
```

## Contributing

### Accessibility Focus
This project maintains high accessibility standards:
- WCAG 2.1 AA compliance throughout
- Screen reader compatible
- Keyboard navigation support
- High contrast ratios
- Semantic HTML structure

### Code Standards
- TypeScript for type safety
- ESLint and Prettier for consistency
- Component-based architecture
- Responsive design principles
- Performance optimization

## License

MIT License - see LICENSE file for details.

## Support

For technical support:
- Review the DEPLOYMENT.md guide
- Check application logs for errors
- Verify database connectivity
- Monitor resource usage

## Accessibility Statement

AccessibilityPro is committed to digital accessibility and follows WCAG 2.1 AA guidelines. The platform itself serves as an example of accessible web development practices.

If you encounter accessibility barriers, please contact us through the report request form to help us improve the platform.