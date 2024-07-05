import { RESPONSE_MESSAGE_TYPE } from '@/interfaces/responseMessage.interface';
import { VENDOR_TYPE } from '@/interfaces/vendor.type';
import { MessageStatusEnum } from '@/utils/Message-status.enum';
// import { getAccessToken, getSession } from '@auth0/nextjs-auth0';
import { ForbiddenException } from 'next-api-decorators';
import { NextRequest, NextResponse } from 'next/server';
import getServerSession from 'next-auth';
export async function POST(_req: NextRequest) {
	console.log('called /api/edcupload');
	// const session = await getServerSession()
	// const session = await getSession();

	// if (!session) {
	// 	throw new Error('You need to be logged in ');
	// }

	// const { accessToken } = await getAccessToken();
	const vendor = (await _req.json()) as VENDOR_TYPE;
	console.log(`vendor in /api/vendor ${JSON.stringify(vendor, null, 2)}`);
	try {
		const url = process.env.EDC_API_BASEURL + '/vendor';
		console.log(`url ${JSON.stringify(url)}`);
		const vendorResp = await fetch(process.env.EDC_API_BASEURL + '/vendor', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(vendor),
		});
		if (!vendorResp.ok) {
			console.log(`Error ${vendorResp.status} ${vendorResp.statusText}`);
			throw new Error(`${vendorResp.status} ${vendorResp.statusText}`);
		}
		const vendorData = (await vendorResp.json()) as VENDOR_TYPE;
		console.log(`vendor from save ${JSON.stringify(vendorData, null, 2)}`);
		return NextResponse.json(vendorData);
	} catch (error: any) {
		if (error instanceof SyntaxError) {
			// Unexpected token < in JSON
			console.log('There was a SyntaxError', error);
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
