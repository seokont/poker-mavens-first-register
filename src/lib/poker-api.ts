import http from "http";
import https from "https";
import { URL } from "url";

/**
 * Poker Mavens API client — TypeScript port of API.php
 * @see https://briggsoft.com/docs/pmavens/API_Examples.htm
 */

const url = process.env.POKER_API_URL ?? "http://127.0.0.1:8087/api";
const pw = process.env.POKER_API_PASSWORD ?? "";

const TIMEOUT_MS = 30_000;

export type PokerApiResponse = {
  Result: string;
  Error?: string;
  Verified?: string;
  SessionKey?: string;
  [key: string]: unknown;
};

export type AccountsAddParams = {
  Player: string;
  RealName?: string;
  PW: string;
  Location: string;
  Email: string;
  Avatar?: string;
  Gender?: string;
  Chat?: string;
  Note?: string;
};

function postRequest(apiUrl: string, body: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(apiUrl);
    const isHttps = parsed.protocol === "https:";
    const lib = isHttps ? https : http;

    const req = lib.request(
      {
        hostname: parsed.hostname,
        port: parsed.port || (isHttps ? 443 : 80),
        path: `${parsed.pathname}${parsed.search}`,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body),
        },
        // CURLOPT_SSL_VERIFYPEER = false
        ...(isHttps && { rejectUnauthorized: false }),
      },
      (res) => {
        let data = "";
        res.on("data", (chunk: Buffer) => {
          data += chunk.toString();
        });
        res.on("end", () => resolve(data));
      }
    );

    req.on("error", (err) => reject(err));

    req.setTimeout(TIMEOUT_MS, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    req.write(body);
    req.end();
  });
}

/**
 * POST to Poker Mavens API — same behavior as PHP Poker_API().
 * Automatically adds Password and JSON=Yes to every request.
 */
export async function pokerApi(
  params: Record<string, string>
): Promise<PokerApiResponse> {
  const apiUrl = process.env.POKER_API_URL ?? url;
  const apiPassword = process.env.POKER_API_PASSWORD ?? pw;

  const postParams: Record<string, string> = {
    ...params,
    Password: apiPassword,
    JSON: "Yes",
  };

  const body = new URLSearchParams(postParams).toString();

  try {
    const response = await postRequest(apiUrl, body);

    if (!response) {
      return { Result: "Error", Error: "Connection failed" };
    }

    return JSON.parse(response) as PokerApiResponse;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { Result: "Error", Error: message };
  }
}

/** PHP-compatible alias */
export const Poker_API = pokerApi;

export async function accountsAdd(
  params: AccountsAddParams
): Promise<PokerApiResponse> {
  return pokerApi({
    Command: "AccountsAdd",
    Player: params.Player,
    RealName: params.RealName ?? "",
    PW: params.PW,
    Location: params.Location,
    Email: params.Email,
    Avatar: params.Avatar ?? "1",
    Gender: params.Gender ?? "Male",
    Chat: params.Chat ?? "Yes",
    Note: params.Note ?? "Account created via API",
  });
}

export async function verifyPassword(
  player: string,
  password: string
): Promise<PokerApiResponse> {
  return pokerApi({
    Command: "AccountsPassword",
    Player: player,
    PW: password,
  });
}

export async function getSessionKey(
  player: string
): Promise<PokerApiResponse> {
  return pokerApi({
    Command: "AccountsSessionKey",
    Player: player,
  });
}
