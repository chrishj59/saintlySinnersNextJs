import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import { Brand } from '../../../interfaces/brand.interface';

export default async function handler(
	_req: NextApiRequest,
	_res: NextApiResponse<Brand[]>
) {
	const { data } = await axios.put<Brand[]>(
		process.env.EDC_API_BASEURL + '/brand',
		_req.body
	);

	const method = _req.method;

	return _res.status(200).json(data);
}
