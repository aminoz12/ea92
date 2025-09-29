# Netlify Deployment Guide

## Prerequisites
- GitHub repository with your code
- Netlify account (free tier available)

## Deployment Steps

### 1. Connect to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Choose "GitHub" and authorize Netlify
4. Select your repository

### 2. Build Settings
Netlify will automatically detect these settings from `netlify.toml`:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18

### 3. Environment Variables (if needed)
If you need any environment variables:
1. Go to Site settings → Environment variables
2. Add any required variables

### 4. Deploy
1. Click "Deploy site"
2. Netlify will build and deploy your site
3. You'll get a random URL like `https://amazing-name-123456.netlify.app`

### 5. Custom Domain (Optional)
1. Go to Site settings → Domain management
2. Add your custom domain
3. Configure DNS settings as instructed

## Features Included

### Performance Optimizations
- ✅ Static asset caching (1 year)
- ✅ Image optimization
- ✅ Gzip compression
- ✅ CDN distribution

### Security Headers
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection
- ✅ X-Content-Type-Options
- ✅ Referrer-Policy

### SPA Support
- ✅ Automatic redirects for React Router
- ✅ 404 handling
- ✅ Client-side routing support

## Build Process
1. Netlify runs `npm install`
2. Runs `npm run build` (TypeScript compilation + Vite build)
3. Publishes `dist` folder
4. Sets up redirects and headers

## Monitoring
- Build logs available in Netlify dashboard
- Automatic deployments on git push
- Preview deployments for pull requests

## Troubleshooting
- Check build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify `netlify.toml` configuration
- Check that `dist` folder is generated correctly
