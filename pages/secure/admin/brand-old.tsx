import { String } from 'aws-sdk/clients/cloudtrail';
import axios from 'axios';
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface BrandTy {
	id: number;
	title: string;
	categoryType: string;
	catDescription: string;
	catLevel: number;
	catId: number;
	image: string;
	onHomePage: boolean;
}

type BrandValues = {
	id: number;
	title: string;
	categoryType: string;
	catDescription: string;
	catLevel: number;
	catId: number;
	image: string;
	onHomePage: boolean;
};

type BrandTyRec = Record<keyof BrandTy, string | number | boolean>;

const Brand: NextPage = ({
	brands,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
	let emptyBrand = {
		id: 0,
		title: '',

		categoryType: '',
		catDescription: '',
		image: '',
		imageFormat: '',
		onHomePage: false,
		catLevel: 0,
		catId: 0,
	};
	const defaultValues = {
		title: '',
		categoryType: '',
		catDescription: '',
		image: '',
		onHomePage: false,
	};

	const catTypes = [
		{ label: 'Brand', value: 'B' },
		{ label: 'Category', value: 'C' },
		{ label: 'Title', value: 'T' },
	];

	const [formData, setFormData] = useState({});
	const [showMessage, setShowMessage] = useState(false);
	const [brandList, setBrandList] = useState<BrandTyRec[]>([]);
	const [selectedBrands, setSelectedBrands] = useState<BrandTyRec[]>([]);
	const [brand, setBrand] = useState<BrandTyRec>(emptyBrand);
	const [brandDialog, setBrandDialog] = useState<boolean>(false);
	const [deleteBrandDialog, setDeleteBrandDialog] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const toast = useRef<Toast>(null);
	const dt = useRef<DataTable<BrandTyRec[]>>(null);

	const hideBrandDialog = () => {
		setSubmitted(false);
		setBrandDialog(false);
	};

	const findIndexById = (id: string | number | true) => {
		let index = -1;
		for (let i = 0; i < brands.length; i++) {
			if (brands[i].id === id) {
				index = i;
				break;
			}
			return index;
		}
	};
	const editBrand = (brand: BrandTy) => {
		setBrand({ ...brand });
		setBrandDialog(true);
		reset(brand);
	};

	const saveBrand = () => {
		alert(`save brand called`);
		let _brands = [...brands];
		let _brand = { ...brand };
		if (brand.id) {
			const index = findIndexById(brand.id);
			if (index) {
				_brands[index] = _brand;
				toast.current?.show({
					severity: 'success',
					summary: 'Successful',
					detail: 'Brand Updated',
					life: 3000,
				});
			}
		}

		setBrandList(_brands);
		setSubmitted(true);
		setBrand(emptyBrand);
		alert(`updated brand list ${JSON.stringify(brand, null, 2)}`);
	};

	const hideDeleteBrandDialog = () => {
		setDeleteBrandDialog(false);
	};

	useEffect(() => {
		setBrandList(brands);
	}, [brands]);

	const header = (
		<div className="table-header">
			<h5 className="mx-0 my-1">Manage Brands</h5>
			<span className="p-input-icon-left">
				<i className="pi pi-search" />
				<InputText type="search" placeholder="Search title" />
			</span>
		</div>
	);

	const confirmDeleteBrand = (brand: BrandTy) => {
		setBrand(brand);
		setDeleteBrandDialog(true);
	};

	const deleteBrand = () => {
		setDeleteBrandDialog(false);
		setBrand(emptyBrand);

		toast?.current?.show({
			severity: 'success',
			summary: 'Successful',
			detail: 'Brand Deleted',
			life: 3000,
		});
	};

	const deleteBrandDialogFooter = (
		<React.Fragment>
			<Button
				label="No"
				icon="pi pi-times"
				className="p-button-text"
				onClick={hideDeleteBrandDialog}
			/>
			<Button
				label="Yes"
				icon="pi pi-check"
				className="p-button-text"
				onClick={deleteBrand}
			/>
		</React.Fragment>
	);

	const actionBodyTemplate = (rowData: BrandTy) => {
		return (
			<React.Fragment>
				<Button
					icon="pi pi-pencil"
					className="p-button-rounded p-button-success mr-2"
					onClick={() => editBrand(rowData)}
				/>

				<Button
					icon="pi pi-trash"
					className="p-button-rounded p-button-error"
				/>
			</React.Fragment>
		);
	};

	const brandDialogFooter = (
		<React.Fragment>
			<Button
				label="Cancel"
				icon="pi pi-times"
				className="p-button-text"
				onClick={hideBrandDialog}
			/>
			<Button
				label="Save"
				icon="pi pi-check"
				className="p-button-text"
				type="submit"
			/>
		</React.Fragment>
	);

	const onInputChange = (
		e: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
		name: keyof BrandTy
	) => {
		const val = e.target && e.target.value;

		let _brand: BrandTyRec = { ...brand };
		_brand[name as keyof BrandTyRec] = val;

		setBrand(_brand);
	};

	const {
		control,
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm<BrandValues>();

	const onSubmit = async (brand: BrandTy) => {
		alert(`onSubmit called with ${brand}`);
		const { data } = await axios.put<BrandValues>('/api/admin/brand', brand);
		const _brandList = brandList.map((b) => {
			console.log(`onsubmit brandid ${data.id} b.id ${b.id}`);
			if (b.id === data.id) {
				b = data;
			}
			return b;
		});
		console.log(`Updated bandList ${JSON.stringify(_brandList, null, 2)}`);
		setBrandList(_brandList);
		// setFormData(data);
		// setShowMessage(true);
		hideBrandDialog();

		reset();
	};

	const getFormErrorMessage = (name: string) => {
		return (
			errors[name as keyof BrandValues] && (
				<small className="p-error">
					{errors[name as keyof BrandValues]?.message}
				</small>
			)
		);
	};

	const onHomePageTemplate = (brand: BrandTy) => {
		return <Checkbox checked={brand.onHomePage} />;
	};

	const categoryTypeTemplate = (brand: BrandTy) => {
		const catName = catTypes.find(
			(catTypes) => catTypes.value === brand.categoryType
		);
		if (catName === undefined) {
			return 'unknown ';
		}
		return catName.label;
	};

	return (
		<div className="brand">
			<Toast ref={toast} />
			<div className="card">
				<DataTable
					dataKey="id"
					selectionMode="single"
					selection={selectedBrands}
					onSelectionChange={(e) => {
						alert(JSON.stringify(e.value, null, 2));
						if (Array.isArray(e.value)) {
							setSelectedBrands(e.value);
						}
					}}
					responsiveLayout="scroll"
					ref={dt}
					value={brandList}
					header={header}
					paginator
					rows={10}
					rowsPerPageOptions={[5, 10, 25]}
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} brands">
					<Column
						selectionMode="single"
						headerStyle={{ width: '3rem' }}
						exportable={false}></Column>
					<Column field="title" header="Title"></Column>
					<Column
						field="categoryType"
						header="Type"
						body={categoryTypeTemplate}></Column>
					<Column field="catLevel" header="Level"></Column>
					<Column field="description" header="Description"></Column>
					<Column field="image" header="Image"></Column>
					<Column
						field="onHomePage"
						header="On home Page"
						body={onHomePageTemplate}></Column>
					<Column
						body={actionBodyTemplate}
						exportable={false}
						style={{ minWidth: '8rem' }}></Column>
				</DataTable>
			</div>
			<Dialog
				visible={brandDialog}
				style={{ width: '450px' }}
				header="Edit brand"
				modal
				className="p-fluid"
				//footer={brandDialogFooter}
				onHide={hideBrandDialog}>
				<form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
					<div className="flex justify-content-center">
						<div className="card">
							<div className="field">
								<span className="p-float-label">
									<Controller
										name="title"
										control={control}
										rules={{ required: 'Tile is required.' }}
										render={({ field, fieldState }) => (
											<InputText
												id={field.name}
												{...field}
												autoFocus
												className={classNames({
													'p-invalid': fieldState.error,
												})}
											/>
										)}
									/>
									<label
										htmlFor="title"
										className={classNames({ 'p-error': errors.title })}>
										Title
									</label>
								</span>
								{getFormErrorMessage('title')}
							</div>

							<div className="field">
								<span className="p-float-label">
									<Controller
										name="categoryType"
										control={control}
										rules={{
											//required: 'Type  required.',
											pattern: {
												value: /^[BCT]/,
												message: 'Only category type B C T are allowed',
											},
											maxLength: {
												value: 1,
												message: 'Only 1 character allopwed',
											},
										}}
										render={({ field, fieldState }) => (
											<Dropdown
												id={field.name}
												{...field}
												autoFocus
												options={catTypes}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
											/>
										)}
									/>

									<label
										htmlFor="catType"
										className={classNames({ 'p-error': errors.catLevel })}>
										Brand Type
									</label>
								</span>
								{getFormErrorMessage('catType')}
							</div>

							<div className="field">
								<span className="p-float-label">
									<Controller
										name="catLevel"
										control={control}
										//rules={{ required: 'Tile is required.' }}
										render={({ field, fieldState }) => (
											<InputNumber
												id={field.name}
												ref={field.ref}
												value={field.value}
												onBlur={field.onBlur}
												onValueChange={(e) => field.onChange(e)}
												mode="decimal"
												maxFractionDigits={0}
												autoFocus
												className={classNames({
													'p-invalid': fieldState.error,
												})}
											/>
										)}
									/>
									<label
										htmlFor="catLevel"
										className={classNames({ 'p-error': errors.catLevel })}>
										Category Level
									</label>
								</span>
								{getFormErrorMessage('catLevel')}
							</div>

							<div className="field">
								<span className="p-float-label">
									<Controller
										name="catDescription"
										control={control}
										rules={{
											//required: 'this is a required',
											maxLength: {
												value: 400,
												message: 'Max length is 400',
											},
										}}
										render={({ field, fieldState }) => (
											<InputTextarea
												id={field.name}
												{...field}
												autoFocus
												className={classNames({
													'p-invalid': fieldState.error,
												})}
											/>
										)}
									/>
									<label
										htmlFor="catDescription"
										className={classNames({
											'p-error': errors.catDescription,
										})}>
										Description
									</label>
								</span>
								{getFormErrorMessage('description')}
							</div>
						</div>
					</div>
					<div className="flex flex-row">
						<Button
							label="Cancel"
							icon="pi pi-times"
							className="p-button-text"
							onClick={hideBrandDialog}
						/>
						<Button
							label="Save"
							type="submit"
							icon="pi pi-check"
							className="p-button-text"
							onClick={saveBrand}
						/>
					</div>
				</form>
			</Dialog>

			<Dialog
				visible={deleteBrandDialog}
				style={{ width: '450px' }}
				header="Delete brand"
				modal
				footer={deleteBrandDialogFooter}
				onHide={hideDeleteBrandDialog}>
				<div className="confirmation-content">
					<i
						className="pi pi-exclamation-triangle mr-3"
						style={{ fontSize: '2rem' }}
					/>
					{brand && (
						<span>
							Are you sure you want to delete <b>{brand.title}</b>?
						</span>
					)}
				</div>
			</Dialog>
		</div>
	);
};

export const getStaticProps: GetStaticProps = async (context) => {
	//let brands: BrandTy[] = [];
	let brands: BrandTy[] = [];

	try {
		const { data } = await axios.get(process.env.EDC_API_BASEURL + `/brand`);
		brands = data;
		console.warn(
			`data found in getstatic props ${JSON.stringify(brands, null, 2)}`
		);
	} catch (e) {
		console.error('Could not find brands');
		console.error(e);
	}
	return {
		props: { brands },
		revalidate: false,
	};
};

export default Brand;
