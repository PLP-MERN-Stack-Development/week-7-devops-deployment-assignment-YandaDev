[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19954029&assignment_repo_type=AssignmentRepo)

# 🚀 TechTalkZA - MERN Stack Blog Platform

## 📋 Assignment Overview: Deployment and DevOps for MERN Applications

This assignment focuses on deploying a full MERN stack application to production, implementing CI/CD pipelines, and setting up monitoring for your application.

### What You'll Accomplish:
1. ✅ **Prepare your MERN application for production deployment**
2. 🔄 **Deploy the backend to a cloud platform**
3. 🌐 **Deploy the frontend to a static hosting service**
4. 🏗️ **Set up CI/CD pipelines with GitHub Actions**
5. 📊 **Implement monitoring and maintenance strategies**

## 🌟 Project Overview

TechTalkZA is a modern full-stack blog platform built with the MERN stack, featuring a beautiful UI powered by ShadCN components and Tailwind CSS. The platform focuses on South African tech community discussions with production-ready deployment capabilities.

## ✨ Features Implemented

- **Modern UI/UX**: Built with ShadCN components and Tailwind CSS
- **Authentication**: JWT-based user authentication and authorization
- **Blog Management**: Create, read, update, and delete blog posts
- **Categories**: 15 predefined South African tech categories
- **Image Uploads**: Support for featured images with file handling
- **Responsive Design**: Mobile-first design approach
- **Production Ready**: Optimized for deployment with CI/CD pipeline
- **Health Monitoring**: Built-in health check endpoints
- **Security**: CORS, security headers, and input validation

## 🛠️ Tech Stack

### Frontend
- **React** 19.1.0 - Modern React with hooks
- **Vite** 7.0.4 - Fast build tool and dev server
- **Tailwind CSS** 4.1.11 - Utility-first CSS framework
- **ShadCN UI** - High-quality React components
- **React Router DOM** 7.6.3 - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** 5.1.0 - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** 8.16.2 - MongoDB object modeling
- **JWT** 9.0.2 - JSON Web Token authentication

### DevOps & Tools
- **GitHub Actions** - CI/CD pipeline
- **Jest** 30.0.4 - Testing framework
- **ESLint** - Code linting
- **pnpm** 10.13.1 - Package manager

## 🏃‍♂️ Local Development Setup

### Prerequisites
- Node.js 18+ 
- pnpm 8+
- MongoDB (local or Atlas)

### Quick Start

1. **Clone and Install**
   ```bash
   git clone https://github.com/PLP-MERN-Stack-Development/week-7-devops-deployment-assignment-YandaDev.git
   cd week-7-devops-deployment-assignment-YandaDev
   
   # Install backend dependencies
   cd server && pnpm install
   
   # Install frontend dependencies
   cd ../client && pnpm install
   ```

2. **Environment Setup**
   ```bash
   # Backend environment
   cd server
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   
   # Frontend environment
   cd ../client
   cp .env.example .env
   # Edit .env with your API URL
   ```

3. **Database Setup**
   ```bash
   # Seed categories (from server directory)
   cd server && pnpm run seed
   ```

4. **Start Development**
   ```bash
   # Terminal 1: Backend (from server directory)
   cd server && pnpm run dev
   
   # Terminal 2: Frontend (from client directory)
   cd client && pnpm run dev
   ```

5. **Access Application**
   - Frontend: http://localhost:5174
   - Backend: http://localhost:5001
   - Health Check: http://localhost:5001/health

## 🚀 Production Deployment

### Task 1: ✅ Application Preparation (COMPLETED)
- ✅ Production build configuration
- ✅ Environment variable setup
- ✅ Security headers and CORS
- ✅ Database connection pooling
- ✅ Health check endpoints
- ✅ Error handling and logging

### Task 2: 🔄 Backend Deployment (READY)
- **Platform Options**: Render, Railway, or Heroku
- **Database**: MongoDB Atlas
- **Environment Variables**: See `.env.example`
- **Health Check**: `/health` endpoint available

### Task 3: 🌐 Frontend Deployment (READY)
- **Platform Options**: Vercel, Netlify, or GitHub Pages
- **Build**: Optimized with code splitting
- **Environment Variables**: See `client/.env.example`
- **Assets**: Minified and compressed

### Task 4: 🏗️ CI/CD Pipeline (CONFIGURED)
- **GitHub Actions**: `.github/workflows/ci-cd.yml`
- **Automated Testing**: Linting and unit tests
- **Build Verification**: Production build testing
- **Security Scanning**: npm audit
- **Deployment**: Automatic deployment on push

