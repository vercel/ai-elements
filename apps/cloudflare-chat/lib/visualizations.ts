/**
 * Data visualization utilities for Cloudflare data
 * Generates charts and graphs as base64-encoded images
 */

import type { MerchantData, TimelineEntry } from './types';

/**
 * Generate a sentiment trend chart
 */
export function generateSentimentChart(
  data: { date: string; sentiment: number }[],
  width = 800,
  height = 400
): string {
  const padding = 60;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Find min/max values
  const sentiments = data.map((d) => d.sentiment);
  const minSentiment = Math.min(...sentiments, 0);
  const maxSentiment = Math.max(...sentiments, 1);

  // Generate path for line chart
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const y =
      padding +
      chartHeight -
      ((d.sentiment - minSentiment) / (maxSentiment - minSentiment)) *
        chartHeight;
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(' L ')}`;

  // Generate area under the curve
  const areaData = `${pathData} L ${padding + chartWidth},${padding + chartHeight} L ${padding},${padding + chartHeight} Z`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <style>
        .title { font: bold 16px sans-serif; fill: #1f2937; }
        .axis { stroke: #9ca3af; stroke-width: 1; }
        .label { font: 12px sans-serif; fill: #6b7280; }
        .line { stroke: #3b82f6; stroke-width: 2; fill: none; }
        .area { fill: #3b82f6; opacity: 0.1; }
        .grid { stroke: #e5e7eb; stroke-width: 1; }
        .point { fill: #3b82f6; }
      </style>

      <!-- Title -->
      <text x="${width / 2}" y="30" class="title" text-anchor="middle">Sentiment Trend Over Time</text>

      <!-- Grid lines -->
      ${Array.from({ length: 5 }, (_, i) => {
        const y = padding + (i * chartHeight) / 4;
        return `<line x1="${padding}" y1="${y}" x2="${padding + chartWidth}" y2="${y}" class="grid"/>`;
      }).join('')}

      <!-- Axes -->
      <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${padding + chartHeight}" class="axis"/>
      <line x1="${padding}" y1="${padding + chartHeight}" x2="${padding + chartWidth}" y2="${padding + chartHeight}" class="axis"/>

      <!-- Y-axis labels -->
      ${Array.from({ length: 5 }, (_, i) => {
        const value = minSentiment + ((maxSentiment - minSentiment) * (4 - i)) / 4;
        const y = padding + (i * chartHeight) / 4;
        return `<text x="${padding - 10}" y="${y + 5}" class="label" text-anchor="end">${value.toFixed(2)}</text>`;
      }).join('')}

      <!-- Area under curve -->
      <path d="${areaData}" class="area"/>

      <!-- Line -->
      <path d="${pathData}" class="line"/>

      <!-- Data points -->
      ${data
        .map((d, i) => {
          const x = padding + (i / (data.length - 1)) * chartWidth;
          const y =
            padding +
            chartHeight -
            ((d.sentiment - minSentiment) / (maxSentiment - minSentiment)) *
              chartHeight;
          return `<circle cx="${x}" cy="${y}" r="4" class="point"/>`;
        })
        .join('')}

      <!-- X-axis labels -->
      ${data
        .filter((_, i) => i % Math.ceil(data.length / 6) === 0)
        .map((d, i) => {
          const x = padding + (i * Math.ceil(data.length / 6) / (data.length - 1)) * chartWidth;
          return `<text x="${x}" y="${padding + chartHeight + 20}" class="label" text-anchor="middle">${new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</text>`;
        })
        .join('')}
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Generate a call volume bar chart
 */
export function generateCallVolumeChart(
  data: { date: string; count: number }[],
  width = 800,
  height = 400
): string {
  const padding = 60;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxCount = Math.max(...data.map((d) => d.count));
  const barWidth = chartWidth / data.length - 4;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <style>
        .title { font: bold 16px sans-serif; fill: #1f2937; }
        .axis { stroke: #9ca3af; stroke-width: 1; }
        .label { font: 12px sans-serif; fill: #6b7280; }
        .bar { fill: #10b981; }
        .grid { stroke: #e5e7eb; stroke-width: 1; }
      </style>

      <!-- Title -->
      <text x="${width / 2}" y="30" class="title" text-anchor="middle">Call Volume Over Time</text>

      <!-- Grid lines -->
      ${Array.from({ length: 5 }, (_, i) => {
        const y = padding + (i * chartHeight) / 4;
        return `<line x1="${padding}" y1="${y}" x2="${padding + chartWidth}" y2="${y}" class="grid"/>`;
      }).join('')}

      <!-- Axes -->
      <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${padding + chartHeight}" class="axis"/>
      <line x1="${padding}" y1="${padding + chartHeight}" x2="${padding + chartWidth}" y2="${padding + chartHeight}" class="axis"/>

      <!-- Y-axis labels -->
      ${Array.from({ length: 5 }, (_, i) => {
        const value = (maxCount * (4 - i)) / 4;
        const y = padding + (i * chartHeight) / 4;
        return `<text x="${padding - 10}" y="${y + 5}" class="label" text-anchor="end">${Math.round(value)}</text>`;
      }).join('')}

      <!-- Bars -->
      ${data
        .map((d, i) => {
          const x = padding + i * (chartWidth / data.length) + 2;
          const barHeight = (d.count / maxCount) * chartHeight;
          const y = padding + chartHeight - barHeight;
          return `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" class="bar"/>`;
        })
        .join('')}

      <!-- X-axis labels -->
      ${data
        .filter((_, i) => i % Math.ceil(data.length / 6) === 0)
        .map((d, i) => {
          const x = padding + i * Math.ceil(data.length / 6) * (chartWidth / data.length) + barWidth / 2;
          return `<text x="${x}" y="${padding + chartHeight + 20}" class="label" text-anchor="middle">${new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</text>`;
        })
        .join('')}
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Generate a merchant interaction timeline visualization
 */
