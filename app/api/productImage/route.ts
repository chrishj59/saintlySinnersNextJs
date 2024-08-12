import { GetObjectCommand } from '@aws-sdk/client-s3';
import { NextApiRequest, NextApiResponse } from 'next';
import { s3Client } from '@/utils/s3-utils';
import { NextRequest, NextResponse } from 'next/server';
import { awsS3ImageReturn } from '@/interfaces/product.type';

export async function GET(req: NextRequest) {
	const bucketName = process.env.AWS_PRODUCT_BUCKET || '';
	const imageKey = req.nextUrl.searchParams.get('imageKey');

	if (!imageKey) {
		return NextResponse.json({ message: 'imageKey is requied', status: 500 });
	}
	const imageFormat = imageKey.split('.')[3];
	const bucketParams = {
		Bucket: bucketName,
		Key: imageKey,
	};

	try {
		const data = await s3Client.send(new GetObjectCommand(bucketParams));
		const img = await data.Body?.transformToString('base64');

		const body: awsS3ImageReturn = {
			imageData: img!,
			imageFormat: imageFormat,
		};

		const resp = NextResponse.json(body, { status: 200 });
		resp.headers.set('Content-Type', `image/${imageFormat}`);
		return resp;
	} catch (err) {
		console.error('Error', err);
		return NextResponse.json({ message: err, status: 500 });
	}
}
