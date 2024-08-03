type CUSTOMER = {
	firstName: string;
	lastName: string;
	street: string;
	street2: string;
	houseNumber: number;

	city: string;
	country: number; // EDC country code

	postCode: string;
	telephone: string;
	email: string;
};

export type ORDER_PRODUCT = {
	model: string;
	attributeStr?: string;

	quantity?: number;
};

export type CUST_ORDER_DELIVERY = {
	id?: number;
	deliveryCost: number;
	shippingModule: string;
	deliveryChargeId: string;
};

export type CUST_ORDER_TYPE = {
	vendorNumber: number;
	stripeSessionId?: string;
	oneTimeCustomer: boolean;
	goodsValue: number;
	tax: number;
	total: number;
	currencyCode: string;
	delivery: number;
	customer: CUSTOMER;
	products: ORDER_PRODUCT[];
	customerDelivery?: CUST_ORDER_DELIVERY;
};
