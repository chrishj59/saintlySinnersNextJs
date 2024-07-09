// type stock = {
// 	name?: string;
// 	value: string;
// };

// type stockLevelProduct = {
// 	item: string;
// 	name: string;
// 	stock?: stock | stock[];
// };
// export type XtraderStockLevelType = {
// 	storeItems: stockLevelProduct[];
// };

export type stockItemType = {
	level: string;
};

export type StockSizeType = {
	size: string;
	level: string;
};
export type xtraderStockLevelType = {
	item: string;
	name: string;
	stockItem?: stockItemType;
	stockSizes?: StockSizeType[];
};
export type XtraderProducts = {
	products: xtraderStockLevelType[];
};

export type xtrStockLevelUpdateApiResp = {
	inStock: number;
	outOfStock: number;
	inStockSize: number;
	outOfStockSize: number;
};
