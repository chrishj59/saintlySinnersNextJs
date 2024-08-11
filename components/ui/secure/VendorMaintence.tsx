'use client';
import { ReactNode, useState, useRef } from 'react';
import { VENDOR_TYPE } from '@/interfaces/vendor.type';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Controller, useForm } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';

export default function VendorMaintence({
	vendors,
}: {
	vendors: VENDOR_TYPE[];
}) {
	let emptyVendor = {
		id: 0,
		name: '',
	};
	const [vendorList, setVendorList] = useState<VENDOR_TYPE[]>(vendors);
	const [selectedVendor, setSelectedVendor] =
		useState<VENDOR_TYPE>(emptyVendor);
	const [vendor, setVendor] = useState<VENDOR_TYPE>(emptyVendor);
	const [vendorUpdateDialog, setVendorUpdateDialog] = useState<boolean>(false);
	const [vendorAddDialog, setVendorAddDialog] = useState<boolean>(false);
	const dt = useRef(null);
	const {
		control,
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm<VENDOR_TYPE>();

	const header = (
		<div className="table-header">
			<h5 className="mx-0 my-1">Manage Vendors</h5>
			<div className="flex justify-content-between">
				{/* <span className="p-input-icon-left">
					<i className="pi pi-search" />
					<InputText type="search" placeholder="Search name" />
				</span> */}
				{/* <span className="p-input-icon-left">
					<i className="pi pi-search" />
					<InputText
						value={globalFilterValue}
						onChange={onGlobalFilterChange}
						placeholder="Keyword Search"
					/>
				</span> */}
				<Button
					type="button"
					icon="pi pi-plus"
					label="Add"
					// className="p-button-outlined"
					onClick={() => setVendorAddDialog(true)}
				/>
			</div>
		</div>
	);

	const editVendor = (vendor: VENDOR_TYPE) => {
		setVendor({ ...vendor });
		setVendorUpdateDialog(true);
		reset(vendor);
	};
	const actionBodyTemplate = (rowData: VENDOR_TYPE) => {
		return (
			<>
				<Button
					icon="pi pi-pencil"
					className="p-button-rounded p-button-success mr-2"
					onClick={() => editVendor(rowData)}
				/>

				{/* <Button
					icon="pi pi-trash"
					className="p-button-rounded p-button-error"
					onClick={() => confirmDeleteCharge(rowData)}
				/> */}
			</>
		);
	};

	const hideVendorAddDialog = () => {
		//setSubmitted(false);
		setVendorAddDialog(false);
	};

	const onSubmitAdd = async (vendor: VENDOR_TYPE) => {
		try {
			const vendorResp = await fetch(`/api/vendor`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(vendor),
			});

			if (!vendorResp.ok) {
				throw new Error(`${vendorResp.status} ${vendorResp.statusText}`);
			}
			const newVendor = (await vendorResp.json()) as VENDOR_TYPE;

			const _vendorList = vendorList;

			_vendorList.push(newVendor);
			setVendorList(_vendorList);
			hideVendorAddDialog();

			reset();
		} catch (error) {
			console.error(`error from create vendor`);
			if (error instanceof SyntaxError) {
				// Unexpected token < in JSON
				console.warn('There was a SyntaxError', error);
			} else {
				console.error('Could not find charges');
				console.error(error);
			}
		}
	};
	const getFormErrorMessage = (name: string) => {
		return (
			errors[name as keyof VENDOR_TYPE] && (
				<small className="p-error">
					{errors[name as keyof VENDOR_TYPE]?.message}
				</small>
			)
		);
	};

	return (
		<>
			<DataTable
				dataKey="id"
				responsiveLayout="scroll"
				ref={dt}
				header={header}
				selection={selectedVendor}
				emptyMessage="No vendors found."
				value={vendorList}>
				<Column field="name" header="Vendor"></Column>
				<Column
					body={actionBodyTemplate}
					exportable={false}
					style={{ minWidth: '8rem' }}></Column>
			</DataTable>

			{/* New delivery charge dialog box */}
			<Dialog
				visible={vendorAddDialog}
				style={{ width: '450px' }}
				header="New Supplier"
				modal
				className="p-fluid"
				onHide={hideVendorAddDialog}>
				<form onSubmit={handleSubmit(onSubmitAdd)} className="p-fluid">
					<div className="flex justify-content-center">
						<div className="card">
							{/* Name Field */}
							<div className="field">
								<span className="p-float-label mb-5">
									<Controller
										name="name"
										control={control}
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
										htmlFor="name"
										className={classNames({ 'p-error': errors.name })}>
										Supplier
									</label>
								</span>
								{getFormErrorMessage('name')}
							</div>
							<div className="flex flex-row">
								<Button
									label="Cancel"
									icon="pi pi-times"
									className="p-button-text"
									onClick={hideVendorAddDialog}
								/>
								<Button
									label="Save"
									type="submit"
									icon="pi pi-check"
									className="p-button-text"
									//onClick={saveBrand}
								/>
							</div>
						</div>
					</div>
				</form>
			</Dialog>
		</>
	);
}
