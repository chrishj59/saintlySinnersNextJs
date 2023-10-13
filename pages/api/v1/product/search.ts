import axios from 'axios';
import { ProductAxiosType } from 'interfaces/product.type';
import { RESPONSE_MESSAGE_TYPE } from 'interfaces/responseMessage.interface';
import { NextApiRequest, NextApiResponse } from 'next';
import { MessageStatusEnum } from 'utils/Message-status.enum';

export default async function handler(
	_req: NextApiRequest,
	_res: NextApiResponse<ProductAxiosType[] | RESPONSE_MESSAGE_TYPE | string>
) {
	const { search } = _req.query;
	const url = process.env.EDC_API_BASEURL + `/productFiltered?id=${search}`;

	try {
		const { data } = await axios.get<ProductAxiosType[]>(url);
		_res.status(200).json(data);
	} catch (err) {
		let message: RESPONSE_MESSAGE_TYPE = {
			status: MessageStatusEnum.WARNING,
			message: '',
		};
		if (axios.isAxiosError(err) && err.response) {
			message.message = err.response.statusText;
		} else {
			message.message = String(err);
		}
		_res.status(400).json(message);
	}
}
