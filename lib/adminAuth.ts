"use client";

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

// Verify if the input password matches the SHA-256 hash defined strictly in process.env
export async function verifyAdminPassword(passwordInput: string): Promise<boolean> {
  const inputHash = await hashPassword(passwordInput);

  // Read hash strictly from environment variable
  const targetHash = process.env.NEXT_ADMIN_PASSWORD_HASH || process.env.NEXT_ADMIN_PASSWORD_HASH;

  if (!targetHash) {
    console.warn("⚠️ No se ha definido NEXT_PUBLIC_ADMIN_PASSWORD_HASH en .env.local o Vercel.");
    return false;
  }

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
