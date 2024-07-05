'use client';

import xml2js, { parseStringPromise } from 'xml2js';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import axios from 'axios';
import { categoriesFileType } from '@/interfaces/xtraderCategory.type';
import { Console } from 'console';

// type categoriesFileType = {
// 	categories_name: string;
// 	categories_id: string;
// 	parent_id: string;
// 	categories_image: string;
// };
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
	const parsed = await parseStringPromise(xmlString);
	return parsed['categories']['CREATED'][0]['category'];
};
export default function XTraderCategoryUpload() {
	const fileUploadRef = useRef<FileUpload | null>(null);
	const toast = useRef<Toast>(null);

	const onUploadHandler = async (event: any) => {
		const file = event.files[0];
		const filedata = await readXmlFile(file);

		const categories: categoriesFileType[] = await parseXml(filedata);
		console.log(`num categories ${categories.length}`);
		let numRecs = 0;

		if (filedata) {
			console.log(`category xml ${JSON.stringify(categories, null, 2)}`);
		}
		for (const cat of categories) {
			try {
				const catResp = await fetch(`/api/xtrader/category`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(cat),
				});

				if (!catResp.ok) {
					throw new Error(`${catResp.status} ${catResp.statusText}`);
				}
				numRecs = numRecs + 1;

				const progress = (numRecs / categories.length) * 100;

				const _catResp = await catResp.json();

				// const newVendor = (await vendorResp.json()) as VENDOR_TYPE;
			} catch (error) {
				if (error instanceof SyntaxError) {
					// Unexpected token < in JSON
					console.warn('There was a SyntaxError', error);
				} else {
					console.error('Could not find charges');
					console.error(error);
				}
			}
		}
		fileUploadRef.current?.clear();
	};
	return (
		<>
			<Toast ref={toast} position="top-center" />
			<div className="grid">
				<div className="col-12">
					<div className="card">
						<h5>Xtrader Category uploaded</h5>
						<FileUpload
							ref={fileUploadRef}
							name="xtraderCat"
							uploadHandler={onUploadHandler}
							customUpload
							auto
							accept="text/xml"
							chooseLabel="Select Category file"
							maxFileSize={1000000}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
