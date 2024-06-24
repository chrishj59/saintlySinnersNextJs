'use client';

import { parseStringPromise } from 'xml2js';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { ProgressBar } from 'primereact/progressbar';
import {
	XtrProdAttributeValue,
	XtraderProduct,
	xtrEan,
} from '@/interfaces/xtraderProduct.type';
import { originalPathname } from 'next/dist/build/templates/app-page';
import { xtrProdAttribute } from '@/interfaces/xtraderProduct.type';
import { isInterfaceTypeIterable, isIterable } from '@/utils/helpers';
// import { forEach } from 'lodash';

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

type StoreItems = {
	CATEGORY: Cat[];
};

type AttribValueItem = {
	ID: number;
	VALUE: string;
	TITLE: string;
	STOCK_STATUS: string;
	PRICEADJUST: string;
};
type AttribValue = {
	item: AttribValueItem;
};
type AttributeItem = {
	NAME: string;
	ATTRIBUTEID: string;
};
type Attribute = {
	item: AttributeItem;
	ATTRIBUTEVALUES: AttribValue[];
};

type productType = {
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

const readXmlFile = (file: File) => {
	return new Promise<any>(function (resolve) {
		var reader = new FileReader();
		reader.onloadend = function () {
			resolve(reader.result);
		};
		reader.readAsText(file);
	});
};
const parseXml = async (xmlString: string) => {
	const parsed = await parseStringPromise(xmlString, {
		attrkey: 'item',
		explicitArray: false,
	});
	return parsed['STOREITEMS']['CREATED'];
};

export default function XtraderStockUpload() {
	const [processed, setProcessed] = useState<number>(0);
	const fileUploadRef = useRef<FileUpload | null>(null);
	const toast = useRef<Toast>(null);

	const processProduct = async (
		numProcessed: number,
		totalProds: number,
		catId: string,
		prod: productType
	): Promise<number> => {
		/** build product records */
		let xtrEan: xtrEan[] = [];

		const currProd: XtraderProduct = {
			category: parseInt(catId),

			id: parseInt(prod.item.ITEM),
			weight: prod.WEIGHT,
			name: prod.NAME,
			model: prod.MODEL,
			goodsPrice: prod.PRICE,
			privateStockPrice: prod.PRIVATESTOCKPRICE,
			caseSize: parseInt(prod.CASESIZE),
			retailPrice: prod.RRP,
			thumb: prod.THUMB,
			image: prod.IMAGE,
			multi: prod.MULTI,
			multi1: prod.MULTI1,
			multi2: prod.MULTI2,
			multi3: prod.MULTI3,
			bigmulti1: prod.BIGMULTI1,
			bigmulti2: prod.BIGMULTI2,
			bigmulti3: prod.BIGMULTI3,
			description: prod.DESCRIPTION,
			descriptionHtml: prod.DESC_RAW,
			ean: prod.EAN,
			// eans?: xtrEan[];
			ximage: prod.XIMAGE,
			ximage2: prod.XIMAGE2,
			ximage3: prod.XIMAGE3,
			ximage4: prod.XIMAGE4,
			ximage5: prod.XIMAGE5,
			length: prod.LENGTH,
			lubeType: prod.LUBETYPE,
			washing: prod.WASHING,
			insertable: prod.INSERTABLE,
			condomSafe: prod.CONDOMSAFE === 'Yes' ? true : false,
			diameter: prod.DIAMETER,
			harnessCompatible: prod.HARNESSCOMPATIBLE === 'Yes' ? true : false,
			oringCirc: prod.ORINGCIRC,
			oringDiam: prod.ORINGDIAM,
			colour: prod.COLOUR,
			flexibility: prod.FLEXIBILITY,
			forWho: prod.FORWHO,
			whatIsIt: prod.WHATISIT,
			for: prod.FOR,
			motion: prod.MOTION,
			features: prod.FEATURES,
			misc: prod.MISC,
			waterProof: prod.WATERPROOF == 'Yes' ? true : false,
			material: prod.MATERIAL,
			brand: prod.BRAND,
			style: prod.STYLE,
			power: prod.POWER,
			catName: prod.INCATNAME,
		};
		if (prod.ATTRIBUTES) {
			//const prodAttribute: xtrProdAttribute

			const attribValues: XtrProdAttributeValue[] = [];
			if (prod.ATTRIBUTES.ATTRIBUTEVALUES)
				if (Array.isArray(prod.ATTRIBUTES.ATTRIBUTEVALUES)) {
					for (const attrVal of prod.ATTRIBUTES.ATTRIBUTEVALUES) {
						const _attrVal: XtrProdAttributeValue = {
							id: attrVal.item.ID ? attrVal.item.ID : 0,
							atrributeValueId: Number(attrVal.item.VALUE),
							stockStatus: attrVal.item.STOCK_STATUS,
							title: attrVal.item.TITLE,
							priceAdjustment: attrVal.item.PRICEADJUST,
						};

						attribValues.push(_attrVal);
					}
				} else {
					const attributeValue: AttribValue = prod.ATTRIBUTES.ATTRIBUTEVALUES;

					const _attrVal: XtrProdAttributeValue = {
						id: attributeValue.item.ID ? attributeValue.item.ID : 0,
						atrributeValueId: Number(attributeValue.item.VALUE),
						title: attributeValue.item.TITLE,
						stockStatus: attributeValue.item.STOCK_STATUS,
						priceAdjustment: attributeValue.item.PRICEADJUST,
					};

					attribValues.push(_attrVal);
				}

			const prodAttribute: xtrProdAttribute = {
				id: prod.ATTRIBUTES.item.ATTRIBUTEID,
				attributeId: parseInt(prod.ATTRIBUTES.item.ATTRIBUTEID),
				name: prod.ATTRIBUTES.item.NAME,
				attributeValues: attribValues,
			};

			currProd.attributes = prodAttribute;
		}

		if (prod.EAN === '') {
			const _prod: any = prod;

			const keys = Object.keys(prod);
			const eanKeys = keys.filter((k: string) => k.startsWith('EAN_'));
			const eans: xtrEan[] = [];
			for (const key of eanKeys) {
				const val = _prod[key];
				const ean: xtrEan = { ean: key, value: val };
				eans.push(ean);
			}

			currProd.eans = eans;
		}
		const url = '/api/admin/xtrProduct';
		const prodResp = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(currProd),
		});
		if (!prodResp.ok) {
			toast.current?.show({
				severity: 'error',
				summary: 'Save product failed',
				detail: `Could not save prod id ${currProd.id}`,
				life: 3000,
			});
		}

		numProcessed++;

		return numProcessed;
	};

	const onUploadHandler = async (event: FileUploadHandlerEvent) => {
		const file = event.files[0];
		const filedata = await readXmlFile(file);

		const products = await parseXml(filedata);

		const storeItems: StoreItems = products;

		const categoryArray = storeItems.CATEGORY;

		/** calculate total number of products */
		let totalProds = 0;
		let numProcessed = 0;

		if (isIterable(categoryArray)) {
			for (const category of categoryArray) {
				if (isIterable(category.PRODUCT)) {
					if (category.PRODUCT.length) {
						totalProds = totalProds + category.PRODUCT.length;
					}
				}
			}
		} else {
			if (isIterable(products.PRODUCT)) {
				totalProds = totalProds + products.PRODUCT.length;
			} else {
				totalProds = totalProds + 1;
			}
		}

		// if (1 === 1) {
		// 	return;
		// }
		/** save products and  update the proportion processed */

		if (isIterable(categoryArray)) {
			for (const category of categoryArray) {
				const catId = category.item.id;

				// if (catId === '101' && numProcessed === 0) {

				if (isIterable(category.PRODUCT)) {
					for (const prod of category.PRODUCT) {
						numProcessed = await processProduct(
							numProcessed,
							totalProds,
							catId,
							prod
						);

						const modCheck = numProcessed % 5;

						if (modCheck === 0) {
							const prop = (numProcessed / totalProds) * 100;
							setProcessed(parseFloat(prop.toFixed(2)));
						}
					}
				} else {
					const _prod = category['PRODUCT'];
				}
			}
		} else {
			const cat = products['CATEGORY'];
			const catProducts = cat['PRODUCT'];

			if (isIterable(catProducts)) {
				const catProduct: any = catProducts;
				const catid = cat['item']['id'];

				numProcessed = await processProduct(
					numProcessed,
					totalProds,
					catid,
					catProduct
				);
				// numProcessed++;

				const modCheck = numProcessed % 5;

				if (modCheck === 0) {
					const prop = (numProcessed / totalProds) * 100;

					setProcessed(parseFloat(prop.toFixed(2)));
				}
			} else {
				// single category single product
				const catProduct: any = catProducts;
				const catid = cat['item']['id'];

				numProcessed = await processProduct(
					numProcessed,
					totalProds,
					catid,
					catProduct
				);
				const modCheck = numProcessed % 5;

				if (modCheck === 0) {
					const prop = (numProcessed / totalProds) * 100;

					setProcessed(parseFloat(prop.toFixed(2)));
				}
			}
		}

		toast.current?.show({
			severity: 'success',
			summary: 'Uploaded products',
			detail: `Uploaded  ${numProcessed} products`,
			life: 3000,
		});
		fileUploadRef.current!.clear();
	};
	return (
		<>
			<Toast ref={toast} position="top-center" />
			<div className="grid">
				<div className="col-12">
					<div className="card">
						<h5>Xtrader upload stock</h5>
						<FileUpload
							ref={fileUploadRef}
							name="xtraderCat"
							uploadHandler={onUploadHandler}
							customUpload
							auto
							accept="text/xml"
							chooseLabel="Select XTRADER stock file"
							maxFileSize={13000000}
						/>
						<ProgressBar value={processed} />
					</div>
				</div>
			</div>
		</>
	);
}
