import crypto from "crypto";

const JWT_SECRET = process.env.REFERRAL_JWT_SECRET;
// Fallback only to allow build to pass if env is missing; requests will fail verification
const SECRET_KEY = JWT_SECRET ? Buffer.from(JWT_SECRET) : crypto.randomBytes(32);

/**
 * Generates a random referral code like "GT-R7K29P"
 */
export function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed ambiguous chars like I, 1, O, 0
  const randomBytes = crypto.randomBytes(6);
  let code = "GT-";
  for (let i = 0; i < 6; i++) {
    code += chars[randomBytes[i] % chars.length];
  }
  return code;
}

function base64urlEncode(buf: Buffer | string): string {
  const buffer = typeof buf === "string" ? Buffer.from(buf, "utf8") : buf;
  return buffer.toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function base64urlDecode(str: string): Buffer {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  return Buffer.from(str, "base64");
}

/**
 * Signs a payload into a simple JWT (HS256)
 */
export function signReferrerJwt(referrerId: string): string {
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    referrerId,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
    iat: Math.floor(Date.now() / 1000),
  };

  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));

  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(signatureInput);
  const signature = base64urlEncode(hmac.digest());

  return `${signatureInput}.${signature}`;
}

/**
 * Verifies a simple JWT (HS256) and returns the payload if valid
 */
export function verifyReferrerJwt(token: string): { referrerId: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    const hmac = crypto.createHmac("sha256", SECRET_KEY);
    hmac.update(signatureInput);
    const expectedSignature = base64urlEncode(hmac.digest());

    if (signature !== expectedSignature) return null;

    const payloadStr = base64urlDecode(encodedPayload).toString("utf8");
    const payload = JSON.parse(payloadStr);

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return { referrerId: payload.referrerId };
  } catch (error) {
    return null;
  }
}
