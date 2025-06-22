# AccessibilityPro - Deployment Guide

A public web accessibility testing platform with minimal data collection and educational resources.

## Overview

AccessibilityPro is a full-stack web application that provides:
- Anonymous accessibility scanning of websites
- Interactive WCAG education and guidelines
- Comprehensive audit checklists
- Educational knowledge base
- Report request system with contact forms

## System Requirements

### Runtime Environment
- **Node.js**: 20.x or higher
- **PostgreSQL**: 14.x or higher
- **Memory**: Minimum 512MB RAM
- **Storage**: 1GB for application and database

### Port Configuration
- **Application Port**: 5000 (serves both API and frontend)
- **Database Port**: 5432 (PostgreSQL default)

## Environment Variables

Create a `.env` file with the following required variables:

```bash
# Database Configuration (Required)
DATABASE_URL=postgresql://username:password@host:port/database_name

# Application Environment
NODE_ENV=production

# PostgreSQL Connection Details (Auto-provided by DATABASE_URL)
PGHOST=your-postgres-host
PGPORT=5432
PGUSER=your-username
PGPASSWORD=your-password
PGDATABASE=your-database-name
```

## Deployment Steps

### 1. Prepare Dependencies

```bash
# Install Node.js dependencies
npm install

# Install production dependencies only (optional)
npm ci --only=production
```

### 2. Database Setup

The application uses PostgreSQL with automatic schema migration and seeding.

```bash
# Push database schema (creates tables)
npm run db:push

# Database seeding happens automatically on application startup
# Initial data includes checklist items and knowledge articles
```

### 3. Build Application

```bash
# Build frontend for production
npm run build

# The build process creates optimized static files
```

### 4. Start Application

```bash
# Production start
npm start

# Development start (with hot reload)
npm run dev
```

## Database Schema

The application automatically creates these tables:

### `public_scans`
- Stores accessibility scan results
- Fields: `id`, `url`, `ip_address`, `scan_type`, `score`, `issues`, `recommendations`, `wcag_level`, `created_at`

### `report_requests`
- Manages user requests for detailed reports
- Fields: `id`, `scan_id`, `name`, `email`, `company`, `message`, `requested_format`, `status`, `created_at`

### `checklist_items`
- Pre-defined accessibility checklist items
- Fields: `id`, `category`, `title`, `description`, `wcag_reference`, `is_completed`

### `knowledge_articles`
- Educational content and best practices
- Fields: `id`, `title`, `content`, `category`, `read_time`, `created_at`

## Health Checks

### Application Health
- **Endpoint**: `GET /api/knowledge` (should return 200)
- **Database**: Automatic connection verification on startup

### Monitoring Endpoints
- **API Status**: Any `/api/*` endpoint for response time monitoring
- **Frontend**: Root path `/` serves the React application

## Security Considerations

### Data Collection
- **Minimal Data**: Only URL and IP address stored for scans
- **Optional Data**: Contact information only when users request reports
- **No Authentication**: Public anonymous access

### Database Security
- Use strong PostgreSQL credentials
- Enable SSL connections in production
- Regular database backups recommended

### Network Security
- Application runs on port 5000 only
- All static assets served through same port
- No additional ports require firewall configuration

## Performance Optimization

### Database Performance
- Indexes automatically created on primary keys
- Consider adding indexes on `created_at` for large datasets
- Regular VACUUM and ANALYZE for PostgreSQL maintenance

### Application Performance
- Static assets served with caching headers
- API responses cached appropriately
- Database connection pooling enabled

## Scaling Considerations

### Horizontal Scaling
- Application is stateless and can run multiple instances
- Database connection pooling supports concurrent connections
- Load balancer can distribute traffic across instances

### Database Scaling
- PostgreSQL supports read replicas for scaling reads
- Consider database partitioning for large scan result tables
- Monitor connection pool usage

## Backup Strategy

### Database Backups
```bash
# Create backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql

# Restore backup
psql $DATABASE_URL < backup-file.sql
```

### Application Backups
- Source code (if not in version control)
- Environment configuration files
- Custom content or modifications

## Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check database connectivity
psql $DATABASE_URL -c "SELECT 1;"

# Verify environment variables
echo $DATABASE_URL
```

#### Port Conflicts
```bash
# Check port 5000 availability
lsof -i :5000

# Kill conflicting processes if needed
kill -9 $(lsof -t -i:5000)
```

#### Memory Issues
```bash
# Monitor memory usage
free -h

# Check Node.js process memory
ps aux | grep node
```

### Log Monitoring
- Application logs to stdout/stderr
- Database query logs in development mode
- Error tracking for production debugging

## Maintenance

### Regular Tasks
- **Database Cleanup**: Remove old scan results (optional)
- **Log Rotation**: Manage application logs
- **Security Updates**: Keep dependencies updated
- **Backup Verification**: Test backup restoration

### Update Process
```bash
# Update dependencies
npm update

# Update database schema
npm run db:push

# Restart application
npm restart
```

## Support and Monitoring

### Application Metrics
- Response times for API endpoints
- Database query performance
- Memory and CPU usage
- Active connections

### User Analytics
- Scan requests per day
- Popular scan types
- Report request volumes
- Geographic usage patterns (from IP data)

## Contact Information

For technical support or deployment assistance:
- Review application logs for error details
- Check database connectivity and performance
- Monitor resource usage and scaling needs

## Version Information

- **Application**: AccessibilityPro v1.0
- **Node.js**: 20.x
- **PostgreSQL**: 14.x+
- **Framework**: Express.js with React frontend
- **Build Tool**: Vite for optimized production builds