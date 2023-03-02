//import axios from 'axios';
import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

export default withApiAuthRequired(async function products(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { accessToken } = await getAccessToken(req, res);
		console.log('accessToken');
		console.log(accessToken);
	} catch (error: any) {
		console.error(error);
		res.status(error.status || 500).end(error.message);
	}
});
