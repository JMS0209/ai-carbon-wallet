import { NextRequest, NextResponse } from "next/server";
import { getSuiClient } from "~~/utils/suiMoney";

export async function POST(req: NextRequest) {
  if (!(process.env.NODE_ENV === 'development' && process.env.MARKETPLACE_DEV_MINT_ENABLED === 'true')) {
    return NextResponse.json({ error: 'Mint disabled' }, { status: 403 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const org = body.org || 'DevOrg';
    const kwh = Number(body.kwh ?? 1);
    const co2eq = Number(body.co2eq ?? 1);

    const packageId = process.env.NEXT_PUBLIC_SUI_PACKAGE_ID;
    if (!packageId) return NextResponse.json({ error: 'SUI_PACKAGE_ID missing' }, { status: 400 });

    // NOTE: For demo, we only build a transaction and return a placeholder since zkLogin signing
    // flow integration is environment-specific. Replace with real PTB + sign/execute using session.
    const client = getSuiClient();
    void client; // silence unused warning in placeholder

    return NextResponse.json({ objectId: 'mock-object-id' });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'mint failed' }, { status: 500 });
  }
}


