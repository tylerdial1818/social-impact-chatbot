# Deployment Guide

Complete deployment instructions for the Social Impact Project Planner.

## Prerequisites

Before deploying, ensure you have:

1. **API Keys**
   - OpenAI API key ([get one here](https://platform.openai.com/api-keys))
   - Pinecone API key ([sign up here](https://www.pinecone.io/))

2. **Corpus Prepared**
   - 17 academic papers in PDF format
   - Papers should be placed in `corpus/` directory
   - Run ingestion script to populate vector database

3. **Git Repository**
   - Code pushed to GitHub
   - Repository accessible to deployment platform

## Option 1: Deploy to Vercel (Recommended)

Vercel provides the best experience for Next.js applications with zero-config deployment.

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   In Vercel dashboard, go to Settings → Environment Variables and add:
   ```
   OPENAI_API_KEY=sk-...
   PINECONE_API_KEY=...
   PINECONE_INDEX_NAME=social-impact
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy
   - Your app will be live at `your-project.vercel.app`

### Cost

- **Vercel Hobby Plan**: FREE
  - 100GB bandwidth/month
  - Unlimited API requests
  - Automatic HTTPS

### Auto-Deploy

Every push to `main` branch triggers automatic deployment.

## Option 2: Deploy to Railway

Railway offers simple deployment with generous free tier.

### Steps

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add Environment Variables**
   - Click on your service
   - Go to "Variables" tab
   - Add all required environment variables

4. **Deploy**
   - Railway automatically detects Next.js
   - Deployment happens automatically
   - Get your URL from the "Settings" tab

### Cost

- **Free Tier**: $5 credit/month
- **Pro Plan**: $20/month (recommended for production)

## Option 3: Self-Hosted (VPS)

Deploy to any VPS (DigitalOcean, AWS EC2, etc.)

### Requirements

- Node.js 18+
- 1GB RAM minimum (2GB recommended)
- Ubuntu 22.04 or similar

### Steps

1. **Setup Server**
   ```bash
   # SSH into your server
   ssh user@your-server-ip
   
   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   sudo npm install -g pm2
   ```

2. **Clone Repository**
   ```bash
   git clone https://github.com/evegreenftw/social-impact-chatbot.git
   cd social-impact-chatbot
   ```

3. **Install Dependencies**
   ```bash
   npm install --production
   ```

4. **Set Environment Variables**
   ```bash
   # Create .env file
   nano .env
   
   # Add variables:
   OPENAI_API_KEY=sk-...
   PINECONE_API_KEY=...
   PINECONE_INDEX_NAME=social-impact
   NODE_ENV=production
   ```

5. **Build Application**
   ```bash
   npm run build
   ```

6. **Start with PM2**
   ```bash
   pm2 start npm --name "social-impact-chatbot" -- start
   pm2 save
   pm2 startup
   ```

7. **Setup Nginx (Reverse Proxy)**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/chatbot
   ```
   
   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   Enable and restart:
   ```bash
   sudo ln -s /etc/nginx/sites-available/chatbot /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Setup SSL (Let's Encrypt)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

### Cost

- **DigitalOcean Droplet**: $6/month (basic)
- **AWS EC2 t3.micro**: ~$8/month
- **Hetzner VPS**: €4/month

## Option 4: Docker Deployment

Use Docker for containerized deployment.

### Dockerfile

```dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### Build and Run

```bash
docker build -t social-impact-chatbot .
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=sk-... \
  -e PINECONE_API_KEY=... \
  -e PINECONE_INDEX_NAME=social-impact \
  social-impact-chatbot
```

### Deploy to Cloud

- **Google Cloud Run**: Fully managed containers
- **AWS ECS**: Container orchestration
- **Azure Container Apps**: Serverless containers

## Data Ingestion (Pinecone Setup)

Before the app can work, you must ingest the corpus into Pinecone.

### 1. Create Pinecone Index

1. Log in to [Pinecone Console](https://app.pinecone.io/)
2. Click "Create Index"
3. Configure:
   - **Name**: `social-impact`
   - **Dimensions**: `1536` (for text-embedding-3-small)
   - **Metric**: `cosine`
   - **Cloud**: `AWS` (or your preference)
   - **Region**: `us-east-1` (or closest)
4. Click "Create Index"

### 2. Prepare Corpus

```bash
mkdir corpus
# Copy your 17 PDF files into corpus/
```

### 3. Run Ingestion

```bash
npm run ingest
```

This will:
- Extract text from PDFs
- Chunk into 600-token segments with overlap
- Generate embeddings using OpenAI
- Upload vectors to Pinecone

**Time**: ~10-15 minutes for 17 papers  
**Cost**: ~$0.05 (OpenAI embeddings)

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | Yes | OpenAI API key for embeddings and chat | `sk-proj-...` |
| `PINECONE_API_KEY` | Yes | Pinecone API key for vector search | `abc123...` |
| `PINECONE_INDEX_NAME` | Yes | Name of Pinecone index | `social-impact` |
| `NODE_ENV` | No | Environment (development/production) | `production` |

## Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] Corpus ingested into Pinecone
- [ ] Application builds successfully
- [ ] Chat interface loads
- [ ] Test query returns structured response
- [ ] Citations appear correctly
- [ ] Mobile responsiveness verified
- [ ] SSL certificate active (if custom domain)
- [ ] Monitoring/logging configured
- [ ] Backup strategy in place

## Monitoring & Maintenance

### Vercel

- Built-in analytics dashboard
- Real-time error tracking
- Performance metrics included

### Self-Hosted

Recommended tools:
- **PM2**: Process monitoring (`pm2 monit`)
- **UptimeRobot**: Uptime monitoring (free)
- **Sentry**: Error tracking
- **LogTail**: Log aggregation

### Cost Monitoring

Track OpenAI usage:
- Go to [platform.openai.com/usage](https://platform.openai.com/usage)
- Set up usage alerts
- Monitor per-request costs

## Scaling Considerations

### When to Scale

Current architecture handles:
- **~1000 conversations/day** comfortably
- **Peak**: 50 concurrent users

Scale up when:
- Response times > 5 seconds
- Error rates > 1%
- Consistent high traffic

### Scaling Strategies

1. **Upgrade OpenAI Model**
   - Switch to `gpt-4o` for better quality
   - Trade cost for performance

2. **Increase Pinecone Capacity**
   - Upgrade to paid tier for more queries
   - Add replicas for redundancy

3. **Add Caching**
   - Cache common queries with Redis
   - Reduce duplicate LLM calls

4. **CDN Integration**
   - Use Vercel Edge Network (automatic)
   - Or Cloudflare for self-hosted

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### API Errors

- Check environment variables are set correctly
- Verify API keys have sufficient credits
- Check Pinecone index exists and has data

### Slow Responses

- Check OpenAI API status
- Verify Pinecone query performance
- Consider increasing `topK` parameter

### No Citations Appearing

- Ensure corpus was ingested
- Check Pinecone index has vectors
- Lower `minScore` threshold in RAG config

## Support

For deployment issues:
- Check [GitHub Issues](https://github.com/evegreenftw/social-impact-chatbot/issues)
- Review Vercel/Railway documentation
- Contact support@example.com

---

**Deployment Time Estimate**: 30-60 minutes (including ingestion)

**Recommended Stack**: Next.js on Vercel + Pinecone free tier = $0/month
