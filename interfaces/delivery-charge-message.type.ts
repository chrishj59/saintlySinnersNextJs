export type DELIVERY_CHARGE_MSG = {
	id: string;
	vendorId: number;
	courierId: string;
	countryId: number;
	uom: number;
	minWeight: number;
	maxWeight: number;
	amount: number;
};
