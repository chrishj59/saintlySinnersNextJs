import { COUNTRY_TYPE } from '@/interfaces/country.type';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { auth } from '@/auth';
type COUNTRY_TY = {
	id: number;
	edcCountryCode: number;
	deliveryActive: boolean;
};
// export async function PUT(req: NextRequest) {
export const PUT = auth(async function PUT(req) {
	if (req.auth) {
		const body = await req.json();

		const country: COUNTRY_TY = {
			id: body.id,
			edcCountryCode: parseInt(body.edcCountryCode),
			deliveryActive: body.deliveryActive,
		};

		try {
			const url = process.env.EDC_API_BASEURL + '/country';

			const countryResp = await fetch(url, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				cache: 'no-cache',
				body: JSON.stringify(country),
			});

			if (!countryResp.ok) {
				return NextResponse.json(
					{
						message: `Country update failed status ${countryResp.status} ${countryResp.statusText}`,
					},
					{ status: countryResp.status }
				);
			}

			const updatedCountry = (await countryResp.json()) as COUNTRY_TYPE;

			revalidateTag('countries');
			return NextResponse.json(updatedCountry, { status: 200 });
		} catch (error) {
			if (error instanceof SyntaxError) {
				// Unexpected token < in JSON
				console.warn('There was a SyntaxError', error);
				return NextResponse.json(
					{ message: 'There was a SyntaxError' },
					{ status: 500 }
				);
			} else {
				console.error('Could not update country');
				console.error(error);
				return NextResponse.json(
					{ message: `Update error ${JSON.stringify(error, null, 2)}` },
					{ status: 500 }
				);
			}
		}
	} else {
		return NextResponse.json(
			{ message: 'Not authorised to update country' },
			{ status: 401 }
		);
	}
});
