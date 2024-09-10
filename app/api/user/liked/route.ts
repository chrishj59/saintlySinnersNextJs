import { XtraderProdLike } from '@/interfaces/xtraderProduct.type';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const body = (await req.json()) as XtraderProdLike;
	console.log(
		`/api/user/liked post body received ${JSON.stringify(body, null, 2)}`
	);
	const likeBody: XtraderProdLike = {
		id: body.userId ? body.userId : '',
		productId: body.productId,
		userId: body.userId,
		liked: body.liked,
	};
	const url = `${process.env.EDC_API_BASEURL}/likeItem`;

	const likeResp = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(likeBody),
	});
	console.log(`likeResp.ok ${likeResp.ok} statusText: ${likeResp.statusText} `);
	if (!likeResp.ok) {
		console.log(
			`nest API error status ${likeResp.status} text: ${likeResp.statusText} `
		);
		return NextResponse.json({
			message: `${likeResp.statusText} status: ${likeResp.status}`,
		});
	} else {
		const like = await likeResp.json();
		console.log(`like returned from next back end`);
		return NextResponse.json({
			message: `${likeResp.statusText}`,
			status: `${likeResp.status}`,
		});
	}
}
