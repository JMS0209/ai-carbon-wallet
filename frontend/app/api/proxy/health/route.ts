import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Backend server error',
          error: `HTTP ${response.status}` 
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    // Return 503 when backend is not available
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Backend not configured or server not running',
        error: 'Connection failed'
      },
      { status: 503 }
    );
  }
}
