type CUSTOMER = {
	name: string;
	street: string;

	houseNumber: number;

	city: string;
	country: number; // EDC country code

	postCode: string;
	telphone: string;
};
export type EDC_ORDER_TYPE = {
	vendorNumber: number;
	stripeSessionId?: string;
	oneTimeCustomer: boolean;
	goodsValue: number;
	tax: number;
	total: number;
	currencyCode: string;
	customer: CUSTOMER;
	products: string[];
};
