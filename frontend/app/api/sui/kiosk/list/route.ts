import { NextRequest, NextResponse } from "next/server";
import { toMist } from "~~/utils/suiMoney";
import { currentRole } from "~~/services/rbac/roles";

export async function POST(req: NextRequest) {
  if (process.env.MARKETPLACE_DEV_LIST_ENABLED !== 'true') return NextResponse.json({ error: 'List disabled' }, { status: 403 });
  try {
    const role = await currentRole();
    if (role !== 'SIGNER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json();
    const nftId = String(body.nftId || '');
    const priceSui = String(body.priceSui || '0');
    if (!nftId) return NextResponse.json({ error: 'nftId required' }, { status: 400 });
    const priceMist = toMist(priceSui);

    // Placeholder: return a mock digest; real PTB build + sign goes here per Kiosk docs
    return NextResponse.json({ listingId: `mock-${nftId}`, mist: priceMist.toString() });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'list failed' }, { status: 500 });
  }
}


