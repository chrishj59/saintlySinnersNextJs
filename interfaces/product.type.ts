export type imageAWS = {
	id: string;
	imageKey: string;
	location: string;
};

export type variant = {
	id: number;

	type: string;

	subArtNr: string;

	ean: number;

	inStock: string;

	stockEstimate: number;

	restockWeekNr: number;

	customProduct: string;

	sizeTitle: string;

	discontinued: string;
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
	imageType?: string;
	imageData?: string;
	stockStatus: string;
	variants?: variant[];
	defaultCategory?: category;
	cartQuantity?: number;
	cartPrice?: string;
};
