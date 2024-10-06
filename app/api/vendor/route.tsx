import { RESPONSE_MESSAGE_TYPE } from '@/interfaces/responseMessage.interface';
import { VENDOR_TYPE } from '@/interfaces/vendor.type';
import { MessageStatusEnum } from '@/utils/Message-status.enum';
// import { getAccessToken, getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import getServerSession from 'next-auth';
export async function POST(_req: NextRequest) {
	const vendor = (await _req.json()) as VENDOR_TYPE;

	try {
		const url = process.env.EDC_API_BASEURL + '/vendor';

		const vendorResp = await fetch(process.env.EDC_API_BASEURL + '/vendor', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(vendor),
		});
		if (!vendorResp.ok) {
			console.warn(`Error ${vendorResp.status} ${vendorResp.statusText}`);
			throw new Error(`${vendorResp.status} ${vendorResp.statusText}`);
		}
		const vendorData = (await vendorResp.json()) as VENDOR_TYPE;

		return NextResponse.json(vendorData);
	} catch (error: any) {
		if (error instanceof SyntaxError) {
			// Unexpected token < in JSON
		} else {
			console.error('Could not find charges');
			console.error(error);
		}
		let message: RESPONSE_MESSAGE_TYPE = {
			status: MessageStatusEnum.ERROR,
			message: `${JSON.stringify(error, null, 2)}`,
		};
	}
}
