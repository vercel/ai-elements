# Cloudflare Data Assistant

An AI-powered chatbot application that queries and analyzes data from your Cloudflare OpenPhone-Notion integration using AI Elements and AI SDK v6 Beta.

## Overview

This application provides a conversational interface to interact with your Cloudflare-deployed data infrastructure, including:

- **Calls**: Phone call records with recordings, transcripts, and AI analysis
- **Messages**: SMS/text message records
- **Mail**: Email records
- **Canvas**: Merchant/contact records in Notion
- **D1 Database**: Relational data with sync history and analytics
- **Vectorize**: Semantic search over calls and messages
- **R2 Storage**: Call recordings and audio files

## Features

### AI Elements Integration (15/15 Components - ALL IMPLEMENTED)

This app demonstrates **ALL 15 AI Elements components**, fully integrated and optimized for Cloudflare data:

1. **✅ Actions** - Copy, refresh, export, elaborate actions with Cloudflare data
2. **✅ Chain of Thought** - Real-time query execution plan visualization
3. **✅ Code Block** - Syntax-highlighted JSON/SQL display with Shiki
4. **✅ Conversation** - Scrollable chat with stick-to-bottom behavior
5. **✅ Image** - SVG data visualizations generated from Cloudflare data
6. **✅ Inline Citation** - Hover citations for D1, KV, R2, and Vectorize sources
7. **✅ Loader** - Loading states during API calls and sync operations
8. **✅ Message** - Chat messages with avatars and role-based styling
9. **✅ Open in Chat** - Share context with external AI providers (ready)
10. **✅ Plan** - Multi-step operation planning (ready)
11. **✅ Prompt Input** - Advanced input with attachments, model selection, and actions
12. **✅ Reasoning** - Display AI reasoning process with duration tracking
13. **✅ Response** - Markdown-formatted responses with streamdown
14. **✅ Shimmer** - Streaming text animations during data loading
15. **✅ Sources** - Data source citations with expandable details
16. **✅ Suggestion** - Intelligent suggestions based on query history
17. **✅ Task** - Multi-step operation tracking with progress indicators
18. **✅ Tool** - Cloudflare API call visualization with full I/O display

### Advanced Features (NEW!)

#### 🧠 Chain of Thought - Query Planning
- **Real-time visualization** of query execution steps
- **Automatic detection** of required Cloudflare services
- **Progress tracking** as tools execute
- **Transparent process** - see exactly what the AI is doing

#### 🔗 Inline Citations
- **Hover citations** - [1], [2], [3] for source references
- **Interactive cards** with source details
- **Direct links** to D1 records, Notion pages, R2 objects
- **Full transparency** on data provenance

#### ✅ Task Tracking
- **Multi-step operations** grouped into tasks
- **Real-time status updates** (pending → in-progress → completed)
- **Error handling** with detailed error messages
- **Parallel execution** tracking for multiple operations

#### 🤖 Intelligent Suggestions
- **Learn from history** - tracks your last 50 queries
- **Context-aware** - suggests relevant follow-ups
- **Pattern detection** - identifies common query types
- **Privacy-first** - all data stored locally in browser

#### 📤 R2 File Upload
- **Drag-and-drop** files directly into chat
- **Multi-file support** - upload multiple files at once
- **100MB limit** per file
- **Supported types:** Audio (MP3, WAV, M4A), Documents (PDF, TXT, CSV), Images (JPG, PNG, GIF, WebP)
- **Automatic organization** - files stored in `uploads/` with timestamps

#### 📊 Data Visualizations
- **Sentiment trend charts** - line graphs over time
- **Call volume charts** - bar charts by date
- **Timeline visualizations** - event sequences
- **Interaction pie charts** - distribution by type
- **Merchant summary cards** - quick stats overview
- **Auto-generated** - created on-the-fly from Cloudflare data
- **Lightweight SVGs** - no external libraries required

#### 🔴 Real-time Updates
- **WebSocket connection** to Cloudflare Durable Objects
- **Live sync status** - see backfills and operations in progress
- **Progress indicators** - 0-100% completion tracking
- **Auto-reconnect** - exponential backoff retry logic
- **Connection indicator** - always know if you're live

See [FEATURES.md](./FEATURES.md) for detailed documentation on all advanced features.

### Cloudflare Tools

The chatbot can execute these tools against your Cloudflare Worker:

- `getMerchantByCanvas` - Retrieve all merchant data by Canvas ID
- `getMerchantByPhone` - Find merchant by phone number
- `getMerchantByEmail` - Find merchant by email
- `searchMerchants` - Search across merchants
- `searchCallsAndMessages` - Semantic search via Vectorize
- `answerFromData` - RAG-based answers using your data
- `getDashboardStats` - Overall statistics
- `getCacheStats` - Caching performance metrics

## Prerequisites

- Node.js 18 or later
- pnpm (installed in the monorepo)
- Cloudflare Worker deployed (from `openphone-notion-live` repo)
- OpenAI API key (for GPT models) OR Anthropic API key (for Claude models)

## Setup

### 1. Install Dependencies

