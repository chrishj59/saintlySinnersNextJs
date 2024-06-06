import { NextRequest, NextResponse } from 'next/server';
import { CATEGORY_TYPE } from '@/interfaces/category.type';

export async function PUT(req: NextRequest) {
	const body = await req.json();

	const url = `/category/${body.id}`;
	const catResp = await fetch(process.env.EDC_API_BASEURL + url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		cache: 'no-store',
		body: JSON.stringify(body),
	});

	if (!catResp.ok) {
		return NextResponse.json(
			{ message: catResp.statusText },
			{ status: catResp.status }
		);
	}
	const category = (await catResp.json()) as CATEGORY_TYPE;
	return NextResponse.json(category, { status: 200 });
}
