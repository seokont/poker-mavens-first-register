import { NextRequest, NextResponse } from "next/server";
import { generateEmailForRegistration, saveRegisteredUser } from "@/lib/db";
import { accountsAdd } from "@/lib/poker-api";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const {
    player,
    realName,
    gender,
    location,
    password1,
    password2,
    avatar,
  } = body as {
    player?: string;
    realName?: string;
    gender?: string;
    location?: string;
    password1?: string;
    password2?: string;
    avatar?: string;
  };

  if (!player?.trim()) {
    return NextResponse.json(
      { success: false, error: "Player name is required" },
      { status: 400 }
    );
  }

  if (!location?.trim()) {
    return NextResponse.json(
      { success: false, error: "Location is required" },
      { status: 400 }
    );
  }

  if (!password1) {
    return NextResponse.json(
      { success: false, error: "Password is required" },
      { status: 400 }
    );
  }

  if (password1 !== password2) {
    return NextResponse.json(
      { success: false, error: "Password mismatch" },
      { status: 400 }
    );
  }

  const playerName = player.trim();
  const fakeEmail = await generateEmailForRegistration(playerName);

  const api = await accountsAdd({
    Player: playerName,
    RealName: realName?.trim() ?? "",
    Gender: gender ?? "Male",
    Location: location.trim(),
    PW: password1,
    Email: fakeEmail,
    Avatar: avatar ?? "1",
  });

  if (api.Result !== "Ok") {
    return NextResponse.json(
      {
        success: false,
        error: api.Error ?? "Unknown API error",
      },
      { status: 400 }
    );
  }

  const user = await saveRegisteredUser(
    {
      player: playerName,
      password: password1,
      realName: realName?.trim() ?? "",
      gender: gender ?? "Male",
      location: location.trim(),
      avatar: avatar ?? "1",
    },
    fakeEmail
  );

  return NextResponse.json({
    success: true,
    message: `Account successfully created for ${playerName}`,
    email: user.email,
  });
}
