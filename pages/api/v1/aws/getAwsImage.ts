import { s3Client } from 'utils/s3-utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { GetObjectCommand, GetObjectCommandOutput } from '@aws-sdk/client-s3';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const client = s3Client;
	const Bucket = process.env.AWS_PUBLIC_BUCKET_NAME || '';
	const awsKey: any = req.query.awsKey || '';

	const command = new GetObjectCommand({
		Bucket,
		Key: awsKey,
	});
	try {
		const resp = await client.send(command);
		if (resp.Body) {
			const imageData = await resp.Body?.transformToString('base64');
			res.status(200).send(imageData);
		} else {
			const awsStatus = resp.$metadata.httpStatusCode;

			res.status(awsStatus || 501).send('Error getting object from aws');
		}
	} catch (e: any) {
		console.log(`getAwsImage aws error ${JSON.stringify(e, null, 2)}`);
		res.status(e.$metadata.httpStatusCode).send(`error ${e.name}`);
	}
}
