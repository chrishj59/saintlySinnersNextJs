import { GetObjectCommand } from '@aws-sdk/client-s3';
import { NextApiRequest, NextApiResponse } from 'next';
import { s3Client } from 'utils/s3-utils';

const ImageData = async (req: NextApiRequest, res: NextApiResponse) => {
	const bucketName = process.env.AWS_PRODUCT_BUCKET || '';
	let { imageKey } = req.query as { imageKey: string };
	//imageKey = 'https://cdn.edc.nl/500/0515213_4.jpg';
	const imageFormat = imageKey.split('.')[3];
	const bucketParams = {
		Bucket: bucketName,
		Key: imageKey,
	};

	try {
		const data = await s3Client.send(new GetObjectCommand(bucketParams));
		const img = await data.Body?.transformToString('base64');
		return res
			.setHeader('Content-Type', `image/${imageFormat}`)
			.status(200)
			.json({ imageData: img, imageFormat: imageFormat });
	} catch (err) {
		console.error('Error', err);
		return res.status(404).json({ message: err });
	}
};

export default ImageData;
