# Deployment Guide - Cloudflare Data Assistant

This guide covers deploying your AI Elements chatbot application that integrates with Cloudflare infrastructure.

## Prerequisites

Before deploying, ensure you have:

1. ✅ Cloudflare Worker deployed (from `openphone-notion-live` repo)
2. ✅ OpenAI API key OR Anthropic API key
3. ✅ Vercel account (recommended) OR self-hosting setup

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides native support for AI SDK streaming, Next.js 16, and seamless deployment.

#### Step 1: Prepare for Deployment

```bash
# Ensure all changes are committed
git add .
git commit -m "Add Cloudflare chatbot application"
git push origin claude/session-011CUZ3tGLxNabt3NbD1FpDJ
```

#### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your repository
3. Select the `apps/cloudflare-chat` directory as the root
4. Framework Preset: **Next.js**
5. Root Directory: `apps/cloudflare-chat`

#### Step 3: Configure Build Settings

**Build Command:**
```bash
cd ../.. && pnpm install && pnpm --filter cloudflare-chat build
```

**Output Directory:**
```
.next
```

**Install Command:**
```bash
pnpm install
```

#### Step 4: Set Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```bash
# Required: Your Cloudflare Worker URL
CLOUDFLARE_WORKER_URL=https://your-worker.your-subdomain.workers.dev

# Required: At least one AI provider
OPENAI_API_KEY=sk-...
# OR
ANTHROPIC_API_KEY=sk-ant-...

# Optional: AI Gateway (recommended for production)
AI_GATEWAY_URL=https://gateway.ai.cloudflare.com/v1/ACCOUNT_ID/GATEWAY_ID
```

#### Step 5: Deploy

Click **Deploy** and wait for the build to complete (~2-3 minutes).

#### Step 6: Test Deployment

1. Visit your deployment URL (e.g., `https://your-app.vercel.app`)
2. Try a test query: "Get dashboard statistics"
3. Verify tool calls are working
4. Check browser console for any errors

---

### Option 2: Cloudflare Pages

Deploy Next.js to Cloudflare Pages for a fully Cloudflare-native stack.

#### Step 1: Install Cloudflare Adapter

```bash
cd apps/cloudflare-chat
pnpm add @cloudflare/next-on-pages
```

#### Step 2: Update `next.config.ts`

```typescript
import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repo/elements', '@repo/shadcn-ui'],
  experimental: {
    optimizePackageImports: ['@repo/elements', 'lucide-react'],
  },
  // Add Cloudflare Pages configuration
  output: 'export', // For static export
  // OR for dynamic routes:
  // output: 'standalone',
};

export default config;
```

#### Step 3: Build for Cloudflare

```bash
pnpm build
npx @cloudflare/next-on-pages
```

#### Step 4: Deploy to Cloudflare Pages

```bash
# Using Wrangler
wrangler pages deploy .vercel/output/static --project-name=cloudflare-chat

# OR via Cloudflare Dashboard
# 1. Go to Pages → Create a project
# 2. Connect your GitHub repo
# 3. Build command: pnpm build && npx @cloudflare/next-on-pages
# 4. Build output: .vercel/output/static
```

#### Step 5: Set Environment Variables

In Cloudflare Pages → Settings → Environment Variables:

```bash
CLOUDFLARE_WORKER_URL=https://your-worker.workers.dev
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

**Note**: Cloudflare Pages has [limits on environment variable sizes](https://developers.cloudflare.com/pages/platform/limits/). Keep API keys under 5KB.

---

### Option 3: Self-Hosted (Docker)

Run the app on your own infrastructure using Docker.

#### Step 1: Create Dockerfile

Create `apps/cloudflare-chat/Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy monorepo files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/cloudflare-chat ./apps/cloudflare-chat

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the app
RUN pnpm --filter cloudflare-chat build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

# Copy built application
COPY --from=base /app/apps/cloudflare-chat/.next ./apps/cloudflare-chat/.next
COPY --from=base /app/apps/cloudflare-chat/public ./apps/cloudflare-chat/public
COPY --from=base /app/apps/cloudflare-chat/package.json ./apps/cloudflare-chat/
COPY --from=base /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Start the app
CMD ["node", "apps/cloudflare-chat/.next/standalone/server.js"]
```

#### Step 2: Build Docker Image

```bash
docker build -t cloudflare-chat -f apps/cloudflare-chat/Dockerfile .
```

#### Step 3: Run Container

```bash
docker run -d \
  -p 3000:3000 \
  -e CLOUDFLARE_WORKER_URL=https://your-worker.workers.dev \
  -e OPENAI_API_KEY=sk-... \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  --name cloudflare-chat \
  cloudflare-chat
```

#### Step 4: Access Application

Visit `http://localhost:3000`

---

## Post-Deployment Configuration

### 1. Configure CORS on Cloudflare Worker

Your Cloudflare Worker needs to allow requests from your deployed app.

Update your worker's `src/index.ts`:

