import axios from 'axios';
import Papa from 'papaparse';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';

import { COUNTRY_TYPE } from '../../../interfaces/country.type';

const UploadCountry = (props: any) => {
	const toast = useRef<Toast>(null);
	const [parsedData, setParsedData] = useState<any[]>([]);
	const [tableRows, setTableRows] = useState([]);
	const [values, setValues] = useState([]);

	const readCsvFile = (file: File) => {
		return new Promise<any>(function (resolve) {
			var reader = new FileReader();
			reader.onloadend = function () {
				resolve(reader.result);
			};
			reader.readAsText(file);
		});
	};

	const buildCountryRec = (r: any): COUNTRY_TYPE => {
		const c: COUNTRY_TYPE = {
			id: r.id,
			name: r.name,
			iso3: r.iso3,
			iso2: r.iso2,
			numericCode: r.numeric_code,
			phoneCode: r.phone_code,
			capital: r.capital,
			currency: r.currency,
			currencySymbol: r.currency_symbol,
			tld: r.tld,
			region: r.region,
			subRegion: r.subregion,
			timezones: r.timezones,
			native: r.native,
			lat: r.latitude,
			lng: r.longitude,
			emoji: r.emoji,
			emojiu: r.emojiU,
		};
		return c;
	};
	const onUploadHandler = async (event: any) => {
		const file = event.files[0];
		const filedata = await readCsvFile(file);
		const csv = Papa.parse(filedata, { header: true });
		let numRecs = 0;
		console.log(`record: ${JSON.stringify(csv.data[0])}`);

		for (const r of csv.data) {
			try {
				const rec = buildCountryRec(r);
				const result = await axios.post(
					process.env.NEXT_PUBLIC_EDC_API_BASEURL + '/countryLoad',
					rec
				);
				numRecs++;
				console.log(numRecs);
				console.log(result);
			} catch (result: any) {
				toast.current?.show({
					severity: 'error',
					summary: 'Unexpected error',
					detail: `Could not ${result.statusText}`,
					life: 3000,
				});
			}
		}

		toast.current?.show({
			severity: 'info',
			summary: 'Uploaded',
			detail: `Countries uploaded ${numRecs} items`,
			life: 3000,
		});
		let data: any = [];
	};

	return (
		<>
			<Toast ref={toast} />
			<div className="grid">
				<div className="col-12">
					<div className="card">
						<h5>Upload Countries</h5>
						<FileUpload
							name="countryLoad"
							uploadHandler={onUploadHandler}
							customUpload
							auto
							accept="text/csv"
							chooseLabel="Select countries file"
							maxFileSize={1000000}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default UploadCountry;
