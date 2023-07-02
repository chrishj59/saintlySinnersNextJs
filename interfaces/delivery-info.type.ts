import { stringTo2048 } from 'aws-sdk/clients/customerprofiles';
import { DELIVERY_CHARGE_TYPE } from './delivery-charge.type';

export type DELIVERY_INFO_TYPE = {
	name: string;
	email: string;
	phone: string;
	house_number_input: string;
	house_number: number;
	street: string;
	street2: string;
	town: string;
	county: string;
	postCode: string;
	country: string;

	deliveryCharge: number;
	shipper?: DELIVERY_CHARGE_TYPE;
};
