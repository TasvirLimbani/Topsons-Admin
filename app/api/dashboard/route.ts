import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'http://topsons.mooo.com/api/admin/dashboard.php',
      {
        method: 'GET',
        cache: 'no-store', // always fresh data
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch dashboard data' },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Dashboard API Error:', error);

    return NextResponse.json(
      { error: 'Server error while fetching dashboard data' },
      { status: 500 }
    );
  }
}