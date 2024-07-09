import { ProductAxiosType } from '@/interfaces/product.type';
// import { Claims, getAccessToken, getSession } from '@auth0/nextjs-auth0';

import axios, { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
	console.log('called /api/edcupload');
	// const session = await getSession();

	// if (!session) {
	// 	return NextResponse.json({ message: 'login required', status: 501 });
	// }

	// const { accessToken } = await getAccessToken();
	console.log(`body is ${JSON.stringify(_req.body, null, 2)}`);
	const product = await _req.json();

	try {
		const { data } = await axios.post<ProductAxiosType>(
			process.env.NEXT_PUBLIC_EDC_API_BASEURL + '/product',
			product,
			{
				headers: {
					// Authorization: `Bearer ${accessToken}`,
				},
			}
		);
		console.log(`update from nestjs ${data}`);
		return NextResponse.json({ message: `created product id ${data.id}` });
	} catch (err) {
		if (axios.isAxiosError(err) && err.response) {
			console.error(err.status);
			console.error(`Axios error resp ${err.message}`);
			return NextResponse.json({
				message: `error ${err.message}`,
				status: err.status,
			});
		} else {
			return NextResponse.json({ message: `Other error`, status: 500 });
		}
	}
}
