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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
                  text: `এই prescription থেকে medicine গুলো বের করুন। শুধু JSON format এ দিন, অন্য কিছু লিখবেন না, কোনো markdown বা backtick দেবেন না।

Format:
{
  "medicines": [
    {
      "medicineName": "medicine নাম",
      "dosage": "dose",
      "frequency": "কতবার",
      "duration": "কতদিন",
      "quantity": 10
    }
  ],
  "doctorName": "doctor নাম বা null",
  "hospitalName": "hospital নাম বা null"
}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Scan error:", String(error));
    return NextResponse.json({
      error: "AI scan করতে পারেনি",
      details: String(error),
    }, { status: 500 });
  }
}