### Task 5: 📊 Monitoring (READY)
- **Health Checks**: `/health` endpoint
- **Error Tracking**: Structured logging
- **Performance**: Build analysis and optimization
- **Uptime**: Ready for external monitoring

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/techtalk-za-blog
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_NODE_ENV=production
VITE_APP_NAME=TechTalkZA
VITE_APP_VERSION=1.0.0
```

## 📚 API Documentation

### Health Check
- `GET /health` - Server health status and uptime

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (auth required)
- `PUT /api/posts/:id` - Update post (auth required)
- `DELETE /api/posts/:id` - Delete post (auth required)

### Categories
- `GET /api/categories` - Get all categories

## 📈 Performance Optimizations

### Frontend
- **Code Splitting**: Vendor, UI, and utility chunks
- **Asset Optimization**: Minified CSS/JS with gzip
- **Build Analysis**: Bundle size monitoring
- **Caching**: Optimized cache headers

### Backend
- **Connection Pooling**: MongoDB connection optimization
- **Security Headers**: Production security headers
- **Request Validation**: Input validation and sanitization
- **Graceful Shutdown**: Proper cleanup on exit

## 🔗 Deployment URLs

### Live Application (Update after deployment)
- **Frontend**: https://your-frontend-domain.com
- **Backend**: https://your-backend-domain.com
- **API Health**: https://your-backend-domain.com/health

### CI/CD Pipeline
[![CI/CD Pipeline](https://github.com/PLP-MERN-Stack-Development/week-7-devops-deployment-assignment-YandaDev/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/PLP-MERN-Stack-Development/week-7-devops-deployment-assignment-YandaDev/actions/workflows/ci-cd.yml)

## 📋 Assignment Completion Checklist

### Task 1: Application Preparation ✅
- [x] Production build configuration
- [x] Environment variable setup
- [x] Security headers and CORS
- [x] Database connection pooling
- [x] Health check endpoints
- [x] Error handling and logging

### Task 2: Backend Deployment 🔄
- [ ] Deploy to Render/Railway/Heroku
- [ ] Configure environment variables
- [ ] Set up MongoDB Atlas
- [ ] Configure custom domain (optional)
- [ ] Implement HTTPS

### Task 3: Frontend Deployment 🔄
- [ ] Deploy to Vercel/Netlify/GitHub Pages
- [ ] Configure build settings
- [ ] Set up environment variables
- [ ] Configure custom domain (optional)
- [ ] Implement caching strategies

### Task 4: CI/CD Pipeline ✅
- [x] GitHub Actions workflow
- [x] Automated testing
- [x] Build verification
- [x] Security scanning
- [x] Deployment automation

### Task 5: Monitoring 🔄
- [ ] Set up uptime monitoring
- [ ] Configure error tracking
- [ ] Implement performance monitoring
- [ ] Create maintenance documentation

## 🤝 Contributing

This is an assignment project, but contributions and improvements are welcome for learning purposes.

## 📜 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **PLP Academy** - For the comprehensive MERN stack curriculum
- **ShadCN** - For the beautiful UI components
- **Tailwind CSS** - For the utility-first CSS framework

---

**Made with ❤️ by [YandaDev](https://github.com/YandaDev) for PLP Academy Week 7 DevOps Assignment**

## Deployment Platforms

### Backend Deployment Options
- **Render**: Easy to use, free tier available
- **Railway**: Developer-friendly, generous free tier
- **Heroku**: Well-established, extensive documentation

### Frontend Deployment Options
- **Vercel**: Optimized for React apps, easy integration
- **Netlify**: Great for static sites, good CI/CD
- **GitHub Pages**: Free, integrated with GitHub

## CI/CD Pipeline

The assignment includes templates for setting up GitHub Actions workflows:
- `frontend-ci.yml`: Tests and builds the React application
- `backend-ci.yml`: Tests the Express.js backend
- `frontend-cd.yml`: Deploys the frontend to your chosen platform
- `backend-cd.yml`: Deploys the backend to your chosen platform

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete all deployment tasks
2. Set up CI/CD pipelines with GitHub Actions
3. Deploy both frontend and backend to production
4. Document your deployment process in the README.md
5. Include screenshots of your CI/CD pipeline in action
6. Add URLs to your deployed applications

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/) 