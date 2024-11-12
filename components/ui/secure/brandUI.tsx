'use client';
//import { Brand } from '@/interfaces/brand.interface';
import { startTransition, useRef, useState, useTransition } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';

import { TriStateCheckbox } from 'primereact/tristatecheckbox';

import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import Image from 'next/image';
import { classNames } from 'primereact/utils';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { XtrBrandType } from '@/interfaces/xtraderBrand.type';
import { awsS3ImageReturn, imageAWS } from '@/interfaces/awsData.type';
import { JsxElement } from 'typescript';
import { revalidateTag } from 'next/cache';
import { bandListRevalidate } from '@/app/actions/revalidate';

export default function BrandUI({
	brandList,
	children,
}: {
	brandList: XtrBrandType[];
	children: React.ReactNode;
}) {
	let emptyBrand = {
		id: 0,
		name: '',
		isFavourite: false,
		ranking: 0,
		imageName: '',
		image: undefined,
	};
	const transition = useTransition();
	const toast = useRef<Toast | null>(null);
	const [brands, setBrands] = useState<XtrBrandType[]>(brandList);
	const dt = useRef<DataTable<XtrBrandType[]>>(null);
	const fileUploadRef = useRef<FileUpload | null>(null);
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [isFavourite, setIsFavourite] = useState<boolean>(false);
	const [awsImageData, setAwsImageData] = useState<string>('');
	const [awsImageFormat, setAwsImageFormat] = useState<string | undefined>('');
	const [brandDialog, setBrandDialog] = useState<boolean>(false);
	const [brand, setBrand] = useState<XtrBrandType>(emptyBrand);
	const [submitted, setSubmitted] = useState<boolean>(false);

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

	const actionBodyTemplate = (rowData: XtrBrandType) => {
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

	const revalidateAction = bandListRevalidate.bind(null);
	const saveBrand = async () => {
		setSubmitted(true);

		if (brand?.name?.trim()) {
			let _brands = [...brands];
			let _brand = { ...brand };

			// _brand.isFavourite = isFavourite;
			if (_brand.image) {
				_brand.image.imageData = '';
			}

			try {
				const url = `/api/admin/xtrBrand`;
				//const { data } = await axios.post<Brand>(url, _brand);
				const brandResp = await fetch(url, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					// cache: 'no-store',
					body: JSON.stringify(_brand),
				});

				if (!brandResp.ok) {
					toast.current?.show({
						severity: 'error',
						summary: 'Could not update brand',
						detail: `Brand Updated status ${brandResp.status} text: ${brandResp.statusText}`,
						life: 3000,
					});
				}
				const updatedBrand = await brandResp.json();

				if (updatedBrand.id) {
					const index = findIndexById(updatedBrand.id);
					_brands[index] = updatedBrand;
					toast.current?.show({
						severity: 'success',
						summary: 'Successful',
						detail: `Brand Updated status ${brandResp.status}`,
						life: 3000,
					});
				}

				setBrands(_brands);
				setBrandDialog(false);
				setBrand(emptyBrand);
			} catch (err) {
				console.warn(
					`/api/admin/brand has err ${JSON.stringify(err, null, 2)}`
				);
			}
		}
	};
	const editBrand = async (brandParam: XtrBrandType) => {
		if (brandParam.image) {
			const url = `/api/aws/brandImage?awsKey=${brandParam.image.key}`;
			// const { data } = await axios.get(url);
			const response = await fetch(url, { cache: 'no-cache' });
			if (!response.ok) {
				toast.current?.show({
					severity: 'error',
					summary: 'Error getting brand image',
					detail: 'Could not find brand image from AWS',
					life: 3000,
				});
			} else {
				const data = await response.json();

				brandParam.image.imageData = data;

				setAwsImageData(brandParam.image.imageData || '');
			}
		}
		setIsFavourite(brandParam.isFavourite);
		setBrand(brandParam);
		setBrandDialog(true);
	};
	// const categoryTypeTemplate = (brand: XtrBrandType) => {
	// 	const catName = catTypes.find(
	// 		(catTypes) => catTypes.value === brand.categoryType
	// 	);
	// 	if (catName === undefined) {
	// 		return 'unknown ';
	// 	}
	// 	return catName.label;
	// };

	const isFavouritePageTemplate = (brand: XtrBrandType) => {
		return <InputSwitch checked={brand.isFavourite} disabled />;
		// if (brand.isFavourite) {
		// 	return <i className="pi pi-check" style={{ color: 'green' }}></i>;
		// } else {
		// 	return <i className="pi pi-times" style={{ color: 'red' }}></i>;
		// }
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

	const onInputSwitchChange = (e: InputSwitchChangeEvent) => {
		const checked = e.value;

		let _brand = { ...brand };
		_brand.isFavourite = checked;

		setBrand(_brand);
	};

	const onInputNumberChange = (e: InputNumberChangeEvent, name: string) => {
		const val = e.value || 0;
		let _brand = { ...brand };

		// @ts-ignore
		_brand[`${name}`] = val;

		setBrand(_brand);
	};

	// const onCategoryChange = (e: DropdownChangeEvent) => {
	// 	let _brand = { ...brand };

	// 	_brand['categoryType'] = e.value;

	// 	setBrand(_brand);
	// };

	const onUploadHandler = async (e: FileUploadHandlerEvent) => {
		const fileArrayBuffer = await e.files[0].arrayBuffer();
		const fileBuffer = Buffer.from(fileArrayBuffer);
		const file = e.files?.[0]!;
		const filename = file.name;
		const fileType = file.type;
		try {
			const fileData = { imageData: fileBuffer, fileName: filename };
			const url = `/api/aws/brandImage`;

			// const { data } = await axios.post(url, fileData);
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				// cache: 'no-store',
				body: JSON.stringify(fileData),
			});

			if (response.ok) {
				const data = await response.json();

				if (data) {
					//uploaded so update
					const uploadedImage: imageAWS = {
						id: 'none',
						key: filename,
						imageData: fileBuffer.toString('base64'),
						imageFormat: fileType,
					};
					brand.image = uploadedImage;
					brand.imageName = filename;

					setBrand(brand);
					if (brand.image.imageData) {
						setAwsImageData(brand.image.imageData);
					}
					setAwsImageFormat(brand.image!.imageFormat);
				}

				fileUploadRef.current?.clear();
			}
		} catch (err) {
			console.warn(`Error uploading to aws ${err}`);
			if (axios.isAxiosError(err)) {
				console.warn(err.status);
				console.error(err.response);
			}
		}
	};
	const hideBrandDialog = () => {
		setSubmitted(false);
		setBrandDialog(false);
	};

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

	const showImage = (brand: XtrBrandType) => {
		if (!brand.image?.imageData) {
			return <div className="text-600"> No brand image found</div>;
		}
		return (
			<Image
				src={`data:${awsImageFormat};base64,${awsImageData}`}
				alt={brand.name ? brand.name : ''}
				width={370}
				height={200}
				placeholder="blur"
				blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0ZfgfBwADOgGU33xQ2gAAAABJRU5ErkJggg=="
			/>
		);
	};

	return (
		<div>
			<Toast ref={toast} position="top-center" />
			<Toolbar className="mb-4" start={rightToolbarTemplate} />
			<DataTable
				ref={dt}
				value={brands}
				selectionMode="single"
				dataKey="id"
				paginator
				removableSort
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
					field="name"
					header="Name"
					sortable
					// style={{ minWidth: '12rem', width: '4rem' }}
				/>
				{/* <Column
					field="categoryType"
					header="Type"
					body={categoryTypeTemplate}
					style={{ minWidth: '4rem' }}
				/> */}
				{/* <Column field="catLevel" header="Level" style={{ minWidth: '4rem' }} />
				<Column field="catDescription" header="Description" /> */}
				<Column
					field="isFavourite"
					sortable
					header="Home Page favourite"
					body={isFavouritePageTemplate}
				/>

				<Column field="ranking" header="Ranking" />
				<Column
					body={actionBodyTemplate}
					exportable={false}
					style={{ minWidth: '12rem' }}
				/>
			</DataTable>

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
				<div className="flex justify-content-center ">
					<div>{showImage(brand)}</div>
				</div>
				{/* } */}

				{/***  Title field ***/}
				<div className="field">
					<label htmlFor="name" className="font-bold">
						Name
					</label>
					<InputText
						id="name"
						value={brand.name}
						onChange={(e) => onInputChange(e, 'name')}
						required
						autoFocus
						className={classNames({
							'p-invalid': submitted && !brand.name,
						})}
					/>
					{submitted && !brand.name && (
						<small className="p-error">Name is required.</small>
					)}
				</div>

				{/***  Category type field ***/}
				{/* <div className="field">
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
				</div> */}

				{/***  catLevel ***/}
				{/* <div className="formgrid grid">
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
				</div> */}

				{/***  Category Description field ***/}
				{/* <div className="field">
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
				</div> */}

				{/***  onHome page field ***/}
				<div className="field">
					<label htmlFor="imageData" className="font-bold">
						Show brand on home page
					</label>
					<div style={{ marginRight: '2em' }}>
						<InputSwitch
							checked={brand.isFavourite}
							onChange={(e) => onInputSwitchChange(e)}
						/>
					</div>
				</div>

				{/***  Ranking ***/}
				<div className="field">
					<label htmlFor="ranking" className="font-bold">
						Ranking
					</label>
					<div>
						<InputNumber
							id="ranking"
							style={{ width: '4rem' }}
							value={brand.ranking}
							onChange={(e) => onInputNumberChange(e, 'ranking')}
							className={classNames({
								'p-invalid': submitted && !brand.ranking,
							})}
						/>
					</div>
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
						auto={true}
						multiple={false}
						chooseLabel="Select Brand image"
						uploadHandler={onUploadHandler}
						accept="image/*"
						maxFileSize={2097152}
						emptyTemplate={
							<p className="m-0">Drag and drop files to here to upload.</p>
						}
					/>
				</div>
			</Dialog>
		</div>
	);
}
