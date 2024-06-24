import { COUNTRY_NAME_TYPE } from './countryName.type';
import { COURIER_TYPE } from './courier.type';
import { VENDOR_TYPE } from './vendor.type';

export type DELIVERY_CHARGE_TYPE = {
	id: string;
	vendor: VENDOR_TYPE;
	country: COUNTRY_NAME_TYPE;
	courier: COURIER_TYPE;
	uom: string;
	minWeight: number;
	maxWeight: number;
	amount: number;
};
