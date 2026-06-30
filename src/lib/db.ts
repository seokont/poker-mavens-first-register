import { JSONFilePreset } from "lowdb/node";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { DatabaseSchema, UserRecord } from "./types";
import { generateUniqueFakeEmail } from "./fake-email";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

const defaultData: DatabaseSchema = { users: [] };

let dbPromise: ReturnType<typeof JSONFilePreset<DatabaseSchema>> | null = null;

async function getDb() {
  if (!dbPromise) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    dbPromise = JSONFilePreset<DatabaseSchema>(DB_PATH, defaultData);
  }
  return dbPromise;
}

export async function generateEmailForRegistration(
  player: string
): Promise<string> {
  const db = await getDb();
  await db.read();
  const existingEmails = db.data.users.map((user) => user.email);
  return generateUniqueFakeEmail(player, existingEmails);
}

export async function saveRegisteredUser(
  input: {
    player: string;
    password: string;
    realName: string;
    gender: string;
    location: string;
    avatar: string;
  },
  email: string
): Promise<UserRecord> {
  const db = await getDb();
  await db.read();

  const user: UserRecord = {
    id: randomUUID(),
    player: input.player,
    password: input.password,
    realName: input.realName,
    gender: input.gender,
    location: input.location,
    email,
    avatar: input.avatar,
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    approved: true,
    approvedAt: new Date().toISOString(),
  };

  db.data.users.push(user);
  await db.write();

  return user;
}

export async function saveSimpleUser(
  player: string,
  password: string
): Promise<UserRecord> {
  const db = await getDb();
  await db.read();

  const exists = db.data.users.some(
    (entry) => entry.player.toLowerCase() === player.toLowerCase()
  );

  if (exists) {
    throw new Error("Player name already taken");
  }

  const email = generateUniqueFakeEmail(
    player,
    db.data.users.map((user) => user.email)
  );

  const user: UserRecord = {
    id: randomUUID(),
    player,
    password,
    realName: player,
    gender: "Male",
    location: "israel",
    email,
    avatar: "1",
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    approved: false,
    approvedAt: null,
  };

  db.data.users.push(user);
  await db.write();

  return user;
}

export async function getAllUsers(): Promise<UserRecord[]> {
  const db = await getDb();
  await db.read();

  return [...db.data.users].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getUserByPlayer(
  player: string
): Promise<UserRecord | undefined> {
  const db = await getDb();
  await db.read();

  return db.data.users.find(
    (entry) => entry.player.toLowerCase() === player.toLowerCase()
  );
}

export async function getUserById(id: string): Promise<UserRecord | undefined> {
  const db = await getDb();
  await db.read();

  const user = db.data.users.find((entry) => entry.id === id);
  if (!user) return undefined;

  return {
    ...user,
    approved: user.approved ?? false,
    approvedAt: user.approvedAt ?? null,
  };
}

export async function markUserApproved(id: string): Promise<UserRecord> {
  const db = await getDb();
  await db.read();

  const index = db.data.users.findIndex((entry) => entry.id === id);
  if (index === -1) {
    throw new Error("Player not found");
  }

  const user = db.data.users[index];
  if (user.approved) {
    throw new Error("Player already approved");
  }

  user.approved = true;
  user.approvedAt = new Date().toISOString();
  await db.write();

  return user;
}
