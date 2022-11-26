type imageAWS = {
	id: string;
	key: string;
	location: string;
};
export type ProductAxiosType = {
	id: number;
	artnr: string;
	title: string;
	description: string;
	caseCount: string;
	date: string;
	modifyDate: string;
	currency: string;
	b2b: string;
	b2c: string;

	vatRateNl: string;
	vatRateDe: string;
	vatRateFR: string;
	vatRateUk: string;
	discount: string;
	minPrice: string;
	weight: number;
	packaging: string;
	material: string;
	popularity: number;
	countryCode: string;
	hsCode: string;
	batteryRequired: boolean;
	images?: imageAWS[];
	stockStatus: string;
};
