'use client';
import { COUNTRY_NAME_TYPE } from '@/interfaces/countryName.type';
import { COURIER_TYPE } from '@/interfaces/courier.type';
import { DELIVERY_CHARGE_TYPE } from '@/interfaces/delivery-charge.type';
import { VENDOR_TYPE } from '@/interfaces/vendor.type';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import {
	InputNumber,
	InputNumberValueChangeEvent,
} from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { formatCurrency } from '@/utils/helpers';
import { Card } from 'primereact/card';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';

export default function DeliveryChargeMaintence({
	charges,
	vendors,
	countries,
	couriers,
}: {
	charges: DELIVERY_CHARGE_TYPE[];
	vendors: VENDOR_TYPE[];
	countries: COUNTRY_NAME_TYPE[];
	couriers: COURIER_TYPE[];
}) {
	let emptyCharge: DELIVERY_CHARGE_TYPE = {
		id: '',
		vendor: { id: 0, name: '' },
		country: { id: 0, name: '', emoji: '', deliveryActive: false },
		courier: { id: '', name: '', shippingModule: '', cutoffTime: '' },
		uom: 'KG',
		minWeight: 0,
		maxWeight: 0,
		amount: 0.0,
		vatAmount: 0.0,
		totalAmount: 0.0,
		minDays: 0,
		maxDays: 0,
		durationDescription: ' ',
		hasLostClaim: false,
		hasTracking: false,
		hasRemoteCharge: false,
		deliveryCharge: 0,
	};
	const toast = useRef<Toast>(null);
	const dt = useRef(null);
	const [chargeList, setChargeList] = useState<DELIVERY_CHARGE_TYPE[]>(charges);
	const [charge, setCharge] = useState<DELIVERY_CHARGE_TYPE>(emptyCharge);
	const [chargeUpdateDialog, setChargeUpdateDialog] = useState<boolean>(false);
	const [chargeAddDialog, setChargeAddDialog] = useState<boolean>(false);
	const [deleteChargeDialog, setDeleteChargeDialog] = useState<boolean>(false);
	const [selectedCharge, setSelectedCharge] =
		useState<DELIVERY_CHARGE_TYPE>(emptyCharge);
	const [filters, setFilters] = useState({
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
		'country.name': {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
		},
		'courier.name': {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
		},
		amount: {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
		},
	});
	const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

	const {
		control,
		register,
		formState: { errors },
		handleSubmit,
		reset,
		setValue,
	} = useForm<DELIVERY_CHARGE_TYPE>();

	const hideChargeUpdateDialog = () => {
		setChargeUpdateDialog(false);
	};

	const hideChargeAddDialog = () => {
		setChargeAddDialog(false);
	};

	const editCharge = (charge: DELIVERY_CHARGE_TYPE) => {
		//setCharge({ ...charge });

		setSelectedCharge(charge);
		setChargeUpdateDialog(true);

		reset(charge);
	};

	const showAddChargeDialog = () => {
		reset(emptyCharge);
		setChargeAddDialog(true);
	};

	const confirmDeleteCharge = (charge: DELIVERY_CHARGE_TYPE) => {
		setSelectedCharge(charge);
		setCharge(charge);
		setDeleteChargeDialog(true);
	};

	const onGlobalFilterChange = (e: any) => {
		const value = e.target.value;
		let _filters = { ...filters };
		_filters['global'].value = value;

		setFilters(_filters);
		setGlobalFilterValue(value);
	};

	const header = (
		<div className="table-header">
			<div className="flex justify-content-center">
				<h5 className="mx-0 my-1">Manage Delivery Charges</h5>
			</div>
			<div className="flex justify-content-between">
				{/* <span className="p-input-icon-left">
					<i className="pi pi-search" />
					<InputText type="search" placeholder="Search name" />
				</span> */}
				<span className="p-input-icon-left">
					<i className="pi pi-search" />
					<InputText
						value={globalFilterValue}
						onChange={onGlobalFilterChange}
						placeholder="Keyword Search"
					/>
				</span>
				<Button
					type="button"
					icon="pi pi-plus"
					label="Add"
					// className="p-button-outlined"
					onClick={() => showAddChargeDialog()}
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

	const amountBodyTemplate = (rowData: DELIVERY_CHARGE_TYPE) => {
		return formatCurrency(rowData.amount);
	};

	const totalAmountBodyTemplate = (rowData: DELIVERY_CHARGE_TYPE) => {
		return formatCurrency(rowData.totalAmount);
	};

	const getFormErrorMessage = (name: string) => {
		return (
			errors[name as keyof DELIVERY_CHARGE_TYPE] && (
				<small className="p-error">
					{errors[name as keyof DELIVERY_CHARGE_TYPE]?.message}
				</small>
			)
		);
	};

	const onSubmitChange = async (charge: DELIVERY_CHARGE_TYPE) => {
		try {
			const chargeUpdateResp = await fetch(`/api/deliveryCharge`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				cache: 'no-store',
				body: JSON.stringify(charge),
			});

			if (!chargeUpdateResp.ok) {
				throw new Error(
					`${chargeUpdateResp.status} ${chargeUpdateResp.statusText}`
				);
			}

			const chargeUpdated =
				(await chargeUpdateResp.json()) as DELIVERY_CHARGE_TYPE;
			const _chargeList = chargeList.map((_charge) => {
				if (_charge.id === chargeUpdated.id) {
					_charge = chargeUpdated;
				}
				return _charge;
			});
			setChargeList(_chargeList);
			hideChargeUpdateDialog();

			reset();
			toast.current?.show({
				severity: 'success',
				summary: 'Delivery charge updated',
				detail: `Saved delivery charge ${charge.country?.name}  ${charge.amount}`,
				life: 3000,
			});
		} catch (error: any) {
			if (error instanceof SyntaxError) {
				// Unexpected token < in JSON
				console.error('There was a SyntaxError', error);
			} else {
				console.error('Could not update delivery charge');
				console.error(error);
			}
		}
	};

	const onSubmitAdd = async (charge: DELIVERY_CHARGE_TYPE) => {
		if (!charge.hasTracking) {
			charge.hasTracking = false;
		}
		if (!charge.hasLostClaim) {
			charge.hasLostClaim = false;
		}

		try {
			const chargeUpdateResp = await fetch(`/api/deliveryCharge`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				cache: 'no-store',
				body: JSON.stringify(charge),
			});
			if (!chargeUpdateResp.ok) {
				throw new Error(
					`${chargeUpdateResp.status} ${chargeUpdateResp.statusText}`
				);
			}
			const newCharge = (await chargeUpdateResp.json()) as DELIVERY_CHARGE_TYPE;

			chargeList.push(newCharge);

			setChargeList(chargeList);

			hideChargeAddDialog();

			reset();
			toast.current?.show({
				severity: 'success',
				summary: 'Delivery charge saved',
				detail: `Saved charge  ${charge.country?.name} `,
				life: 3000,
			});
		} catch (error: any) {
			if (error instanceof SyntaxError) {
				// Unexpected token < in JSON
				console.error('There was a SyntaxError', error);
			} else {
				console.error('Could not add delivery charge');
				console.error(error);
				toast.current?.show({
					severity: 'error',
					summary: 'Could add delivery charge',
					detail: 'Failed to save new delivery charge',
					life: 3000,
				});
			}
		}
	};

	const hideDeleteChargeDialog = () => {
		setDeleteChargeDialog(false);
	};

	const deleteCharge = async () => {
		try {
			const url = `/api/deliveryCharge`;

			const chargeDeleteResp = await fetch(url, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				cache: 'no-store',
				body: JSON.stringify({ id: charge.id }),
			});

			if (!chargeDeleteResp.ok) {
				toast.current?.show({
					severity: 'error',
					summary: 'Could not delete charge',
					detail: `Reason ${chargeDeleteResp.statusText}`,
					life: 3000,
				});
				throw new Error(
					`${chargeDeleteResp.status} ${chargeDeleteResp.statusText}`
				);
			}
			const deletedCharge =
				(await chargeDeleteResp.json()) as DELIVERY_CHARGE_TYPE;

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
		} catch (error: any) {
			if (error instanceof SyntaxError) {
				// Unexpected token < in JSON
				console.error('There was a SyntaxError', error);
			} else {
				console.error('Could not delete delivery charge');
				console.error(error);
			}
		}
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

	const countryOptionTemplate = (option: COUNTRY_NAME_TYPE) => {
		return (
			<div className="flex align-items-center">
				<div>{option.name}</div>
			</div>
		);
	};

	const selectedCountryTemplate = (option: COUNTRY_NAME_TYPE, props: any) => {
		if (option) {
			return (
				<div className="flex align-items-center">
					<div>{option.name}</div>
				</div>
			);
		}

		return <span>{props.placeholder}</span>;
	};

	const hasClaimTemplate = (delCharge: DELIVERY_CHARGE_TYPE) => (
		<InputSwitch checked={delCharge.hasLostClaim} disabled={true} />
	);

	const hasTrackingTemplate = (delCharge: DELIVERY_CHARGE_TYPE) => (
		<InputSwitch checked={delCharge.hasTracking} disabled={true} />
	);

	const addDialogFooter = (
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
	);

	const updateDialogFooter = (
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
	);
	const handleCourierChange = (e: DropdownChangeEvent) => {
		const courirId: string = e.value;

		const _selectedCourier = couriers.find((c) => c.id === courirId);
		if (_selectedCourier) {
			setValue('courier.shippingModule', _selectedCourier?.shippingModule);
			setValue('courier', _selectedCourier);
		}
	};
	return (
		<>
			<div className="brand">
				<Toast ref={toast} position="top-center" />
				<div className="card ">
					<DataTable
						dataKey="id"
						sortOrder={1}
						sortField="country.name"
						scrollable
						scrollHeight="flex"
						ref={dt}
						stripedRows
						selection={selectedCharge}
						//onSelectionChange={(e) => setSelectedCharge(e.value[0])}
						filters={filters}
						filterDisplay="row"
						globalFilterFields={['country.name', 'courier.name', 'amount']}
						emptyMessage="No delivery charges found."
						value={chargeList}
						header={header}
						paginator
						rows={10}
						sortMode="single"
						rowsPerPageOptions={[5, 10, 25]}
						paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
						currentPageReportTemplate="Showing {first} to {last} of {totalRecords} delivery">
						<Column
							selectionMode="single"
							headerStyle={{ width: '3rem' }}
							exportable={false}></Column>
						<Column field="vendor.name" header="Vendor"></Column>
						<Column
							field="country.name"
							header="Country"
							sortable={true}></Column>
						<Column field="courier.name" header="Courier" sortable={true} />
						{/* <Column
							field="courier.shippingModule"
							header="Shiiping Module"
							sortable={true}
						/> */}
						<Column field="uom" header="UOM"></Column>
						<Column
							field="minWeight"
							header="Min Weight"
							sortable={true}></Column>
						<Column field="maxWeight" header="Max Weight" sortable={true} />
						<Column field="minDays" header="Min days" sortable={true} />
						<Column field="maxDays" header="Max days" sortable={true} />
						<Column
							field="hasLostClaim"
							header="Lost claim"
							body={hasClaimTemplate}
							sortable={true}
						/>
						<Column
							field="hasTracking"
							header="Tracking"
							body={hasTrackingTemplate}
							sortable={true}
						/>
						<Column
							field="amount"
							header="Amount"
							body={amountBodyTemplate}
							sortable={true}
						/>
						<Column
							field="totalAmount"
							header="Total Amount"
							body={totalAmountBodyTemplate}
							sortable={true}
						/>

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
					{/* <div className="flex justify-content-center"> */}
					<Card footer={updateDialogFooter}>
						<div className="flex flex-row flex-wrap">
							<div className="flex flex-column flex-wrap">
								<div className="field">
									<Controller
										name="vendor.name"
										control={control}
										render={({ field, fieldState }) => (
											<>
												<label
													htmlFor={field.name}
													className={classNames({
														'p-error': errors.vendor?.name,
													})}></label>
												<span className="p-float-label">
													<InputText
														id={field.name}
														value={field.value}
														onChange={(e) => field.onChange(e.target.value)}
														disabled={true}
														className={classNames({
															'p-invalid': fieldState.error,
														})}
													/>
													<label htmlFor={field.name}>Vendor</label>
												</span>
												{getFormErrorMessage(field.name)}
											</>
										)}
									/>
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
													disabled={true}
													className={classNames({
														'p-invalid': fieldState.error,
													})}
												/>
											)}
										/>
										<label
											htmlFor="courier.name"
											className={classNames({
												'p-error': errors.vendor?.name,
											})}>
											Courier
										</label>
									</span>
									{getFormErrorMessage('courier.name')}
								</div>

								{/* Shipping Module */}
								<div className="field">
									<span className="p-float-label mb-5">
										<Controller
											name="courier.shippingModule"
											control={control}
											render={({ field, fieldState }) => (
												<InputText
													id={field.name}
													{...field}
													required={true}
													className={classNames({
														'p-invalid': fieldState.error,
													})}
												/>
											)}
										/>
										<label
											htmlFor="courier.shippingModule"
											className={classNames({
												'p-error': errors.vendor?.name,
											})}>
											Shipping Module
										</label>
									</span>
									{getFormErrorMessage('courier.shippingModule')}
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
													disabled={true}
													className={classNames({
														'p-invalid': fieldState.error,
													})}
												/>
											)}
										/>
										<label
											htmlFor="country.name"
											className={classNames({
												'p-error': errors.vendor?.name,
											})}>
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

								{/** Min weight */}
								<div className="field">
									<Controller
										name="minWeight"
										control={control}
										//rules={{ required: 'Tile is required.' }}
										render={({ field, fieldState }) => (
											<>
												<span className="p-float-label mb-5">
													<InputNumber
														id={field.name}
														ref={field.ref}
														value={field.value}
														onBlur={field.onBlur}
														onValueChange={(e) => field.onChange(e)}
														minFractionDigits={0}
														maxFractionDigits={2}
														className={classNames({
															'p-invalid': fieldState.error,
														})}
													/>
													<label
														htmlFor="minWeight"
														className={classNames({
															'p-error': errors.maxWeight,
														})}>
														Mimum Weight
													</label>
												</span>
											</>
										)}
									/>

									{getFormErrorMessage('maxWeight')}
								</div>

								{/** Max Weight */}
								<div className="field">
									<Controller
										name="maxWeight"
										control={control}
										//rules={{ required: 'Tile is required.' }}
										render={({ field, fieldState }) => (
											<>
												<span className="p-float-label mb-5">
													<InputNumber
														id={field.name}
														ref={field.ref}
														value={field.value}
														onBlur={field.onBlur}
														onValueChange={(e) => field.onChange(e)}
														minFractionDigits={0}
														maxFractionDigits={2}
														className={classNames({
															'p-invalid': fieldState.error,
														})}
													/>
													<label
														htmlFor="maxWeight"
														className={classNames({
															'p-error': errors.maxWeight,
														})}>
														Maximum Weight
													</label>
													{getFormErrorMessage('maxWeight')}
												</span>
											</>
										)}
									/>
								</div>
							</div>
							{/* Column 2 */}
							<div className="flex flex-column flex-wrap">
								{/** min Days */}
								<div className="field">
									<Controller
										name="minDays"
										control={control}
										//rules={{ required: 'Tile is required.' }}
										render={({ field, fieldState }) => (
											<>
												<span className="p-float-label mb-5">
													<InputNumber
														id={field.name}
														ref={field.ref}
														value={field.value}
														onBlur={field.onBlur}
														onValueChange={(e) => field.onChange(e)}
														minFractionDigits={0}
														maxFractionDigits={2}
														className={classNames({
															'p-invalid': fieldState.error,
														})}
													/>
													<label
														htmlFor="minDays"
														className={classNames({
															'p-error': errors.minDays,
														})}>
														Minimum Days
													</label>
													{getFormErrorMessage('minDays')}
												</span>
											</>
										)}
									/>
								</div>

								{/** max Days */}
								<div className="field">
									<Controller
										name="maxDays"
										control={control}
										rules={{ required: 'Maximum days is required.' }}
										render={({ field, fieldState }) => (
											<>
												<span className="p-float-label mb-5">
													<InputNumber
														id={field.name}
														ref={field.ref}
														value={field.value}
														onBlur={field.onBlur}
														onValueChange={(e) => field.onChange(e)}
														minFractionDigits={0}
														maxFractionDigits={2}
														className={classNames({
															'p-invalid': fieldState.error,
														})}
													/>
													<label
														htmlFor="maxDays"
														className={classNames({
															'p-error': errors.minDays,
														})}>
														Maximum Days
													</label>
													{getFormErrorMessage('maxDays')}
												</span>
											</>
										)}
									/>
								</div>

								{/** Duration description */}
								<div className="field">
									<Controller
										name="durationDescription"
										control={control}
										//rules={{ required: 'Tile is required.' }}
										render={({ field, fieldState }) => (
											<>
												<span className="p-float-label mb-5">
													<InputText
														id={field.name}
														{...field}
														className={classNames({
															'p-invalid': fieldState.error,
														})}
													/>
													<label
														htmlFor="durationDescription"
														className={classNames({
															'p-error': errors.durationDescription,
														})}>
														Duration
													</label>
													{getFormErrorMessage('durationDescription')}
												</span>
											</>
										)}
									/>
								</div>

								{/** Lost Claim */}
								<div className="field">
									<Controller
										name="hasLostClaim"
										control={control}
										// rules={{ required: 'Lost claim is required.' }}
										render={({ field, fieldState }) => (
											<>
												<InputSwitch
													inputId={field.name}
													checked={field.value}
													inputRef={field.ref}
													className={classNames({
														'p-invalid': fieldState.error,
													})}
													onChange={(e: InputSwitchChangeEvent) =>
														field.onChange(e.value)
													}
												/>
												<label
													htmlFor="hasLostClaim"
													className={classNames({
														'p-error': errors.hasLostClaim,
													})}>
													<span className="ml-2">Lost Claim</span>
												</label>
												{getFormErrorMessage('hasLostClaim')}
											</>
										)}
									/>
								</div>

								{/** Tracking */}

								<div className="field">
									<Controller
										name="hasTracking"
										control={control}
										// rules={{ required: 'Tracking is required.' }}
										render={({ field, fieldState }) => (
											<>
												<InputSwitch
													inputId={field.name}
													checked={field.value}
													inputRef={field.ref}
													className={classNames({
														'p-invalid': fieldState.error,
													})}
													onChange={(e: InputSwitchChangeEvent) =>
														field.onChange(e.value)
													}
												/>
												<label
													htmlFor="hasTracking"
													className={classNames({
														'p-error': errors.hasTracking,
													})}>
													<span className="ml-2">Tracking</span>
												</label>
												{getFormErrorMessage('hasLostClaim')}
											</>
										)}
									/>
								</div>

								{/* amount */}

								<div className="field mt-5">
									<Controller
										name="amount"
										control={control}
										rules={{ required: 'Amount is required.' }}
										render={({ field, fieldState }) => (
											<>
												<span className="p-float-label">
													<label
														htmlFor="amount"
														className={classNames({
															'p-error': errors.amount,
														})}></label>
													<InputNumber
														id={field.name}
														ref={field.ref}
														value={field.value}
														onValueChange={(e) => field.onChange(e)}
														mode="currency"
														currency="GBP"
														className={classNames({
															'p-invalid': fieldState.error,
														})}
													/>
													<label htmlFor={field.name}>Amount</label>
												</span>
												{getFormErrorMessage('amount')}
											</>
										)}
									/>
								</div>

								{/* VAT amount */}
								<div className="field mt-5">
									<Controller
										name="vatAmount"
										control={control}
										rules={{ required: 'Amount is required.' }}
										render={({ field, fieldState }) => (
											<>
												<span className="p-float-label">
													<label
														htmlFor="vatAmount"
														className={classNames({
															'p-error': errors.amount,
														})}></label>
													<InputNumber
														id={field.name}
														ref={field.ref}
														value={field.value}
														onValueChange={(e) => field.onChange(e)}
														mode="currency"
														disabled={true}
														currency="GBP"
														className={classNames({
															'p-invalid': fieldState.error,
														})}
													/>
													<label htmlFor={field.name}>VAT Amount</label>
												</span>
												{getFormErrorMessage('vatAmount')}
											</>
										)}
									/>
								</div>

								{/* Total amount */}
								<div className="field mt-5">
									<Controller
										name="totalAmount"
										control={control}
										rules={{ required: 'Amount is required.' }}
										render={({ field, fieldState }) => (
											<>
												<span className="p-float-label">
													<label
														htmlFor="totalAmount"
														className={classNames({
															'p-error': errors.amount,
														})}></label>
													<InputNumber
														id={field.name}
														ref={field.ref}
														value={field.value}
														onValueChange={(e) => field.onChange(e)}
														mode="currency"
														disabled={true}
														currency="GBP"
														className={classNames({
															'p-invalid': fieldState.error,
														})}
													/>
													<label htmlFor={field.name}>Total Amount</label>
												</span>
												{getFormErrorMessage('totalAmount')}
											</>
										)}
									/>
								</div>
							</div>
						</div>
					</Card>
					{/* </div> */}
				</form>
			</Dialog>

			{/* New delivery charge dialog box */}
			<Dialog
				visible={chargeAddDialog}
				header="new  Delivery charge"
				style={{ width: '50vw' }}
				breakpoints={{ '960px': '75vw', '641px': '90vw' }}
				modal
				className="p-fluid"
				onHide={hideChargeAddDialog}>
				<form onSubmit={handleSubmit(onSubmitAdd)} className="p-fluid">
					<Toast ref={toast} position="top-center" />
					<div className="flex justify-content-center">
						<Card footer={addDialogFooter}>
							{/* <div className="card"> */}
							<div className="field">
								<Controller
									name="vendor"
									control={control}
									rules={{ required: 'Vendor is required' }}
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
									className={classNames({
										'p-error': errors.vendor?.name,
									})}>
									Vendors
								</label>

								{getFormErrorMessage('vendor.name')}
							</div>

							{/* Country */}
							<div className="field">
								<Controller
									name="country"
									control={control}
									rules={{ required: 'Country is required' }}
									render={({ field, fieldState }) => (
										<Dropdown
											id={field.name}
											{...field}
											value={field.value}
											// autoFocus
											filter
											valueTemplate={selectedCountryTemplate}
											itemTemplate={countryOptionTemplate}
											optionValue="id"
											optionLabel="name"
											options={countries}
											placeholder="Please select Country"
											className={classNames({
												'p-invalid': fieldState.error,
											})}
										/>
									)}
								/>
								<label
									htmlFor="country"
									className={classNames({
										'p-error': errors.vendor?.name,
									})}>
									Country
								</label>

								{getFormErrorMessage('courier.name')}
							</div>

							{/* Courier */}
							<div className="field">
								<Controller
									name="courier.id"
									control={control}
									render={({ field, fieldState }) => (
										<Dropdown
											id={field.name}
											{...field}
											// autoFocus
											optionValue="id"
											optionLabel="name"
											onChange={handleCourierChange}
											options={couriers}
											placeholder="Please select"
											className={classNames({
												'p-invalid': fieldState.error,
											})}
										/>
									)}
								/>
								<label
									htmlFor="courier.id"
									className={classNames({
										'p-error': errors.courier?.name,
									})}>
									Courier
								</label>

								{getFormErrorMessage('courier.id')}
							</div>

							{/* Shipping Module */}
							<div className="field">
								<Controller
									name="courier.shippingModule"
									control={control}
									// rules={{ required: 'Shipping Module is required.' }}
									render={({ field, fieldState }) => (
										<>
											<label
												htmlFor={field.name}
												className={classNames({
													'p-error': errors.courier?.shippingModule,
												})}
											/>
											<span className="p-float-label">
												<InputText
													id={field.name}
													value={field.value}
													disabled
													// onChange={(e) => field.onChange(e.target.value)}
													className={classNames({
														'p-invalid': fieldState.error,
													})}
												/>
												<label htmlFor={field.name}>Shipping module</label>
											</span>
											{getFormErrorMessage(field.name)}
										</>
									)}
								/>
							</div>

							{/* UOM */}
							<div className="field">
								<Controller
									name="uom"
									control={control}
									rules={{ required: 'UOM is required.' }}
									render={({ field, fieldState }) => (
										<>
											<label
												htmlFor={field.name}
												className={classNames({
													'p-error': errors.uom,
												})}
											/>
											<span className="p-float-label">
												<InputText
													id={field.name}
													value={field.value}
													onChange={(e) => field.onChange(e.target.value)}
													// autoFocus
													// defaultValue="KG"
													className={classNames({
														'p-invalid': fieldState.error,
													})}
												/>
												<label htmlFor={field.name}>UOM</label>
											</span>
											{getFormErrorMessage(field.name)}
										</>
									)}
								/>
							</div>

							{/* Min weight */}
							<div className="field col-6 ">
								<Controller
									name="minWeight"
									control={control}
									rules={{ required: 'Minimum weight is required.' }}
									render={({ field, fieldState }) => (
										<>
											<label
												htmlFor={field.name}
												className={classNames({
													'p-error': errors.uom,
												})}
											/>
											<span className="p-float-label">
												<InputNumber
													id={field.name}
													ref={field.ref}
													value={field.value}
													inputRef={field.ref}
													onBlur={field.onBlur}
													onValueChange={(e) => field.onChange(e)}
													mode="decimal"
													minFractionDigits={2}
													className={classNames({
														'p-invalid': fieldState.error,
													})}
												/>
												<label htmlFor={field.name}>Minimum Weight</label>
											</span>

											{getFormErrorMessage(field.name)}
										</>
									)}
								/>
							</div>

							{/* Max weight */}
							<div className="field col-6 ">
								<Controller
									name="maxWeight"
									control={control}
									rules={{ required: 'Max weight is required.' }}
									render={({ field, fieldState }) => (
										<>
											<label
												htmlFor={field.name}
												className={classNames({
													'p-error': errors.maxWeight,
												})}
											/>
											<span className="p-float-label">
												<InputNumber
													id={field.name}
													ref={field.ref}
													value={field.value}
													onBlur={field.onBlur}
													onValueChange={(e) => field.onChange(e)}
													mode="decimal"
													minFractionDigits={2}
													className={classNames({
														'p-invalid': fieldState.error,
													})}
												/>
												<label htmlFor={field.name}>Maximum Weight</label>
											</span>
											{getFormErrorMessage(field.name)}
											{/* <label
												htmlFor="maxWeight"
												className={classNames({
													'p-error': errors.maxWeight,
												})}>
												Maximum Weight
											</label>
											{getFormErrorMessage('maxWeight')} */}
										</>
									)}
								/>
							</div>

							{/** min days */}
							<div className="field">
								<Controller
									name="minDays"
									control={control}
									rules={{ required: 'Min days is required.' }}
									render={({ field, fieldState }) => (
										<>
											<label
												htmlFor={field.name}
												className={classNames({
													'p-error': errors.minDays,
												})}
											/>
											<span className="p-float-label">
												<InputNumber
													id={field.name}
													ref={field.ref}
													value={field.value}
													onBlur={field.onBlur}
													onValueChange={(e) => field.onChange(e)}
													className={classNames({
														'p-invalid': fieldState.error,
													})}
												/>
												<label htmlFor={field.name}>Minimum Days</label>
											</span>
											{getFormErrorMessage(field.name)}
											{/* <label
												htmlFor="minDays"
												className={classNames({
													'p-error': errors.minDays,
												})}>
												Min Days
											</label>
											{getFormErrorMessage('minDays')} */}
										</>
									)}
								/>
							</div>

							{/** max days */}
							<div className="field col-6 md:col-12">
								<Controller
									name="maxDays"
									control={control}
									rules={{ required: 'Maximum days is required' }}
									render={({ field, fieldState }) => (
										<>
											<label
												htmlFor={field.name}
												className={classNames({
													'p-error': errors.maxDays,
												})}
											/>
											<span className="p-float-label">
												<InputNumber
													id={field.name}
													ref={field.ref}
													value={field.value}
													onBlur={field.onBlur}
													onValueChange={(e) => field.onChange(e)}
													// autoFocus
													className={classNames({
														'p-invalid': fieldState.error,
													})}
												/>
												<label htmlFor={field.name}>Maximum Days</label>
											</span>
											{getFormErrorMessage(field.name)}
										</>
									)}
								/>
								{/* <label
									htmlFor="maxDays"
									className={classNames({ 'p-error': errors.maxDays })}>
									Maximum delivery Days
								</label> */}
							</div>

							{/** delivery text */}
							<div className="field">
								<Controller
									name="durationDescription"
									control={control}
									rules={{ required: 'Duration description is required.' }}
									render={({ field, fieldState }) => (
										<>
											<label
												htmlFor={field.name}
												className={classNames({
													'p-error': errors.durationDescription,
												})}
											/>
											<span className="p-float-label">
												<InputText
													id={field.name}
													value={field.value}
													onChange={(e) => field.onChange(e)}
													className={classNames({
														'p-invalid': fieldState.error,
													})}
												/>
												<label htmlFor={field.name}>Delivery duration</label>
											</span>
											{getFormErrorMessage(field.name)}
										</>
									)}
								/>
								{/* <label
									htmlFor="durationDescription"
									className={classNames({
										'p-error': errors.durationDescription,
									})}>
									Delivery duration
								</label> */}
							</div>

							{/** lost claim */}
							<div className="field">
								<Controller
									name="hasLostClaim"
									control={control}
									// rules={{ required: 'Lost claim is required.' }}
									render={({ field, fieldState }) => (
										<>
											<InputSwitch
												inputId={field.name}
												checked={field.value}
												inputRef={field.ref}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e: InputSwitchChangeEvent) =>
													field.onChange(e.value)
												}
											/>
											<label
												htmlFor="hasLostClaim"
												className={classNames({
													'p-error': errors.hasLostClaim,
												})}>
												<span className="ml-2">Lost Claim</span>
											</label>
											{getFormErrorMessage('hasLostClaim')}
										</>
									)}
								/>
							</div>

							{/** Tracking */}
							<div className="field">
								<Controller
									name="hasTracking"
									control={control}
									// rules={{ required: 'Tracking is required.' }}
									render={({ field, fieldState }) => (
										<>
											<InputSwitch
												inputId={field.name}
												checked={field.value}
												inputRef={field.ref}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e: InputSwitchChangeEvent) =>
													field.onChange(e.value)
												}
											/>
											<label
												htmlFor="hasTracking"
												className={classNames({
													'p-error': errors.hasTracking,
												})}>
												<span className="ml-2">Tracking</span>
											</label>
											{getFormErrorMessage('hasTracking')}
										</>
									)}
								/>
							</div>

							{/* amount */}
							<div className="field">
								<Controller
									name="amount"
									control={control}
									rules={{ required: 'Amount is required.' }}
									render={({ field, fieldState }) => (
										<>
											<label
												htmlFor={field.name}
												className={classNames({
													'p-error': errors.amount,
												})}
											/>
											<span className="p-float-label">
												<InputNumber
													id={field.name}
													ref={field.ref}
													value={field.value}
													onBlur={field.onBlur}
													onValueChange={(e) => field.onChange(e)}
													mode="currency"
													currency="GBP"
													className={classNames({
														'p-invalid': fieldState.error,
													})}
												/>
												<label htmlFor={field.name}>Amount</label>
											</span>
											{getFormErrorMessage(field.name)}
										</>
									)}
								/>

								{getFormErrorMessage('amount')}
							</div>

							{/* </div> */}
						</Card>
					</div>
				</form>
			</Dialog>

			{/** deleted dialog */}
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
							Are you sure you want to delete <br></br> country:{' '}
							<b>{charge.country?.name}</b> courier:{' '}
							<b> {charge.courier?.name} </b> Min Weight:{' '}
							<b>{charge.minWeight}</b>?
						</span>
					)}
				</div>
			</Dialog>
		</>
	);
}
