import { DELIVERY_CHARGE_MSG } from '@/interfaces/delivery-charge-message.type';
import { DELIVERY_CHARGE_TYPE } from '@/interfaces/delivery-charge.type';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
	const body = await req.json();
	console.log(`delivery charge post body ${JSON.stringify(body, null, 2)}`);
	const deliveryChargeMsg: DELIVERY_CHARGE_MSG = {
		vendorId: body.vendor,
		courierId: body.courier.id,
		countryId: body.country,
		shippingModule: body.courier.shippingModule,
		uom: body.uom,
		maxWeight: body.maxWeight,
		minWeight: body.minWeight,
		minDays: body.minDays,
		maxDays: body.maxDays,
		durationDescription: body.durationDescription,
		amount: body.amount,
		hasLostClaim: body.hasLostClaim,
		hasTracking: body.hasTracking,
	};

	console.log(
		`delivery charge post message ${JSON.stringify(deliveryChargeMsg, null, 2)}`
	);
	try {
		//const url = process.env.EDC_API_BASEURL + '/deliveryCharge';
		// const { data } = await axios.post<DELIVERY_CHARGE_TYPE>(url, charge);
		const url = process.env.EDC_API_BASEURL + '/deliveryCharge';
		console.log(
			`deliveryChargeMsg ${JSON.stringify(deliveryChargeMsg, null, 2)}`
		);
		const chargeResp = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			// cache: 'no-store',
			body: JSON.stringify(deliveryChargeMsg),
		});

		if (!chargeResp.ok) {
			console.log(`delcharge url ${url}`);
			console.log(`error text ${JSON.stringify(chargeResp, null, 2)}`);
			console.error(
				`deliery charge route error status ${JSON.stringify(
					chargeResp.json,
					null,
					2
				)}`
			);
			return NextResponse.json(
				{ message: chargeResp.statusText },
				{ status: chargeResp.status }
			);
		}
		const newCharge = (await chargeResp.json()) as DELIVERY_CHARGE_TYPE;

		return NextResponse.json(newCharge);
	} catch (err) {
		console.error('Error from axios update');
		console.error(err);
		return NextResponse.json({ message: err }, { status: 500 });
		//_res.status(500).json(err);
	}
}

export async function PUT(req: NextRequest) {
	const body = await req.json();
	console.log(
		`/api/deliveryCharge put called with  ${JSON.stringify(body, null, 2)}`
	);
	const deliveryChargeMsg: DELIVERY_CHARGE_MSG = {
		id: body.id,
		vendorId: body.vendor.id,
		courierId: body.courier.id,
		countryId: body.country.id,
		shippingModule: body.courier.shippingModule,
		uom: body.uom,
		maxWeight: body.maxWeight,
		minWeight: body.minWeight,
		minDays: body.minDays,
		maxDays: body.maxDays,
		durationDescription: body.durationDescription,
		amount: body.amount,
		hasLostClaim: body.hasLostClaim,
		hasTracking: body.hasTracking,
	};
	console.log(
		`deliveryChargeMsg ${JSON.stringify(deliveryChargeMsg, null, 2)}`
	);
	try {
		const url = process.env.EDC_API_BASEURL + '/deliveryCharge';
		console.log(`url ${url}`);
		// const { data } = await axios.post<DELIVERY_CHARGE_TYPE>(url, charge);
		const chargeResp = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-cache',
			body: JSON.stringify(deliveryChargeMsg),
		});

		console.log(
			`response from nest ${JSON.stringify(chargeResp.headers, null, 2)}`
		);
		if (!chargeResp.ok) {
			console.log(
				`error text: ${chargeResp.statusText} status ${chargeResp.status}`
			);
			return NextResponse.json(
				{ message: chargeResp.statusText },
				{ status: chargeResp.status }
			);
		}

		const newCharge = (await chargeResp.json()) as DELIVERY_CHARGE_TYPE;
		revalidateTag('deliveryCharge');
		return NextResponse.json(newCharge);
	} catch (err) {
		console.error('Error from axios update');
		console.error(err);
		return NextResponse.json({ message: err }, { status: 500 });
		//_res.status(500).json(err);
	}
}

export async function DELETE(req: NextRequest) {
	const body = await req.json();

	const url = process.env.EDC_API_BASEURL + `/deliveryCharge/${body.id}`;
	const resp = await fetch(url, { method: 'DELETE' });

	console.log(`resp status ${JSON.stringify(resp.ok)}`);
	if (!resp.ok) {
		console.log(`Error getting from nestjs ${resp.status} ${resp.statusText}`);
		return NextResponse.json(
			{ message: 'Failed to delete from DB' },
			{ status: 400 }
		);
	}
	return NextResponse.json(body);
}
