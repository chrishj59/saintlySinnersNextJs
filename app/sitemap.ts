// //
// // import path from 'path';
// //import fs from 'fs';

import { Languages } from 'next/dist/lib/metadata/types/alternative-urls-types';

// const extensions = ['tsx', 'mdx'];
// const baseUrl = 'https://saintlySinners.co.uk';
// const baseDir = 'app';

// function getRoutesFromDir(fullPath: string, prefix = ''): string[] {
// 	const entries = fs.readdirSync(fullPath, { withFileTypes: true });
// 	return entries.reduce((routes, entry) => {
// 		if (entry.isDirectory()) {
// 			const newPrefix = `${prefix}/${entry.name}`;
// 			if (
// 				extensions.some((ext) =>
// 					fs.existsSync(path.join(fullPath, entry.name, `page.${ext}`))
// 				)
// 			) {
// 				routes.push(newPrefix);
// 			}
// 			// Recursively get routes from subdirectories
// 			const subDir = path.join(fullPath, entry.name);
// 			return routes.concat(getRoutesFromDir(subDir, newPrefix));
// 		}
// 		return routes;
// 	}, [] as string[]);
// }

// function getRoutes() {
// 	const fullPath = path.join(process.cwd(), baseDir);
// 	const routes = getRoutesFromDir(fullPath);
// 	return routes.map((route) => {
// 		return {
// 			url: `${baseUrl}${route}`,
// 			lastModified: new Date(),
// 			changeFrequency: 'weekly',
// 			priority: 1.0,
// 		};
// 	});
// }

// export default function sitemap() {
// 	return getRoutes();
// }

type Sitemap = Array<{
	url: string;
	lastModified?: string | Date;
	changeFrequency?:
		| 'always'
		| 'hourly'
		| 'daily'
		| 'weekly'
		| 'monthly'
		| 'yearly'
		| 'never';
	priority?: number;
	alternates?: {
		languages?: Languages<string>;
	};
}>;

import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: 'https://saintlySinners.co.uk',
			lastModified: new Date(),
		},
		{
			url: 'https://saintlySinners.co.uk/support/frequent-questions',
			lastModified: new Date(),
		},
	];
}
