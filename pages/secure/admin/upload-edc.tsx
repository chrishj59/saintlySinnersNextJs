import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import xml2js, { parseStringPromise } from 'xml2js';

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
const UploadEdc = (props: any) => {
	const fileUploadRef = useRef(null);
	const toast = useRef<Toast>(null);
	const [totalSize, setTotalSize] = useState(0);
	const [formData, setFormData] = useState(null);

	const onUploadHandler = async (event: any) => {
		const file = event.files[0];
		const filedata = await readXmlFile(file);

		const edcJson = await parseXml(filedata);
		let numRecs = 0;
		for (const product of edcJson) {
			try {
				const { data } = await axios.post(`/api/admin/edcupload`, product);
				numRecs++;
			} catch (result: any) {
				toast.current?.show({
					severity: 'error',
					summary: 'Unexpected error',
					detail: `Could not save the product ${result.statusText}`,
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
	};

	return (
		<>
			<Toast ref={toast} />
			<div className="grid">
				<div className="col-12">
					<div className="card">
						<h5>EDC stockfile</h5>
						<FileUpload
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

// export default UploadEdc;
export default withPageAuthRequired(UploadEdc);
