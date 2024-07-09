'use client';

import xml2js, { parseStringPromise } from 'xml2js';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import axios from 'axios';
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
	let convert = await parseStringPromise(xmlString);
	return convert['products']['product'];
};

const EdcUploadUI = ({ children }: { children: React.ReactNode }) => {
	const fileUploadRef = useRef<FileUpload | null>(null);
	const toast = useRef<Toast>(null);

	const onUploadHandler = async (event: any) => {
		const file = event.files[0];
		const filedata = await readXmlFile(file);

		const edcJson = await parseXml(filedata);
		let numRecs = 0;
		const url = '/api/edcupload';
		for (const product of edcJson) {
			const resp = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(product),
			});
			const apiStatus = resp.status;
			console.log(`api status ${JSON.stringify(apiStatus, null, 2)}`);
			if (apiStatus === 200) {
				numRecs++;
			} else {
				toast.current?.show({
					severity: 'error',
					summary: 'Unexpected error',
					detail: `Could not save the product ${resp.statusText}`,
					life: 3000,
				});
			}
		}

		toast.current?.show({
			severity: 'info',
			summary: 'Uploaded',
			detail: `EDC stock file uploaded ${numRecs} items`,
			life: 3000,
		});
		alert(`uploaded files ${fileUploadRef.current?.getFiles().length}`);
		fileUploadRef.current?.clear();
	};

	return (
		<>
			<Toast ref={toast} position="top-center" />
			<div className="grid">
				<div className="col-12">
					<div className="card">
						<h5>EDC stockfile</h5>
						<FileUpload
							ref={fileUploadRef}
							name="edcStock"
							uploadHandler={onUploadHandler}
							customUpload
							auto
							accept="text/xml"
							chooseLabel="Select stock file"
							maxFileSize={1000000}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default EdcUploadUI;
