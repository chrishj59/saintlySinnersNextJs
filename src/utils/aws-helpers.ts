import { AWS_DATA_TYPE } from '@/interfaces/awsData.type';
import { XtrStockImage } from '@/interfaces/xtraderProduct.type';
import { s3Client } from '@/utils/s3-utils';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
const client = s3Client;
const PublicBucket = process.env.AWS_PUBLIC_BUCKET_NAME || '';
const ProductBucket = process.env.AWS_PRODUCT_BUCKET || '';
const XtrStockBucket = process.env.AWS_XTR_STOCK_BUCKET_NAME || '';
const XtrBrandBucket = process.env.AWS_XTR_BRAND_BUCKET_NAME || '';

export async function getAwsProductImageData(
	awsKey: string
): Promise<string | null> {
	const command = new GetObjectCommand({
		Bucket: ProductBucket,
		Key: awsKey,
	});
	try {
		const resp = await client.send(command);
		if (resp.Body) {
			const imageData = await resp.Body?.transformToString('base64');
			return imageData;
		}
	} catch (err) {
		console.log(`getAwsImage aws error ${JSON.stringify(err, null, 2)}`);
	}

	return null;
}

export async function getAwsXtrStockImageData(
	awsKey: string
): Promise<string | null> {
	const command = new GetObjectCommand({
		Bucket: XtrStockBucket,
		Key: awsKey,
	});
	try {
		const resp = await client.send(command);
		if (resp.Body) {
			const imageData = await resp.Body?.transformToString('base64');
			return imageData;
		}
	} catch (err) {
		console.log(`getAwsImage aws error ${JSON.stringify(err, null, 2)}`);
		return null;
	}
	return null;
}

export async function getAwsXtrBrandImageData(
	awsKey: string
): Promise<string | null> {
	const command = new GetObjectCommand({
		Bucket: XtrBrandBucket,
		Key: awsKey,
	});
	try {
		const resp = await client.send(command);
		if (resp.Body) {
			const imageData = await resp.Body?.transformToString('base64');
			return imageData;
		}
	} catch (err) {
		console.log(`getAwsImage aws error ${JSON.stringify(err, null, 2)}`);
		return null;
	}
	return null;
}

export async function saveImage() {}
