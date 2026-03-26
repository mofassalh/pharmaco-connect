import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const reminders = await prisma.reminder.findMany({
    include: {
      customer: true,
      regularMedicine: true,
    },
    orderBy: { dueDate: "asc" },
  });
  return NextResponse.json(reminders);
}
