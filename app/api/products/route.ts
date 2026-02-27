import { NextRequest, NextResponse } from 'next/server';

const GET_PRODUCTS_API =
  'http://topsons.mooo.com/api/product/getproducts.php';

const ADD_PRODUCT_API =
  'http://topsons.mooo.com/api/product/addproduct.php';

const DELETE_PRODUCT_API =
  'http://topsons.mooo.com/api/product/deleteproduct.php';

/* =========================
   GET PRODUCTS
========================= */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '15';

    const response = await fetch(
      `${GET_PRODUCTS_API}?page=${page}&limit=${limit}`
    );

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Products GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

/* =========================
   ADD OR DELETE PRODUCT (POST)
========================= */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    /* =========================
       DELETE PRODUCT (JSON)
    ========================= */
    if (contentType.includes('application/json')) {
      const { id } = await request.json();

      const formData = new FormData();
      formData.append('product_id', String(id));

      const response = await fetch(DELETE_PRODUCT_API, {
        method: 'POST',
        body: formData, // matches your Postman (form-data)
      });

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    /* =========================
       ADD PRODUCT (formData)
    ========================= */
    const incomingFormData = await request.formData();

    const formData = new FormData();
    for (const [key, value] of incomingFormData.entries()) {
      formData.append(key, value as any);
    }

    const response = await fetch(ADD_PRODUCT_API, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Products POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}