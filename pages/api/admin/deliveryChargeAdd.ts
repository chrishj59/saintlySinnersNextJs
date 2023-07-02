import axios from 'axios';
import { DELIVERY_CHARGE_MSG } from 'interfaces/delivery-charge-message.type';
import { NextApiRequest, NextApiResponse } from 'next';

import { DELIVERY_CHARGE_TYPE } from '../../../interfaces/deliveryCharge.type';

export default async function handler(
	_req: NextApiRequest,
	_res: NextApiResponse<DELIVERY_CHARGE_TYPE | any>
) {
	const deliveryCharge: DELIVERY_CHARGE_MSG = {
		id: _req.body.id,
		vendorId: _req.body.vendor,
		courierId: _req.body.courier,
		countryId: _req.body.country,
		uom: _req.body.uom,
		maxWeight: _req.body.maxWeight,
		minWeight: _req.body.minWeight,
		amount: _req.body.amount,
	};
	const url = process.env.EDC_API_BASEURL + '/deliveryCharge';
	try {
		const { data } = await axios.post<DELIVERY_CHARGE_TYPE>(
			url,
			deliveryCharge
		);

		_res.status(200).json(data);
	} catch (err) {
		console.log('Error from axios update');
		console.log(err);
		_res.status(500).json(err);
	}
}
