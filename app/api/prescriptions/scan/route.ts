import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL দিন" }, { status: 400 });
    }

    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");
    const contentType = imageResponse.headers.get("content-type") || "image/jpeg";

    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: contentType,
                    data: base64Image,
                  },
                },
                {
                  text: `Extract medicines from this prescription. Return ONLY valid JSON, no markdown, no backticks, no explanation.

{"medicines":[{"medicineName":"name","dosage":"dose","frequency":"frequency","duration":"duration","quantity":10}],"doctorName":"name or null","hospitalName":"name or null"}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    const data = await response.json();
    
    // Debug: raw response দেখুন
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.error("Gemini raw response:", rawText);

    if (!rawText) {
      return NextResponse.json({ 
        error: "Gemini response খালি",
        raw: JSON.stringify(data)
      }, { status: 500 });
    }

    // JSON extract করুন
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ 
        error: "JSON পাওয়া যায়নি",
        raw: rawText
      }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);

  } catch (error) {
    console.error("Scan error:", String(error));
    return NextResponse.json({
      error: "AI scan করতে পারেনি",
      details: String(error),
    }, { status: 500 });
  }
}