import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL দিন" }, { status: 400 });
    }

    // Image fetch করুন
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");
    const contentType = imageResponse.headers.get("content-type") || "image/jpeg";

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: contentType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                data: base64Image,
              },
            },
            {
              type: "text",
              text: `এই prescription থেকে medicine গুলো বের করুন। শুধু JSON format এ দিন, অন্য কিছু লিখবেন না।

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
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    
    // JSON parse করুন
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Scan error:", String(error));
    return NextResponse.json({ 
      error: "AI scan করতে পারেনি",
      details: String(error)
    }, { status: 500 });
  }
}