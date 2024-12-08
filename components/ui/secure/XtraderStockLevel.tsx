'use client';

import {
	StockSizeType,
	XtraderProducts,
	stockItemType,
	xtrStockLevelUpdateApiResp,
	xtraderStockLevelType,
} from '@/interfaces/xtraderStockLevel.type';
import { isIterable } from '@/utils/helpers';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { useState } from 'react';

export default function XtraderStockLevel() {
	const [processed, setProcessed] = useState<number>(0);
	const [inStock, setInStock] = useState<number>(0);
	const [outOfStock, setOutOfStock] = useState<number>(0);
	const [inStockSize, setInStockSize] = useState<number>(0);
	const [outOfStockSize, setOutOfStockSize] = useState<number>(0);

	const batchSize = 100;
	let apiUrl = '';

	let items = 0;
	let numProcessed = 0;
	let totalStock = 0;

	const onClickHandler = async () => {
		const products: xtraderStockLevelType[] = [];
		const url = '/api/xtrader/stock-status';
		const stockLevelResp = await fetch(url, { cache: 'no-cache' });
		if (!stockLevelResp.ok) {
			throw Error(
				`Could not get stock level: status ${stockLevelResp.status} message ${stockLevelResp.statusText}`
			);
		}
		const stockLevelJson = await stockLevelResp.json();

		let _instock = 0;
		let _outOfStock = 0;
		let _inStockSize = 0;
		let _outOfStockSize = 0;
		if (isIterable(stockLevelJson)) {
			totalStock = stockLevelJson.length;
		}

		for (const prod of stockLevelJson) {
			numProcessed = numProcessed + 1;
			items = items + 1;
			let batchRemainder = items % batchSize;

			if (batchRemainder === 0) {
				const xtrProds: XtraderProducts = {
					products,
				};

				const statusResp = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(xtrProds),
				});
				if (!statusResp.ok) {
					console.warn(
						`Could not update stock levels status ${statusResp.status} statusText: ${statusResp.statusText}`
					);
				} else {
					const stockStatusUpdates =
						(await statusResp.json()) as xtrStockLevelUpdateApiResp;

					_outOfStock = outOfStock + stockStatusUpdates.outOfStock;
					_instock = _instock + stockStatusUpdates.inStock;
					_inStockSize = inStockSize + stockStatusUpdates.inStockSize;
					_outOfStockSize = outOfStockSize + stockStatusUpdates.outOfStockSize;
					products.length = 0;
					const processedVal = (numProcessed / totalStock) * 100;
					setProcessed(parseFloat(processedVal.toFixed(2)));
				}
			} else {
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
		}
		const processedVal = (numProcessed / totalStock) * 100;
		setProcessed(parseFloat(processedVal.toFixed(2)));
		setInStock(_instock);
		setOutOfStock(_outOfStock);
		setInStockSize(_inStockSize);
		setOutOfStockSize(_outOfStockSize);
	};

	return (
		<Card title="Update stock level">
			<p className="m-0">
				<Button onClick={() => onClickHandler()}>
					Get current stock levels
				</Button>
			</p>

			<ProgressBar className="mt-5" value={processed} />

			<div className="grid mt-5">
				<div className="col-2">
					<span className="text-grey-500 text-left">In stock</span>
				</div>
				<div className="col-10">
					<span className="text-grey-500 text-left">{inStock}</span>
				</div>
				<div className="col-2">
					<span className="text-grey-500 text-left">Out of stock</span>
				</div>
				<div className="col-10">
					<span className="text-grey-500 text-left">{outOfStock}</span>
				</div>
				<div className="col-2">
					<span className="text-grey-500 text-left">In stock sizes</span>
				</div>
				<div className="col-10">
					<span className="text-grey-500 text-left">{inStockSize}</span>
				</div>
				<div className="col-2">
					<span className="text-grey-500 text-left">Out of stock sizes</span>
				</div>
				<div className="col-10">
					<span className="text-grey-500 text-left">{outOfStockSize}</span>
				</div>
			</div>
		</Card>
	);
}
