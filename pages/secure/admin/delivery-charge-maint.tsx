import axios from 'axios';
import { RESPONSE_MESSAGE_TYPE } from 'interfaces/responseMessage.interface';
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { COUNTRY_NAME_TYPE } from './interfaces/countryName.type';
import { COURIER_TYPE } from './interfaces/courier.type';
import { DELIVERY_CHARGE_TYPE } from './interfaces/deliveryCharge.type';
import { VENDOR_TYPE } from './interfaces/vendor.type';

type ChargeRec = Record<keyof DELIVERY_CHARGE_TYPE, string | number>;
const DeliveryMaint: NextPage<{ charges: ChargeRec[] }> = ({
	charges,
	vendors,
	countries,
	couriers,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
	console.log('charges prop');
	console.log(charges);
	console.log(vendors);
	console.log(countries.length);
	console.log(couriers);
	let emptyCharge = {
		id: '',
		vendor: { id: 0, name: '' },
		country: { id: 0, name: '', emoji: '' },
		courier: { id: '', name: '' },
		uom: '',
		minWeight: 0,
		maxWeight: 0,
		amount: 0,
	};

	const toast = useRef<Toast>(null);
	const dt = useRef(null);
	const [chargeList, setChargeList] = useState<DELIVERY_CHARGE_TYPE[]>(charges);
	const [charge, setCharge] = useState<DELIVERY_CHARGE_TYPE>(emptyCharge);
	const [chargeUpdateDialog, setChargeUpdateDialog] = useState<boolean>(false);
	const [chargeAddDialog, setChargeAddDialog] = useState<boolean>(false);
	const [deleteChargeDialog, setDeleteChargeDialog] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [selectedCharge, setSelectedCharge] = useState<
		DELIVERY_CHARGE_TYPE | undefined
	>(undefined);

	const hideChargeUpdateDialog = () => {
		console.log('hidecharge called');
		//setSubmitted(false);
		setChargeUpdateDialog(false);
	};

	const hideChargeAddDialog = () => {
		console.log('hidecharge called');
		//setSubmitted(false);
		setChargeAddDialog(false);
	};

	const editCharge = (charge: DELIVERY_CHARGE_TYPE) => {
		setCharge({ ...charge });
		setChargeUpdateDialog(true);
		reset(charge);
		console.log('edit brand');
		console.log(charge);
	};

	const confirmDeleteCharge = (charge: DELIVERY_CHARGE_TYPE) => {
		setSelectedCharge(charge);
		setCharge(charge);
		setDeleteChargeDialog(true);
	};

	const header = (
		<div className="table-header">
			<h5 className="mx-0 my-1">Manage Delivery Charges</h5>
			<div className="flex justify-content-between">
				<span className="p-input-icon-left">
					<i className="pi pi-search" />
					<InputText type="search" placeholder="Search name" />
				</span>
				<Button
					type="button"
					icon="pi pi-plus"
					label="Add"
					className="p-button-outlined"
					onClick={() => setChargeAddDialog(true)}
				/>
			</div>
		</div>
	);

	const actionBodyTemplate = (rowData: DELIVERY_CHARGE_TYPE) => {
		return (
			<React.Fragment>
				<Button
					icon="pi pi-pencil"
					className="p-button-rounded p-button-success mr-2"
					onClick={() => editCharge(rowData)}
				/>

				<Button
					icon="pi pi-trash"
					className="p-button-rounded p-button-error"
					onClick={() => confirmDeleteCharge(rowData)}
				/>
			</React.Fragment>
		);
	};

	const {
		control,
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm<DELIVERY_CHARGE_TYPE>();

	const getFormErrorMessage = (name: string) => {
		console.log('errors');
		return (
			errors[name as keyof DELIVERY_CHARGE_TYPE] && (
				<small className="p-error">
					{errors[name as keyof DELIVERY_CHARGE_TYPE]?.message}
				</small>
			)
		);
	};

	const onSubmitChange = async (charge: DELIVERY_CHARGE_TYPE) => {
		const { data } = await axios.put<DELIVERY_CHARGE_TYPE>(
			`/api/admin/deliveryChargeUpdate`,
			charge
		);

		const _chargeList = chargeList.map((_charge) => {
			if (_charge.id === data.id) {
				_charge = data;
			}
			return _charge;
		});
		setChargeList(_chargeList);
		hideChargeUpdateDialog();

		reset();
	};

	const onSubmitAdd = async (charge: DELIVERY_CHARGE_TYPE) => {
		const { data } = await axios.put<DELIVERY_CHARGE_TYPE>(
			`/api/admin/deliveryChargeAdd`,
			charge
		);

		chargeList.push(data);
		setChargeList(chargeList);
		hideChargeAddDialog();

		reset();
	};

	const hideDeleteChargeDialog = () => {
		setDeleteChargeDialog(false);
	};

	const deleteCharge = async () => {
		const url = `/api/admin/deliveryChargeDelete?id=${charge['id']}`;

		const { data } = await axios.delete<RESPONSE_MESSAGE_TYPE>(url);
		const _chargeList = chargeList.filter((c) => c.id !== charge['id']);
		setChargeList(_chargeList);
		setDeleteChargeDialog(false);
		setCharge(emptyCharge);
		toast.current?.show({
			severity: 'success',
			summary: 'Successful',
			detail: 'Charge Deleted',
			life: 3000,
		});
	};
	const deleteChargeDialogFooter = (
		<>
			<Button
				label="No"
				icon="pi pi-times"
				className="p-button-text"
				onClick={hideDeleteChargeDialog}
			/>
			<Button
				label="Yes"
				icon="pi pi-check"
				className="p-button-text"
				onClick={deleteCharge}
			/>
		</>
	);

	return (
		<>
			<div className="brand">
				<Toast ref={toast} />
				<div className="card">
					<DataTable
						dataKey="id"
						responsiveLayout="scroll"
						ref={dt}
						selection={selectedCharge}
						onSelectionChange={(e) => setSelectedCharge(e.value)}
						value={chargeList}
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
						<Column field="vendor.name" header="Vendor"></Column>
						<Column field="country.name" header="Country"></Column>
						<Column field="courier.name" header="Courier"></Column>
						<Column field="uom" header="Unit of measure"></Column>
						<Column field="minWeight" header="Min Weight"></Column>
						<Column field="maxWeight" header="Max Weight"></Column>
						<Column field="amount" header="amount"></Column>
						<Column
							body={actionBodyTemplate}
							exportable={false}
							style={{ minWidth: '8rem' }}></Column>
					</DataTable>
				</div>
			</div>
			<ConfirmDialog />

			{/* Update dialog box */}
			<Dialog
				visible={chargeUpdateDialog}
				style={{ width: '450px' }}
				header="Edit Delivery charge"
				modal
				className="p-fluid"
				onHide={hideChargeUpdateDialog}>
				<form onSubmit={handleSubmit(onSubmitChange)} className="p-fluid">
					<div className="flex justify-content-center">
						<div className="card">
							<div className="field">
								<span className="p-float-label mb-5">
									<Controller
										name="vendor.name"
										control={control}
										render={({ field, fieldState }) => (
											<InputText
												id={field.name}
												{...field}
												autoFocus
												disabled={true}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
											/>
										)}
									/>
									<label
										htmlFor="vendor.name"
										className={classNames({ 'p-error': errors.vendor?.name })}>
										Vendors
									</label>
								</span>
								{getFormErrorMessage('vendor.name')}
							</div>

							{/* Courier */}
							<div className="field">
								<span className="p-float-label mb-5">
									<Controller
										name="courier.name"
										control={control}
										render={({ field, fieldState }) => (
											<InputText
												id={field.name}
												{...field}
												autoFocus
												disabled={true}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
											/>
										)}
									/>
									<label
										htmlFor="courier.name"
										className={classNames({ 'p-error': errors.vendor?.name })}>
										Courier
									</label>
								</span>
								{getFormErrorMessage('courier.name')}
							</div>

							{/* Country */}
							<div className="field">
								<span className="p-float-label mb-5">
									<Controller
										name="country.name"
										control={control}
										render={({ field, fieldState }) => (
											<InputText
												id={field.name}
												{...field}
												autoFocus
												disabled={true}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
											/>
										)}
									/>
									<label
										htmlFor="country.name"
										className={classNames({ 'p-error': errors.vendor?.name })}>
										Country
									</label>
								</span>
								{getFormErrorMessage('courier.name')}
							</div>

							{/* UOM */}
							<div className="field">
								<span className="p-float-label mb-5">
									<Controller
										name="uom"
										control={control}
										rules={{ required: 'UOM is required.' }}
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
										htmlFor="uom"
										className={classNames({ 'p-error': errors.uom })}>
										UOM
									</label>
									{getFormErrorMessage('uom')}
								</span>
							</div>

							<div className="field">
								<span className="p-float-label mb-5">
									<Controller
										name="minWeight"
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
										htmlFor="minWeight"
										className={classNames({ 'p-error': errors.maxWeight })}>
										Mimum Weight
									</label>
								</span>
								{getFormErrorMessage('maxWeight')}
							</div>

							{/* Max weight */}
							<div className="field">
								<span className="p-float-label mb-5">
									<Controller
										name="maxWeight"
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
										htmlFor="maxWeight"
										className={classNames({ 'p-error': errors.minWeight })}>
										Maximum Weight
									</label>
								</span>
								{getFormErrorMessage('maxWeight')}
							</div>

							{/* amount */}
							<div className="field">
								<span className="p-float-label mb-5">
									<Controller
										name="amount"
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
												minFractionDigits={2}
												maxFractionDigits={2}
												autoFocus
												className={classNames({
													'p-invalid': fieldState.error,
												})}
											/>
										)}
									/>
									<label
										htmlFor="amount"
										className={classNames({ 'p-error': errors.minWeight })}>
										Maximum Weight
									</label>
								</span>
								{getFormErrorMessage('maxWeight')}
							</div>
						</div>
					</div>
					<div className="flex flex-row">
						<Button
							label="Cancel"
							icon="pi pi-times"
							className="p-button-text"
							onClick={hideChargeUpdateDialog}
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

			{/* New delivery charge dialog box */}
			<Dialog
				visible={chargeAddDialog}
				style={{ width: '450px' }}
				header="new  Delivery charge"
				modal
				className="p-fluid"
				onHide={hideChargeAddDialog}>
				<form onSubmit={handleSubmit(onSubmitAdd)} className="p-fluid">
					<div className="flex justify-content-center">
						<div className="card">
							<div className="field">
								<span className="p-float-label mb-5">
									<Controller
										name="vendor"
										control={control}
										render={({ field, fieldState }) => (
											<Dropdown
												id={field.name}
												{...field}
												autoFocus
												optionValue="id"
												optionLabel="name"
												options={vendors}
												placeholder="Please select"
												className={classNames({
													'p-invalid': fieldState.error,
												})}
											/>
										)}
									/>
									<label
										htmlFor="vendor"
										className={classNames({ 'p-error': errors.vendor?.name })}>
										Vendors
									</label>
								</span>
								{getFormErrorMessage('vendor.name')}
							</div>

							{/* Country */}
							<div className="field">
								<span className="p-float-label mb-5">
									<Controller
										name="country"
										control={control}
										render={({ field, fieldState }) => (
											<Dropdown
												id={field.name}
												{...field}
												// autoFocus
												optionValue="id"
												optionLabel="name"
												options={countries}
												placeholder="Please select"
												className={classNames({
													'p-invalid': fieldState.error,
												})}
											/>
										)}
									/>
									<label
										htmlFor="country"
										className={classNames({ 'p-error': errors.vendor?.name })}>
										Country
									</label>
								</span>
								{getFormErrorMessage('courier.name')}
							</div>

							{/* Courier */}
							<div className="field">
								<span className="p-float-label mb-5">
									<Controller
										name="courier"
										control={control}
										render={({ field, fieldState }) => (
											<Dropdown
												id={field.name}
												{...field}
												// autoFocus
												optionValue="id"
												optionLabel="name"
												options={couriers}
												placeholder="Please select"
												className={classNames({
													'p-invalid': fieldState.error,
												})}
											/>
										)}
									/>
									<label
										htmlFor="courier"
										className={classNames({ 'p-error': errors.vendor?.name })}>
										Courier
									</label>
								</span>
								{getFormErrorMessage('courier.name')}
							</div>

							{/* UOM */}
							<div className="field">
								<span className="p-float-label mb-5">
									<Controller
										name="uom"
										control={control}
										rules={{ required: 'UOM is required.' }}
										render={({ field, fieldState }) => (
											<InputText
												id={field.name}
												{...field}
												// autoFocus
												// defaultValue="KG"
												className={classNames({
													'p-invalid': fieldState.error,
												})}
											/>
										)}
									/>
									<label
										htmlFor="uom"
										className={classNames({ 'p-error': errors.uom })}>
										UOM
									</label>
									{getFormErrorMessage('uom')}
								</span>
							</div>

							{/* Min weight */}
							<div className="field">
								<span className="p-float-label mb-5">
									<Controller
										name="minWeight"
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
												// autoFocus
												className={classNames({
													'p-invalid': fieldState.error,
												})}
											/>
										)}
									/>
									<label
										htmlFor="minWeight"
										className={classNames({ 'p-error': errors.maxWeight })}>
										Mimum Weight
									</label>
								</span>
								{getFormErrorMessage('maxWeight')}
							</div>

							{/* Max weight */}
							<div className="field">
								<span className="p-float-label mb-5">
									<Controller
										name="maxWeight"
										control={control}
										//rules={{ required: 'Tile is required.' }}
										render={({ field, fieldState }) => (
											<InputNumber
												id={field.name}
												ref={field.ref}
												value={field.value}
												onBlur={field.onBlur}
												defaultValue={2}
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
										htmlFor="maxWeight"
										className={classNames({ 'p-error': errors.minWeight })}>
										Maximum Weight
									</label>
								</span>
								{getFormErrorMessage('maxWeight')}
							</div>

							{/* amount */}
							<div className="field">
								<span className="p-float-label mb-5">
									<Controller
										name="amount"
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
												minFractionDigits={2}
												maxFractionDigits={2}
												autoFocus
												className={classNames({
													'p-invalid': fieldState.error,
												})}
											/>
										)}
									/>
									<label
										htmlFor="amount"
										className={classNames({ 'p-error': errors.minWeight })}>
										Amount
									</label>
								</span>
								{getFormErrorMessage('maxWeight')}
							</div>
						</div>
					</div>
					<div className="flex flex-row">
						<Button
							label="Cancel"
							icon="pi pi-times"
							className="p-button-text"
							onClick={hideChargeAddDialog}
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
				visible={deleteChargeDialog}
				style={{ width: '450px' }}
				header="Confirm"
				modal
				footer={deleteChargeDialogFooter}
				onHide={hideDeleteChargeDialog}>
				<div className="flex align-items-center justify-content-center">
					<i
						className="pi pi-exclamation-triangle mr-3"
						style={{ fontSize: '2rem' }}
					/>
					{charge && (
						<span>
							Are you sure you want to delete charge with country:{' '}
							<b>{charge.country.name}</b> courier:{' '}
							<b> {charge.courier.name} </b> Min Weight:{' '}
							<b>{charge.minWeight}</b>?
						</span>
					)}
				</div>
			</Dialog>
		</>
	);
};

