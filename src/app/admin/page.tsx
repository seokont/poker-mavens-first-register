import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { verifyAdminSession } from "@/lib/admin-auth";
import { AdminDashboard } from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin — iqpoker88",
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token || !verifyAdminSession(token)) {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}
