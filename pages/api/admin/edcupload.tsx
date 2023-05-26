import { getAccessToken, getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

type ResponseError = {
	message: string;
};

export default withApiAuthRequired(async function handler(
	_req: NextApiRequest,
	_res: NextApiResponse
) {
	console.log('called api/admin/deliveryChargeUpdate');
	console.log(`_req: ${JSON.stringify(_req.body)}`);
	const product = _req.body;
	const session = await getSession(_req, _res);
	//console.log(session);
	const { accessToken } = await getAccessToken(_req, _res, {});

	const response = await fetch(
		`http://localhost:8000/api/v1/messages/protected`,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	);
	const data = await response.json();
	//console.log(data);
	const result = await axios.post(
		process.env.NEXT_PUBLIC_EDC_API_BASEURL + '/product',
		product,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	);
	console.log(result);
	_res.status(200).json('okay');
});
// export default function handler(req: NextApiRequest, res: NextApiResponse) {
// 	const { body } = req;
// 	console.log(body);
// 	console.log(req);
// 	console.log('called api');
// 	return res.status(200).json({ message: 'called api' });
// }
// export const config = {
// 	api: {
// 		bodyParser: false,
// 	},
//};
