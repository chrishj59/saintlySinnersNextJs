import { COUNTRY_FILE, COUNTRY_TYPE } from './country.type';

export type VENDOR = {
	id: number;
	name: string;
};

export type COURIER = {
	id: string;
	name: string;
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
	deliveryCharge: number;
	vendor?: VENDOR;
	country?: COUNTRY_TYPE;
	courier?: COURIER;
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
