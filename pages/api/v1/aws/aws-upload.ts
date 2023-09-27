import { s3Client } from 'utils/s3-utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const client = s3Client;
	const Bucket = process.env.AWS_PUBLIC_BUCKET_NAME || '';
	const { fileName } = req.body;
	// console.log(`req.body ${JSON.stringify(req.body, null, 2)}`);
	//console.log(`fileBody ${typeof fileData} `);
	const { imageData } = req.body;
	console.log(`imagedata ${typeof imageData}`);
	const fileBuffer = Buffer.from(imageData);
	console.log(
		`command bucket ${Bucket} key ${fileName} body ${Buffer.isBuffer(
			fileBuffer
		)}`
	);
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
			res.status(awsStatus).send('saved to AWS');
		} else {
			res.status(501).send('AWS not responded');
		}
	} catch (e: any) {
		console.log(`aws error`);
		res.status(501).send(`error ${e.message}`);
	}
}
