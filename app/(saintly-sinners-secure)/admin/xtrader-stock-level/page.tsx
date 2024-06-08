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
	const url = 'https://www.xtrader.co.uk/catalog/xml-feed/stockatt.xml';

	const stocklevelResp = await fetch(url, { cache: 'no-cache' });

	if (!stocklevelResp.ok) {
		throw new Error('No stock levels found');
	}

	const xmlString = await stocklevelResp.text();
	// const xmlString2 = `${xmlString.substring(0, 149)}</STOREITEMS>`;
	const xmlString2 = `${xmlString.substring(0, 2532)}</STOREITEMS>`;
	// console.log(`xmlString2 ${xmlString2}`);

	const stockJson = await parsedXml(xmlString);

	const products: xtraderStockLevelType[] = [];
	const batchSize = 100;
	const statusUrl = `${process.env.EDC_API_BASEURL}/xtrStockLevel`;
	let inStock = 0;
	let outOfStock = 0;
	let items = 0;
	for (const prod of stockJson) {
		items = items + 1;
		let batchRemainder = items % batchSize;
		if (batchRemainder === 0) {
			//send to backend and and clear
			const xtrProds: XtraderProducts = {
				products,
			};

			const statusResp = await fetch(statusUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(xtrProds),
			});

			const resp = await statusResp.json();
			inStock = inStock + Number(resp['inStock']);
			outOfStock = outOfStock + Number(resp['outOfStock']);

			products.length = 0;
		}

		let _prod: xtraderStockLevelType = {
			name: prod['$']['NAME'],
			item: prod['$']['ITEM'],
		};

		const _stock = prod['STOCK'];
		const numStockItems: number = _stock.length;
		if (numStockItems === 1) {
			const stock_item: stockItemType = { level: _stock[0] };
			_prod.stockItem = stock_item;
		} else {
			const _stockSizes: StockSizeType[] = [];
			for (const item of _stock) {
				const stockSize: StockSizeType = {
					size: item['$']['Size'],
					level: item['_'],
				};
				_stockSizes.push(stockSize);
			}
			_prod.stockSizes = _stockSizes;
		}

		products.push(_prod);
	}
	const xtrProds: XtraderProducts = {
		products,
	};

	const statusResp = await fetch(statusUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(xtrProds),
	});

	const resp = await statusResp.json();
	inStock = inStock + Number(resp['inStock']);
	outOfStock = outOfStock + Number(resp['outOfStock']);
	revalidatePath(
		'(saintly-sinners-public)/product/productOverview/[id]',
		'page'
	);
	return (
		<>
			<div>In stock {inStock}</div>
			<div>Out of stock {outOfStock}</div>
		</>
	);
}
