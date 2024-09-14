import { USER_ADDRESS_TYPE } from '@/interfaces/userAddress.type';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
	userId: string;
};

export async function POST(req: NextRequest, context: { params: Params }) {
	const userId = context.params.userId;
	const address = (await req.json()) as USER_ADDRESS_TYPE;
	console.log(
		`/api/user/address/post address ${JSON.stringify(address, null, 2)}`
	);
	const url = `${process.env.EDC_API_BASEURL}/userAddress/${userId}`;
	console.log(`userId ${userId}`);
	const addressResp = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(address),
	});
	console.log(
		`call to ${url} returned status ${addressResp.status} statusText ${addressResp.statusText}`
	);
	if (!addressResp.ok) {
		console.warn(
			`Add address to user ${userId} failed. Status: ${addressResp.status} text: ${addressResp.statusText}`
		);
		return NextResponse.json(
			{ text: `error saving address ${addressResp.statusText}` },
			{ status: addressResp.status }
		);
	}
	const _address = (await addressResp.json()) as USER_ADDRESS_TYPE;
	return NextResponse.json(_address, { status: addressResp.status });
}

export async function PATCH(req: NextRequest, context: { params: Params }) {
	const userId = context.params.userId;
	const address = (await req.json()) as USER_ADDRESS_TYPE;
	console.log(
		`/api/user/address/patch called with address ${JSON.stringify(
			address,
			null,
			2
		)}`
	);
	const url = `${process.env.EDC_API_BASEURL}/userAddress/${userId}`;
	const addressResp = await fetch(url, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(address),
	});
	if (!addressResp.ok) {
		console.warn(
			`Add address to user ${userId} failed. Status: ${addressResp.status} text: ${addressResp.statusText}`
		);
		return NextResponse.json(
			{ text: `error saving address ${addressResp.statusText}` },
			{ status: addressResp.status }
		);
	} else {
		const _address = (await addressResp.json()) as USER_ADDRESS_TYPE;
		return NextResponse.json(_address, { status: addressResp.status });
	}
}
