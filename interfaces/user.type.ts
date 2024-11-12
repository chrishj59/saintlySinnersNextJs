import { CUSTOMER_ORDER } from './customerOrder.type';
import { USER_ADDRESS_TYPE } from './userAddress.type';
import { XtraderProductResp } from './xtraderProduct.type';

export type USER_REVIEW_TYPE = {
	id: string;
	rating: number;
	title: string;
	body: string;
	createdDate: string;
};
export type USER_TYPE = {
	id: string;
	title: string;
	displayName: string;
	name: string;
	email: string;
	emailVerified: Date;
	image: string;
	firstName: string;
	lastName: string;
	mobPhone: string;
	birthDate: Date;
	role: string;
	stripeCustomerId: string;
	likedProds: XtraderProductResp[];
	likes: number;
	addresses: USER_ADDRESS_TYPE[];
	orders: CUSTOMER_ORDER[];
	reviews: USER_REVIEW_TYPE;
};
