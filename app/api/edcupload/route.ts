import { ProductAxiosType } from '@/interfaces/product.type';
// import { Claims, getAccessToken, getSession } from '@auth0/nextjs-auth0';

import axios, { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
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
