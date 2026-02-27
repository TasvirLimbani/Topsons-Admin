import { NextRequest, NextResponse } from 'next/server';

const DELETE_API =
  'http://topsons.mooo.com/api/category/deletecategory.php';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${DELETE_API}?category_id=${id}`,
      {
        method: 'POST', // backend requires POST
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}