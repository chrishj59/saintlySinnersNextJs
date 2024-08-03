import { xtraderCategorySelectType } from '@/interfaces/xtraderCategory.type';
import { MetadataRoute } from 'next';
import { notFound } from 'next/navigation';
export async function generateSitemaps() {
	// Fetch the total number of products and calculate the number of sitemaps needed
	const url = `${process.env.EDC_API_BASEURL}/xtrCategory-Menu`;
	const resp = await fetch(url);

	if (!resp.ok) {
		notFound();
	}
	const cats = (await resp.json()) as xtraderCategorySelectType[];

	return cats.map((c: xtraderCategorySelectType) => ({
		id: c.id.toString(),
	}));
}

export default async function sitemap({
	id,
}: {
	id: number;
}): Promise<MetadataRoute.Sitemap> {
	const BASE_URL = 'https://saintlysinners.co.uk';

	const url = process.env.EDC_API_BASEURL + `/xtrcategory/${id}`;
	const catResp = await fetch(url, { cache: 'no-cache' });

	const cats = (await catResp.json()) as xtraderCategorySelectType[];
	return cats.map((cat) => ({
		url: `${BASE_URL}/xtrader/category/${cat.id}`,
		lastModified: new Date(),
	}));
}
