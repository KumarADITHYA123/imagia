import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const prompt = searchParams.get("prompt");
    const model = searchParams.get("model");
    const guidance = searchParams.get("guidance") || "7.5";
    const strength = searchParams.get("strength") || "1";

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const externalUrl = new URL("https://ai-image-api.xeven.workers.dev/img");
    externalUrl.searchParams.set("prompt", prompt);
    if (model) externalUrl.searchParams.set("model", model);
    if (guidance) externalUrl.searchParams.set("guidance", guidance);
    if (strength) externalUrl.searchParams.set("strength", strength);

    const response = await fetch(externalUrl.toString(), {
      method: "GET",
      // Important to skip caching to always fetch a fresh image
      cache: "no-store", 
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `External API error: ${response.status} ${response.statusText}`,
        errorText
      );
      return NextResponse.json(
        { error: "Failed to generate image from external API" },
        { status: response.status }
      );
    }

    // Stream the image blob back to the client
    const headers = new Headers();
    const contentType = response.headers.get("Content-Type");
    if (contentType) {
      headers.set("Content-Type", contentType);
    } else {
        headers.set("Content-Type", "image/png")
    }

    return new NextResponse(response.body, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error("Error in API proxy:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
