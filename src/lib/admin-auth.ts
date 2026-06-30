import { createHmac, timingSafeEqual } from "crypto";

const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? "dev-admin-secret-change-me";
}

export function verifyAdminCredentials(
  username: string,
  password: string
): boolean {
  const adminUser = process.env.ADMIN_USERNAME ?? "admin";
  const adminPass = process.env.ADMIN_PASSWORD ?? "admin123";

  return username === adminUser && password === adminPass;
}

export function createAdminSession(): string {
  const expires = Date.now() + SESSION_MAX_AGE_MS;
  const data = `admin:${expires}`;
  const sig = createHmac("sha256", getSessionSecret())
    .update(data)
    .digest("hex");
  return `${data}.${sig}`;
}

export function verifyAdminSession(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [data, sig] = parts;
  const expected = createHmac("sha256", getSessionSecret())
    .update(data)
    .digest("hex");

  try {
    const sigBuf = Buffer.from(sig, "hex");
    const expectedBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expectedBuf.length) return false;
    if (!timingSafeEqual(sigBuf, expectedBuf)) return false;
  } catch {
    return false;
  }

  const expires = Number(data.split(":")[1]);
  return Number.isFinite(expires) && Date.now() < expires;
}
