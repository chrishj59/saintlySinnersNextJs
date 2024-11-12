import { CUSTOMER_ORDER } from './customerOrder.type';
import { USER_TYPE } from './user.type';

export type USER_ADDRESS_TYPE = {
	id?: string;
	addressName: string;
	firstName: string;
	lastName: string;
	default: boolean;
	street: string;
	street2: string;
	town: string;
	postCode: string;
	county: string;
	email: string;
	customer?: USER_TYPE;
	order?: CUSTOMER_ORDER;
};
