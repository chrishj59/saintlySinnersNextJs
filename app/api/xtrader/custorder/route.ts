import { CUSTOMER_ORDER } from '@/interfaces/customerOrder.type';
import { CUSTOMER_ORDER_RESPONSE } from '@/interfaces/customerOrderResponse.type';
import {
	CUST_ORDER_TYPE,
	ORDER_PRODUCT,
	CUST_ORDER_DELIVERY,
	CUST_ORDER_STATUS,
} from '@/interfaces/edcOrder.type';
import { revalidatePath } from 'next/cache';

import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(_req: NextRequest) {
	const order: CUST_ORDER_STATUS = (await _req.json()) as CUST_ORDER_STATUS;

	const url = `${process.env.EDC_API_BASEURL}/customerOrderStatus/${order.orderid}`;
	const orderUpdateResp = await fetch(url, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(order),
	});

	if (!orderUpdateResp.ok) {
		return NextResponse.json(
			{ statusText: orderUpdateResp.statusText },
			{ status: orderUpdateResp.status }
		);
	}

	if (!order.onetimeCust) {
		const url = `/userAccount/purchaseHistory/${order.userId}`;

		revalidatePath(url, 'page');
	}

	return NextResponse.json(order, { status: 200 });
}

export async function POST(_req: NextRequest) {
	const body: CUST_ORDER_TYPE = (await _req.json()) as CUST_ORDER_TYPE;

	/** save order as created */
	const url = `${process.env.EDC_API_BASEURL}/customerOrder`;
	const custOrderResp = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});
	if (!custOrderResp.ok) {
		console.warn(
			`error from nestjs status: ${custOrderResp.status} statusText: ${custOrderResp.statusText}`
		);
		return NextResponse.json(
			{ statusText: custOrderResp.statusText },
			{ status: custOrderResp.status }
		);
	}
	const custOrder = (await custOrderResp.json()) as CUSTOMER_ORDER_RESPONSE;
	if (custOrder) {
		return NextResponse.json(custOrder, { status: custOrderResp.status });
	}
	// const mode = process.env.NODE_ENV;

	// const orderURL = process.env.XTRADER_URL;
	// const orderCode =
	// 	mode === 'development'
	// 		? process.env.XTRADER_TEST_CODE
	// 		: process.env.XTRADER_TEST_CODE;

	return NextResponse.json({ Mesage: 'called cust order' }, { status: 200 });
}
