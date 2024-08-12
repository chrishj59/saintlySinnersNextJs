import { notFound } from 'next/navigation';
import { BadRequestException } from 'next-api-decorators';
import { XtrBrand, XtraderProductResp } from '@/interfaces/xtraderProduct.type';
import ProductList from '@/components/ui/ProductList';
import {
	getAwsXtrBrandImageData,
	getAwsXtrStockImageData,
} from '@/utils/aws-helpers';
import { Metadata } from 'next';
import { Suspense } from 'react';
import Loading from '@/app/loading';

export const metadata: Metadata = {
	title: 'Global Search',
};
export default async function ProductSearch({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const filter = searchParams['search'];
	try {
		const url = `${process.env.EDC_API_BASEURL}/xtrProductFiltered?searchParam=${filter} `;

		const prodsResp = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		if (!prodsResp.ok) {
			notFound();
		}
		const products = (await prodsResp.json()) as XtraderProductResp[];

		/** get set of brand images */
		const brands: XtrBrand[] = [];
		for (const prod of products) {
			const prodBrand = prod.brand;
			const brand = brands.find((b) => b.id === prodBrand.id);
			if (!brand) {
				brands.push(prodBrand);
			}
		}

		/** get brand images */

		for (const brand of brands) {
			if (brand.imageName) {
				const imageData = await getAwsXtrBrandImageData(brand.imageName);
				if (imageData) {
					brand.imageData = imageData;
				}
			}
		}

		let indx = 0;
		for (const prod of products) {
			if (prod.thumb) {
				const imageData = await getAwsXtrStockImageData(prod.thumb.key);
				if (imageData) {
					prod.thumb.imageData = imageData;
					products[indx] = prod;
				}
			} else {
				if (prod.ximage) {
					const imageData = await getAwsXtrStockImageData(prod.ximage.key);
					if (imageData) {
						prod.thumb = prod.ximage;
						prod.thumb.imageData = imageData;
						products[indx] = prod;
					}
				}
			}
			if (prod.brand) {
				const brand = brands.find((b) => b.id === prod.brand.id);
				if (brand) {
					prod.brand = brand;
				}
			}
			indx++;
		}
		return (
			<Suspense fallback={<Loading />}>
				<ProductList
					products={products}
					title={`Filtered products by: ${filter} `}>
					children
				</ProductList>
			</Suspense>
		);
	} catch (error: any) {
		if (error instanceof SyntaxError) {
			// Unexpected token < in JSON
			console.warn('There was a SyntaxError', error);
		} else {
			console.error('Could not find charges');
			console.error(error);
		}
		// throw new BadRequestException();
		//throw new Error(`unhandled error ${error}`);
	}
}
