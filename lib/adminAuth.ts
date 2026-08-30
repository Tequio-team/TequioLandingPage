"use client";

const ADMIN_SESSION_KEY = "tequio_admin_authenticated";

// Verify if the input password matches NEXT_ADMIN_PASSWORD_HASH via server API
export async function verifyAdminPassword(passwordInput: string): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: passwordInput }),
    });

    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error("Error verificando contraseña admin:", err);
    return false;
  }
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
