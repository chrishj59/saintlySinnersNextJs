import { DELIVERY_CHARGE_MSG } from '@/interfaces/delivery-charge-message.type';
import { DELIVERY_CHARGE_TYPE } from '@/interfaces/delivery-charge.type';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const body = await req.json();

	const deliveryChargeMsg: DELIVERY_CHARGE_MSG = {
		vendorId: body.vendor.id,
		courierId: body.courier.id,
		countryId: body.country.id,
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

	try {
		//const url = process.env.EDC_API_BASEURL + '/deliveryCharge';
		// const { data } = await axios.post<DELIVERY_CHARGE_TYPE>(url, charge);
		const url = process.env.EDC_API_BASEURL + '/deliveryCharge';

		const chargeResp = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
			body: JSON.stringify(deliveryChargeMsg),
		});

		if (!chargeResp.ok) {
			console.error(`error status ${JSON.stringify(chargeResp.json, null, 2)}`);
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
	const deliveryChargeMsg: DELIVERY_CHARGE_MSG = {
		id: body.id,
		vendorId: body.vendor.id,
		courierId: body.courier.id,
		countryId: body.country.id,
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

	try {
		//const url = process.env.EDC_API_BASEURL + '/deliveryCharge';
		// const { data } = await axios.post<DELIVERY_CHARGE_TYPE>(url, charge);
		const chargeResp = await fetch(
			process.env.EDC_API_BASEURL + '/deliveryCharge',
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				cache: 'no-store',
				body: JSON.stringify(deliveryChargeMsg),
			}
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
