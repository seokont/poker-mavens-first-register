import { NextRequest, NextResponse } from "next/server";
import { saveSimpleUser } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { player, password } = body as {
    player?: string;
    password?: string;
  };

  if (!player?.trim()) {
    return NextResponse.json(
      { success: false, error: "Player name is required" },
      { status: 400 }
    );
  }

  if (!password) {
    return NextResponse.json(
      { success: false, error: "Password is required" },
      { status: 400 }
    );
  }

  try {
    const user = await saveSimpleUser(player.trim(), password);

    return NextResponse.json({
      success: true,
      message: `Registration successful for ${user.player}`,
      email: user.email,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Registration failed";

    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
