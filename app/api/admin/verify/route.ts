import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ success: false, error: "Contraseña requerida" }, { status: 400 });
    }

    // Compute SHA-256 hash of the input password
    const inputHash = crypto.createHash("sha256").update(password.trim()).digest("hex");

    // Read NEXT_ADMIN_PASSWORD_HASH strictly from server process.env
    const targetHash = process.env.NEXT_ADMIN_PASSWORD_HASH;

    if (!targetHash) {
      console.warn("⚠️ NEXT_ADMIN_PASSWORD_HASH no está configurada en .env.local o Vercel.");
      return NextResponse.json({ success: false, error: "NEXT_ADMIN_PASSWORD_HASH no configurada en servidor" }, { status: 500 });
    }

    const isValid = inputHash.toLowerCase() === targetHash.trim().toLowerCase();

    return NextResponse.json({ success: isValid });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
