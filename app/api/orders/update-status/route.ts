import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, status } = body;

    // Validation
    if (!order_id || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    // Call your PHP API
    const response = await fetch(
      'http://topsons.mooo.com/api/order/updatestatus.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: Number(order_id),
          status: status,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Update Status Error:', error);

    return NextResponse.json(
      { error: 'Server error while updating order status' },
      { status: 500 }
    );
  }
}