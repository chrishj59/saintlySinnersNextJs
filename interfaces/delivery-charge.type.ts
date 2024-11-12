import { COUNTRY_FILE, COUNTRY_TYPE } from './country.type';
import { COURIER_TYPE } from './courier.type';
export type VENDOR = {
	id: number;
	name: string;
};

export type COURIER = {
	id: string;
	name: string;
	shippingModule: string;
	cutOffTime: string;
};

export type REMOTE_LOCATION_TYPE = {
	id?: number;
	//deliveryCharge?: DELIVERY_CHARGE_TYPE;
	postCode: string;
	remoteCharge: number;
	surcharge: boolean;
	days?: number;
	deliveryChargeId?: string;
	deliveryId?: string;
};

export type DELIVERY_CHARGE_TYPE = {
	id?: string;
	uom?: string;
	minWeight: number;
	maxWeight: number;
	amount: number;
	vatAmount: number;
	totalAmount: number;
	deliveryCharge: number;
	vendor?: VENDOR;
	country?: COUNTRY_TYPE;
	courier?: COURIER_TYPE;
	courierName?: string;
	entryAmount?: number;
	minDays: number;
	maxDays: number;
	durationDescription: string;
	hasLostClaim: boolean;
	hasTracking: boolean;
	hasRemoteCharge: boolean;
	remoteLocations?: REMOTE_LOCATION_TYPE[];
};
