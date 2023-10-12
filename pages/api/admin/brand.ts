import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import { Brand } from '../../../interfaces/brand.interface';
import { RESPONSE_MESSAGE_TYPE } from 'interfaces/responseMessage.interface';
import { MessageStatusEnum } from 'utils/Message-status.enum';

export default async function handler(
	_req: NextApiRequest,
	_res: NextApiResponse<Brand[] | RESPONSE_MESSAGE_TYPE>
) {
	console.log('api/admin/brand called with');
	console.log(`_req.body ${JSON.stringify(_req.body, null, 2)}`);
	try {
		const { data } = await axios.put<Brand[]>(
			process.env.EDC_API_BASEURL + '/brand',
			_req.body
		);

		// const method = _req.method;
		// console.log(`method ${method}`);

		return _res.status(200).json(data);
	} catch (err) {
		let message: RESPONSE_MESSAGE_TYPE = {
			status: MessageStatusEnum.ERROR,
			message: '',
		};
		if (axios.isAxiosError(err) && err.response) {
			console.error(err.status);
			console.error(err.response);

			message.message = err.response.statusText;
		} else {
			console.error(err);
			message.message = String(err);
		}
		_res.status(500).send(message);
	}
}
