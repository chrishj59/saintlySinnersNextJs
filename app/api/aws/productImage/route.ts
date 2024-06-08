import { s3Client } from '@/utils/s3-utils';
import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

export async function GET(req: NextRequest) {
	const awsKey = req.nextUrl.searchParams.get('awsKey');
	const client = s3Client;
	const Bucket = process.env.AWS_PRODUCT_BUCKET || '';

	if (!awsKey) {
		return NextResponse.json({ message: 'awkkey is required', status: 400 });
	}
	const command = new GetObjectCommand({
		Bucket,
		Key: awsKey,
	});
	try {
		const resp = await client.send(command);
		if (resp.Body) {
			const imageData = await resp.Body?.transformToString('base64');
			return NextResponse.json(imageData, { status: 200 });
		} else {
			const awsStatus = resp.$metadata.httpStatusCode;
			return NextResponse.json({
				message: 'Error getting object from aws',
				status: awsStatus || 501,
			});
		}
	} catch (e: any) {
		console.log(`getAwsImage aws error ${JSON.stringify(e, null, 2)}`);
		return NextResponse.json({
			message: `error ${e.name}`,
			status: e.$metadata.httpStatusCode,
		});
	}
}

export async function POST(req: NextRequest) {
	const body = await req.json();
	const client = s3Client;
	const Bucket = process.env.AWS_PUBLIC_BUCKET_NAME || '';
	const { fileName } = body;
	const { imageData } = body;

	const fileBuffer = Buffer.from(imageData);

	const command = new PutObjectCommand({
		Bucket,
		Key: fileName,
		Body: fileBuffer,
	});

	try {
		const resp = await client.send(command);
		console.log(`resp from AWS ${JSON.stringify(resp)}`);
		const awsStatus = resp.$metadata.httpStatusCode;
		if (awsStatus) {
			return NextResponse.json({ message: 'saved to AWS', status: 200 });
		} else {
			return NextResponse.json({ messge: 'AWS not responded', status: 500 });
		}
	} catch (e: any) {
		console.log(`aws-load aws error ${e.message}`);
		return NextResponse.json({ messge: e.message, status: 501 });
	}
}
