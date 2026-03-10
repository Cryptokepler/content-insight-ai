import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL requerida" }, { status: 400 });

    const fullUrl = url.startsWith("http") ? url : `https://${url}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(fullUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json({ error: `Error al acceder al sitio: HTTP ${response.status}` }, { status: 400 });
    }

    const html = await response.text();

    // Extract text content from HTML
    let text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
      .replace(/<svg[\s\S]*?<\/svg>/gi, "")
      .replace(/<header[\s\S]*?<\/header>/gi, (m) => m.replace(/<[^>]+>/g, " "))
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&[a-z]+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (text.length > 3000) {
      text = text.substring(0, 3000) + "...";
    }

    if (text.length < 20) {
      return NextResponse.json({ error: "No se pudo extraer contenido útil. El sitio puede usar JavaScript para cargar contenido." }, { status: 400 });
    }

    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : "";

    return NextResponse.json({ text, title, charCount: text.length });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ error: "Tiempo de espera agotado. El sitio tardó demasiado en responder." }, { status: 408 });
    }
    const message = error instanceof Error ? error.message : "Error extrayendo contenido";
    return NextResponse.json({ error: `No se pudo acceder al sitio: ${message}` }, { status: 500 });
  }
}
