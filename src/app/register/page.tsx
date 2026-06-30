import type { Metadata } from "next";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Register — iqpoker88",
  description: "Create your iqpoker88 account",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
