import { DELIVERY_CHARGE_TYPE } from './delivery-charge.type';

export type DELIVERY_INFO_TYPE = {
	email: string;
	phone: string;
	street: string;
	street2: string;
	town: string;
	county: string;
	postCode: string;
	country: string;
	deliveryCharge: number;
	shipper?: DELIVERY_CHARGE_TYPE;
};
