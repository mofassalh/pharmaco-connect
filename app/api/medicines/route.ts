import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const medicines = await prisma.inventoryItem.findMany({
      where: {
        isAvailable: true,
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { genericName: { contains: search, mode: "insensitive" } },
            { brand: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      select: {
        id: true,
        name: true,
        genericName: true,
        brand: true,
        category: true,
        manufacturer: true,
        sellingPrice: true,
        currentStock: true,
      },
      orderBy: { name: "asc" },
      take: 20,
    });

    return NextResponse.json(medicines);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}