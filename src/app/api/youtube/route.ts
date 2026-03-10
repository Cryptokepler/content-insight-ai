import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

async function getTranscript(videoId: string): Promise<{ title: string; transcript: string }> {
  // First get the video page to extract title and caption tracks
  const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
    },
  });

  const html = await pageRes.text();

  // Extract title
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  const title = titleMatch ? titleMatch[1].replace(" - YouTube", "").trim() : "";

  // Extract captions URL from player response
  const captionMatch = html.match(new RegExp('"captions":\\s*(\\{.*?"playerCaptionsTracklistRenderer".*?\\})\\s*,\\s*"videoDetails"', 's'));
  
  if (!captionMatch) {
    // Try alternative: timedtext API directly
    const timedTextUrl = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=es&fmt=srv3`;
    const ttRes = await fetch(timedTextUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
    });
    
    if (ttRes.ok) {
      const ttXml = await ttRes.text();
      const texts = ttXml.match(/<text[^>]*>([\s\S]*?)<\/text>/gi);
      if (texts && texts.length > 0) {
        const transcript = texts
          .map(t => t.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&quot;/g, '"'))
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        return { title, transcript };
      }
    }

    // Try English
    const ttResEn = await fetch(`https://www.youtube.com/api/timedtext?v=${videoId}&lang=en&fmt=srv3`, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
    });
    
    if (ttResEn.ok) {
      const ttXml = await ttResEn.text();
      const texts = ttXml.match(/<text[^>]*>([\s\S]*?)<\/text>/gi);
      if (texts && texts.length > 0) {
        const transcript = texts
          .map(t => t.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&quot;/g, '"'))
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        return { title, transcript };
      }
    }

    // Try to get auto-generated captions
    const captionUrlMatch = html.match(/"captionTracks":\s*\[\s*\{[^}]*"baseUrl":\s*"([^"]+)"/);
    if (captionUrlMatch) {
      const captionUrl = captionUrlMatch[1].replace(/\\u0026/g, "&");
      const capRes = await fetch(captionUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
      });
      if (capRes.ok) {
        const capXml = await capRes.text();
        const texts = capXml.match(/<text[^>]*>([\s\S]*?)<\/text>/gi);
        if (texts && texts.length > 0) {
          const transcript = texts
            .map(t => t.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&quot;/g, '"'))
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();
          return { title, transcript };
        }
      }
    }

    throw new Error("No se encontraron subtítulos para este video. El video debe tener subtítulos (manuales o automáticos) habilitados.");
  }

  // Parse caption tracks from player response
  try {
    const captionData = JSON.parse(captionMatch[1]);
    const tracks = captionData?.playerCaptionsTracklistRenderer?.captionTracks || [];
    
    // Prefer Spanish, then English, then first available
    const esTrack = tracks.find((t: { languageCode: string }) => t.languageCode === "es");
    const enTrack = tracks.find((t: { languageCode: string }) => t.languageCode === "en");
    const track = esTrack || enTrack || tracks[0];

    if (!track?.baseUrl) {
      throw new Error("No caption URL found");
    }

    const capRes = await fetch(track.baseUrl.replace(/\\u0026/g, "&"), {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
    });
    const capXml = await capRes.text();
    
    const texts = capXml.match(/<text[^>]*>([\s\S]*?)<\/text>/gi);
    if (!texts || texts.length === 0) throw new Error("Empty captions");

    const transcript = texts
      .map(t => t.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&quot;/g, '"'))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    return { title, transcript };
  } catch {
    throw new Error("No se pudieron extraer los subtítulos del video.");
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL de YouTube requerida" }, { status: 400 });

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: "URL de YouTube no válida. Usa formato: youtube.com/watch?v=... o youtu.be/..." }, { status: 400 });
    }

    const { title, transcript } = await getTranscript(videoId);

    // Limit to 3000 chars
    const text = transcript.length > 3000 ? transcript.substring(0, 3000) + "..." : transcript;

    return NextResponse.json({ 
      text, 
      title, 
      videoId,
      charCount: text.length,
      source: "youtube_transcript"
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error extrayendo transcript";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
