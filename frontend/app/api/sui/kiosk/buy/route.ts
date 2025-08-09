import { NextRequest, NextResponse } from "next/server";
import { currentRole } from "~~/services/rbac/roles";

export async function POST(req: NextRequest) {
  if (process.env.MARKETPLACE_DEV_BUY_ENABLED !== 'true') return NextResponse.json({ error: 'Buy disabled' }, { status: 403 });
  try {
    const role = await currentRole();
    if (role !== 'BUYER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json();
    const listingId = String(body.listingId || '');
    if (!listingId) return NextResponse.json({ error: 'listingId required' }, { status: 400 });

    // Placeholder: return a mock digest; real PTB build + sign goes here per Kiosk docs
    return NextResponse.json({ digest: `mock-digest-for-${listingId}` });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'buy failed' }, { status: 500 });
  }
}


