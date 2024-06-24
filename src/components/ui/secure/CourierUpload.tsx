'use client';
import Papa from 'papaparse';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';

export default function CourierUpload() {
	const toast = useRef<Toast>(null);
	const fileUploadRef = useRef<FileUpload | null>(null);

	const readCsvFile = (file: File) => {
		return new Promise<any>(function (resolve) {
			var reader = new FileReader();
			reader.onloadend = function () {
				resolve(reader.result);
			};
			reader.readAsText(file);
		});
	};
	let numRecs = 0;
	const onUploadHandler = async (event: any) => {
		const file = event.files[0];
		const filedata = await readCsvFile(file);
		const csv = Papa.parse(filedata, { header: true });
		for (const r of csv.data) {
			console.log(`courier file has ${JSON.stringify(r, null, 2)}`);
			try {
				const courierResp = await fetch(
					process.env.NEXT_PUBLIC_EDC_API_BASEURL + '/courier',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						cache: 'no-store',
						body: JSON.stringify(r),
					}
				);
				if (!courierResp.ok) {
					throw new Error(`${courierResp.status} ${courierResp.statusText}`);
				}

				numRecs++;
			} catch (result: any) {
				toast.current?.show({
					severity: 'error',
					summary: 'Unexpected error',
					detail: `Could not load courier${result.statusText}`,
					life: 3000,
				});
			}
		}
		fileUploadRef.current?.clear();
		toast.current?.show({
			severity: 'info',
			summary: 'Uploaded',
			detail: `Upoaded  ${numRecs} Couriers`,
			life: 3000,
		});
	};

	return (
		<>
			<Toast ref={toast} position="top-center" />
			<div className="grid">
				<div className="col-12">
					<div className="card">
						<h5>Upload Couriers</h5>
						<FileUpload
							name="courierLoad"
							uploadHandler={onUploadHandler}
							customUpload
							auto
							accept="text/csv"
							chooseLabel="Select couriers file"
							maxFileSize={1000000}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
