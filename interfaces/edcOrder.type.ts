type CUSTOMER = {
	name: string;
	street: string;
	// EDC country code
	country: number;
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
