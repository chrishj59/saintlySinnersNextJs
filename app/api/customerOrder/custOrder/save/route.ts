import { NextRequest, NextResponse } from 'next/server';
import { CUST_ORDER_TYPE } from '@/interfaces/edcOrder.type';

export async function POST(req: NextRequest) {
	const edcOrder = (await req.json()) as CUST_ORDER_TYPE;
	const url = process.env.EDC_API_BASEURL + '/customerOrder';
	console.warn(
		`call save customer order with ${JSON.stringify(edcOrder, null, 2)}`
	);
	try {
		const orderResp = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
			body: JSON.stringify(edcOrder),
		});
		if (!orderResp.ok) {
			console.error(
				`Coulsd not save customer order ${orderResp.status} ${orderResp.statusText}`
			);
			return NextResponse.json(
				{ message: 'could not save custumer order ${orderResp.statusText' },
				{ status: orderResp.status }
			);
		}
		const order = await orderResp.json();
		return NextResponse.json(order, { status: 200 });
	} catch (error) {
		if (error instanceof SyntaxError) {
			// Unexpected token < in JSON

			return NextResponse.json(
				{ message: 'nest - JSON response error' },
				{ status: 500 }
			);
		} else {
			console.error('Could not find charges');
			console.error(error);
			return NextResponse.json(
				{ message: `Unexpected error ${error}` },
				{ status: 500 }
			);
		}
	}
	return NextResponse.json(
		{ message: 'Save Customer order Route found' },
		{ status: 200 }
	);
}
