import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward to backend
    const response = await fetch(`${BACKEND_URL}/api/energy/sample`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    // If backend is not available, return a mock response for development
    if (process.env.NODE_ENV === 'development') {
      const mockBody = await request.json().catch(() => ({}));
      return NextResponse.json({
        success: true,
        data: {
          jobId: mockBody?.jobId || 'mock-job-123',
          kwh: mockBody?.kwh || 0.5,
          co2eq: mockBody?.co2eq || 0.2,
          timestamp: Date.now(),
        },
        message: 'Mock response (backend unavailable)',
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
