import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { verifyAdminSession } from "@/lib/admin-auth";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login — iqpoker88",
};

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (token && verifyAdminSession(token)) {
    redirect("/admin");
  }

  return <AdminLoginForm />;
}
