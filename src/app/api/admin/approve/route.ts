import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getUserById, markUserApproved } from "@/lib/db";
import { accountsAdd } from "@/lib/poker-api";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token || !verifyAdminSession(token)) {
    return null;
  }

  return token;
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id } = body as { id?: string };

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Player id is required" },
      { status: 400 }
    );
  }

  const user = await getUserById(id);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Player not found" },
      { status: 404 }
    );
  }

  if (user.approved) {
    return NextResponse.json(
      { success: false, error: "Player already approved" },
      { status: 400 }
    );
  }

  const api = await accountsAdd({
    Player: user.player,
    RealName: user.realName || user.player,
    Gender: user.gender,
    Location: user.location || "israel",
    PW: user.password,
    Email: user.email,
    Avatar: user.avatar,
    Note: "Account approved by admin",
  });

  if (api.Result !== "Ok") {
    return NextResponse.json(
      { success: false, error: api.Error ?? "Poker Mavens API error" },
      { status: 400 }
    );
  }

  await markUserApproved(id);

  return NextResponse.json({
    success: true,
    message: `Player ${user.player} approved and sent to Poker Mavens`,
  });
}
