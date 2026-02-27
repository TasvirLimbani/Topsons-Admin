import { NextRequest, NextResponse } from 'next/server';

const UPDATE_API =
  'http://topsons.mooo.com/api/category/editcategory.php';

export async function POST(request: NextRequest) {
  try {
    const incomingFormData = await request.formData();

    const categoryId = incomingFormData.get('category_id');
    const categoryName = incomingFormData.get('category_name');
    const image = incomingFormData.get('image');

    if (!categoryId || !categoryName) {
      return NextResponse.json(
        { error: 'Category ID and Name are required' },
        { status: 400 }
      );
    }

    // Create new FormData to send to PHP backend
    const formData = new FormData();
    formData.append('category_id', String(categoryId));
    formData.append('category_name', String(categoryName));

    // Only append image if user selected new one
    if (image && typeof image !== 'string') {
      formData.append('image', image);
    }

    const response = await fetch(UPDATE_API, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Category Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}