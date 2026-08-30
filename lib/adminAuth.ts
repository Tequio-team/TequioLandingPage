"use client";

// SHA-256 Hash of default password "tequio2026"
// User can override this by setting NEXT_PUBLIC_ADMIN_PASSWORD_HASH in .env.local or Vercel
const DEFAULT_PASSWORD_HASH = "8e9185a62f5921868352b2f6b8f15b81a7b1b3fb490f8450125bb7e2d93e1b02";

const ADMIN_SESSION_KEY = "tequio_admin_authenticated";

// Hash a string using SHA-256 Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password.trim());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

// Verify if the input password matches the SHA-256 hash
export async function verifyAdminPassword(passwordInput: string): Promise<boolean> {
  const inputHash = await hashPassword(passwordInput);
  const targetHash = process.env.NEXT_PUBLIC_ADMIN_PASSWORD_HASH || DEFAULT_PASSWORD_HASH;
  return inputHash === targetHash;
}

// Check if currently authenticated in browser session
export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

// Set admin session state
export function setAdminSession(authenticated: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (authenticated) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    } else {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
  } catch (err) {
    console.warn("Could not set admin session:", err);
  }
}
