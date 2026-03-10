import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL requerida" }, { status: 400 });

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ContentInsightAI/1.0)",
        "Accept": "text/html",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Error al acceder: ${response.status}` }, { status: 400 });
    }

    const html = await response.text();

    // Extract text content from HTML
    let text = html
      // Remove scripts and styles
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
      // Remove HTML tags
      .replace(/<[^>]+>/g, " ")
      // Decode entities
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&[a-z]+;/gi, " ")
      // Clean whitespace
      .replace(/\s+/g, " ")
      .trim();

    // Limit to ~3000 chars for analysis
    if (text.length > 3000) {
      text = text.substring(0, 3000) + "...";
    }

    if (text.length < 20) {
      return NextResponse.json({ error: "No se pudo extraer contenido útil de esta URL" }, { status: 400 });
    }

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : "";

    return NextResponse.json({ text, title, charCount: text.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error extrayendo contenido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
