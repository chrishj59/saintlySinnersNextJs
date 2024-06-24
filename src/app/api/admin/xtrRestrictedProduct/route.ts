import { restrProdRespIF } from '@/interfaces/xtrRestrProdResp.interface';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const payload = await req.json();
	const url = `${process.env.EDC_API_BASEURL}/xtrRestrictedProduct`;

	const restrictedProdResp = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	});

	if (restrictedProdResp.ok) {
		const updated = (await restrictedProdResp.json()) as restrProdRespIF;

		return NextResponse.json(updated, { status: restrictedProdResp.status });
	} else {
		return NextResponse.json(
			{
				status: restrictedProdResp.status,
				text: restrictedProdResp.statusText,
			},
			{ status: restrictedProdResp.status }
		);
	}
	console.log(
		`xtrRestrictedProduct route payload ${JSON.stringify(payload, null, 2)}`
	);

	return NextResponse.json(payload);
}