export const getStaticProps: GetStaticProps = async (context) => {
	let charges: DELIVERY_CHARGE_TYPE[] = [];
	let vendors: VENDOR_TYPE[] = [];
	let countries: COUNTRY_NAME_TYPE[] = [];
	let couriers: COURIER_TYPE[] = [];
	try {
		const { data } = await axios.get<DELIVERY_CHARGE_TYPE[]>(
			process.env.EDC_API_BASEURL + `/deliveryCharge`
		);
		charges = data;
	} catch (e) {
		console.log('Could not find charges');
		console.log(e);
	}
	try {
		const { data } = await axios.get<VENDOR_TYPE[]>(
			process.env.EDC_API_BASEURL + `/vendor`
		);
		vendors = data;
	} catch (e) {
		console.log('Could not find vendors');
		console.log(e);
	}
	try {
		const { data } = await axios.get<COUNTRY_NAME_TYPE[]>(
			process.env.EDC_API_BASEURL + `/countryName`
		);
		countries = data;
	} catch (e) {
		console.log('Could not find countries');
		console.log(e);
	}
	try {
		const { data } = await axios.get<COURIER_TYPE[]>(
			process.env.EDC_API_BASEURL + `/courier`
		);
		couriers = data;
	} catch (e) {
		console.log('Could not find couriers');
		console.log(e);
	}
	return {
		props: { charges, vendors, countries, couriers },
	};
};
export default DeliveryMaint;
