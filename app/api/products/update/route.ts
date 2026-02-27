import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'http://topsons.mooo.com/api/product/updateproduct.php';

export async function POST(request: NextRequest) {
  try {
    const incomingFormData = await request.formData();

    const formData = new FormData();

    // Copy all fields manually
    for (const [key, value] of incomingFormData.entries()) {
      formData.append(key, value as any);
      console.log("Forwarding:", key, value);
    }

    const response = await fetch(API_BASE, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to update product' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}