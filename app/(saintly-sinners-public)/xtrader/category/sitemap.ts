import { xtraderCategorySelectType } from '@/interfaces/xtraderCategory.type';
import { MetadataRoute } from 'next';
import { notFound } from 'next/navigation';

export default async function sitemap({
	id,
}: {
	id: number;
}): Promise<MetadataRoute.Sitemap> {
	const BASE_URL = process.env.SAINTLY_URL;
	// Google's limit is 50,000 URLs per sitemap
	const url = `${process.env.EDC_API_BASEURL}/xtrCategories`;
	const resp = await fetch(url);

	if (!resp.ok) {
		notFound();
	}
	const cats = (await resp.json()) as xtraderCategorySelectType[];

	return cats.map((c: xtraderCategorySelectType) => ({
		url: `${BASE_URL}/xtrader/category/${c.id}`,
		lastModified: new Date(),
	}));
}