```typescript
// Handle CORS preflight
if (request.method === 'OPTIONS') {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': 'https://your-app.vercel.app',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// Add CORS headers to all responses
const response = await handleRequest(request, env, ctx);
const headers = new Headers(response.headers);
headers.set('Access-Control-Allow-Origin', 'https://your-app.vercel.app');
return new Response(response.body, {
  status: response.status,
  headers,
});
```

For development, use:
```typescript
headers.set('Access-Control-Allow-Origin', '*');
```

### 2. Set Up AI Gateway (Optional but Recommended)

AI Gateway provides caching, analytics, and rate limiting for AI API calls.

1. Go to [Cloudflare AI Gateway](https://dash.cloudflare.com/?to=/:account/ai/ai-gateway)
2. Create a new gateway
3. Copy the gateway URL
4. Set environment variable:

```bash
AI_GATEWAY_URL=https://gateway.ai.cloudflare.com/v1/ACCOUNT_ID/GATEWAY_ID
```

Update `app/api/chat/route.ts`:

```typescript
import { openai } from '@ai-sdk/openai';

const model = openai('gpt-4o', {
  baseURL: process.env.AI_GATEWAY_URL + '/openai',
});
```

### 3. Monitor Performance

**Vercel Analytics:**

Already included via `@vercel/analytics` in the layout.

**Cloudflare Analytics:**

View in Cloudflare dashboard → Analytics & Logs

**Custom Logging:**

Add custom event tracking:

```typescript
// In your components
import { track } from '@vercel/analytics';

track('merchant_query', {
  canvasId: merchantData.canvasId,
  toolsUsed: toolInvocations.length,
});
```

---

## Troubleshooting

### Issue: CORS Errors

**Symptom:** `Access-Control-Allow-Origin` errors in browser console

**Solution:**
1. Verify `CLOUDFLARE_WORKER_URL` is correct
2. Add CORS headers to your worker (see above)
3. Ensure worker is deployed and accessible

### Issue: Tool Execution Timeouts

**Symptom:** Tools fail with timeout errors

**Solution:**
1. Increase `maxDuration` in `app/api/chat/route.ts`:
```typescript
export const maxDuration = 60; // 60 seconds
```
2. Optimize Cloudflare Worker queries
3. Add caching for frequently accessed data

### Issue: Streaming Not Working

**Symptom:** Full response appears at once instead of streaming

**Solution:**
1. Ensure platform supports streaming (Vercel ✅, Cloudflare Pages ⚠️)
2. Check that `streamText` is used (not `generateText`)
3. Verify no middleware is buffering responses

### Issue: Build Failures

**Symptom:** `pnpm build` fails with errors

**Common Causes:**
1. TypeScript errors - Run `pnpm typecheck`
2. Missing dependencies - Run `pnpm install`
3. Workspace issues - Clear cache: `rm -rf .next node_modules && pnpm install`

### Issue: Environment Variables Not Loading

**Symptom:** `undefined` API keys in production

**Solution:**
1. Verify variables are set in deployment platform
2. Check variable names match exactly (case-sensitive)
3. For Vercel: Ensure variables are set for Production environment
4. Redeploy after setting variables

---

## Production Checklist

Before going live, verify:

- [ ] `CLOUDFLARE_WORKER_URL` points to production worker
- [ ] API keys are production keys, not test keys
- [ ] CORS is configured correctly
- [ ] AI Gateway is set up (optional)
- [ ] Analytics are working
- [ ] Error boundaries handle failures gracefully
- [ ] Rate limiting is in place (via AI Gateway or custom)
- [ ] Monitoring is configured
- [ ] Custom domain is set up (optional)
- [ ] SSL certificate is valid
- [ ] Performance testing completed
- [ ] Backup plan for API key rotation

---

## Scaling Considerations

### Horizontal Scaling

Both Vercel and Cloudflare Pages auto-scale horizontally:
- No manual configuration needed
- Pay per request/execution time
- Automatic load balancing

### Caching Strategy

Implement caching at multiple levels:

1. **Browser Cache** - Static assets (already configured)
2. **CDN Cache** - Vercel/Cloudflare edge caching
3. **KV Cache** - Cloudflare KV for API responses
4. **AI Cache** - AI Gateway response caching

### Cost Optimization

**AI API Costs:**
- Use GPT-4o Mini for simple queries ($0.15/1M tokens)
- Use GPT-4o for complex analysis ($2.50/1M tokens)
- Enable AI Gateway caching to reduce API calls
- Set user rate limits

**Infrastructure Costs:**
- Vercel: ~$20-50/month (Pro plan)
- Cloudflare Pages: Free tier + Pages Functions ($0.50/1M requests)
- Cloudflare Worker: Included in Free tier or $5/month (Paid)

---

## Support

For deployment issues:
- Vercel: https://vercel.com/support
- Cloudflare Pages: https://community.cloudflare.com/
- Next.js: https://github.com/vercel/next.js/discussions
- AI SDK: https://github.com/vercel/ai/discussions

---

**Deployment complete!** 🎉

Your Cloudflare Data Assistant is now live and ready to query your OpenPhone-Notion data.
