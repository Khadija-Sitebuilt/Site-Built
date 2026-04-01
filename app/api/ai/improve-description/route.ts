import { NextResponse } from "next/server";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

// fast + stable model on Groq
const GROQ_MODEL = "llama-3.1-8b-instant";

type ImproveRequest = {
  projectName?: string;
  location?: string;
  description?: string;
};

/**
 * Builds deterministic prompt
 */
function buildPrompt(input: ImproveRequest) {
  return `
Improve grammar and clarity of this construction project description.

Rules:
- Keep meaning exactly the same
- Do NOT add new information
- Do NOT remove technical meaning
- Fix grammar and punctuation
- Keep length similar
- Return ONLY improved text
- If description is empty, return empty string

Description:
${input.description || ""}
`.trim();
}

/**
 * Clean model output
 */
function cleanOutput(text: string) {
  if (!text) return "";

  return text
    .trim()
    .replace(/^"+|"+$/g, "") // remove wrapping quotes
    .replace(/\s+/g, " ") // remove extra spaces
    .replace(/,{2,}/g, ",") // fix double commas
    .replace(/\s+,/g, ",") // remove space before comma
    .replace(/\s+\./g, ".") // remove space before period
    .trim();
}

export async function POST(req: Request) {
  try {
    // check env
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY missing" },
        { status: 500 }
      );
    }

    const body = (await req.json()) as ImproveRequest;

    // empty input safety
    if (!body?.description?.trim()) {
      return NextResponse.json({ improved: "" });
    }

    const prompt = buildPrompt(body);

    const response = await fetch(
      `${GROQ_BASE_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          temperature: 0.1, // deterministic
          max_tokens: 120,
          messages: [
            {
              role: "system",
              content:
                "You improve construction project descriptions with minimal edits.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      return NextResponse.json(
        {
          error: "Groq request failed",
          detail: errorText,
        },
        { status: 500 }
      );
    }

    const data = await response.json();

    const raw =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      "";

    const improved = cleanOutput(raw);

    return NextResponse.json({
      improved,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Unexpected error",
      },
      { status: 500 }
    );
  }
}