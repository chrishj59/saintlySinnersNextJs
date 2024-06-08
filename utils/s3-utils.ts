//import { awsS3ImageReturn } from '../../../../interfaces/';

import {
	CreateBucketCommand,
	DeleteBucketCommand,
	DeleteObjectsCommand,
	GetObjectCommand,
	ListObjectsCommand,
	PutBucketPolicyCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import { awsS3ImageReturn } from '../interfaces/awsData.type';

const REGION = process.env.WS_REGION;
const s3Client = new S3Client({
	region: REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
	},
});
export { s3Client };

export function createBucket(bucketName: string) {
	const createBucketCommand = new CreateBucketCommand({
		Bucket: bucketName,
	});

	return s3Client.send(createBucketCommand);
}
export function deleteBucket(bucketName: string) {
	const deleteBucketCommand = new DeleteBucketCommand({
		Bucket: bucketName,
	});

	return s3Client.send(deleteBucketCommand);
}

export async function emptyBucket(bucketName: string) {
	const listObjectsCommand = new ListObjectsCommand({ Bucket: bucketName });
	const listObjectsResult = await s3Client.send(listObjectsCommand);
	const objects = listObjectsResult.Contents;
	const objectIdentifiers = objects?.map((o) => ({ Key: o.Key }));
	const deleteObjectsCommand = new DeleteObjectsCommand({
		Bucket: bucketName,
		Delete: { Objects: objectIdentifiers },
	});

	return s3Client.send(deleteObjectsCommand);
}

export function putBucketPolicyAllowPuts(bucketName: string, sid: string) {
	const putBucketPolicyCommand = new PutBucketPolicyCommand({
		Bucket: bucketName,
		Policy: JSON.stringify({
			Version: '2012-10-17',
			Statement: [
				{
					Sid: sid,
					Effect: 'Allow',
					Principal: {
						Service: 'ses.amazonaws.com',
					},
					Action: 's3:PutObject',
					Resource: `arn:aws:s3:::${bucketName}/*`,
				},
			],
		}),
	});
	return s3Client.send(putBucketPolicyCommand);
}

export async function getAwsImage(
	imageKey: string
): Promise<awsS3ImageReturn | undefined> {
	const bucketName = process.env.AWS_PRODUCT_BUCKET || '';
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

		return body;
	} catch (err) {
		console.error('Error', err);
		return undefined;
	}
}
