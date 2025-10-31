/**
 * File Upload API Route
 * Handles file uploads to Cloudflare R2 bucket
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 60;

const CLOUDFLARE_WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || '';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 100MB.' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'audio/mpeg',
      'audio/wav',
      'audio/mp3',
      'audio/m4a',
      'audio/ogg',
      'application/pdf',
      'text/plain',
      'text/csv',
      'application/json',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: `File type ${file.type} not allowed. Supported types: audio, PDF, text, CSV, JSON, images.`,
        },
        { status: 400 }
      );
    }

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const filename = `uploads/${timestamp}-${randomId}.${extension}`;

    // Upload to Cloudflare Worker endpoint
    const uploadResponse = await fetch(
      `${CLOUDFLARE_WORKER_URL}/api/upload`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          contentType: file.type,
          data: Buffer.from(arrayBuffer).toString('base64'),
        }),
      }
    );

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.error('R2 upload failed:', error);
      return NextResponse.json(
        { error: 'Failed to upload file to R2' },
        { status: 500 }
      );
    }

    const result = await uploadResponse.json();

    return NextResponse.json({
      success: true,
      filename,
      url: result.url,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to upload file',
      },
      { status: 500 }
    );
  }
}
