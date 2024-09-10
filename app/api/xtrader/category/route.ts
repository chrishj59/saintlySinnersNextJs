import {
	categoriesFileType,
	xtraderCategorySelectType,
	xtraderCategoryType,
} from '@/interfaces/xtraderCategory.type';
import { revalidatePath } from 'next/cache';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
	const body = (await _req.json()) as categoriesFileType;

	const cat = {
		id: parseInt(body.categories_id),
		name: body.categories_name[0],
		parentId: parseInt(body.parent_id),
		category_image: body.categories_image[0],
	};

	const catUrl = `${process.env.EDC_API_BASEURL}/xtrCat`;

	try {
		const catResp = await fetch(catUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(cat),
		});

		if (!catResp.ok) {
			return NextResponse.json(
				{ message: `could not save ${cat.name} ${catResp.statusText}` },
				{ status: catResp.status }
			);
		}
		const _cats = (await catResp.json()) as xtraderCategorySelectType[];

		console.log(
			`loaded xtrCats ${_cats.length} cat: ${JSON.stringify(_cats, null, 2)}`
		);
		revalidatePath('/product');

		return NextResponse.json(_cats, { status: catResp.status });
	} catch (err) {
		return NextResponse.json(
			{ message: `could not save ${cat.name} ${JSON.stringify(err, null, 2)}` },
			{ status: 500 }
		);
	}
}
