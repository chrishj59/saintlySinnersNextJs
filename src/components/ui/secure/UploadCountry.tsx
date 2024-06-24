'use client';
import { COUNTRY_TYPE } from '@/interfaces/country.type';
import Papa from 'papaparse';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';

export default function CountryUpload() {
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
			deliveryActive: r.deliveryActive,
		};
		return c;
	};
	const onUploadHandler = async (event: any) => {
		const file = event.files[0];
		const filedata = await readCsvFile(file);
		const csv = Papa.parse(filedata, { header: true });
		let numRecs = 0;

		for (const r of csv.data) {
			try {
				const rec = buildCountryRec(r);

				const resp = await fetch(
					process.env.NEXT_PUBLIC_EDC_API_BASEURL + '/countryLoad',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(rec),
					}
				);
				if (resp.ok) {
					numRecs++;
				} else {
					toast.current?.show({
						severity: 'error',
						summary: 'Could not save country',
						detail: `Reason ${resp.statusText}`,
						life: 3000,
					});
				}
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
			<Toast ref={toast} position="top-center" />
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
}
