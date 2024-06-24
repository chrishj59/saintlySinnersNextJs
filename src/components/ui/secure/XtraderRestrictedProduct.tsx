'use client';

import {
	RestrictedProducts,
	RestrictedStoreItems,
	StoreItems,
} from '@/interfaces/product.type';
import { restrProdRespIF } from '@/interfaces/xtrRestrProdResp.interface';
import { isIterable } from '@/utils/helpers';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import { parseStringPromise } from 'xml2js';
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

export default function XtraderRestrictedStock() {
	const [processed, setProcessed] = useState<number>(0);
	const fileUploadRef = useRef<FileUpload | null>(null);
	const toast = useRef<Toast>(null);

	const onUploadHandler = async (event: FileUploadHandlerEvent) => {
		const file = event.files[0];

		const filedata = await readXmlFile(file);

		const products = await parseXml(filedata);
		// console.log(
		// 	`products ${JSON.stringify(products['CATEGORY']['PRODUCT'], null, 2)}`
		// );

		const storeItems: StoreItems = products;

		let totalProds = 0;
		let numProcessed = 0;

		const categoryArray = storeItems.CATEGORY;
		console.log(
			`storeItems  ${JSON.stringify(categoryArray[0].PRODUCT[0], null, 2)}`
		);
		const restrictedIds: number[] = [];
		if (isIterable(categoryArray)) {
			for (const category of categoryArray) {
				console.log('loop over categoryArray');
				if (isIterable(category.PRODUCT)) {
					if (category.PRODUCT.length) {
						totalProds = totalProds + category.PRODUCT.length;
					}
					for (const prod of category.PRODUCT) {
						console.log(`prod ${JSON.stringify(prod.item.ITEM)}`);
						const itemid: number = Number(prod.item.ITEM);
						restrictedIds.push(itemid);
					}
				}
			}
		}
		// } else {
		// 	if (isIterable(products.PRODUCT)) {
		// 		console.log('in products.PRODUCT block');
		// 		totalProds = totalProds + products.PRODUCT.length;
		// 	} else {
		// 		totalProds = totalProds + 1;
		// 	}
		// }

		// console.log(
		// 	`restrictedProducts ${JSON.stringify(restrictedProducts, null, 2)}`
		// );
		const restricted: RestrictedProducts = {
			productIds: restrictedIds,
		};
		console.log(`restricted ${JSON.stringify(restricted)}`);
		console.log(`totalProds is ${totalProds}`);
		const url = '/api/admin/xtrRestrictedProduct';
		const restrictedResp = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(restricted),
		});
		console.log(`restrictedResp status ${restrictedResp.status}`);
		if (restrictedResp.ok) {
			const restricted = (await restrictedResp.json()) as restrProdRespIF;
			toast.current?.show({
				severity: 'success',
				summary: 'Updated restricted products',
				detail: `${restricted.message} ${restricted.quantity}`,
				life: 3000,
			});
		} else {
			toast.current?.show({
				severity: 'warn',
				summary: 'Could not update restricted products',
				detail: `${restrictedResp.status} ${restrictedResp.statusText}`,
				life: 3000,
			});
		}
		fileUploadRef.current!.clear();
	};
	return (
		<>
			<Toast ref={toast} position="top-center" />
			<div className="grid">
				<div className="col-12">
					<div className="card flex justify-content-center">
						<h5>Xtrader restricted stock update</h5>
					</div>
					<div>
						<FileUpload
							ref={fileUploadRef}
							name="xtraderCat"
							uploadHandler={onUploadHandler}
							customUpload
							auto
							accept="text/xml"
							chooseLabel="Select XTRADER restricted stock"
							maxFileSize={13000000}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
