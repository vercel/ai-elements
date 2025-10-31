/**
 * Chat API Route - AI SDK Streaming Endpoint
 * Handles chat messages with Cloudflare tool integration
 */

import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { cloudflareTools } from '@/lib/cloudflare-tools';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, model = 'gpt-4o' } = await req.json();

    // Select the AI model based on user preference
    let selectedModel;
    if (model.startsWith('gpt-') || model.startsWith('o1-')) {
      selectedModel = openai(model);
    } else if (model.startsWith('claude-')) {
      selectedModel = anthropic(model);
    } else {
      // Default to GPT-4o
      selectedModel = openai('gpt-4o');
    }

    // Stream the response with tools enabled
    const result = streamText({
      model: selectedModel,
      messages,
      tools: cloudflareTools,
      maxSteps: 5, // Allow multi-step tool usage
      system: `You are an AI assistant that helps users query and analyze data from a Cloudflare-based system.

Available Data Sources:
- Calls: Phone call records with recordings, transcripts, and AI analysis
- Messages: SMS/text message records
- Mail: Email records
- Canvas: Merchant/contact records in Notion
- D1 Database: Relational data with sync history and analytics
- Vectorize: Semantic search over calls and messages
- R2 Storage: Call recordings and audio files

Your Capabilities:
1. Retrieve merchant data by Canvas ID, phone number, or email
2. Search for merchants by name or query
3. Perform semantic search over calls and messages
4. Answer questions using RAG (Retrieval-Augmented Generation)
5. Provide statistics and analytics

Best Practices:
- When users ask about a merchant, use getMerchantByPhone or getMerchantByEmail if they provide contact info
- For general questions, use searchCallsAndMessages or answerFromData
- Always cite your sources and show which tools you used
- Format data clearly with tables or lists when appropriate
- Explain the reasoning behind your queries

Be helpful, accurate, and transparent about your data sources.`,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred while processing your request.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
