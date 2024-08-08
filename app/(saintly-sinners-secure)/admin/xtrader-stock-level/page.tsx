import { parseStringPromise } from 'xml2js';

import { _readValueToProps } from 'chart.js/dist/helpers/helpers.options';
import {
	StockSizeType,
	XtraderProducts,
	stockItemType,
	xtraderStockLevelType,
} from '@/interfaces/xtraderStockLevel.type';
import { Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';
import XtraderStockLevel from '@/components/ui/secure/XtraderStockLevel';

export const metadata: Metadata = {
	title: 'Xtrader Stock level maintenance',
};

const parsedXml = async (xmlString2: string) => {
	const parsed = await parseStringPromise(xmlString2);
	return parsed['STOREITEMS']['PRODUCT'];
};

// type stockItemType = {
// 	level: string;
// };

// type StockSizeType = {
// 	size: string;
// 	level: string;
// };
// type prodType = {
// 	item: string;
// 	name: string;
// 	stockItem?: stockItemType;
// 	stockSizes?: StockSizeType[];
// };

const parseXml = async (xmlString: string) => {
	const parsed = await parseStringPromise(xmlString);
	return parsed;
	// return parsed['categories']['CREATED'][0]['category'];
};
export default async function XtraderStockLevelPage() {
	return <XtraderStockLevel />;
}
