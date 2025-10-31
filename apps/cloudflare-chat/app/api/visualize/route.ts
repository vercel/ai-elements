/**
 * Visualization API Route
 * Generates data visualizations from Cloudflare data
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  generateSentimentChart,
  generateCallVolumeChart,
  generateTimelineVisualization,
  generateInteractionPieChart,
  generateMerchantSummaryCard,
} from '@/lib/visualizations';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();

    let imageData: string;

    switch (type) {
      case 'sentiment-trend':
        imageData = generateSentimentChart(data);
        break;

      case 'call-volume':
        imageData = generateCallVolumeChart(data);
        break;

      case 'timeline':
        imageData = generateTimelineVisualization(data);
        break;

      case 'interaction-pie':
        imageData = generateInteractionPieChart(data);
        break;

      case 'merchant-summary':
        imageData = generateMerchantSummaryCard(data);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid visualization type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      type,
      imageData,
    });
  } catch (error) {
    console.error('Visualization error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate visualization',
      },
      { status: 500 }
    );
  }
}
