import { BrandSaveType } from '@/interfaces/brandSave.type';
import { XtrBrandType } from '@/interfaces/xtraderBrand.type';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
	const payload = (await req.json()) as XtrBrandType;

	const _brand: BrandSaveType = {
		id: payload.id,
		name: payload.name,
		imageName: payload.imageName ? payload.imageName : '',
		isFavourite: payload.isFavourite,
		ranking: payload.ranking,
		imageKey: payload.image?.key ? payload.image.key : '',
	};
	const url = `${process.env.EDC_API_BASEURL}/xtrBrand`;
	const nestApiResp = await fetch(url, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		// cache: 'no-store',
		body: JSON.stringify(_brand),
	});

	if (!nestApiResp.ok) {
		throw new Error(
			`Error connecting to back end ${nestApiResp.status} Text ${nestApiResp.statusText}`
		);
	}

	const updatedBrand = (await nestApiResp.json()) as XtrBrandType;
	console.log(`updatedBrand ${JSON.stringify(updatedBrand, null, 2)}`);

	return NextResponse.json(updatedBrand, { status: nestApiResp.status });
}
