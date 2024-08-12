import { xtraderCategorySelectType } from '@/interfaces/xtraderCategory.type';
import { notFound } from 'next/navigation';
import NotFound from '../../../cartPayment/checkout-form/error';
import { XtraderCategories } from '@/components/ui/xtrcategories';
import { AWS_DATA_TYPE, imageAWS } from '@/interfaces/awsData.type';
import { GetObjectCommand, GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { s3Client } from '@/utils/s3-utils';
import ProductList from '@/components/ui/ProductList';
import {
	XtrBrand,
	XtraderProduct,
	XtraderProductResp,
} from '@/interfaces/xtraderProduct.type';
import {
	getAwsXtrBrandImageData,
	getAwsXtrStockImageData,
} from '@/utils/aws-helpers';
import { Brand } from '@/interfaces/brand.interface';
import { Metadata } from 'next';
import { Suspense, cache } from 'react';
import ProductListSuspense from '@/components/ui/ProductListSuspense';
import Loading from '@/app/loading';
import CategoryNotFound from '../not-found';
import CategoryLoading from '../loading';

export const maxDuration = 60;
export const dynamic = 'force-static';
// dynamicParams = true

export const metadata: Metadata = {
	title: 'Category Products',
};
export async function generateStaticParams() {
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
export default async function XtraderCategoryPage({
	params,
}: {
	params: { id: string };
}) {
	const catId = Number(params.id);

	const bucketName = process.env.AWS_XTR_CAT_BUCKET_NAME || '';
	const url = process.env.EDC_API_BASEURL + `/xtrcategory/${catId}`;
	const catResp = await fetch(url, { cache: 'no-cache' });

	if (!catResp.ok) {
		notFound();
	}
	const cat = (await catResp.json()) as xtraderCategorySelectType;

	if (cat.childCategories && cat.childCategories.length > 0) {
		const numchildren = cat.childCategories.length;
		const indx = 0;
		for (const item of cat.childCategories) {
			const image: imageAWS = item.image;

			if (image) {
				const key = image.key;
				const imgFormat = key.split('.')[1];
				const bucketParams = {
					Bucket: bucketName,
					Key: key,
				};
				const data: GetObjectCommandOutput = await s3Client.send(
					new GetObjectCommand(bucketParams)
				);

				if (data) {
					const imgData = await data.Body?.transformToString('base64');
					if (imgData) {
						item.imageFormat = imgFormat;
						item.imageData = imgData;
						cat.childCategories[indx] = item;
					}
				}
			}
		}

		// if (numchildren && numchildren > 0) {
		return (
			<XtraderCategories categories={cat.childCategories} title={cat.catName} />
		);
		// }
	} else {
		const url =
			process.env.EDC_API_BASEURL + `/productByCategoryId?id=${catId}`;
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
			<ProductList products={products} title={cat.catName}>
				children
			</ProductList>
		);
	}
}
