# 🚀 MandiSense 2.0 Deployment Guide

This guide covers various deployment options for MandiSense 2.0, from development to production environments.

## 📋 Prerequisites

### System Requirements
- Node.js 16.0+ and npm 8.0+
- Git 2.30.0+
- Modern web browser
- Internet connection for external APIs

### Environment Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables (see `.env.example`)
4. Build the application: `npm run build`

## 🌐 Deployment Options

### 1. Static Hosting (Recommended)

#### Netlify Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=build
```

**Netlify Configuration (`netlify.toml`)**:
```toml
[build]
  publish = "build"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "16"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

**Vercel Configuration (`vercel.json`)**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### GitHub Pages Deployment
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

### 2. Cloud Hosting

#### AWS S3 + CloudFront
```bash
# Install AWS CLI
pip install awscli

# Configure AWS credentials
aws configure

# Sync build to S3
aws s3 sync build/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

#### Google Cloud Storage
```bash
# Install Google Cloud SDK
# Follow: https://cloud.google.com/sdk/docs/install

# Deploy to GCS
gsutil -m rsync -r -d build/ gs://your-bucket-name

# Set up load balancer and CDN
gcloud compute backend-buckets create mandisense-backend --gcs-bucket-name=your-bucket-name
```

#### Azure Static Web Apps
```bash
# Install Azure CLI
# Follow: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

# Create static web app
az staticwebapp create \
  --name mandisense \
  --resource-group your-resource-group \
  --source https://github.com/srakshitha0802/MandiSense \
  --location "Central US" \
  --branch main \
  --app-location "/" \
  --output-location "build"
```

### 3. Container Deployment

#### Docker
**Dockerfile**:
```dockerfile
# Build stage
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**:
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

**Build and Run**:
```bash
# Build Docker image
docker build -t mandisense:latest .

# Run container
docker run -p 80:80 mandisense:latest
```

#### Docker Compose
**docker-compose.yml**:
```yaml
version: '3.8'
services:
  mandisense:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl
      - ./nginx-ssl.conf:/etc/nginx/nginx.conf
    depends_on:
      - mandisense
    restart: unless-stopped
```

### 4. Kubernetes Deployment

**deployment.yaml**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mandisense
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mandisense
  template:
    metadata:
      labels:
        app: mandisense
    spec:
      containers:
      - name: mandisense
        image: mandisense:latest
        ports:
        - containerPort: 80
        env:
        - name: NODE_ENV
          value: "production"
---
apiVersion: v1
kind: Service
metadata:
  name: mandisense-service
spec:
  selector:
    app: mandisense
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

## 🔧 Environment Configuration

### Production Environment Variables
```env
# Production API URLs
REACT_APP_API_BASE_URL=https://api.mandisense.com
REACT_APP_BLOCKCHAIN_NETWORK=mainnet

# Security Settings
REACT_APP_ENABLE_HTTPS_ONLY=true
REACT_APP_SESSION_TIMEOUT=3600

# Performance Settings
REACT_APP_CACHE_DURATION=3600
REACT_APP_CDN_URL=https://cdn.mandisense.com

# Analytics
REACT_APP_ANALYTICS_ID=your_production_analytics_id
REACT_APP_SENTRY_DSN=your_production_sentry_dsn

# Feature Flags
REACT_APP_ENABLE_VOICE_FEATURES=true
REACT_APP_ENABLE_BLOCKCHAIN=true
REACT_APP_ENABLE_IOT=true
```

### Staging Environment
```env
# Staging API URLs
REACT_APP_API_BASE_URL=https://staging-api.mandisense.com
REACT_APP_BLOCKCHAIN_NETWORK=testnet

# Debug Settings
REACT_APP_DEBUG_MODE=true
REACT_APP_LOG_LEVEL=debug

# Feature Flags
REACT_APP_ENABLE_BETA_FEATURES=true
REACT_APP_ENABLE_EXPERIMENTAL_UI=true
```

## 🔒 Security Configuration

### HTTPS Setup
```nginx
server {
    listen 443 ssl http2;
    server_name mandisense.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}
```

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://apis.google.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.mandisense.com wss://api.mandisense.com;
  media-src 'self';
  frame-src 'none';
">
```

## 📊 Monitoring & Analytics

### Health Checks
```javascript
// health-check.js
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 80,
  path: '/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    console.log('Health check passed');
    process.exit(0);
  } else {
    console.log('Health check failed');
    process.exit(1);
  }
});

req.on('error', (err) => {
  console.log('Health check error:', err);
  process.exit(1);
});

req.end();
```

### Performance Monitoring
```javascript
// performance-monitor.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test -- --coverage --watchAll=false
    
    - name: Build application
      run: npm run build
      env:
        REACT_APP_API_BASE_URL: ${{ secrets.PROD_API_URL }}
        REACT_APP_ANALYTICS_ID: ${{ secrets.ANALYTICS_ID }}
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './build'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 16+
```

#### Deployment Issues
```bash
# Check build output
npm run build
ls -la build/

# Test locally
npx serve -s build -l 3000

# Check environment variables
printenv | grep REACT_APP
```

#### Performance Issues
```bash
# Analyze bundle size
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js

# Check lighthouse scores
npm install -g lighthouse
lighthouse https://your-domain.com --view
```

## 📈 Scaling Considerations

### Load Balancing
- Use CDN for static assets
- Implement proper caching strategies
- Consider edge computing for global users
- Monitor performance metrics

### Database Scaling
- Implement read replicas
- Use caching layers (Redis)
- Consider database sharding
- Monitor query performance

### API Scaling
- Implement rate limiting
- Use API gateways
- Consider microservices architecture
- Monitor API performance

## 🔐 Backup & Recovery

### Backup Strategy
```bash
# Backup user data
aws s3 sync s3://mandisense-data s3://mandisense-backup-$(date +%Y%m%d)

# Backup database
pg_dump mandisense > backup-$(date +%Y%m%d).sql

# Backup configuration
tar -czf config-backup-$(date +%Y%m%d).tar.gz /etc/nginx /etc/ssl
```

### Disaster Recovery
1. Maintain multiple deployment regions
2. Implement automated failover
3. Regular backup testing
4. Document recovery procedures
5. Monitor system health

---

## 📞 Support

For deployment issues or questions:
- Check the [troubleshooting guide](TROUBLESHOOTING.md)
- Create an issue on [GitHub](https://github.com/srakshitha0802/MandiSense/issues)
- Contact: deployment@mandisense.com

**Happy Deploying! 🚀**