import axios, { AxiosError } from 'axios';
import type { InferGetStaticPropsType, GetStaticProps } from 'next';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { useRef, useState } from 'react';
import { classNames } from 'primereact/utils';
import { InputTextarea } from 'primereact/inputtextarea';
import {
	FileUpload,
	FileUploadHandlerEvent,
	FileUploadUploadEvent,
} from 'primereact/fileupload';
import { s3Client } from 'utils/s3-utils';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Nullable } from 'primereact/ts-helpers';
import Image from 'next/image';
import { Brand } from '../../../interfaces/brand.interface';
import useSWR from 'swr';

// interface Brand {
// 	id: number;
// 	title: string | undefined;
// 	categoryType: string | undefined;
// 	catDescription: string | undefined;
// 	catLevel: number;
// 	catId: number;
// 	imageData: string | null | undefined;
// 	imageFormat: string | undefined;
// 	onHomePage: boolean;
// 	awsKey: string | null;
// }

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BrandList({
	brandList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
	let emptyBrand = {
		id: 0,
		title: '',
		categoryType: '',
		catDescription: '',
		catLevel: 6,
		catid: 0,
		awsImage: '',
		awsImageFormat: 'jpeg',
		onHomePage: false,
		awsKey: '',
	};

	const fileUploadRef = useRef<FileUpload | null>(null);
	const [brands, setBrands] = useState<Brand[]>(brandList);
	const [brandDialog, setBrandDialog] = useState<boolean>(false);
	const [brand, setBrand] = useState<Brand>(emptyBrand);
	const [selectedBrand, setSelectedBrand] = useState<Brand[]>([]);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const toast = useRef<Toast | null>(null);
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const dt = useRef<DataTable<Brand[]>>(null);

	const [onHomePage, setOnHomePage] = useState<boolean>(false);
	const [awsImageData, setAwsImageData] = useState<string>('');
	const [awsImageFormat, setAwsImageFormat] = useState<string>('');

	// const errors = form.formState.errors;

	const catTypes = [
		{ label: 'Brand', value: 'B' },
		{ label: 'Category', value: 'C' },
		{ label: 'Title', value: 'T' },
	];
	const findIndexById = (id: number) => {
		let index = -1;

		for (let i = 0; i < brands.length; i++) {
			if (brands[i].id === id) {
				index = i;
				break;
			}
		}

		return index;
	};

	const exportCSV = () => {
		dt.current?.exportCSV();
	};

	const onCategoryTypeChange = (e: DropdownChangeEvent) => {
		let _brand = { ...brand };

		_brand['categoryType'] = e.value;
		setBrand(_brand);
	};

	const onInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		name: string
	) => {
		const val = (e.target && e.target.value) || '';
		let _brand = { ...brand };

		// @ts-ignore
		_brand[`${name}`] = val;

		setBrand(_brand);
	};

	const onInputAreaChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
		name: string
	) => {
		const val = (e.target && e.target.value) || '';
		let _brand = { ...brand };

		// @ts-ignore
		_brand[`${name}`] = val;
		setBrand(_brand);
	};

	const onInputNumberChange = (e: InputNumberChangeEvent, name: string) => {
		const val = e.value || 0;
		let _brand = { ...brand };

		// @ts-ignore
		_brand[`${name}`] = val;

		setBrand(_brand);
	};

	const onCategoryChange = (e: DropdownChangeEvent) => {
		alert(`e.value ${e.value}`);
		let _brand = { ...brand };

		_brand['categoryType'] = e.value;
		alert(`brand ${JSON.stringify(_brand, null, 2)}`);
		setBrand(_brand);
	};

	const onChangeHomePage = (e: InputSwitchChangeEvent) => {
		console.log(`onChangeHomePage new value ${e.checked} value ${e.value}`);
		let _brand = { ...brand };
		_brand.onHomePage = e.value ? e.value : false;
		setOnHomePage(_brand.onHomePage);
		setBrand(_brand);
	};

	const actionBodyTemplate = (rowData: Brand) => {
		return (
			<>
				<Button
					icon="pi pi-pencil"
					rounded
					outlined
					className="mr-2"
					onClick={() => editBrand(rowData)}
				/>
			</>
		);
	};

	const editBrand = async (brand: Brand) => {
		console.log(
			`editBrand called with brand ${JSON.stringify(brand, null, 2)}`
		);
		const url = `/api/v1/aws/getAwsImage?awsKey=${brand.awsKey}`;
		const { data } = await axios.get(url);
		brand.awsImage = data;

		setAwsImageData(brand.awsImage || '');
		setBrand({ ...brand });
		setBrandDialog(true);
	};

	const rightToolbarTemplate = () => {
		return (
			<Button
				label="Export"
				icon="pi pi-download"
				className="p-button-help"
				onClick={exportCSV}
			/>
		);
	};
	const categoryTypeTemplate = (brand: Brand) => {
		const catName = catTypes.find(
			(catTypes) => catTypes.value === brand.categoryType
		);
		if (catName === undefined) {
			return 'unknown ';
		}
		return catName.label;
	};
	const onHomePageTemplate = (brand: Brand) => {
		return <Checkbox checked={brand.onHomePage ? brand.onHomePage : false} />;
	};

	const hideBrandDialog = () => {
		setSubmitted(false);
		setBrandDialog(false);
	};

	const show = () => {
		toast.current?.show({
			severity: 'success',
			summary: 'Form Submitted',
			detail: '',
		});
	};
	const onBrandSubmit = (data: any) => {
		data.value && show();
		//form.reset();
	};

	const readBlobFile = (file: File) => {
		return new Promise<any>(function (resolve) {
			var reader = new FileReader();
			reader.onloadend = function () {
				resolve(reader.result);
			};
			reader.readAsArrayBuffer(file);
		});
	};
	interface ValidationError {
		message: string;
		errors: Record<string, string[]>;
	}
	const onUploadHandler = async (e: FileUploadHandlerEvent) => {
		alert('onUploadHandler');
		console.log(`event called with file name ${e.files[0].name}`);
		const fileArrayBuffer = await e.files[0].arrayBuffer();
		const fileBuffer = Buffer.from(fileArrayBuffer);
		const file = e.files?.[0]!;
		const filename = file.name;
		const fileType = file.type;
		console.log(`filetype ${fileType}`);
		try {
			const fileData = { imageData: fileBuffer, fileName: filename };
			console.log(`fileData = ${fileData.imageData.byteLength}`);
			const url = `/api/v1/aws/aws-upload`;
			const { data } = await axios.post(url, fileData);

			if (data) {
				//uploaded so update
				console.log('updating brand');
				brand.awsImage = fileBuffer.toString('base64');
				brand.awsImageFormat = fileType;
				brand.awsKey = filename;

				setBrand(brand);
				setAwsImageData(brand.awsImage);
				setAwsImageFormat(brand.awsImageFormat);
				console.log(`Brand awsKey after file upload ${brand.awsKey}`);
			}
			console.log(
				`after setBrand ${JSON.stringify(brand.awsImageFormat, null, 2)}`
			);
			fileUploadRef.current?.clear();
		} catch (err) {
			console.log(`Error uploading to aws ${err}`);
			if (axios.isAxiosError(err)) {
				console.log(err.status);
				console.error(err.response);
			}
		}
	};
	// const getFormErrorMessage = (name: string) => {
	// 	return (
	// 		errors[name as keyof Brand] && (
	// 			<small className="p-error">
	// 				{errors[name as keyof Brand]?.message}
	// 			</small>
	// 		)
	// 	);
	// };

	const saveBrand = async () => {
		console.log(
			`save brand called with ${JSON.stringify(brand.awsImageFormat, null, 2)}`
		);
		setSubmitted(true);

		if (brand?.title?.trim()) {
			let _brands = [...brands];
			let _brand = { ...brand };
			_brand.onHomePage = onHomePage;
			console.log(
				`_brand.awsImage ${typeof _brand.awsImage} awsKey ${_brand.awsKey}`
			);
			_brand.awsImage = '';
			try {
				const url = `/api/admin/brand`;
				const { data } = await axios.post<Brand>(url, _brand);
				console.log(
					`response from update brand ${JSON.stringify(data, null, 2)}`
				);
				if (brand.id) {
					const index = findIndexById(brand.id);
					_brands[index] = _brand;
					toast.current?.show({
						severity: 'success',
						summary: 'Successful',
						detail: 'Brand Updated',
						life: 3000,
					});
				}

				setBrands(_brands);
				setBrandDialog(false);
				setBrand(emptyBrand);
			} catch (err) {
				let message: string;
				if (axios.isAxiosError(err) && err.response) {
					console.error(err.status);
					console.error(err.response);
					message = err.response.statusText;
				} else {
					console.error(err);
					message = String(err);
				}
				console.log(`/api/admin/brand has err ${message}`);
			}
		}
	};

	const header = (
		<div className="flex flex-wrap gap-2 align-items-center justify-content-between">
			<h4 className="m-0">Manage Brands</h4>
			<span className="p-input-icon-left">
				<i className="pi pi-search" />
				<InputText
					type="search"
					placeholder="Search..."
					onInput={(e) => {
						const target = e.target as HTMLInputElement;

						setGlobalFilter(target.value);
					}}
				/>
			</span>
		</div>
	);

	const brandDialogFooter = (
		<>
			<Button
				label="Cancel"
				icon="pi pi-times"
				outlined
				onClick={hideBrandDialog}
			/>
			<Button
				label="Save"
				type="submit"
				icon="pi pi-check"
				onClick={saveBrand}
			/>
		</>
	);

	return (
		<div>
			<Toast ref={toast} />
			<div className="card">
				<Toolbar className="mb-4" right={rightToolbarTemplate} />
				<DataTable
					ref={dt}
					value={brands}
					selection={selectedBrand}
					onSelectionChange={(e) => {
						if (Array.isArray(e.value)) {
							setSelectedBrand(e.value);
						}
					}}
					selectionMode="single"
					dataKey="id"
					paginator
					rows={10}
					rowsPerPageOptions={[5, 10, 25]}
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Brands"
					globalFilter={globalFilter}
					header={header}>
					<Column
						selectionMode="single"
						exportable={false}
						style={{ width: '2rem' }}
					/>
					<Column
						field="title"
						header="Title"
						sortable
						style={{ minWidth: '12rem', width: '4rem' }}
					/>
					<Column
						field="categoryType"
						header="Type"
						body={categoryTypeTemplate}
						style={{ minWidth: '4rem' }}
					/>
					<Column
						field="catLevel"
						header="Level"
						style={{ minWidth: '4rem' }}
					/>
					<Column field="catDescription" header="Description" />
					<Column
						field="onHomePage"
						header="On home Page"
						body={onHomePageTemplate}></Column>
					<Column
						body={actionBodyTemplate}
						exportable={false}
						style={{ minWidth: '12rem' }}
					/>
				</DataTable>
			</div>

			{/*****  Brand Dialog */}

			<Dialog
				visible={brandDialog}
				style={{ width: '50vw' }}
				breakpoints={{ '960px': '75vw', '641px': '90vw' }}
				header="Edit Brand Details"
				modal
				className="p-fluid"
				footer={brandDialogFooter}
				onHide={hideBrandDialog}>
				{
					<div className="flex justify-content-center ">
						<div
							style={{ position: 'relative', width: '370px', height: '200px' }}>
							<Image
								fill
								src={`data:${awsImageFormat};base64,${awsImageData}`}
								alt={brand.title ? brand.title : ''}
								style={{ objectFit: 'cover' }}
								placeholder="blur"
								blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0ZfgfBwADOgGU33xQ2gAAAABJRU5ErkJggg=="
							/>
						</div>
					</div>
				}

				{/***  Title field ***/}
				<div className="field">
					<label htmlFor="categoryType" className="font-bold">
						Title
					</label>
					<InputText
						id="categoryType"
						value={brand.title}
						onChange={(e) => onInputChange(e, 'categoryType')}
						required
						autoFocus
						className={classNames({
							'p-invalid': submitted && !brand.categoryType,
						})}
					/>
					{submitted && !brand.title && (
						<small className="p-error">Title is required.</small>
					)}
				</div>

				{/***  Category type field ***/}
				<div className="field">
					<label htmlFor="categoryType" className="font-bold">
						Category Type
					</label>
					<Dropdown
						id="categoryType"
						options={catTypes}
						optionLabel="label"
						value={brand.categoryType}
						onChange={(e) => onCategoryChange(e)}
						required
						className={classNames({
							'p-invalid': submitted && !brand.categoryType,
						})}
					/>
					{submitted && !brand.categoryType && (
						<small className="p-error">Title is required.</small>
					)}
				</div>

				{/***  catLevel ***/}
				<div className="formgrid grid">
					<div className="field col">
						<label htmlFor="catLevel" className="font-bold">
							Category group
						</label>
						<div>
							<InputNumber
								id="catLevel"
								style={{ width: '4rem' }}
								value={brand.catLevel}
								onChange={(e) => onInputNumberChange(e, 'catLevel')}
								required
								autoFocus
								className={classNames({
									'p-invalid': submitted && !brand.catLevel,
								})}
							/>
							{submitted && !brand.title && (
								<small className="p-error">Title is required.</small>
							)}
						</div>
					</div>
				</div>

				{/***  Category Description field ***/}
				<div className="field">
					<label htmlFor="catDescription" className="font-bold">
						Description
					</label>
					<InputTextarea
						id="catDescription"
						value={brand.catDescription}
						onChange={(e) => onInputAreaChange(e, 'catDescription')}
						rows={3}
						required
						cols={20}
					/>

					{submitted && !brand.catDescription && (
						<small className="p-error">Description is required.</small>
					)}
				</div>

				{/***  Image field ***/}
				<div className="field">
					<label htmlFor="imageData" className="font-bold">
						Upload Brand Image
					</label>
					<FileUpload
						ref={fileUploadRef}
						id="imageData"
						customUpload
						mode="advanced"
						// auto={true}
						multiple={false}
						chooseLabel="Select Brand image"
						uploadHandler={onUploadHandler}
						accept="image/*"
						maxFileSize={1000000}
						emptyTemplate={
							<p className="m-0">Drag and drop files to here to upload.</p>
						}
					/>
				</div>

				{/***  onHome page field ***/}
				<div className="field">
					<label htmlFor="imageData" className="font-bold">
						Show brand on home page
					</label>
					<div style={{ marginRight: '2em' }}>
						<InputSwitch
							checked={onHomePage}
							onChange={(e: InputSwitchChangeEvent) =>
								setOnHomePage(e.value ? e.value : false)
							}
						/>
					</div>
				</div>
			</Dialog>
		</div>
	);
}

export const getStaticProps: GetStaticProps<{
	brandList: Brand[];
}> = async () => {
	try {
		const { data } = await axios.get<Brand[]>(
			process.env.EDC_API_BASEURL + `/brand`
		);
		return { props: { brandList: data } };
	} catch (err) {
		return {
			notFound: true,
		};
	}
};
