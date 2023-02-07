export type VENDOR = {
	id: number;
	name: string;
};

export type COURIER = {
	id: string;
	name: string;
};

export type COUNTRY = {
	id: number;
	name: string;
	langCode: string;
	langName: string;
	iso3: string;
	iso2: string;
	numericCode: string;
	phoneCode: string;
	capital: string;
	currency: string;
	currencySymbol: string;
	tld: string;
	region: string;
	subRegion: string;
	native: string;
	timezones: string;
	lat: string;
	lng: string;
	emoji: string;
	emojiu: string;
};

export type DELIVERY_CHARGE_TYPE = {
	id: string;
	uom: string;
	minWeight: number;
	maxWeight: number;
	amount: string;
	vendor: VENDOR;
	country: COUNTRY;
	courier: COURIER;
	courierName?: string;
};
