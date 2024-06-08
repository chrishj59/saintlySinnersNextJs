import BrandUI from '@/app/components/ui/secure/brandUI';
import { Brand } from '@/interfaces/brand.interface';

import { XtrBrandType } from '@/interfaces/xtraderBrand.type';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Brand maintenance',
};

export default async function BrandListPage() {
	const url = `${process.env.EDC_API_BASEURL}/xtrBrand`;

	const res = await fetch(url, { cache: 'no-store' });
	if (res.status !== 200) {
		return <div>Error getting brands</div>;
	}
	const brands = (await res.json()) as XtrBrandType[];
	// const _brands = brands.map((el: XtrBrandType) => {
	// 	const ret = { ...el };
	// 	if (!ret.catDescription) {
	// 		ret.catDescription = '';
	// 	}
	// 	return ret;
	// });

	return <BrandUI brandList={brands}>children</BrandUI>;
}
