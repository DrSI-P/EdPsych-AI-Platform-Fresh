import { NextRequest, NextResponse } from 'next/server';

// Minimal implementation that just returns a static response
export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'Blog generation API is disabled for now',
  });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({
    message: 'Blog generation API is disabled for now',
  });
}
