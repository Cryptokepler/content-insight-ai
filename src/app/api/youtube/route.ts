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

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\\n/g, " ")
    .replace(/\s+/g, " ");
}

function extractCaptionsFromXml(xml: string): string {
  const texts = xml.match(/<text[^>]*>([\s\S]*?)<\/text>/gi);
  if (!texts || texts.length === 0) return "";
  return texts
    .map(t => {
      const content = t.replace(/<[^>]+>/g, "");
      return decodeHtmlEntities(content);
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchWithUA(url: string): Promise<Response> {
  return fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });
}

async function getTranscript(videoId: string): Promise<{ title: string; transcript: string }> {
  // Fetch video page
  const pageRes = await fetchWithUA(`https://www.youtube.com/watch?v=${videoId}`);
  const html = await pageRes.text();

  // Extract title
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  const title = titleMatch ? titleMatch[1].replace(" - YouTube", "").trim() : "";

  // Method 1: Extract all baseUrl from captionTracks in ytInitialPlayerResponse
  const allBaseUrls: string[] = [];
  const baseUrlRegex = /"baseUrl"\s*:\s*"(https?:[^"]*timedtext[^"]*)"/g;
  let match;
  while ((match = baseUrlRegex.exec(html)) !== null) {
    allBaseUrls.push(match[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/"));
  }

  // Try each caption URL
  for (const captionUrl of allBaseUrls) {
    try {
      const capRes = await fetchWithUA(captionUrl);
      if (!capRes.ok) continue;
      const capXml = await capRes.text();
      const transcript = extractCaptionsFromXml(capXml);
      if (transcript.length > 50) {
        return { title, transcript };
      }
    } catch {
      continue;
    }
  }

  // Method 2: Try innertube API
  const apiKey = html.match(/"INNERTUBE_API_KEY"\s*:\s*"([^"]+)"/)?.[1];
  if (apiKey) {
    try {
      const innertubeRes = await fetch(`https://www.youtube.com/youtubei/v1/get_transcript?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: "WEB",
              clientVersion: "2.20240101.00.00",
              hl: "es",
            },
          },
          params: btoa(`\n\x0b${videoId}`),
        }),
      });

      if (innertubeRes.ok) {
        const data = await innertubeRes.json();
        const segments = data?.actions?.[0]?.updateEngagementPanelAction?.content?.transcriptRenderer?.body?.transcriptBodyRenderer?.cueGroups;
        if (segments && segments.length > 0) {
          const transcript = segments
            .map((s: { transcriptCueGroupRenderer?: { cues?: Array<{ transcriptCueRenderer?: { cue?: { simpleText?: string } } }> } }) => 
              s.transcriptCueGroupRenderer?.cues?.[0]?.transcriptCueRenderer?.cue?.simpleText || ""
            )
            .filter(Boolean)
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();
          if (transcript.length > 50) {
            return { title, transcript };
          }
        }
      }
    } catch {
      // continue to next method
    }
  }

  // Method 3: Try direct timedtext URLs for common languages
  const langs = ["es", "en", "es-419", "es-ES", "en-US", "pt", "fr"];
  for (const lang of langs) {
    try {
      // Try auto-generated
      const autoUrl = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}&kind=asr&fmt=srv3`;
      const autoRes = await fetchWithUA(autoUrl);
      if (autoRes.ok) {
        const xml = await autoRes.text();
        const transcript = extractCaptionsFromXml(xml);
        if (transcript.length > 50) {
          return { title, transcript };
        }
      }
      
      // Try manual
      const manualUrl = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}&fmt=srv3`;
      const manualRes = await fetchWithUA(manualUrl);
      if (manualRes.ok) {
        const xml = await manualRes.text();
        const transcript = extractCaptionsFromXml(xml);
        if (transcript.length > 50) {
          return { title, transcript };
        }
      }
    } catch {
      continue;
    }
  }

  // Method 4: Extract description as fallback
  const descMatch = html.match(/"shortDescription"\s*:\s*"([^"]{50,})"/);
  if (descMatch) {
    const desc = decodeHtmlEntities(descMatch[1]);
    if (desc.length > 50) {
      return { title: title + " (descripción)", transcript: desc };
    }
  }

  throw new Error("No se pudieron extraer subtítulos ni descripción de este video. Prueba copiando el texto manualmente desde YouTube.");
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
    const text = transcript.length > 3000 ? transcript.substring(0, 3000) + "..." : transcript;

    return NextResponse.json({
      text,
      title,
      videoId,
      charCount: text.length,
      source: "youtube_transcript",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error extrayendo transcript";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
