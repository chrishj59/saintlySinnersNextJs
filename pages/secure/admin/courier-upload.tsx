import axios from 'axios';
import Papa from 'papaparse';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';

const UploadCourier = (props: any) => {
	const toast = useRef<Toast>(null);

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
			try {
				//const rec = buildCountryRec(r);
				const result = await axios.post(
					process.env.NEXT_PUBLIC_EDC_API_BASEURL + '/courier',
					r
				);
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

		toast.current?.show({
			severity: 'info',
			summary: 'Uploaded',
			detail: `Upoaded  ${numRecs} Couriers`,
			life: 3000,
		});
	};

	return (
		<>
			<Toast ref={toast} />
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
};

export default UploadCourier;
