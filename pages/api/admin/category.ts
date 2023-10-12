import axios, { AxiosError } from 'axios';
import { CATEGORY_TYPE } from 'interfaces/category.type';
import { RESPONSE_MESSAGE_TYPE } from 'interfaces/responseMessage.interface';
import { NextApiRequest, NextApiResponse } from 'next';
import { MessageStatusEnum } from 'utils/Message-status.enum';

export default async function handler(
	_req: NextApiRequest,
	_res: NextApiResponse<CATEGORY_TYPE[] | RESPONSE_MESSAGE_TYPE | string>
) {
	console.log('api/admin/brand called with');
	console.log(`method ${JSON.stringify(_req.method, null, 2)}`);

	if (_req.method === 'GET') {
		try {
			const { data } = await axios.get<CATEGORY_TYPE[]>(
				process.env.EDC_API_BASEURL + '/category'
			);
			_res.status(200).json(data);
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
	} else if (_req.method === 'PUT') {
		console.log(`category put ${JSON.stringify(_req.body, null, 2)}`);
		try {
			const url = `/category/${_req.body.id}`;
			const { data } = await axios.put<CATEGORY_TYPE[]>(
				process.env.EDC_API_BASEURL + url,
				_req.body
			);
			console.log(`result from category put ${JSON.stringify(data, null, 2)} `);
			return _res.status(200).json(data);
		} catch (err) {
			let message: RESPONSE_MESSAGE_TYPE = {
				status: MessageStatusEnum.ERROR,
				message: '',
			};
			console.log('error from nest API ');
			if (axios.isAxiosError(err) && err.response) {
				console.error(err.status);
				//console.error(err.response);

				message.message = err.response.statusText;
			} else {
				console.log('bad request error');
				console.error(err);
				message.message = String(err);
			}
			_res.status(500).send(message);
		}
	}
}
