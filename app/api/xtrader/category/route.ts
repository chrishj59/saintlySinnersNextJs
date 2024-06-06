import {
	categoriesFileType,
	xtraderCategoryType,
} from '@/interfaces/xtraderCategory.type';
import { revalidatePath } from 'next/cache';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
	const body = (await _req.json()) as categoriesFileType;
	console.log(
		`/api/xtrader/category called with ${JSON.stringify(body, null, 2)}`
	);

	const cat = {
		id: parseInt(body.categories_id),
		name: body.categories_name[0],
		parentId: parseInt(body.parent_id),
		category_image: body.categories_image[0],
	};

	console.log(`cat passed ${JSON.stringify(cat)}`);

	const catUrl = `${process.env.EDC_API_BASEURL}/xtrCat`;
	console.log(`catUrl ${catUrl}`);
	console.log(`cat set ${JSON.stringify(cat, null, 2)}`);
	try {
		const catResp = await fetch(catUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(cat),
		});
		console.log(`catResp status ${catResp.status}`);
		if (!catResp.ok) {
			console.log(
				`error saving  cat status ${catResp.status} ${catResp.statusText}`
			);
			return NextResponse.json(
				{ message: `could not save ${cat.name} ${catResp.statusText}` },
				{ status: catResp.status }
			);
		}
		const _cat = await catResp.json();

		console.log(`saved cat ${JSON.stringify(cat, null, 2)}`);
		return NextResponse.json(_cat, { status: catResp.status });
	} catch (err) {
		console.log(`save cat error ${JSON.stringify(err, null, 2)}`);
		return NextResponse.json(
			{ message: `could not save ${cat.name} ${JSON.stringify(err, null, 2)}` },
			{ status: 500 }
		);
	}

	// try {
	// 	const url = `${process.env.EDC_API_BASEURL}/xtrCat`;
	// 	const catResp = await fetch(url, {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 		},
	// 		body: JSON.stringify(cat),
	// 	});
	// 	console.log(`onSubmitAdd ${JSON.stringify(catResp.ok, null, 2)}`);
	// 	if (!catResp.ok) {
	// 		throw new Error(`${catResp.status} ${catResp.statusText}`);
	// 	}
	// 	return NextResponse.json(
	// 		{ message: 'Created', Name: `${cat.name}` },
	// 		{ status: 200 }
	// 	);
	// } catch (error) {
	// 	if (error instanceof SyntaxError) {
	// 		// Unexpected token < in JSON
	// 		console.warn('There was a SyntaxError', error);
	// 		return NextResponse.json(
	// 			{ message: 'Syntax error', Name: `${error.message}` },
	// 			{ status: 500 }
	// 		);
	// 	} else {
	// 		console.error('Could not find charges');
	// 		console.error(error);
	// 		return NextResponse.json(
	// 			{ message: 'Syntax error', Name: `${error}` },
	// 			{ status: 500 }
	// 		);
	// 	}
	// }
}
