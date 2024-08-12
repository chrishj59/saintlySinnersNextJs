export type DELIVERY_CHARGE_MSG = {
	id?: string;
	vendorId: number;
	courierId: string;
	shippingModule: string;
	countryId: number;
	uom: number;
	minWeight: number;
	maxWeight: number;
	minDays: number;
	maxDays: number;
	durationDescription: string;
	amount: number;
	hasLostClaim: boolean;
	hasTracking: boolean;
};
