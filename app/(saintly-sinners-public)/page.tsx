import { Console } from 'console';
import HomeUI from './homeUI';
import { Brand } from '@/interfaces/brand.interface';
import { GetObjectCommand, GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { s3Client } from '@/utils/s3-utils';
import { XtrBrand } from '@/interfaces/xtraderProduct.type';
import { Metadata } from 'next';
export const metadata: Metadata = {
	title: 'Home Shopping',
};

export default async function Home() {
	const url = `${process.env.EDC_API_BASEURL}/xtrBrandsHomePage`;
	const bucketName = process.env.AWS_XTR_BRAND_BUCKET_NAME || '';

	// Get home page brands
	const res = await fetch(url);
	let brands: XtrBrand[] = [];
	if (res.ok) {
		brands = (await res.json()) as XtrBrand[];

		for (const brand of brands) {
			const key = brand.image?.key;
			if (!key) {
				break;
			}
			const imgFormat = key.split('.')[1];
			const bucketParams = {
				Bucket: bucketName,
				Key: key,
			};
			if (imgFormat) {
				const data: GetObjectCommandOutput = await s3Client.send(
					new GetObjectCommand(bucketParams)
				);
				if (data.Body) {
					const imgData = await data.Body.transformToString('base64');
					if (imgData) {
						if (brand.image) {
							brand.image.imageFormat = imgFormat;
							brand.image.imageData = imgData;
						}
					}
				} else {
					return {
						notFound: true,
					};
				}
			}
		}
	}
	return (
		<>
			<HomeUI brands={brands}>children</HomeUI>
		</>
	);
}
