/**
 * TypeScript types for Cloudflare OpenPhone-Notion integration
 * Based on the data structures from the Cloudflare Worker
 */

// ============================================================================
// Merchant Data Types
// ============================================================================

export interface MerchantData {
  canvasId: string;
  canvas: NotionCanvasPage;
  calls: NotionCallPage[];
  messages: NotionMessagePage[];
  mail: NotionMailPage[];
  timeline: TimelineEntry[];
  stats: MerchantStats;
}

export interface MerchantStats {
  totalCalls: number;
  totalMessages: number;
  totalMail: number;
  totalInteractions: number;
  firstInteraction: string; // ISO date
  lastInteraction: string; // ISO date
  avgSentiment?: string;
  avgLeadScore?: number;
}

export interface TimelineEntry {
  type: 'call' | 'message' | 'mail';
  id: string;
  timestamp: string; // ISO date
  summary: string;
  direction?: 'incoming' | 'outgoing';
  sentiment?: string;
  notionPageId: string;
}

// ============================================================================
// Notion Page Types (Simplified)
// ============================================================================

export interface NotionCanvasPage {
  id: string;
  properties: {
    Name?: { title: Array<{ plain_text: string }> };
    Phone?: { rich_text: Array<{ plain_text: string }> };
    Email?: { rich_text: Array<{ plain_text: string }> };
    Address?: { rich_text: Array<{ plain_text: string }> };
    [key: string]: any;
  };
  url: string;
  created_time: string;
  last_edited_time: string;
}

export interface NotionCallPage {
  id: string;
  properties: {
    'Call ID'?: { title: Array<{ plain_text: string }> };
    Direction?: { select: { name: string } | null };
    Status?: { select: { name: string } | null };
    Duration?: { number: number | null };
    Participants?: { rich_text: Array<{ plain_text: string }> };
    'Created At'?: { date: { start: string } | null };
    'Has Recording'?: { checkbox: boolean };
    'Recording URL'?: { url: string | null };
    'Has Transcript'?: { checkbox: boolean };
    Transcript?: { rich_text: Array<{ plain_text: string }> };
    'Has Summary'?: { checkbox: boolean };
    Summary?: { rich_text: Array<{ plain_text: string }> };
    'Next Steps'?: { rich_text: Array<{ plain_text: string }> };
    Sentiment?: { select: { name: string } | null };
    'Lead Score'?: { number: number | null };
    Canvas?: { relation: Array<{ id: string }> };
    [key: string]: any;
  };
  url: string;
  created_time: string;
  last_edited_time: string;
}

export interface NotionMessagePage {
  id: string;
  properties: {
    'Message ID'?: { title: Array<{ plain_text: string }> };
    Direction?: { select: { name: string } | null };
    From?: { rich_text: Array<{ plain_text: string }> };
    To?: { rich_text: Array<{ plain_text: string }> };
    Content?: { rich_text: Array<{ plain_text: string }> };
    Status?: { select: { name: string } | null };
    'Created At'?: { date: { start: string } | null };
    Canvas?: { relation: Array<{ id: string }> };
    [key: string]: any;
  };
  url: string;
  created_time: string;
  last_edited_time: string;
}

export interface NotionMailPage {
  id: string;
  properties: {
    'Mail ID'?: { title: Array<{ plain_text: string }> };
    Subject?: { rich_text: Array<{ plain_text: string }> };
    From?: { rich_text: Array<{ plain_text: string }> };
    To?: { rich_text: Array<{ plain_text: string }> };
    'Created At'?: { date: { start: string } | null };
    Canvas?: { relation: Array<{ id: string }> };
    [key: string]: any;
  };
  url: string;
  created_time: string;
  last_edited_time: string;
}

// ============================================================================
// Semantic Search Types
// ============================================================================

export interface VectorSearchResult {
  id: string;
  score: number;
  metadata: {
    phoneNumber?: string;
    timestamp: string;
    notionPageId?: string;
    type: 'call' | 'message';
    direction?: string;
  };
}

export interface SearchResponse {
  results: VectorSearchResult[];
  cached: boolean;
}

export interface RAGSearchResponse {
  answer: string;
  sources: VectorSearchResult[];
  originalQuery: string;
  rewrittenQuery?: string;
  cached: boolean;
}

// ============================================================================
// D1 Database Types
// ============================================================================

export interface SyncHistoryRecord {
  id: number;
  phone_number_id: string;
  resource_type: 'call' | 'message' | 'mail';
  resource_id: string;
  notion_page_id: string;
  canvas_id: string | null;
  sync_status: 'success' | 'failed' | 'skipped';
  processing_time_ms: number;
  synced_at: number; // Unix timestamp
}

export interface PhoneNumberRecord {
  id: string;
  number: string; // E.164 format
  name: string | null;
  first_seen_at: number;
  last_call_sync_at: number | null;
  last_message_sync_at: number | null;
  total_calls_synced: number;
  total_messages_synced: number;
  is_active: number; // 1 or 0
}

export interface CanvasCacheRecord {
  lookup_key: string;
  lookup_type: 'phone' | 'email';
  canvas_id: string;
  canvas_name: string | null;
  cached_at: number;
  last_used_at: number;
  hit_count: number;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface GetMerchantByCanvasRequest {
  canvasId: string;
}

export interface GetMerchantByPhoneRequest {
  phoneNumber: string;
}

export interface GetMerchantByEmailRequest {
  email: string;
}

export interface SearchMerchantsRequest {
  query: string;
  limit?: number;
}

export interface SemanticSearchRequest {
  query: string;
  limit?: number;
}

export interface RAGSearchRequest {
  query: string;
}

// ============================================================================
// AI Analysis Types
// ============================================================================

export interface CallAnalysis {
  sentiment: {
    label: 'positive' | 'negative' | 'neutral';
    score: number; // 0-1 confidence
  };
  summary: string;
  actionItems: string[];
  category: string;
  leadScore?: number;
  keywords: string[];
}

// ============================================================================
// Chat UI Types
// ============================================================================

export interface Source {
  title: string;
  url: string;
  type: 'call' | 'message' | 'mail' | 'canvas' | 'd1' | 'vectorize';
  description?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources?: Source[];
  reasoning?: string;
  reasoningDuration?: number;
  toolInvocations?: ToolInvocation[];
  timestamp: Date;
}

export interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  args: Record<string, any>;
  result?: any;
  state: 'pending' | 'running' | 'completed' | 'error';
  error?: string;
}

// ============================================================================
// Cloudflare Worker Configuration
// ============================================================================

export interface CloudflareWorkerConfig {
  baseUrl: string;
  apiKey?: string;
}
