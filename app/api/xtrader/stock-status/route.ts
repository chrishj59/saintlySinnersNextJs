import { xtraderStockLevelType } from '@/interfaces/xtraderStockLevel.type';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
	const body = (await _req.json()) as xtraderStockLevelType;
	console.log(
		`/api/xtrader/stock-status body: ${JSON.stringify(body, null, 2)}`
	);
	return NextResponse.json(body, { status: 200 });
}
