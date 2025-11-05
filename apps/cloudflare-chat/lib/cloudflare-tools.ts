/**
 * AI SDK Tool Definitions for Cloudflare OpenPhone-Notion Integration
 * Compatible with AI SDK v6 Beta
 */

import { tool } from 'ai';
import { z } from 'zod';
import type {
  MerchantData,
  SearchResponse,
  RAGSearchResponse,
} from './types';

// Base URL for Cloudflare Worker - configure via environment variable
const CLOUDFLARE_WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || '';

/**
 * Helper function to make API calls to Cloudflare Worker
 */
async function callCloudflareAPI<T>(
  endpoint: string,
  body?: Record<string, any>
): Promise<T> {
  const url = `${CLOUDFLARE_WORKER_URL}${endpoint}`;

  const response = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(
      `Cloudflare API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

// ============================================================================
// Merchant Retrieval Tools
// ============================================================================

/**
 * Get all merchant data (calls, messages, mail, timeline) by Canvas ID
 */
export const getMerchantByCanvas = tool({
  description: `
    Get comprehensive merchant data from Cloudflare by Canvas ID (Notion page ID).
    Returns all calls, messages, mail, timeline, and statistics for a specific merchant.
    Use this when you have a Canvas ID and want to see all interactions with that merchant.
  `,
  parameters: z.object({
    canvasId: z
      .string()
      .describe('The Notion Canvas page ID (e.g., "abc123-def456-...")'),
  }),
  execute: async ({ canvasId }) => {
    return callCloudflareAPI<MerchantData>('/api/merchant/canvas', {
      canvasId,
    });
  },
});

/**
 * Get merchant data by phone number
 */
export const getMerchantByPhone = tool({
  description: `
    Get merchant data from Cloudflare by phone number.
    Searches the Canvas database for a matching phone number and returns all related data.
    Use this when you have a phone number and want to find the associated merchant.
  `,
  parameters: z.object({
    phoneNumber: z
      .string()
      .describe('Phone number in E.164 format (e.g., "+13365185544")'),
  }),
  execute: async ({ phoneNumber }) => {
    return callCloudflareAPI<MerchantData>('/api/merchant/phone', {
      phoneNumber,
    });
  },
});

/**
 * Get merchant data by email address
 */
export const getMerchantByEmail = tool({
  description: `
    Get merchant data from Cloudflare by email address.
    Searches the Canvas database for a matching email and returns all related data.
    Use this when you have an email address and want to find the associated merchant.
  `,
  parameters: z.object({
    email: z
      .string()
      .email()
      .describe('Email address (e.g., "john@example.com")'),
  }),
  execute: async ({ email }) => {
    return callCloudflareAPI<MerchantData>('/api/merchant/email', {
      email,
    });
  },
});

/**
 * Search for merchants by query
 */
export const searchMerchants = tool({
  description: `
    Search for merchants in the Cloudflare Canvas database.
    Performs a text search across merchant names, phones, and emails.
    Returns matching merchants with their basic information.
  `,
  parameters: z.object({
    query: z
      .string()
      .describe('Search query (name, phone, email, or any text)'),
    limit: z
      .number()
      .optional()
      .describe('Maximum number of results to return (default: 10)'),
  }),
  execute: async ({ query, limit = 10 }) => {
    return callCloudflareAPI('/api/merchant/search', {
      query,
      limit,
    });
  },
});

// ============================================================================
// Semantic Search Tools
// ============================================================================

/**
 * Semantic search using Vectorize
 */
export const searchCallsAndMessages = tool({
  description: `
    Perform semantic search over all calls and messages using Cloudflare Vectorize.
    Uses AI embeddings to find semantically similar content, not just keyword matching.
    Great for finding calls about specific topics, sentiments, or contexts.

    Examples:
    - "calls about pricing negotiations"
    - "messages with negative sentiment"
    - "conversations mentioning contract renewal"
  `,
  parameters: z.object({
    query: z
      .string()
      .describe(
        'Natural language search query describing what you want to find'
      ),
    limit: z
      .number()
      .optional()
      .describe('Maximum number of results (default: 10)'),
  }),
  execute: async ({ query, limit = 10 }) => {
    return callCloudflareAPI<SearchResponse>('/api/search', {
      query,
      limit,
    });
  },
});

/**
 * RAG-based search with AI-generated answers
 */
export const answerFromData = tool({
  description: `
    Ask questions about the data and get AI-generated answers using RAG (Retrieval-Augmented Generation).
    Searches the Cloudflare Vectorize index and uses Workers AI to generate answers based on the data.

    Examples:
    - "What are the main concerns from recent calls?"
    - "How many high-value leads did we get this week?"
    - "What pricing questions came up in conversations?"
  `,
  parameters: z.object({
    question: z
      .string()
      .describe('Question to answer using the data in Cloudflare'),
  }),
  execute: async ({ question }) => {
    return callCloudflareAPI<RAGSearchResponse>('/api/search/rag', {
      query: question,
    });
  },
});

// ============================================================================
// Statistics & Analytics Tools
// ============================================================================

/**
 * Get dashboard statistics
 */
export const getDashboardStats = tool({
  description: `
    Get overall statistics from the Cloudflare D1 database.
    Returns total counts, sync status, performance metrics, and recent activity.
  `,
  parameters: z.object({}),
  execute: async () => {
    return callCloudflareAPI('/api/stats');
  },
});

/**
 * Get cache statistics
 */
export const getCacheStats = tool({
  description: `
    Get caching statistics from Cloudflare KV and Cache API.
    Shows cache hit rates, size, and performance metrics.
  `,
  parameters: z.object({}),
  execute: async () => {
    return callCloudflareAPI('/api/cache');
  },
});

// ============================================================================
// Export all tools
// ============================================================================

export const cloudflareTools = {
  getMerchantByCanvas,
  getMerchantByPhone,
  getMerchantByEmail,
  searchMerchants,
  searchCallsAndMessages,
  answerFromData,
  getDashboardStats,
  getCacheStats,
};

export type CloudflareToolName = keyof typeof cloudflareTools;
