import { imageAWS } from './product.type';

export type xtraderProductCat = {
	id: string;
	name: string;
};

export type XtrBrand = {
	id: number;
	name: string;
	imageName?: string;
	image?: imageAWS;
	imageData?: string;
};
// export type xtraderProductType = {
// 	category: xtraderProductCat;
// };

export type XtrProdCat = {
	id: number;
	catName: string;
	image?: imageAWS;
	parentCategory?: XtrProdCat;
	childCategories?: XtrProdCat[];
};
export type xtrEan = {
	ean: string;
	value: string;
};

export type XtrStockImage = {
	id: string;
	category: string;
	key: string;
	fileType: string;
	imageData?: string;
};

export type XtrProdAttributeValue = {
	id: number;
	atrributeValueId: number;

	title: string;
	priceAdjustment: string;
	ean?: string;
	stockStatus: string;
};
export type xtrProdAttribute = {
	id: string;
	attributeId: number;
	name: string;
	attributeValues: XtrProdAttributeValue[];
};

export type XtrProdEan = {
	id: number;
	code: string;
	value: string;
};

export type XtraderProduct = {
	category: number;
	id: number;
	weight: string;
	name: string;
	model: string;
	goodsPrice: string;
	privateStockPrice: string;
	caseSize: number;
	retailPrice: string;
	thumb: string;
	image: string;
	multi?: string;
	multi1?: string;
	multi2?: string;
	multi3?: string;
	bigmulti1?: string;
	bigmulti2?: string;
	bigmulti3?: string;
	description: string;
	descriptionHtml: string;
	ean?: string;
	eans?: xtrEan[];
	ximage?: string;
	ximage2?: string;
	ximage3?: string;
	ximage4?: string;
	ximage5?: string;
	length?: string;
	lubeType?: string;
	condomSafe?: boolean;
	liquidVolume?: string;
	numberOfPills?: string;
	washing?: string;
	insertable?: string;
	diameter?: string;

	harnessCompatible?: boolean;
	oringCirc?: string;
	oringDiam?: string;
	circumference?: string;
	colour?: string;
	flexibility?: string;
	controller?: string;
	forWho?: string;
	whatIsIt?: string;
	for?: string;
	motion?: string;
	features?: string;
	misc?: string;
	waterProof?: boolean;
	material?: string;
	brand: string;
	style?: string;
	power?: string;
	size?: string;
	opening?: string;
	catName: string;

	attributes?: xtrProdAttribute[] | xtrProdAttribute;
	// attributesOld?: {
	// 	id: number;
	// 	name: string;
	// 	attributeValues: [
	// 		{
	// 			value: number;
	// 			title: string;
	// 			priceAdjustment: string;
	// 		}
	// 	];
	// };
};

export type XtraderProdLike = {
	id: string;
	productId: number;
	userId: string | undefined;
	liked: boolean;
};

export type XtraderProdReview = {
	id: string;
	productId: number;
	rating: number;
	title: string;
	body: string;
	createdDate: Date;
};

export type XtraderProductResp = {
	category: XtrProdCat;
	id: number;
	weight: string;
	name: string;
	model: string;
	goodsPrice: string;
	privateStockPrice: string;
	caseSize: number;
	retailPrice: string;
	thumb: XtrStockImage;
	image: XtrStockImage;
	multi?: XtrStockImage;
	multi1?: XtrStockImage;
	multi2?: XtrStockImage;
	multi3?: XtrStockImage;
	bigmulti1?: XtrStockImage;
	bigmulti2?: XtrStockImage;
	bigmulti3?: XtrStockImage;
	description: string;
	descriptionHtml: string;
	ean?: string;
	selectedEan?: string;
	eans?: XtrProdEan[];
	sizeId?: number;
	ximage?: XtrStockImage;
	ximage2?: XtrStockImage;
	ximage3?: XtrStockImage;
	ximage4?: XtrStockImage;
	ximage5?: XtrStockImage;
	length?: string;
	lubeType?: string;
	condomSafe?: boolean;
	liquidVolume?: string;
	numberOfPills?: string;
	washing?: string;
	insertable?: string;
	diameter?: string;
	fastening?: string;
	harnessCompatible?: boolean;
	oringCirc?: string;
	oringDiam?: string;
	circumference?: string;
	colour?: string;
	flexibility?: string;
	controller?: string;
	forWho?: string;
	whatIsIt?: string;
	for?: string;
	motion?: string;
	features?: string;
	misc?: string;
	waterProof?: boolean;
	material?: string;
	brand: XtrBrand;
	style?: string;
	power?: string;
	size?: string;
	opening?: string;
	catName: string;
	stockStatus: string;
	stripeRestricted: boolean;
	attributes?: xtrProdAttribute[];
	numLikes: number;
	likes: XtraderProdLike[];
	rating?: number;
	reviews: XtraderProdReview[];
};