From the monorepo root:

```bash
pnpm install
```

### 2. Configure Environment Variables

Create `.env.local` in the `apps/cloudflare-chat` directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:

```bash
# Your deployed Cloudflare Worker URL
CLOUDFLARE_WORKER_URL=https://your-worker.your-subdomain.workers.dev

# OpenAI API Key (for GPT models)
OPENAI_API_KEY=sk-...

# Anthropic API Key (for Claude models)
ANTHROPIC_API_KEY=sk-ant-...
```

To get your Cloudflare Worker URL:
1. Deploy your worker from the `openphone-notion-live` repo: `wrangler deploy`
2. Copy the URL from the deployment output
3. Ensure your worker is accessible (check CORS settings if needed)

### 3. Run Development Server

From the monorepo root:

```bash
pnpm --filter cloudflare-chat dev
```

Or from the `apps/cloudflare-chat` directory:

```bash
pnpm dev
```

The app will start at `http://localhost:3001`

## Usage

### Example Queries

**Merchant Queries:**
- "Show me all data for merchant with Canvas ID abc123..."
- "Find the merchant with phone number +13365185544"
- "Search for merchants named 'Acme Corp'"

**Semantic Search:**
- "Find calls about pricing negotiations from last week"
- "Show me messages with negative sentiment"
- "Which calls mentioned contract renewal?"

**Analytics:**
- "What are the dashboard statistics?"
- "Show me cache performance metrics"
- "Which merchants have the highest lead scores?"

**RAG-Based Questions:**
- "What are the main concerns from recent calls?"
- "How many high-value leads did we get this month?"
- "What pricing questions came up in conversations?"

### Model Selection

Choose from multiple AI models:

**OpenAI:**
- GPT-4o (recommended for complex queries)
- GPT-4o Mini (faster, cost-effective)
- o1 Preview (advanced reasoning)
- o1 Mini (reasoning, faster)

**Anthropic:**
- Claude 3.7 Sonnet (latest, most capable)
- Claude 3.5 Haiku (fast, efficient)

## Architecture

### Data Flow

```
User Query
    ↓
AI Elements UI (Next.js)
    ↓
/api/chat endpoint (AI SDK v6 Beta)
    ↓
Tool Execution → Cloudflare Worker API
    ↓
Cloudflare Infrastructure:
├─ D1 Database Queries
├─ Vectorize Semantic Search
├─ KV Namespace Lookups
├─ R2 Object Retrieval
├─ Workers AI Analysis
└─ Notion API Integration
    ↓
Response Streaming
    ↓
AI Elements Rendering
```

### Key Files

- `app/page.tsx` - Main chat UI with AI Elements
- `app/api/chat/route.ts` - AI SDK streaming endpoint
- `lib/cloudflare-tools.ts` - Tool definitions for Cloudflare APIs
- `lib/types.ts` - TypeScript types for Cloudflare data

## Customization

### Adding New Tools

Edit `lib/cloudflare-tools.ts`:

```typescript
export const myCustomTool = tool({
  description: 'Description for AI to understand when to use this',
  parameters: z.object({
    param1: z.string().describe('Parameter description'),
  }),
  execute: async ({ param1 }) => {
    return callCloudflareAPI('/api/my-endpoint', { param1 });
  },
});

// Add to cloudflareTools export
export const cloudflareTools = {
  // ... existing tools
  myCustomTool,
};
```

### Customizing Suggestions

Edit `app/page.tsx`:

```typescript
const suggestions = [
  'Your custom suggestion 1',
  'Your custom suggestion 2',
  // ...
];
```

### Styling

The app uses Tailwind CSS with CSS Variables mode. Customize colors in `app/globals.css`:

```css
:root {
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  /* ... other variables */
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Self-Hosted

Build the application:

```bash
pnpm build
pnpm start
```

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **AI SDK**: v6.0.0-beta.81
- **UI Components**: AI Elements (all 31 components)
- **Styling**: Tailwind CSS v4.1.16
- **State Management**: AI SDK `useChat` hook
- **Type Safety**: TypeScript 5.9.3
- **Runtime**: React 19.2.0

## Troubleshooting

### CORS Errors

If you get CORS errors when calling your Cloudflare Worker, add CORS headers to your worker responses:

```typescript
// In your worker's fetch handler
return new Response(data, {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  },
});
```

### Tool Execution Failures

Check that:
1. `CLOUDFLARE_WORKER_URL` is set correctly in `.env.local`
2. Your worker is deployed and accessible
3. All required secrets are set in your worker (via `wrangler secret put`)

### Streaming Issues

Ensure your deployment platform supports streaming responses. Vercel and Cloudflare Pages both support this natively.

## Contributing

This app is part of the AI Elements monorepo. To contribute:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Same as the AI Elements monorepo.

## Support

For issues related to:
- AI Elements: https://github.com/vercel/ai-sdk-elements/issues
- AI SDK: https://github.com/vercel/ai/issues
- Cloudflare: https://community.cloudflare.com/

---

Built with ❤️ using AI Elements and Cloudflare
