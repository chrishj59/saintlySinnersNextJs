import {
	xtrStockLevelUpdateApiResp,
	xtraderStockLevelType,
} from '@/interfaces/xtraderStockLevel.type';
import { NextRequest, NextResponse, userAgent } from 'next/server';

import xml2js, { parseStringPromise } from 'xml2js';

export async function POST(_req: NextRequest) {
	const { ua } = userAgent(_req);
	console.log(`ua ${ua}`);
	const statusUrl = `${process.env.EDC_API_BASEURL}/xtrStockLevel`;

	const body = (await _req.json()) as xtraderStockLevelType;
	console.log(
		`/api/xtrader/stock-status called with body: ${JSON.stringify(
			body,
			null,
			2
		)}`
	);

	const statusResp = await fetch(statusUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'User-Agent': ua,
		},
		body: JSON.stringify(body),
	});
	if (!statusResp.ok) {
		return NextResponse.json(statusResp.statusText, {
			status: statusResp.status,
		});
	}
	const stockStatus = (await statusResp.json()) as xtrStockLevelUpdateApiResp;
	console.log(
		`stock status update from api ${JSON.stringify(stockStatus, null, 2)}`
	);
	return NextResponse.json(stockStatus, { status: 200 });
}
const parsedXml = async (xmlString2: string) => {
	const parsed = await parseStringPromise(xmlString2);
	return parsed['STOREITEMS']['PRODUCT'];
};

export async function GET(_req: NextRequest) {
	const url = 'https://www.xtrader.co.uk/catalog/xml-feed/stockatt.xml';
	const stocklevelResp = await fetch(url, { cache: 'no-cache' });
	if (!stocklevelResp.ok) {
		return NextResponse.json(
			{
				xtraderStatus: stocklevelResp.status,
				xtraderStatusText: stocklevelResp.statusText,
			},
			{ status: 501 }
		);
	}
	const xmlString = await stocklevelResp.text();
	const stockJson = await parsedXml(xmlString);

	return NextResponse.json(stockJson, { status: 200 });
}
