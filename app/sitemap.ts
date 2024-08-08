import { Sitemap } from '@/utils/helpers';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	const URL = 'https://saintlysinners.co.uk';
	const sitemap: Sitemap = [
		{
			url: `${URL}/`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 1,
		},
		{
			url: `${URL}/support/frequent-questions`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${URL}/support/customer-services`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.5,
		},
		{
			url: `{URL}/support/terms-and-conditions`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.5,
		},
	];

	return sitemap;
}
