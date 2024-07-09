import { xtraderCategoryType } from '@/interfaces/xtraderCategory.type';
import { NextRequest, NextResponse } from 'next/server';
import { cache } from 'react';

export async function GET(req: NextRequest) {
	const url = process.env.EDC_API_BASEURL + '/xtrCategory-Menu';

	try {
		const resp = await fetch(url, { next: { revalidate: 86400 } });

		if (!resp.ok) {
			return NextResponse.json(
				{ message: `` },
				{ status: resp.status, statusText: resp.statusText }
			);
		}

		const categories = (await resp.json()) as xtraderCategoryType;

		return NextResponse.json(categories, {
			status: resp.status,
			statusText: resp.statusText,
		});
	} catch (error) {
		let errMessage: string;
		if (error instanceof SyntaxError) {
			// Unexpected token in JSON
			console.error('There was a SyntaxError', error);
			errMessage = `There was a SyntaxError ${JSON.stringify(error, null, 2)}`;
		} else {
			console.error('There was an error', error);
			errMessage = `There was an error from backend api ${JSON.stringify(
				error,
				null,
				2
			)}`;
		}
		return NextResponse.json(errMessage, {
			status: 500,
			statusText: 'Bad request',
		});
	}
}
