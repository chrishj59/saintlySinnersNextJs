import ProductOverview from '@/components/ui/ProductOverview';
import { AWS_DATA_TYPE } from '@/interfaces/awsData.type';
import {
	ProductAxiosType,
	imageAWS,
	productId,
} from '@/interfaces/product.type';
import { CATEGORY_TYPE } from '@/interfaces/category.type';
import { s3Client } from '@/utils/s3-utils';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import {
	XtrBrand,
	XtrProdAttributeValue,
	XtrProdEan,
	XtraderProductResp,
} from '@/interfaces/xtraderProduct.type';
import {
	getAwsXtrBrandImageData,
	getAwsXtrStockImageData,
} from '@/utils/aws-helpers';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense } from 'react';
import ProductSuspense from '@/components/ui/ProductSuspense';
import Loading from '@/app/loading';
import ProductNotFound from './not-found';
import ProductLoading from './loading';

export const dynamicParams = true;

// export const revalidate = 60;
/** get details of each product */
export const metadata: Metadata = {
	title: 'Product details',
};
// export async function generateStaticParams() {
// 	const url = process.env.EDC_API_BASEURL + `/xtrProductId`;
// 	const prodResp = await fetch(url, {
// 		method: 'GET',
// 		headers: {
// 			'Content-Type': 'application/json',
// 		},
// 		next: { tags: ['productOverview'] },
// 	});
// 	if (prodResp.ok) {
// 		const prodList = (await prodResp.json()) as number[];
// 		// const topProdList = prodList.slice(0, 10);
// 		return prodList.map((p: number) => {
// 			return { id: p.toString() };
// 		});
// 	} else {
// 		return [{ id: '0' }];
// 	}
// }

export default async function ProductOverviewPage({
	params,
}: {
	params: { id: string };
}) {
	const id: string = params.id;

	const bucketName = process.env.AWS_PRODUCT_BUCKET || '';
	const url = `${process.env.EDC_API_BASEURL}/xtrProd/${id}`;
	const prodResp = await fetch(url, { cache: 'no-cache' });
	let imageParam: AWS_DATA_TYPE[] = [];
	if (prodResp.status !== 200) {
		console.warn(
			`Get nestjs product failed: status: ${
				prodResp.status
			}  text: ${JSON.stringify(prodResp.statusText)}`
		);
	}
	//found product ok
	const prod = (await prodResp.json()) as XtraderProductResp;

	/** get brand images */

	if (prod.brand && prod.brand.imageName) {
		const imageData = await getAwsXtrBrandImageData(prod.brand.imageName);
		if (imageData) {
			prod.brand.imageData = imageData;
		}
	}

	/** add images */

	// size 500 x 500
	if (prod.ximage) {
		const imageData = await getAwsXtrStockImageData(prod.ximage.key);
		if (imageData) {
			prod.ximage.imageData = imageData;
		}
	}

	if (prod.ximage2) {
		const imageData = await getAwsXtrStockImageData(prod.ximage2.key);
		if (imageData) {
			prod.ximage2.imageData = imageData;
		}
	}
	if (prod.ximage3) {
		const imageData = await getAwsXtrStockImageData(prod.ximage3.key);
		if (imageData) {
			prod.ximage3.imageData = imageData;
		}
	}
	if (prod.ximage4) {
		const imageData = await getAwsXtrStockImageData(prod.ximage4.key);
		if (imageData) {
			prod.ximage4.imageData = imageData;
		}
	}
	if (prod.ximage5) {
		const imageData = await getAwsXtrStockImageData(prod.ximage5.key);
		if (imageData) {
			prod.ximage5.imageData = imageData;
		} else {
			prod.ximage5 = undefined;
		}
		if (prod.bigmulti1) {
			const imageData = await getAwsXtrStockImageData(prod.bigmulti1.key);
			if (imageData) {
				prod.bigmulti1.imageData = imageData;
			} else {
				prod.bigmulti1 = undefined;
			}
		}
		if (prod.bigmulti2) {
			const imageData = await getAwsXtrStockImageData(prod.bigmulti2.key);
			if (imageData) {
				prod.bigmulti2.imageData = imageData;
			} else {
				prod.bigmulti1 = undefined;
			}
		}
		if (prod.bigmulti3) {
			const imageData = await getAwsXtrStockImageData(prod.bigmulti3.key);
			if (imageData) {
				prod.bigmulti3.imageData = imageData;
			} else {
				prod.bigmulti3 = undefined;
			}
		}
		if (prod.multi1) {
			const imageData = await getAwsXtrStockImageData(prod.multi1.key);
			if (imageData) {
				prod.multi1.imageData = imageData;
			} else {
				prod.multi1 = undefined;
			}
		}
		if (prod.multi2) {
			const imageData = await getAwsXtrStockImageData(prod.multi2.key);
			if (imageData) {
				prod.multi2.imageData = imageData;
			} else {
				prod.multi2 = undefined;
			}
		}
		if (prod.multi3) {
			const imageData = await getAwsXtrStockImageData(prod.multi3.key);
			if (imageData) {
				prod.multi3.imageData = imageData;
			} else {
				prod.multi3 = undefined;
			}
		}
	}

	const eans = prod.eans?.map((e: XtrProdEan) => {
		e.code = e.code.substring(4).toLowerCase();
		return e;
	});
	if (eans) {
		prod.eans = eans;
	}
	if (prod.attributes && eans) {
		const attribute = prod.attributes[0];
		if (attribute && attribute.attributeValues) {
			const attributeValues = attribute.attributeValues.map(
				(attVal: XtrProdAttributeValue) => {
					const _attVal = attVal;

					const searchSting = attVal.title.replace(/\s/g, '').toLowerCase();
					const ean = eans?.filter(
						(ean: XtrProdEan) => ean.code === searchSting
					);
					if (ean && ean[0]) {
						_attVal.ean = ean[0].value;
					}
					return _attVal;
				}
			);
			prod.attributes[0].attributeValues = attributeValues;
		}
	}

	return (
		<Suspense fallback={<ProductLoading />}>
			<ProductOverview product={prod} images={imageParam}>
				children
			</ProductOverview>
		</Suspense>
	);
}
