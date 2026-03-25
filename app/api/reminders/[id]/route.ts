import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { status, callNotes, customerConfirmed } = await req.json();

  const reminder = await prisma.reminder.update({
    where: { id: params.id },
    data: {
      status,
      callNotes,
      customerConfirmed,
      lastCallAt: new Date(),
      callAttempts: { increment: 1 },
    },
  });

  return NextResponse.json(reminder);
}

