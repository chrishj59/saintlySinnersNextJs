import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: '*',
				allow: ['/'],
				disallow: ['/admin/', '/userAccount/'],
			},
		],
		sitemap: 'https://saintlysinners.co.uk/sitemap.xml',
	};
}
