import { NextRequest, NextResponse } from 'next/server';
import { publicApi } from '@/lib/api-backend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, email, message, organization, phone, service } = body;
    
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Forward to backend contact API
    const result = await publicApi.submitContact(body);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
} 