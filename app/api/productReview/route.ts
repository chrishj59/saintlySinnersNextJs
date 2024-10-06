import { productReviewType } from '@/interfaces/product-review.type';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
	console.log('/api/productOverview');
	const review = (await _req.json()) as productReviewType;

	const url = `${process.env.EDC_API_BASEURL}/xtrProdctReview`;
	const reviewReq = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(review),
	});
	console.log(`nestAPI returns ${JSON.stringify(review, null, 2)}`);
	if (!reviewReq.ok) {
		return NextResponse.json(
			{ errorText: reviewReq.statusText },
			{ status: reviewReq.status }
		);
	}
	const _review = (await reviewReq.json()) as productReviewType;
	return NextResponse.json(_review, { status: reviewReq.status });
}
