import { s3Client } from 'utils/s3-utils';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const client = s3Client;
	const Bucket = process.env.AWS_PUBLIC_BUCKET_NAME || '';

	const Key: any = req.query.fileName || '';
	const post = await createPresignedPost(client, {
		Bucket,
		Key,
		Expires: 60, // seconds
	});

	res.status(200).json(post);
}

// {
// 	"Version": "2012-10-17",
// 	"Id":"publicBucket1",
// 	"Statement": [
// 			{
// 					"Sid": "hidden",
// 					"Effect": "Allow",
// 					"Principal": "*",
// 					"Action": ["s3:DeleteObject",
// 					"s3:GetObject",
// 					"s3:ListBucket",
// 					"s3:PutObject",
// 					"s3:PutObjectAcl"
// 					],
// 					"Resource":
// 							"arn:aws:s3:::saintly-sinners-public-bucket/*"
// 			}
// 	]
// }
