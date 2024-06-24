import { XtraderProduct } from '@/interfaces/xtraderProduct.type';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const payload = (await req.json()) as XtraderProduct;

	const url = process.env.EDC_API_BASEURL + '/xtrProd';
	console.log(`xtrProduct post url ${url}`);
	console.log(`payload ${JSON.stringify(payload, null, 2)}`);

	const prodResp = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	});

	if (prodResp.ok) {
		revalidatePath(
			'(saintly-sinners-public)/product/brandProduct/[id]',
			'page'
		);
		revalidatePath(
			'(saintly-sinners-public)/product/categoryProduct/[id]',
			'page'
		);
		return NextResponse.json(
			{ message: `Saved product id: ${payload.id}` },
			{ status: prodResp.status }
		);
	} else {
		console.error(
			`status returned status ${prodResp.status} status text ${prodResp.statusText} text: ${prodResp.text}`
		);
		const message = await prodResp.json();

		console.error(
			`In route handler Could not save product id ${payload.id} status ${
				prodResp.status
			} reason ${prodResp.statusText} message: ${JSON.stringify(
				message,
				null,
				2
			)}`
		);
		return NextResponse.json(
			{
				message: `Product id: ${payload.id} save failed with reason ${prodResp.statusText}`,
			},
			{ status: prodResp.status }
		);
	}
}
