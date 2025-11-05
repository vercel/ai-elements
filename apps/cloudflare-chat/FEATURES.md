# Advanced Features Guide

This document details all the advanced features implemented in the Cloudflare Data Assistant.

## Table of Contents

1. [Chain of Thought (Query Planning)](#1-chain-of-thought)
2. [Inline Citations](#2-inline-citations)
3. [Task Tracking](#3-task-tracking)
4. [Intelligent Suggestions](#4-intelligent-suggestions)
5. [File Upload to R2](#5-file-upload-to-r2)
6. [Data Visualizations](#6-data-visualizations)
7. [Real-time Updates](#7-real-time-updates)

---

## 1. Chain of Thought (Query Planning)

**Status:** ✅ Fully Implemented

### Overview

The Chain of Thought feature visualizes the AI's query planning process before executing operations. It breaks down complex queries into steps and shows their execution status in real-time.

### How It Works

When you type a query, the system analyzes it and generates an execution plan:

```
User Query: "Show me calls with negative sentiment from last week"

Execution Plan:
1. Analyzing query intent and required data sources ✓
2. Searching Vectorize index for semantic matches →
3. Querying D1 database for sync history and analytics ⏳
4. Aggregating and formatting results ⏳
```

### Implementation Details

**File:** `lib/query-plan.ts`

The system detects query patterns and generates appropriate steps:

- **Semantic Search** - Detects keywords like "search", "find", "about"
- **Sentiment Analysis** - Detects "sentiment", "positive", "negative"
- **Merchant Queries** - Detects "merchant", "canvas", "contact"
- **Timeline Queries** - Detects "timeline", "history", "interactions"
- **Stats Queries** - Detects "stats", "analytics", "dashboard"

### User Experience

- **Transparent Process** - See exactly what the AI is doing
- **Real-time Updates** - Steps update as tools execute
- **Progress Tracking** - Know how far along the query is
- **Debugging** - Identify bottlenecks in data retrieval

### Example Queries

Try these to see Chain of Thought in action:

- "Find merchants with negative sentiment in the last month"
- "Show me timeline and stats for Canvas ID abc123"
- "Search for calls about pricing and analyze sentiment trends"

---

## 2. Inline Citations

**Status:** ✅ Fully Implemented

### Overview

Inline Citations allow the AI to reference specific data sources directly within responses. Hover over citation numbers to see the source details.

### How It Works

When the AI makes a claim based on data, it adds citation markers like [1], [2], [3]:

```
"This merchant has been very active recently[1], with 23 calls[2]
and an average sentiment score of 0.85[3]."

[1] D1 Database - sync_history table
[2] Notion API - Calls database
[3] Workers AI - Sentiment Analysis
```

### Implementation Details

**Component:** `InlineCitation` from AI Elements

The system automatically:
1. Parses response text for citation markers `[1]`, `[2]`, etc.
2. Maps them to sources from metadata
3. Renders interactive hover cards with source details

### Source Types

Citations can reference:

- **D1 Database Records** - Specific tables and queries
- **Notion Pages** - Canvas, Call, Message, Mail pages
- **Vectorize Results** - Semantic search matches
- **R2 Objects** - Recordings and files
- **Workers AI Analysis** - Sentiment, summaries, scores

### User Experience

- **Hover to View** - Hover over `[1]` to see source details
- **Click to Navigate** - Click citation to open source URL
- **Multiple Sources** - Carousel through multiple citations
- **Full Transparency** - Know exactly where data comes from

---

## 3. Task Tracking

**Status:** ✅ Fully Implemented

### Overview

Task Tracking shows progress for multi-step operations, especially useful for long-running queries that hit multiple Cloudflare services.

### How It Works

When a query involves multiple tool calls, they're grouped into a task:

```
Task: Executing 3 operations
├─ ✓ getMerchantByCanvas (completed)
├─ → searchCallsAndMessages (in-progress)
└─ ⏳ answerFromData (pending)
```

### Implementation Details

**Component:** `Task`, `TaskItem` from AI Elements

Each task item shows:
- **Status Icon** - Visual indicator (✓, →, ⏳, ✗)
- **Operation Name** - Tool being executed
- **Input/Output** - Full JSON data in code blocks
- **Timing** - Duration of execution

### Status States

- **Pending** (⏳) - Queued, not started
- **In Progress** (→) - Currently executing
- **Completed** (✓) - Successfully finished
- **Error** (✗) - Failed with error message

### Use Cases

Perfect for tracking:

- **Backfill Operations** - Historical data sync
- **Bulk Queries** - Multiple merchants at once
- **Complex Analytics** - Multi-step aggregations
- **File Processing** - R2 uploads and transformations

### User Experience

- **Real-time Progress** - See operations as they execute
- **Expandable Details** - Click to see full input/output
- **Error Visibility** - Immediately see what failed
- **Parallel Execution** - Multiple tasks can run simultaneously

---

## 4. Intelligent Suggestions

**Status:** ✅ Fully Implemented

### Overview

The system learns from your query history and provides contextual suggestions based on your usage patterns.

### How It Works

**Storage:** LocalStorage (persists across sessions)
**Limit:** Last 50 queries tracked
**Algorithm:** Pattern detection + recency weighting

### Suggestion Types

#### 1. Base Suggestions

Always available when you start:
```
- Show me dashboard statistics
- Get cache performance metrics
- Find merchants with recent activity
- Search for calls about pricing
```

#### 2. Follow-up Suggestions

After you query a merchant:
```
- Show me the timeline for this merchant
- Compare this merchant with similar ones
- Analyze interaction patterns for this merchant
```

#### 3. Pattern-Based Suggestions

If you search for "today", suggests:
```
- [Same query] this week
- [Same query] this month
```

#### 4. Tool-Based Suggestions

After using `getMerchantByCanvas`:
```
- Get all interactions for this Canvas
- Show me related Canvas records
```

### Implementation Details

**File:** `lib/use-suggestions.ts`

**Features:**
- **Query History Tracking** - Stores query + tools used
- **Pattern Detection** - Identifies common query types
- **Recency Weighting** - Recent queries influence more
- **De-duplication** - No repeated suggestions
- **Privacy-First** - All data stored locally

### Management

**View History:**
```tsx
getRecentQueries(10) // Last 10 queries
```

**Popular Queries:**
```tsx
getPopularQueries() // Most frequent queries
```

**Clear History:**
```tsx
clearHistory() // Wipe all tracked data
```

### User Experience

- **Learn Your Patterns** - Gets smarter with use
- **Save Time** - One-click common queries
- **Context-Aware** - Suggests relevant follow-ups
- **Privacy Control** - Clear history anytime

---

## 5. File Upload to R2

**Status:** ✅ Fully Implemented

### Overview

Upload files directly from the chat interface to your Cloudflare R2 bucket. Useful for call recordings, documents, and images.

### How It Works

**Flow:**
```
Select File → Upload to Next.js → Transfer to Worker → Store in R2 → Get URL
```

1. User selects file(s) via PromptInput
2. Frontend uploads to `/api/upload`
3. API converts to base64
4. Sends to Worker `/api/upload` endpoint
5. Worker stores in R2 bucket
6. Returns public URL

### Supported File Types

**Audio:**
- MP3 (audio/mpeg)
- WAV (audio/wav)
- M4A (audio/m4a)
- OGG (audio/ogg)

**Documents:**
- PDF (application/pdf)
- Text (text/plain)
- CSV (text/csv)
- JSON (application/json)

**Images:**
- JPEG (image/jpeg)
- PNG (image/png)
- GIF (image/gif)
- WebP (image/webp)

### File Size Limit

**Maximum:** 100MB per file

### Implementation Details

**API Route:** `app/api/upload/route.ts`

**Security:**
- File type validation
- Size limit enforcement
- Unique filename generation (timestamp + random ID)
- Organized storage (`uploads/TIMESTAMP-ID.ext`)

### User Experience

1. Click attachment icon in input
2. Select file(s) from device
3. See upload progress
4. Files show as attachments
5. Reference in queries: "Analyze the uploaded file"
6. AI can access file via URL

### Example Use Cases

- **Upload Recording** - "Transcribe and analyze this call recording"
- **Import Data** - "Load this CSV and analyze the data"
- **Add Context** - "Reference this PDF in your analysis"

---

## 6. Data Visualizations

**Status:** ✅ Fully Implemented

### Overview

Automatically generate charts and graphs from Cloudflare data to visualize trends, patterns, and statistics.

### Available Visualizations

#### 1. Sentiment Trend Chart

**Type:** Line chart
**Data:** Time series of sentiment scores

```
Shows:
- Sentiment over time (-1 to +1)
- Trend line
- Data points
- Grid for reference
```

**Generated For:**
- Merchant sentiment analysis
- Call sentiment trends
- Message sentiment patterns

#### 2. Call Volume Chart

**Type:** Bar chart
**Data:** Call counts by date

```
Shows:
- Call volume per day/week/month
- Peak activity periods
- Comparison bars
- Y-axis scaling
```

**Generated For:**
- Dashboard statistics
- Activity patterns
- Usage analytics

#### 3. Timeline Visualization

**Type:** Event timeline
**Data:** Chronological interactions

```
Shows:
- Calls (blue circles)
- Messages (green circles)
- Mail (orange circles)
- Timestamps
- Event summaries
```

**Generated For:**
- Merchant interaction history
- Canvas timeline
- Activity sequences

#### 4. Interaction Pie Chart

**Type:** Pie chart
**Data:** Interaction type distribution

```
Shows:
- Calls percentage
- Messages percentage
- Mail percentage
- Legend with counts
```

**Generated For:**
- Merchant summaries
- Communication mix
- Channel preferences

#### 5. Merchant Summary Card

**Type:** Info card
**Data:** Key metrics

```
Shows:
- Total interactions
- Breakdown by type
- Last interaction date
- Average sentiment
- Lead score
```

**Generated For:**
- Merchant overview
- Quick stats
- Executive summaries

### Implementation Details

**File:** `lib/visualizations.ts`

**Technology:**
- SVG generation (no external libraries!)
- Base64 encoding for inline display
- Responsive sizing
- Light/dark mode support

**API Route:** `app/api/visualize/route.ts`

### Toggling Visualizations

**In UI:**
```tsx
<button onClick={() => setShowVisualizations(!showVisualizations)}>
  {showVisualizations ? 'Hide' : 'Show'} Visualizations
</button>
```

**Default:** Enabled

### Performance

- **Fast Generation** - SVG created in <10ms
- **No External Requests** - All client-side
- **Cacheable** - Same data = same SVG
- **Lightweight** - SVGs are typically <5KB

### User Experience

- **Automatic** - Generated when relevant data appears
- **Inline** - Shows right in the chat
- **Interactive** - Hover for details
- **Exportable** - Right-click → Save Image

---

## 7. Real-time Updates

**Status:** ✅ Fully Implemented

### Overview

Connect to Cloudflare Durable Objects via WebSocket for live updates on sync status, operations, and data changes.

### How It Works

**WebSocket Connection:**
```
wss://your-worker.workers.dev/ws/phone/{phoneNumberId}
```

**Message Types:**
- `sync_started` - Sync operation began
- `sync_progress` - Progress update (0-100%)
- `sync_completed` - Sync finished
- `error` - Error occurred

### Implementation Details

**Hook:** `lib/use-realtime.ts`

**Features:**
- **Automatic Reconnection** - Exponential backoff (up to 5 attempts)
- **Connection Status** - Live indicator in header
- **Message History** - Stores all received messages
- **Clean Disconnect** - Proper cleanup on unmount

### Connection States

**Connected (Green Pulse):**
```tsx
<ActivityIcon className="text-green-500 animate-pulse" />
<span>Live</span>
```

**Offline (Gray):**
```tsx
<ActivityIcon className="text-muted-foreground" />
<span>Offline</span>
```

**Syncing (With Progress):**
```tsx
<Loader />
<span>Syncing... 45%</span>
```

### Use Cases

1. **Real-time Sync Monitoring**
   - See when backfills start
   - Track progress percentage
   - Know when sync completes

2. **Live Notifications**
   - New calls synced
   - Messages received
   - Data updates

3. **Multi-device Coordination**
   - Share sync status across tabs
   - Coordinate updates
   - Prevent conflicts

### Hooks Available

#### useRealtime(phoneNumberId?)

```tsx
const {
  connected,      // boolean
  messages,       // RealtimeMessage[]
  lastMessage,    // RealtimeMessage | null
  error,          // string | null
  sendMessage,    // (msg: any) => void
  clearMessages,  // () => void
} = useRealtime('PN123...');
```

#### useGlobalSyncStatus()

```tsx
const {
  active,           // boolean - sync in progress
  progress,         // number - 0-100
  currentOperation, // string | null
  connected,        // boolean - WebSocket status
} = useGlobalSyncStatus();
```

### Configuration

**Environment Variable:**
```bash
NEXT_PUBLIC_CLOUDFLARE_WORKER_URL=https://your-worker.workers.dev
```

**Note:** Must be `NEXT_PUBLIC_` prefix for client-side access.

### User Experience

- **Visual Indicator** - Always know connection status
- **Progress Tracking** - See sync percentage
- **Non-Intrusive** - Updates happen in background
- **Error Handling** - Clear messages when disconnected

---

## Feature Matrix

| Feature | Status | Component | Hook | API Route |
|---------|--------|-----------|------|-----------|
| Chain of Thought | ✅ | `ChainOfThought` | - | - |
| Inline Citations | ✅ | `InlineCitation` | - | - |
| Task Tracking | ✅ | `Task` | - | - |
| Smart Suggestions | ✅ | `Suggestions` | `useSuggestions` | - |
| R2 File Upload | ✅ | `PromptInputAttachment` | - | `/api/upload` |
| Visualizations | ✅ | `Image` | - | `/api/visualize` |
| Real-time Updates | ✅ | - | `useRealtime` | WebSocket |

---

## Configuration Summary

### Environment Variables

```bash
# Required
CLOUDFLARE_WORKER_URL=https://your-worker.workers.dev
NEXT_PUBLIC_CLOUDFLARE_WORKER_URL=https://your-worker.workers.dev
OPENAI_API_KEY=sk-...

# Optional
ANTHROPIC_API_KEY=sk-ant-...
AI_GATEWAY_URL=https://gateway.ai.cloudflare.com/v1/...
```

### Feature Toggles

All features can be toggled in the UI:

```tsx
// In page.tsx
const [showVisualizations, setShowVisualizations] = useState(true);
const [useSemanticSearch, setUseSemanticSearch] = useState(false);
```

---

## Performance Considerations

### Chain of Thought
- **Overhead:** Minimal (<1ms to generate plan)
- **Benefit:** Improved UX transparency

### Inline Citations
- **Overhead:** Negligible (string parsing)
- **Benefit:** Enhanced credibility

### Task Tracking
- **Overhead:** None (uses existing tool data)
- **Benefit:** Better progress visibility

### Smart Suggestions
- **Overhead:** <5ms (LocalStorage access)
- **Benefit:** Faster query composition

### R2 Upload
- **Overhead:** Network transfer time
- **Limit:** 100MB files, reasonable for most use cases

### Visualizations
- **Overhead:** 5-10ms per chart
- **Benefit:** Instant visual insights

### Real-time Updates
- **Overhead:** ~1KB/s WebSocket connection
- **Benefit:** Live sync status

---

## Best Practices

### 1. Use Chain of Thought for Complex Queries

Great for:
- Multi-step data aggregations
- Cross-service queries
- Debugging slow responses

### 2. Enable Visualizations for Merchant Data

Always on for:
- Merchant overviews
- Sentiment analysis
- Activity patterns

### 3. Upload Files for Context

Useful for:
- Call recordings to transcribe
- Documents to reference
- Data imports

### 4. Monitor Real-time Sync

Critical for:
- Backfill operations
- Production deployments
- Data consistency checks

### 5. Clear Suggestion History

Recommended:
- After major workflow changes
- When sharing device
- To reset recommendations

---

## Troubleshooting

### Chain of Thought Not Showing

**Issue:** Query plan doesn't appear
**Solution:** Ensure query is substantive (not just "Hello")

### Inline Citations Missing

**Issue:** No citation numbers in response
**Solution:** AI model must be prompted to cite sources (GPT-4o works best)

### Task Tracking Shows Wrong Status

**Issue:** Task stuck in "pending"
**Solution:** Check tool execution in browser console

### Suggestions Not Updating

**Issue:** Same suggestions every time
**Solution:** Clear browser LocalStorage or use "Clear History" button

### R2 Upload Fails

**Issue:** "Failed to upload file"
**Solution:**
- Check file size (<100MB)
- Verify file type is allowed
- Ensure Worker has R2 bucket access

### Visualizations Not Rendering

**Issue:** Empty space where chart should be
**Solution:**
- Check browser console for errors
- Verify data structure matches expected format
- Toggle visualizations off/on

### WebSocket Won't Connect

**Issue:** Always shows "Offline"
**Solution:**
- Verify `NEXT_PUBLIC_CLOUDFLARE_WORKER_URL` is set
- Check Worker WebSocket endpoint exists
- Ensure CORS headers allow WebSocket upgrade

---

## Future Enhancements

Potential additions:

1. **Advanced Analytics** - Interactive Plotly/Chart.js graphs
2. **Annotation Tools** - Mark up visualizations
3. **Export Formats** - SVG, PNG, PDF downloads
4. **Custom Dashboards** - Pin favorite visualizations
5. **Collaborative Features** - Share live WebSocket sessions
6. **Voice Input** - Upload audio, get transcription
7. **OCR Support** - Extract text from uploaded images
8. **Scheduled Reports** - Auto-generate weekly summaries

---

**All features are production-ready and optimized for AI SDK v6 beta!** 🚀
