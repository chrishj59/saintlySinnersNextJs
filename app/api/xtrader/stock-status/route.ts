import {
	xtrStockLevelUpdateApiResp,
	xtraderStockLevelType,
} from '@/interfaces/xtraderStockLevel.type';
import { NextRequest, NextResponse, userAgent } from 'next/server';

import xml2js, { parseStringPromise } from 'xml2js';

export async function POST(_req: NextRequest) {
	const { ua } = userAgent(_req);

	const statusUrl = `${process.env.EDC_API_BASEURL}/xtrStockLevel`;

	const body = (await _req.json()) as xtraderStockLevelType;

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

	if (xmlString.length > 0) {
		const stockJson = await parsedXml(xmlString);

		return NextResponse.json(stockJson, { status: 200 });
	} else {
		return NextResponse.json(
			{ message: ' no data from status update' },
			{ status: stocklevelResp.status }
		);
	}
}
