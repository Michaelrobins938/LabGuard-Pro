# Environment Configuration Guide

This guide will help you configure LabGuard Pro for production deployment.

## Required Environment Variables

### Database Configuration
```env
DATABASE_URL="postgresql://username:password@host:port/database_name"
```
- **username**: Database username
- **password**: Database password  
- **host**: Database host (localhost for local, your DB host for production)
- **port**: Database port (usually 5432 for PostgreSQL)
- **database_name**: Name of your database (e.g., labguard_pro)

### Authentication Configuration
```envX
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-super-secure-secret-key-here"
```
- **NEXTAUTH_URL**: Your application's public URL
- **NEXTAUTH_SECRET**: A secure random string (generate with: `openssl rand -base64 32`)

### Email Configuration
For production, configure a real SMTP service:

#### Gmail (with App Password)
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@yourdomain.com"
```

#### SendGrid
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
SMTP_FROM="noreply@yourdomain.com"
```

#### AWS SES
```env
SMTP_HOST="email-smtp.us-east-1.amazonaws.com"
SMTP_PORT="587"
SMTP_USER="your-ses-smtp-username"
SMTP_PASS="your-ses-smtp-password"
SMTP_FROM="noreply@yourdomain.com"
```

### API Configuration
```env
API_BASE_URL="https://your-api-domain.com/api"
```

### AI Services
```env
OPENAI_API_KEY="sk-your-openai-api-key"
NEXT_PUBLIC_BIOMNI_API_KEY="your-biomni-api-key"
NEXT_PUBLIC_BIOMNI_ENVIRONMENT="laboratory-management"
NEXT_PUBLIC_BIOMNI_MODEL="biomni-a1-latest"
```

### Payment Processing (Stripe)
```env
STRIPE_PUBLISHABLE_KEY="pk_live_your-stripe-publishable-key"
STRIPE_SECRET_KEY="sk_live_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"
```

## Production Security Checklist

### 1. Environment Variables
- [ ] All sensitive data is in environment variables
- [ ] No hardcoded secrets in code
- [ ] Different secrets for each environment (dev/staging/prod)

### 2. Database Security
- [ ] Strong database passwords
- [ ] Database user has minimal required permissions
- [ ] Database connection uses SSL in production
- [ ] Regular database backups configured

### 3. Email Security
- [ ] Use dedicated email service (not personal Gmail)
- [ ] Configure SPF, DKIM, and DMARC records
- [ ] Use app passwords, not account passwords
- [ ] Monitor email delivery rates

### 4. Application Security
- [ ] HTTPS enabled everywhere
- [ ] Secure headers configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Input validation on all endpoints

### 5. Authentication Security
- [ ] Strong password policies
- [ ] Account lockout protection
- [ ] Session timeout configured
- [ ] Multi-factor authentication (future enhancement)

## Environment-Specific Configurations

### Development
```env
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/labguard_pro_dev
```

### Staging
```env
NODE_ENV=staging
NEXTAUTH_URL=https://staging.yourdomain.com
DATABASE_URL=postgresql://user:pass@staging-db:5432/labguard_pro_staging
```

### Production
```env
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
DATABASE_URL=postgresql://user:pass@prod-db:5432/labguard_pro
```

## Database Setup Commands

### Create Database
```sql
CREATE DATABASE labguard_pro;
CREATE USER labguard_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE labguard_pro TO labguard_user;
```

### Run Migrations
```bash
npm run db:push
npm run db:generate
npm run db:seed
```

## Email Service Setup

### Gmail Setup
1. Enable 2-factor authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in SMTP_PASS

### SendGrid Setup
1. Create a SendGrid account
2. Generate an API key with "Mail Send" permissions
3. Verify your sender domain
4. Use the API key in SMTP_PASS

### AWS SES Setup
1. Create an AWS account
2. Set up SES in your preferred region
3. Verify your email domain
4. Create SMTP credentials
5. Use the credentials in SMTP_USER and SMTP_PASS

## Monitoring and Logging

### Application Logs
Configure logging to capture:
- Authentication attempts
- Password reset requests
- Email verification attempts
- Database errors
- API errors

### Security Monitoring
Monitor for:
- Failed login attempts
- Suspicious IP addresses
- Unusual user activity
- Database access patterns

## Backup Strategy

### Database Backups
- Daily automated backups
- Point-in-time recovery capability
- Off-site backup storage
- Regular backup restoration tests

### Application Backups
- Source code version control
- Environment configuration backups
- User upload storage backups
- Configuration management

## Performance Optimization

### Database
- Proper indexing on frequently queried columns
- Query optimization
- Connection pooling
- Regular maintenance

### Application
- CDN for static assets
- Image optimization
- Code splitting
- Caching strategies

## Troubleshooting

### Common Issues

#### Database Connection Errors
- Check DATABASE_URL format
- Verify database is running
- Check firewall settings
- Verify user permissions

#### Email Not Sending
- Check SMTP credentials
- Verify email service status
- Check spam folder
- Review email service logs

#### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies
- Check session configuration

### Debug Mode
For troubleshooting, enable debug mode:
```env
DEBUG=prisma:*
NODE_ENV=development
```

## Support

For additional help:
- Check the main README.md
- Review application logs
- Contact support@labguard.com
- Create an issue on GitHub 