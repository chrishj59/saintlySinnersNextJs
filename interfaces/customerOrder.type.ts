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
export type ORDER_LINE = {
	id: number;
	quantity: number;
	price: string;
	lineTotal: string;
	prodRef: string;
	description: string;
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
	createdDate?: string;

	tax: number;
	total: number;
	vendGoodCost: number;
	vendDelCost: number;
	vendTotalPayable: number;
	currencyCode: string;
	customer: CUSTOMER;
	orderLines?: ORDER_LINE[];
	products?: PRODUCT[];
	stripeSession: string;
	confirmOrder: string;
	xtraderError: string;
	xtraderStatus: string;
	trackingRef: string;
};
