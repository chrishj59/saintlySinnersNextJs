import axios from 'axios';
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { Button } from 'primereact/button';
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
}

type BrandValues = {
	id: number;
	title: string;
	categoryType: string;
	catDescription: string;
	catLevel: number;
	catId: number;
};

type BrandTyRec = Record<keyof BrandTy, string | number>;

const Brand: NextPage = ({
	brands,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
	let emptyBrand = {
		id: 0,
		title: '',

		categoryType: '',
		catDescription: '',
		catLevel: 0,
		catId: 0,
	};
	const defaultValues = {
		title: '',
		categoryType: '',
		catDescription: '',
	};

	const catTypes = [
		{ label: 'Brand', value: 'B' },
		{ label: 'Category', value: 'C' },
		{ label: 'Title', value: 'T' },
	];

	const [formData, setFormData] = useState({});
	const [showMessage, setShowMessage] = useState(false);
	const [brandList, setBrandList] = useState<BrandTyRec[]>([]);
	const [brand, setBrand] = useState<BrandTyRec>(emptyBrand);
	const [brandDialog, setBrandDialog] = useState<boolean>(false);
	const [deleteBrandDialog, setDeleteBrandDialog] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const toast = useRef<Toast>(null);
	const dt = useRef(null);

	const hideBrandDialog = () => {
		setSubmitted(false);
		setBrandDialog(false);
	};

	const editBrand = (brand: BrandTy) => {
		setBrand({ ...brand });
		setBrandDialog(true);
		reset(brand);
		console.log('edit brand');
		console.log(brand);
	};

	const saveBrand = () => {
		setSubmitted(true);
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
			detail: 'Product Deleted',
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
		// if (name === 'title') {
		// 	_brand[`title`] = val;
		// } else if (name === 'categoryType') {
		// 	_brand['categoryType'] = val;
		// } else if (name === 'catDescription') {
		// 	_brand['catDescription'] = val;
		// } else if (name === 'catLevel') {
		// 	_brand['catLevel'] = Number(val);
		// }
		console.log(_brand);
		setBrand(_brand);
	};

	const {
		control,
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm<BrandValues>();

	const onSubmit = async (brand: any) => {
		const { data } = await axios.put<BrandValues>('/api/admin/brand', brand);
		const _brandList = brandList.map((b) => {
			if (b.id === data.id) {
				b = data;
			}
			return b;
		});
		setBrandList(_brandList);
		// setFormData(data);
		// setShowMessage(true);
		hideBrandDialog();

		reset();
	};

	const getFormErrorMessage = (name: string) => {
		console.log('errors');
		return (
			errors[name as keyof BrandValues] && (
				<small className="p-error">
					{errors[name as keyof BrandValues]?.message}
				</small>
			)
		);
	};

	return (
		<div className="datatable-crud-demo">
			<Toast ref={toast} />
			<div className="card">
				<DataTable
					dataKey="id"
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
					<Column field="categoryType" header="Type"></Column>
					<Column field="catLevel" header="Level"></Column>
					<Column field="description" header="Desription"></Column>
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
										htmlFor="description"
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
							//onClick={saveBrand}
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
	let menuItems: BrandTy[] = [];

	try {
		const { data } = await axios.get(process.env.EDC_API_BASEURL + `/brand`);
		menuItems = data;
	} catch (e) {
		console.log('Could not find brands');
		console.log(e);
	}
	return {
		props: { menuItems },
	};
};

export default Brand;
