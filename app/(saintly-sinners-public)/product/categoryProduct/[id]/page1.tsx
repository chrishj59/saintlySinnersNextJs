import ProductList from '@/components/ui/ProductList';
import { CATEGORY_TYPE } from '@/interfaces/category.type';
import { ProductAxiosType, awsS3ImageReturn } from '@/interfaces/product.type';
import { isIterable } from '@/utils/helpers';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { getAwsImage } from '@/utils/s3-utils';
import { imageAWS } from '../../../../../interfaces/product.type';
// export async function generateStaticParams() {
// 	const categories = (await fetch(
// 		process.env.EDC_API_BASEURL + `/category`
// 	).then((res) => res.json())) as CATEGORY_TYPE[];

// 	return categories.map((c: CATEGORY_TYPE) => ({
// 		id: c.id,
// 	}));
// }
export const dynamicParams = true;

export const revalidate = 60;

export async function generateStaticParams() {
	const ids = [{ id: '1' }, { id: '2' }, { id: '3' }];
	const resp = await fetch(process.env.EDC_API_BASEURL + `/category`);
	const cats = (await resp.json()) as CATEGORY_TYPE[];

	return cats.map((c: CATEGORY_TYPE) => ({
		id: c.id.toString(),
	}));
}

export default async function CategoryProductPage({
	params,
}: {
	params: { id: string };
}) {
	let products: ProductAxiosType[] = [];
	const { id } = params;
	const url = `${process.env.EDC_API_BASEURL}/category?id=${params.id}`;
	const catResp = await fetch(url);
	let cat: CATEGORY_TYPE;

	if (!catResp.ok) {
		cat = { id: 0, title: 'Category not found', onMenu: false, menulevel: 6 };
	} else {
		cat = (await catResp.json()) as CATEGORY_TYPE;
	}
	// const contentType = catResp.headers.get('content-type');
	// if (contentType && contentType.indexOf('application/json') !== -1) {
	// 	// resp is JSON
	// 	cat = (await catResp.json()) as CATEGORY_TYPE;
	// } else {
	// 	// response not JSON
	// 	cat = { id: 0, title: 'Category not found', onMenu: false, menulevel: 6 };
	// }

	/** Get products */
	const prodUrl = `${process.env.EDC_API_BASEURL}/productByCategoryId?id=${params.id}`;
	const prodResp = await fetch(prodUrl);
	if (prodResp.status === 200) {
		const prodContentType = prodResp.headers.get('content-type');
		if (prodContentType && prodContentType.indexOf('application/json') !== -1) {
			// resp is JSON
			products = (await prodResp.json()) as ProductAxiosType[];

			if (prodResp.status !== 200) {
				redirect('/login');
			}

			if (isIterable(products)) {
				for await (const prod of products) {
					const images = prod.images;

					if (images) {
						for (const image of images) {
							images.sort((a, b) =>
								a.key > b.key ? 1 : b.key > a.key ? -1 : 0
							);
							const imgKey = image.key;
							const imgData = await getAwsImage(imgKey);
							// const url = `/api/aws/productImage?awsKey=${imgKey}`;
							// const response = await fetch(url);
							// const imgData = (await response.json()) as awsS3ImageReturn;
							if (imgData) {
								prod.imageData = imgData.imageData;
								prod.imageFormat = imgData.imageFormat;
							}
						}
					}
				}
			}
		}
	}

	return (
		<div className="flex justify-content-center">
			<div className="card min-w-full">
				<h3 className="text-center"> Category - {cat.title}</h3>

				{/* <ProductList products={products} title="Categories" children /> */}
			</div>
		</div>
	);
}
