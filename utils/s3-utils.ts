import {
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectsCommand,
  ListObjectsCommand,
  PutBucketPolicyCommand,
  S3Client,
} from '@aws-sdk/client-s3';

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
