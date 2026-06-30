"use client";

import { FormEvent, useState } from "react";
import { AvatarPicker } from "./AvatarPicker";

type FormState = {
  player: string;
  realName: string;
  gender: "Male" | "Female";
  location: string;
  password1: string;
  password2: string;
  avatar: string;
};

const initialState: FormState = {
  player: "",
  realName: "",
  gender: "Male",
  location: "",
  password1: "",
  password2: "",
  avatar: "1",
};

export function RegistrationForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setResult(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/poker-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player: form.player,
          realName: form.realName,
          gender: form.gender,
          location: form.location,
          password1: form.password1,
          password2: form.password2,
          avatar: form.avatar,
        }),
      });

      const data = (await response.json()) as {
        success: boolean;
        message?: string;
        email?: string;
        error?: string;
      };

      if (data.success) {
        setResult({
          type: "success",
          message:
            data.message +
            (data.email ? ` (email: ${data.email})` : ""),
        });
        setForm(initialState);
      } else {
        setResult({
          type: "error",
          message: data.error ?? "Registration failed",
        });
      }
    } catch {
      setResult({ type: "error", message: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h3 className="mb-6 text-xl font-semibold text-gray-900">
        Create New Account
      </h3>

      {result && (
        <div
          className={`mb-4 rounded border px-4 py-3 text-sm ${
            result.type === "success"
              ? "border-green-300 bg-green-50 text-green-800"
              : "border-red-300 bg-red-50 text-red-800"
          }`}
          role="alert"
        >
          {result.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <table className="w-full border-collapse">
          <tbody>
            <FormRow label="Your player name:">
              <input
                type="text"
                name="Player"
                value={form.player}
                onChange={(e) => updateField("player", e.target.value)}
                required
                maxLength={12}
                className="w-full rounded border border-gray-300 px-2 py-1.5"
              />
            </FormRow>

            <FormRow label="Your real name:">
              <input
                type="text"
                name="RealName"
                value={form.realName}
                onChange={(e) => updateField("realName", e.target.value)}
                maxLength={25}
                className="w-full rounded border border-gray-300 px-2 py-1.5"
              />
            </FormRow>

            <FormRow label="Your gender:">
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="Gender"
                    value="Male"
                    checked={form.gender === "Male"}
                    onChange={() => updateField("gender", "Male")}
                  />
                  Male
                </label>
                <label className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="Gender"
                    value="Female"
                    checked={form.gender === "Female"}
                    onChange={() => updateField("gender", "Female")}
                  />
                  Female
                </label>
              </div>
            </FormRow>

            <FormRow label="Your location:">
              <input
                type="text"
                name="Location"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                required
                maxLength={50}
                className="w-full rounded border border-gray-300 px-2 py-1.5"
              />
            </FormRow>

            <FormRow label="Select a password:">
              <input
                type="password"
                name="Password1"
                value={form.password1}
                onChange={(e) => updateField("password1", e.target.value)}
                required
                className="w-full rounded border border-gray-300 px-2 py-1.5"
              />
            </FormRow>

            <FormRow label="Confirm password:">
              <input
                type="password"
                name="Password2"
                value={form.password2}
                onChange={(e) => updateField("password2", e.target.value)}
                required
                className="w-full rounded border border-gray-300 px-2 py-1.5"
              />
            </FormRow>

            <FormRow label="Your avatar:">
              <AvatarPicker
                value={form.avatar}
                onChange={(value) => updateField("avatar", value)}
              />
            </FormRow>
          </tbody>
        </table>

        <button
          type="submit"
          name="Submit"
          disabled={loading}
          className="mt-4 rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

function FormRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <tr>
      <td className="py-2 pr-4 align-top text-sm text-gray-700">{label}</td>
      <td className="py-2">{children}</td>
    </tr>
  );
}