export function generateTimelineVisualization(
  timeline: TimelineEntry[],
  width = 800,
  height = 600
): string {
  const padding = 40;
  const timelineHeight = height - padding * 2;
  const rowHeight = Math.min(60, timelineHeight / timeline.length);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <style>
        .title { font: bold 16px sans-serif; fill: #1f2937; }
        .timeline-line { stroke: #d1d5db; stroke-width: 2; }
        .event-circle { stroke-width: 2; }
        .call { fill: #3b82f6; stroke: #2563eb; }
        .message { fill: #10b981; stroke: #059669; }
        .mail { fill: #f59e0b; stroke: #d97706; }
        .event-text { font: 12px sans-serif; fill: #374151; }
        .timestamp { font: 10px sans-serif; fill: #6b7280; }
      </style>

      <!-- Title -->
      <text x="${width / 2}" y="25" class="title" text-anchor="middle">Interaction Timeline</text>

      <!-- Timeline line -->
      <line x1="100" y1="${padding}" x2="100" y2="${height - padding}" class="timeline-line"/>

      <!-- Events -->
      ${timeline
        .map((event, i) => {
          const y = padding + i * rowHeight + rowHeight / 2;
          const circleClass = event.type;
          const date = new Date(event.timestamp);

          return `
            <g>
              <circle cx="100" cy="${y}" r="8" class="event-circle ${circleClass}"/>
              <text x="120" y="${y - 5}" class="event-text">${event.summary.substring(0, 50)}${event.summary.length > 50 ? '...' : ''}</text>
              <text x="120" y="${y + 10}" class="timestamp">${date.toLocaleDateString()} ${date.toLocaleTimeString()}</text>
            </g>
          `;
        })
        .join('')}

      <!-- Legend -->
      <g transform="translate(${width - 150}, ${height - 80})">
        <circle cx="10" cy="10" r="6" class="event-circle call"/>
        <text x="25" y="15" class="event-text">Call</text>

        <circle cx="10" cy="35" r="6" class="event-circle message"/>
        <text x="25" y="40" class="event-text">Message</text>

        <circle cx="10" cy="60" r="6" class="event-circle mail"/>
        <text x="25" y="65" class="event-text">Mail</text>
      </g>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Generate a pie chart for interaction types
 */
export function generateInteractionPieChart(
  stats: { calls: number; messages: number; mail: number },
  width = 400,
  height = 400
): string {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 40;

  const total = stats.calls + stats.messages + stats.mail;
  const callsAngle = (stats.calls / total) * 360;
  const messagesAngle = (stats.messages / total) * 360;
  const mailAngle = (stats.mail / total) * 360;

  const createArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${centerX} ${centerY} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
  };

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <style>
        .title { font: bold 16px sans-serif; fill: #1f2937; }
        .calls-slice { fill: #3b82f6; }
        .messages-slice { fill: #10b981; }
        .mail-slice { fill: #f59e0b; }
        .label { font: 12px sans-serif; fill: #1f2937; }
        .percentage { font: bold 14px sans-serif; fill: white; }
      </style>

      <!-- Title -->
      <text x="${width / 2}" y="25" class="title" text-anchor="middle">Interaction Distribution</text>

      <!-- Pie slices -->
      <path d="${createArc(0, callsAngle)}" class="calls-slice"/>
      <path d="${createArc(callsAngle, callsAngle + messagesAngle)}" class="messages-slice"/>
      <path d="${createArc(callsAngle + messagesAngle, 360)}" class="mail-slice"/>

      <!-- Percentages -->
      <text x="${centerX}" y="${centerY - 60}" class="percentage" text-anchor="middle">${Math.round((stats.calls / total) * 100)}%</text>
      <text x="${centerX + 60}" y="${centerY + 30}" class="percentage" text-anchor="middle">${Math.round((stats.messages / total) * 100)}%</text>
      <text x="${centerX - 60}" y="${centerY + 30}" class="percentage" text-anchor="middle">${Math.round((stats.mail / total) * 100)}%</text>

      <!-- Legend -->
      <g transform="translate(20, ${height - 80})">
        <rect x="0" y="0" width="15" height="15" class="calls-slice"/>
        <text x="20" y="12" class="label">Calls (${stats.calls})</text>

        <rect x="0" y="25" width="15" height="15" class="messages-slice"/>
        <text x="20" y="37" class="label">Messages (${stats.messages})</text>

        <rect x="0" y="50" width="15" height="15" class="mail-slice"/>
        <text x="20" y="62" class="label">Mail (${stats.mail})</text>
      </g>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// Helper function
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

/**
 * Generate a merchant summary card with key metrics
 */
export function generateMerchantSummaryCard(
  merchantData: MerchantData,
  width = 600,
  height = 300
): string {
  const stats = merchantData.stats;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <style>
        .card { fill: #f9fafb; stroke: #e5e7eb; stroke-width: 2; }
        .title { font: bold 20px sans-serif; fill: #1f2937; }
        .subtitle { font: 14px sans-serif; fill: #6b7280; }
        .metric-label { font: 12px sans-serif; fill: #6b7280; }
        .metric-value { font: bold 24px sans-serif; fill: #1f2937; }
        .positive { fill: #10b981; }
        .neutral { fill: #f59e0b; }
        .negative { fill: #ef4444; }
      </style>

      <!-- Card background -->
      <rect x="0" y="0" width="${width}" height="${height}" class="card" rx="8"/>

      <!-- Header -->
      <text x="30" y="40" class="title">${merchantData.canvas.properties.Name?.title[0]?.plain_text || 'Merchant'}</text>
      <text x="30" y="65" class="subtitle">Canvas ID: ${merchantData.canvasId.substring(0, 8)}...</text>

      <!-- Metrics Grid -->
      <g transform="translate(30, 100)">
        <!-- Total Interactions -->
        <text x="0" y="0" class="metric-label">Total Interactions</text>
        <text x="0" y="30" class="metric-value">${stats.totalInteractions}</text>

        <!-- Calls -->
        <text x="150" y="0" class="metric-label">Calls</text>
        <text x="150" y="30" class="metric-value">${stats.totalCalls}</text>

        <!-- Messages -->
        <text x="300" y="0" class="metric-label">Messages</text>
        <text x="300" y="30" class="metric-value">${stats.totalMessages}</text>

        <!-- Mail -->
        <text x="450" y="0" class="metric-label">Mail</text>
        <text x="450" y="30" class="metric-value">${stats.totalMail}</text>
      </g>

      <g transform="translate(30, 180)">
        <!-- Avg Sentiment -->
        ${
          stats.avgSentiment
            ? `
        <text x="0" y="0" class="metric-label">Avg Sentiment</text>
        <text x="0" y="30" class="metric-value ${stats.avgSentiment === 'positive' ? 'positive' : stats.avgSentiment === 'negative' ? 'negative' : 'neutral'}">${stats.avgSentiment}</text>
        `
            : ''
        }

        <!-- Last Interaction -->
        <text x="200" y="0" class="metric-label">Last Interaction</text>
        <text x="200" y="30" class="subtitle">${new Date(stats.lastInteraction).toLocaleDateString()}</text>
      </g>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
