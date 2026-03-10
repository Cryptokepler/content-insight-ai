import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function getClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not configured");
  return new OpenAI({ apiKey: key });
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  "landing": "Landing page",
  "anuncio": "Anuncio publicitario",
  "email": "Email comercial",
  "propuesta": "Propuesta de valor",
  "servicio": "Descripción de servicio",
  "bio": "Bio / presentación",
  "youtube": "Video de YouTube (transcript)",
};

export async function POST(req: NextRequest) {
  try {
    const { text, contentType } = await req.json();

    if (!text || !contentType) {
      return NextResponse.json({ error: "Texto y tipo de contenido requeridos" }, { status: 400 });
    }

    const label = CONTENT_TYPE_LABELS[contentType] || contentType;

    const openai = getClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Eres un analista senior de marketing y copywriting. Analiza textos comerciales y devuelve diagnósticos estructurados en español.

Tu respuesta DEBE ser un JSON válido con esta estructura exacta:
{
  "score": <número 0-100>,
  "claridad": {
    "nivel": "<Bajo|Medio|Medio-Alto|Alto>",
    "detalle": "<análisis de 1-2 oraciones>"
  },
  "propuestaValor": {
    "nivel": "<Débil|Aceptable|Fuerte|Muy Fuerte>",
    "detalle": "<análisis de 1-2 oraciones>"
  },
  "fortalezas": ["<punto 1>", "<punto 2>", "<punto 3>"],
  "mejoras": ["<punto 1>", "<punto 2>", "<punto 3>", "<punto 4 opcional>", "<punto 5 opcional>"],
  "recomendaciones": ["<recomendación accionable 1>", "<recomendación 2>", "<recomendación 3>"],
  "versionOptimizada": "<texto completo reescrito y mejorado>"
}

Criterios de evaluación:
- Claridad del mensaje
- Propuesta de valor (diferenciación)
- Persuasión y urgencia
- Estructura y jerarquía
- Tono apropiado para el público
- Call to Action (presencia y fuerza)
- Capacidad de conversión

Sé directo, profesional y accionable. No uses lenguaje genérico. La versión optimizada debe ser significativamente mejor que el original.`
        },
        {
          role: "user",
          content: `Analiza el siguiente texto de tipo "${label}":\n\n${text}`
        }
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "No se recibió respuesta de la IA" }, { status: 500 });
    }

    const result = JSON.parse(content);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Error en análisis:", error);
    const message = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
