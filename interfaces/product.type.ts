export type imageAWS = {
	id: string;
	key: string;
	location: string;
};

export type variant = {
	id: number;

	type?: string;

	subArtNr: string;

	ean?: number;

	inStock?: string;

	stockEstimate?: number;

	restockWeekNr?: number;

	customProduct?: string;

	sizeTitle?: string;

	discontinued?: string;
};

export type bulletPoint = {
	id: string;
	description: string;
	seq: number;
};

export type category = {
	id: number;
	title: string;
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
	subArtNr: string;
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
	imageFormat?: string;
	imageData?: string;
	stockStatus: string;
	variants: variant[];
	defaultCategory?: category;
	cartQuantity?: number;
	cartPrice?: string;
};
