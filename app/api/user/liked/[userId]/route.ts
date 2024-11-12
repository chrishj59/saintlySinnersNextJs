import { NextResponse } from 'next/server';

type Params = {
	userId: string;
};

export async function GET(request: Request, context: { params: Params }) {
	const userId = context.params.userId;

	const url = `${process.env.EDC_API_BASEURL}/likeItem/${userId}`;
	const likedProdResp = await fetch(url, { cache: 'no-cache' });

	if (likedProdResp.ok) {
		const likedProds = await likedProdResp.json();

		return NextResponse.json(likedProds);
	} else {
		return NextResponse.json({
			text: likedProdResp.statusText,
			status: likedProdResp.status,
		});
	}
}
