import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {

    const response = await fetch(
      `http://topsons.mooo.com/api/category/getcategory.php`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[v0] Categories API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}


/* =========================
   ADD CATEGORY
========================= */
export async function POST(request: NextRequest) {
  try {
    const incomingFormData = await request.formData();

    const categoryName = incomingFormData.get('category_name');
    const image = incomingFormData.get('image');

    if (!categoryName || !image) {
      return NextResponse.json(
        { error: 'Category name and image are required' },
        { status: 400 }
      );
    }

    const formData = new FormData();
    formData.append('category_name', categoryName);
    formData.append('image', image);

    const response = await fetch(`http://topsons.mooo.com/api/category/addcategory.php`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || data.status === false) {
      return NextResponse.json(
        { error: data.message || 'Failed to add category' },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Add category error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}