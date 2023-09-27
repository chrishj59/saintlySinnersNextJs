import axios, { AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	_req: NextApiRequest,
	_res: NextApiResponse<any>
) {
	const order = _req.body;
	const url = process.env.EDC_API_BASEURL + '/customerOrder';
	console.warn(`call saveCustomerOrder with ${JSON.stringify(order, null, 2)}`);
	try {
		const resp = await axios.post(url, order);

		_res.status(200).send(resp.data);
	} catch (err) {
		let message: string;
		if (axios.isAxiosError(err) && err.response) {
			console.error(err.status);
			console.error(err.response);
			message = err.response.statusText;

			_res.status(500).send(message);
		} else {
			console.error(err);
			message = String(err);
			_res.status(500).send(message);
		}
	}
	// _res.send('end of save EdcOrder');
}
