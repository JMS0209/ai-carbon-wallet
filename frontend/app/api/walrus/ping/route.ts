import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_WALRUS_URL;
  if (!url) return NextResponse.json({ ok: false, reason: "WALRUS_URL not set" }, { status: 200 });
  try {
    const controller = new AbortController();
    const to = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { method: "HEAD", signal: controller.signal });
    clearTimeout(to);
    return NextResponse.json({ ok: res.ok }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, reason: e?.message || "ping failed" }, { status: 200 });
  }
}


