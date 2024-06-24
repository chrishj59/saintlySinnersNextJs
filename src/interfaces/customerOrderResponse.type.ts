type ORDER_MESSAGE = {
	orderNumber: number;
	orderId: string;
};
export type CUSTOMER_ORDER_RESPONSE = {
	status: number;
	orderMessage: ORDER_MESSAGE;
};
