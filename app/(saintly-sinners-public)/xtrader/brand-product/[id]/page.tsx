import Loading from '@/app/loading';
import ProductList from '@/components/ui/ProductList';
import { XtrBrandType } from '@/interfaces/xtraderBrand.type';
import { XtrBrand, XtraderProductResp } from '@/interfaces/xtraderProduct.type';
import {
	getAwsXtrBrandImageData,
	getAwsXtrStockImageData,
} from '@/utils/aws-helpers';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const dynamicParams = true;

export const metadata: Metadata = {
	title: 'Brand Products',
};
export async function generateStaticParams() {
	const resp = await fetch(process.env.EDC_API_BASEURL + `/xtrBrand`);
	if (!resp.ok) {
		notFound();
	}

	const brands = (await resp.json()) as XtrBrandType[];
	// const topBHrands = brands.slice(0, 10);

	return brands.map((p: XtrBrandType) => {
		return { id: p.id.toString() };
	});
}

export default async function ProductOverviewPage({
	params,
}: {
	params: { id: string };
}) {
	const brandId = Number(params.id);
	const url =
		process.env.EDC_API_BASEURL + `/xtrProductByBrandId?id=${brandId}`;
	const prodResp = await fetch(url, { cache: 'no-cache' });
	if (!prodResp.ok) {
		notFound();
	}
	const products = (await prodResp.json()) as XtraderProductResp[];

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
	const brand = products[0] && products[0].brand;
	/** get AWS Images */
	let indx = 0;
	for (const prod of products) {
		if (prod.ean) {
			prod.selectedEan = prod.ean;
		}
		prod.sizeId = 0;
		if (prod.thumb) {
			const imageData = await getAwsXtrStockImageData(prod.thumb.key);
			if (imageData) {
				prod.thumb.imageData = imageData;
				products[indx] = prod;
			}
		} else {
			// no thumb image  only on ximage
			if (prod.ximage) {
				const xImageData = await getAwsXtrStockImageData(prod.ximage.key);
				if (xImageData) {
					prod.thumb = prod.ximage;
					prod.thumb.imageData = xImageData;
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
				title={`Brand  : ${brand && brand.name}`}>
				children
			</ProductList>
		</Suspense>
	);
}
