import { XtraderProdLike } from '@/interfaces/xtraderProduct.type';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const body = (await req.json()) as XtraderProdLike;

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

	if (!likeResp.ok) {
		return NextResponse.json({
			message: `${likeResp.statusText} status: ${likeResp.status}`,
		});
	} else {
		const like = await likeResp.json();

		return NextResponse.json({
			message: `${likeResp.statusText}`,
			status: `${likeResp.status}`,
		});
	}
}
