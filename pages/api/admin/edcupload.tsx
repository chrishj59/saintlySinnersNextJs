import { NextApiRequest, NextApiResponse } from 'next';

type ResponseError = {
	message: string;
};
export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const { body } = req;
	console.log(body);
	console.log(req);
	console.log('called api');
	return res.status(200).json({ message: 'called api' });
}
export const config = {
	api: {
		bodyParser: false,
	},
};
