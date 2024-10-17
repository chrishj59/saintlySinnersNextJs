import { USER_ADDRESS_TYPE } from '@/interfaces/userAddress.type';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
	userId: string;
};

export async function POST(req: NextRequest, context: { params: Params }) {
	const userId = context.params.userId;
	const address = (await req.json()) as USER_ADDRESS_TYPE;

	const url = `${process.env.EDC_API_BASEURL}/userAddress/${userId}`;

	const addressResp = await fetch(url, {
		method: 'POST',
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
	}
	const _address = (await addressResp.json()) as USER_ADDRESS_TYPE;
	revalidatePath('/userAccount');
	return NextResponse.json(_address, { status: addressResp.status });
}

export async function PATCH(req: NextRequest, context: { params: Params }) {
	const userId = context.params.userId;
	const address = (await req.json()) as USER_ADDRESS_TYPE;

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
			`Update address for user ${userId} failed. Status: ${addressResp.status} text: ${addressResp.statusText}`
		);
		return NextResponse.json(
			{ text: `error saving address ${addressResp.statusText}` },
			{ status: addressResp.status }
		);
	} else {
		const _address = (await addressResp.json()) as USER_ADDRESS_TYPE;
		revalidatePath('/userAccount');
		return NextResponse.json(_address, { status: addressResp.status });
	}
}

export async function GET(req: NextRequest, context: { params: Params }) {
	const userId = context.params.userId;
	const address = (await req.json()) as USER_ADDRESS_TYPE;

	const url = `${process.env.EDC_API_BASEURL}/userAddress/${userId}`;
	const addressResp = await fetch(url);
	if (!addressResp.ok) {
		console.warn(
			`Get addresses for user ${userId} failed. Status: ${addressResp.status} text: ${addressResp.statusText}`
		);
		return NextResponse.json(
			{ text: `error getting address ${addressResp.statusText}` },
			{ status: addressResp.status }
		);
	} else {
		const _address = (await addressResp.json()) as USER_ADDRESS_TYPE;
		return NextResponse.json(_address, { status: addressResp.status });
	}
}
