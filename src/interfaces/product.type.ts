export type imageAWS = {
	id: string;
	key: string;
	// location: string;
	imageFormat?: string;
	imageData?: string;
};

export type awsS3ImageReturn = {
	imageData: string;
	imageFormat: string;
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

export type productId = {
	id: number;
	b2c?: string;
};
export type bulletPoint = {
	id: string;
	description: string;
	seq: number;
};

export type category = {
	id: number;
	title: string;
	onMenu: boolean;
	menuLevel?: number;
};

export type propertyValue = {
	id: number;
	title: string;
	unit: string;
	magnitude: number;
};
export type property = {
	id: number;
	propertyId: number;
	productId: number;
	propTitle: string;
	values: propertyValue[];
};

export type bullet = {
	id: string;
	seq: number;
	description: string;
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
	properties: property[];
	newCategories: category[];
	bullets?: bullet[];
};

type restrictedProduct = {
	ITEM: string;
};
type prodItem = {
	ITEM: string;
};

type catItem = {
	id: string;
	name: string;
};

type Cat = {
	item: catItem;
	PRODUCT: productType[];
};

type restrictedCat = {
	id: string;
	name: string;
	PRODUCT: restrictedProduct[];
};

export type RestrictedStoreItems = {
	CATEGORY: restrictedCat[];
};
export type StoreItems = {
	CATEGORY: Cat[];
};

type AttribValueItem = {
	VALUE: string;
	TITLE: string;
	PRICEADJUST: string;
};
type AttribValue = {
	item: AttribValueItem;
};
type AttributeItem = {
	NAME: string;
	ATTRIBUTEID: string;
};
export type Attribute = {
	item: AttributeItem;
	ATTRIBUTEVALUES: AttribValue[];
};

export type productType = {
	item: prodItem;
	WEIGHT: string;
	NAME: string;
	MODEL: string;
	PRICE: string;
	PRIVATESTOCKPRICE: string;
	CASESIZE: string;
	RRP: string;
	THUMB: string;
	IMAGE: string;
	MULTI: string;
	MULTI1: string;
	MULTI2: string;
	MULTI3: string;
	BIGMULTI1: string;
	BIGMULTI2: string;
	BIGMULTI3: string;
	DESCRIPTION: string;
	DESC_RAW: string;
	EAN: string;
	XIMAGE: string;
	XIMAGE2: string;
	XIMAGE3: string;
	XIMAGE4: string;
	XIMAGE5: string;
	WASHING?: string;
	COLOUR: string;
	LENGTH: string;
	FLEXIBILITY: string;
	LUBETYPE: string;
	CONDOMSAFE: string;
	LIQUIDVOLUMN: string;
	NUMBEROFPILLS: string;
	FASTENING: string;
	INSERTABLE: string;
	DIAMETER: string;
	HARNESSCOMPATIBLE: string;
	ORINGCIRC: string;
	ORINGDIAM: string;
	CIRCUMFERENCE: string;
	CONTROLLER: string;
	FORWHO: string;
	WHATISIT: string;
	FOR: string;
	MOTION: string;
	FEATURES: string;
	MISC: string;
	WATERPROOF: string;
	MATERIAL: string;
	BRAND: string;
	STYLE: string;
	POWER: string;
	SIZE: string;
	OPENING: string;
	INCATNAME: string;
	ATTRIBUTES: Attribute;
};

export type RestrictedProducts = {
	productIds: Number[];
};
