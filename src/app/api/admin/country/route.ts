import { COUNTRY_TYPE } from '@/interfaces/country.type';
import { NextRequest, NextResponse } from 'next/server';

type COUNTRY_TY = {
	id: number;
	edcCountryCode: number;
};
export async function PUT(req: NextRequest) {
	const body = await req.json();

	const country: COUNTRY_TY = {
		id: body.id,
		edcCountryCode: parseInt(body.edcCountryCode),
	};

	try {
		const url = process.env.EDC_API_BASEURL + '/country';
		console.log(`url ${url}`);
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
}
