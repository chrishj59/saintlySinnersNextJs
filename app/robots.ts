import type { MetadataRoute } from 'next';
import sitemap from './sitemap';
export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: '*',
				allow: ['/'],
				disallow: ['/admin/', '/userAccount/'],
			},
		],
		sitemap: [
			'https://saintlysinners.co.uk/sitemap.xml',
			'https://saintlysinners.co.uk/product/productOverview/sitemap.xml',
			'https://saintlysinners.co.uk/xtrader/category/sitemap.xml',
		],
	};
}
//
