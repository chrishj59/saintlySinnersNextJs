import axios from 'axios';
import { RESPONSE_MESSAGE_TYPE } from 'interfaces/responseMessage.interface';
import { NextApiRequest, NextApiResponse } from 'next';
import { MessageStatusEnum } from 'utils/Message-status.enum';

export default async function handler(
	_req: NextApiRequest,
	_res: NextApiResponse<RESPONSE_MESSAGE_TYPE | any>
) {
	const {
		query: { id },
	} = _req;
	const url = process.env.EDC_API_BASEURL + `/deliveryCharge/${id}`;
	try {
		const { data } = await axios.delete<RESPONSE_MESSAGE_TYPE>(url);

		const resp = {
			status: MessageStatusEnum.SUCCESS,
			message: `delete charge reeceived id  ${id}`,
		};

		_res.status(200).json(resp);
	} catch (err) {
		console.log('Error from axios update');
		console.log(err);
		_res.status(500).json(err);
	}
}
