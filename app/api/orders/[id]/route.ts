import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ unwrap params
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      'http://topsons.mooo.com/api/order/orderdetail.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: Number(id),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || data.status === false) {
      return NextResponse.json(
        { error: data.message || 'Failed to fetch order detail' },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error while fetching order detail' },
      { status: 500 }
    );
  }
}