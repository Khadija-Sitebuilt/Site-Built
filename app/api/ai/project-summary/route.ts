import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const GROQ_MODEL = "llama-3.1-8b-instant";

type SummaryRequest = {
  projectId?: string;
};

/**
 * deterministic gap detection
 */
function computeGaps(data: any) {

  const gaps: string[] = [];
  const nextSteps: string[] = [];

  if (!data.location) {
    gaps.push("Missing project location");
    nextSteps.push("Add project location");
  }

  if (data.plans_count === 0) {
    gaps.push("No plans uploaded");
    nextSteps.push("Upload at least one floor plan");
  }

  if (data.photos_count === 0) {
    gaps.push("No photos uploaded");
    nextSteps.push("Upload site photos");
  }

  if (data.photos_count > 0 && data.placed_photos_count === 0) {
    gaps.push("Photos not placed on plan");
    nextSteps.push("Place uploaded photos on the floor plan");
  }

  return {
    gaps:
      gaps.length > 0
        ? gaps.join(", ")
        : "No major gaps detected",

    nextSteps:
      nextSteps.length > 0
        ? nextSteps
        : ["Review project documentation completeness"]
  };
}

/**
 * build strict prompt
 */
function buildSummaryPrompt(project: any) {

  const plans = project.plans || [];
  const photos = project.photos || [];

  const placedPhotos =
    photos.filter(
      (p: any) =>
        p.photo_placements &&
        p.photo_placements.length > 0
    ).length || 0;

  const lastPlanDate =
    plans
      .map((p: any) => p.created_at)
      .filter(Boolean)
      .sort()
      .slice(-1)[0] || "Not available";

  const lastPhotoDate =
    photos
      .map((p: any) => p.created_at || p.exif_timestamp)
      .filter(Boolean)
      .sort()
      .slice(-1)[0] || "Not available";

  const baseData = {
    project_name: project.name || "Not provided",
    description: project.description || "Not provided",
    location: project.location || "Not provided",
    created_at: project.created_at || "Not available",

    plans_count: plans.length,
    photos_count: photos.length,
    placed_photos_count: placedPhotos,

    last_plan_upload: lastPlanDate,
    last_photo_upload: lastPhotoDate,
  };

  const gapInfo = computeGaps({
    location: project.location,
    plans_count: plans.length,
    photos_count: photos.length,
    placed_photos_count: placedPhotos
  });

  return `
Generate structured project summary.

STRICT RULES:
- Use ONLY provided data
- DO NOT invent any new fields
- DO NOT add assumptions
- Output plain text only
- Follow exact bullet structure

OUTPUT FORMAT:

- Project name & description: "<project_name>" – brief description "<description>".
- Creation date: <created_at>.
- Location: <location>.
- Plans: <plans_count> uploaded (last upload <last_plan_upload>).
- Photos: <photos_count> uploaded (last upload <last_photo_upload>).
- Placed photos: <placed_photos_count>.
- Gaps: ${gapInfo.gaps}.
- Next steps:
  1. ${gapInfo.nextSteps[0] || "Review project completeness"}
  2. ${gapInfo.nextSteps[1] || "Ensure all required data is uploaded"}
  3. ${gapInfo.nextSteps[2] || "Verify project documentation"}

Project data:
${JSON.stringify(baseData, null, 2)}
`;
}

export async function POST(req: Request) {

  try {

    if (!process.env.GROQ_API_KEY) {

      return NextResponse.json(
        { error: "GROQ_API_KEY missing" },
        { status: 500 }
      );

    }

    const body = await req.json() as SummaryRequest;

    if (!body.projectId) {

      return NextResponse.json(
        { error: "projectId required" },
        { status: 400 }
      );

    }

    const supabase = await createClient();

    const { data: project, error } =
      await supabase
        .from("projects")
        .select(`
          id,
          name,
          description,
          location,
          created_at,

          plans (
            id,
            created_at,
            photo_placements ( id )
          ),

          photos (
            id,
            created_at,
            exif_timestamp,
            photo_placements ( id )
          )
        `)
        .eq("id", body.projectId)
        .single();

    if (error || !project) {

      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );

    }

    const prompt = buildSummaryPrompt(project);

    const response =
      await fetch(
        `${GROQ_BASE_URL}/chat/completions`,
        {

          method: "POST",

          headers: {

            Authorization:
              `Bearer ${process.env.GROQ_API_KEY}`,

            "Content-Type":
              "application/json",

          },

          body: JSON.stringify({

            model: GROQ_MODEL,

            temperature: 0.1,

            max_tokens: 180,

            messages: [

              {
                role: "system",
                content:
                  "You generate structured construction summaries using only provided data."
              },

              {
                role: "user",
                content: prompt
              }

            ],

          }),

        }
      );

    if (!response.ok) {

      const err =
        await response.text();

      return NextResponse.json(
        {
          error: "Groq request failed",
          detail: err
        },
        { status: 500 }
      );

    }

    const data =
      await response.json();

    const summary =
      data?.choices?.[0]?.message?.content
      ?.trim() || "";

    return NextResponse.json({

      summary

    });

  }
  catch (error: any) {

    return NextResponse.json(

      {

        error:
          error?.message ||
          "Unexpected error"

      },

      { status: 500 }

    );

  }

}