import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    if (!file) return NextResponse.json({ error: "No image" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mediaType = file.type as "image/jpeg" | "image/png" | "image/webp";

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: `Extract medicine information from this box image. Return ONLY valid JSON, no markdown:
{
  "name": "medicine brand name",
  "genericName": "generic/INN name",
  "brand": "manufacturer brand",
  "dosage": "e.g. 500mg",
  "category": "GENERAL|ANTIBIOTIC|CARDIAC|DIABETES|RESPIRATORY|PAIN_RELIEF|VITAMIN|ANTACID|NEUROLOGICAL|DERMATOLOGY|OPHTHALMIC|OTHER",
  "unit": "strip|bottle|vial|box",
  "manufacturer": "company name",
  "mrp": number or null,
  "batchNumber": "if visible",
  "expiryDate": "YYYY-MM-DD if visible"
}` }
        ]
      }]
    });

    const text = response.content.filter(b => b.type === "text").map(b => (b as any).text).join("");
    const clean = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to scan" }, { status: 500 });
  }
}