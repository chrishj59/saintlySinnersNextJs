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
		const { data } = await axios.post(url, order);
		console.log(`api post CustomerOrder returned ${JSON.stringify(data)} `);
		_res.send(data);
	} catch (err) {
		if (axios.isAxiosError(err)) {
			console.error(err.status);
			console.error(err.response);
			// Do something with this error...
			_res.status(500);
		} else {
			console.error(err);
			_res.status(500);
		}
	}
	// _res.send('end of save EdcOrder');
}
