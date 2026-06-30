import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getAllUsers } from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token || !verifyAdminSession(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await getAllUsers();

  return NextResponse.json({
    users: users.map((user) => ({
      id: user.id,
      player: user.player,
      realName: user.realName,
      email: user.email,
      location: user.location,
      gender: user.gender,
      createdAt: user.createdAt,
      approved: user.approved ?? false,
      approvedAt: user.approvedAt ?? null,
    })),
  });
}
