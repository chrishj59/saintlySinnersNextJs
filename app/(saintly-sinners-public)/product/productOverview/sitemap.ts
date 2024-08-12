import { MetadataRoute } from 'next';
import { notFound } from 'next/navigation';

export default async function sitemap({
	id,
}: {
	id: number;
}): Promise<MetadataRoute.Sitemap> {
	const BASE_URL = process.env.SAINTLY_URL;
	// Google's limit is 50,000 URLs per sitemap
	const url = `${process.env.EDC_API_BASEURL}/xtrProductId`;
	const resp = await fetch(url);

	if (!resp.ok) {
		notFound();
	}
	const prods = await resp.json();

	return prods.map((c: any) => ({
		url: `${BASE_URL}/product/productOverview/${c}`,
		lastModified: new Date(),
	}));
}
