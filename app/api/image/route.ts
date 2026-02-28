export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new Response("Image URL required", { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    return new Response("Failed to fetch image", { status: 500 });
  }
}