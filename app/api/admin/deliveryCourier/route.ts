import { COURIER_TYPE } from '@/interfaces/courier.type';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
	const body = await req.json();
	console.log(
		`/api/admin.courier patch called with body ${JSON.stringify(body, null, 2)}`
	);
	const url = `${process.env.EDC_API_BASEURL}/courier`;
	const courierResp = await fetch(url, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		// cache: 'no-store',
		body: JSON.stringify(body),
	});
	console.log(`courierResp ${JSON.stringify(courierResp.status, null, 2)}`);
	if (!courierResp.ok) {
		console.log('error getting response from patch courier');
		return NextResponse.json(courierResp.status, {
			status: courierResp.status,
		});
	}
	const updated = (await courierResp.json()) as number;
	console.log(`updated: ${updated}`);
	return NextResponse.json(
		{ message: `Updated Delivery Couriers ` },
		{ status: courierResp.status }
	);
}

export async function POST(req: NextRequest) {
	const body = (await req.json()) as COURIER_TYPE;
	console.log(
		`delivery charge post called with ${JSON.stringify(body, null, 2)}`
	);
	const courier: any = {
		name: body.name,
		shippingModule: body.shippingModule,
		cutoffTime: body.cutoffTime,
	};
	const url = `${process.env.EDC_API_BASEURL}/courier`;
	console.log(`post url ${url}`);
	const courierResp = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(courier),
	});

	if (!courierResp.ok) {
		console.log(
			`error getting response from post courier status ${courierResp.status} statusText ${courierResp.statusText}`
		);
		return NextResponse.json(courierResp.status, {
			status: courierResp.status,
		});
	}
	const _courier = (await courierResp.json()) as COURIER_TYPE;
	return NextResponse.json(_courier, { status: courierResp.status });
}
