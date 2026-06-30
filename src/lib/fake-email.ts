const DOMAINS = [
  "iqpoker88.mail",
  "iqpoker88.local",
  "play.iqpoker88.fake",
] as const;

function sanitizePlayerName(player: string): string {
  const sanitized = player.toLowerCase().replace(/[^a-z0-9]/g, "");
  return sanitized || "player";
}

function randomDigits(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

function pickDomain(): string {
  return DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
}

export function generateFakeEmail(player: string): string {
  const base = sanitizePlayerName(player);
  const domain = pickDomain();
  const variant = Math.floor(Math.random() * 3);

  if (variant === 0) {
    return `${base}${randomDigits(4)}@${domain}`;
  }

  if (variant === 1) {
    return `${base}.${randomDigits(3)}@${domain}`;
  }

  return `user.${base}${randomDigits(2)}@${domain}`;
}

export function generateUniqueFakeEmail(
  player: string,
  existingEmails: string[]
): string {
  const taken = new Set(existingEmails.map((email) => email.toLowerCase()));

  for (let attempt = 0; attempt < 20; attempt++) {
    const email = generateFakeEmail(player);
    if (!taken.has(email.toLowerCase())) {
      return email;
    }
  }

  return `${sanitizePlayerName(player)}${Date.now()}@iqpoker88.mail`;
}
