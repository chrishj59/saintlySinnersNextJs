import {
	getAccessToken,
	getSession,
	withApiAuthRequired,
} from '@auth0/nextjs-auth0';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

type ResponseError = {
	message: string;
};

export default withApiAuthRequired(async function handler(
	_req: NextApiRequest,
	_res: NextApiResponse
) {
	const product = _req.body;

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

	const result = await axios.post(
		process.env.NEXT_PUBLIC_EDC_API_BASEURL + '/product',
		product,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	);

	_res.status(200).json('okay');
});
