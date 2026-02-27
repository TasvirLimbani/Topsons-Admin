import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ unwrap params (same as your working file)
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      'http://topsons.mooo.com/api/order/getuserorders.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // SAME as your working route
        },
        body: JSON.stringify({
          user_id: Number(id),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || data.status === false) {
      return NextResponse.json(
        { error: data.message || 'Failed to fetch user orders' },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error while fetching user orders' },
      { status: 500 }
    );
  }
}