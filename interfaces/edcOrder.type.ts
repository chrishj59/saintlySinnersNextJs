export type ORDER_CUSTOMER = {
	firstName: string;
	lastName: string;
	street: string;
	street2: string;
	houseNumber?: number;

	city: string;
	country: number; // EDC country code

	postCode: string;
	telephone: string;
	email: string;
};
export type ORDER_ADDRESS = {
	firstName: string;
	lastName: string;
	street: string;
	street2: string;
	houseNumber: number;
	city: string;
	county: string;
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

export type CUST_ORDER_STATUS = {
	userId?: string;
	onetimeCust?: boolean;
	orderid: string;
	orderNumber: number;
	orderStatus: number;
	confirmOrder: string;
	trackingRef: string;
	xtraderStatus: string;
	xtraderError: string;
};

export type CUST_ORDER_TYPE = {
	vendorNumber: number;
	orderedOn: Date;
	stripeSessionId?: string;
	oneTimeCustomer: boolean;
	customerId?: string;
	goodsValue: number;
	tax: number;
	total: number;
	currencyCode: string;
	delivery: number;
	orderAddress: ORDER_ADDRESS;
	customerOneTime?: ORDER_CUSTOMER;
	customer?: ORDER_CUSTOMER;
	products: ORDER_PRODUCT[];
	customerDelivery?: CUST_ORDER_DELIVERY;
};
