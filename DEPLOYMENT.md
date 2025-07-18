# TechTalkZA Deployment Configuration

## Environment Setup

### Development
- **Frontend**: http://localhost:5174
- **Backend**: http://localhost:5001
- **Database**: MongoDB local instance

### Staging
- **Frontend**: To be configured with Vercel/Netlify
- **Backend**: To be configured with Render/Railway
- **Database**: MongoDB Atlas (staging cluster)

### Production
- **Frontend**: To be configured with Vercel/Netlify
- **Backend**: To be configured with Render/Railway
- **Database**: MongoDB Atlas (production cluster)

## Deployment Steps

### 1. Backend Deployment (Render/Railway)
```bash
# Environment variables to configure:
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/techtalk-za-blog
JWT_SECRET=your-super-secret-production-jwt-key
FRONTEND_URL=https://your-frontend-domain.com
```

### 2. Frontend Deployment (Vercel/Netlify)
```bash
# Environment variables to configure:
VITE_API_URL=https://your-backend-domain.com/api
VITE_NODE_ENV=production
VITE_APP_NAME=TechTalkZA
VITE_APP_VERSION=1.0.0
```

### 3. Database Setup (MongoDB Atlas)
1. Create a new cluster
2. Configure network access (IP whitelist)
3. Create database user with read/write permissions
4. Set up connection string in environment variables

## Monitoring and Health Checks

### Health Check Endpoints
- **Backend**: `/health` - Returns server status and uptime
- **Frontend**: Build-time health checks via CI/CD

### Monitoring Setup
- **Uptime Monitoring**: Configure with UptimeRobot or similar
- **Error Tracking**: Ready for Sentry integration
- **Performance**: Built-in metrics via health endpoint

## Security Considerations

### Backend Security
- CORS configured for production domain
- Security headers implemented
- JWT tokens with expiration
- Input validation and sanitization

### Frontend Security
- Environment variables properly configured
- Build artifacts minified and optimized
- No sensitive data in client-side code

## Rollback Strategy

### Automated Rollback
- GitHub Actions can revert to previous deployment
- Database migrations should be backward compatible
- Feature flags for quick feature toggles

### Manual Rollback
1. Revert to previous Git commit
2. Redeploy via CI/CD pipeline
3. Verify health checks pass
4. Monitor for errors

## Maintenance Schedule

### Regular Updates
- **Dependencies**: Weekly security updates
- **Database**: Monthly optimization
- **SSL Certificates**: Auto-renewal configured

### Backups
- **Database**: Daily automated backups via MongoDB Atlas
- **Code**: Git repository with branch protection
- **Assets**: Cloud storage with versioning
