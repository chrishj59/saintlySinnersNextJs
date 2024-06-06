type PRODUCT = {
	model: string;
	quantity: number;
	attributeName?: string;
	attributeValue?: string;
};

export type CUSTOMER = {
	title: string;
	firstName: string;
	lastName: string;
	street: string;
	street2: string;
	city: string;
	county: string;
	country: number;
	postCode: string;
	telephone: string;
	orderRef: string;
	ioss: number;
};

export type CUSTOMER_ORDER = {
	id?: string;
	orderNumber: number;
	orderStatus: number;
	vendorNumber: number;
	vendOrderNumber: string;
	oneTimeCustomer: boolean;
	goodsValue: number;
	deliveryCost?: number;
	tax: number;
	total: number;
	vendGoodCost: number;
	vendDelCost: number;
	vendTotalPayable: number;
	currencyCode: string;
	customer: CUSTOMER;
	products?: PRODUCT[];
	stripeSession: string;
	confirmOrder: string;
	xtraderError: string;
	xtraderStatus: string;
	trackingRef: string;
};
