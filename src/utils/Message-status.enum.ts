export enum MessageStatusEnum {
	SUCCESS = 'SUCCESS',
	ERROR = 'ERROR',
	FAIL = 'FAIL',
	WARNING = 'WARNING',
}

export enum CustOrderStatusEnum {
	'PENDING' = 0,
	'STRIPE_PAID' = 1,
	'EDC_ORDER_COMPLETE' = 2,
	'DELIVERED' = 3,
}
