'use client';

import {
	DELIVERY_CHARGE_TYPE,
	REMOTE_LOCATION_TYPE,
} from '@/interfaces/delivery-charge.type';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import {
	DataTable,
	DataTableExpandedRows,
	DataTableRowEvent,
	DataTableRowToggleEvent,
	DataTableValue,
	DataTableValueArray,
} from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { awsS3ImageReturn } from '@/interfaces/product.type';

type REMOTE_LOCATION_RETURN = {
	id?: number;
	deliveryCharge?: DELIVERY_CHARGE_TYPE;
	postCode: string;
	remoteCharge: number;
	surcharge: boolean;
	days?: number;
	deliveryChargeId?: string;
	deliveryId?: string;
};
export default function DeliveryRemoteLocationMaintence({
	charges,
}: {
	charges: DELIVERY_CHARGE_TYPE[];
}) {
	let emptyRemoteLocation: REMOTE_LOCATION_TYPE = {
		postCode: '',
		remoteCharge: 0,
		days: 0,
		surcharge: false,
	};
	const toast = useRef<Toast>(null);
	const dt = useRef(null);
	const [chargeList, setChargeList] = useState<DELIVERY_CHARGE_TYPE[]>(charges);
	const [selectedChargeId, setSelectedChargeId] = useState<string>('');
	const [remoteLocation, setRemoteLocation] =
		useState<REMOTE_LOCATION_TYPE>(emptyRemoteLocation);
	const [remoteLocations, setRemoteLocations] =
		useState<REMOTE_LOCATION_TYPE[]>();
	const [selectedRemoteLocation, setSelectedRemoteLocation] =
		useState<REMOTE_LOCATION_TYPE>(emptyRemoteLocation);
	const [expandedRows, setExpandedRows] = useState<
		DataTableExpandedRows | DataTableValueArray | undefined
	>(undefined);
	const [showRemoteAddDlg, setShowRemoteAddDlg] = useState<boolean>(false);
	const [showRemoteUpdateDlg, setShowRemoteUpdateDlg] =
		useState<boolean>(false);
	const [showRemoDeleteDlg, setShowRemoteDeleteDlg] = useState<boolean>(false);

	const {
		control,
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm<REMOTE_LOCATION_TYPE>();
	const expandAll = () => {
		let _expandedRows: DataTableExpandedRows = {};

		chargeList.forEach(
			(delCharge: DELIVERY_CHARGE_TYPE) =>
				(_expandedRows[`${delCharge.id}`] = true)
		);

		setExpandedRows(_expandedRows);
	};
	const collapseAll = () => {
		setExpandedRows(undefined);
	};

	const editRemoteLocation = (remoteLocation: REMOTE_LOCATION_TYPE) => {
		setSelectedRemoteLocation(remoteLocation);
		setShowRemoteUpdateDlg(true);
		reset(remoteLocation);
	};

	const hideDeleteChargeDialog = () => {
		setShowRemoteDeleteDlg(false);
	};

	const deleteRemoteLocation = async () => {
		try {
			const url = `/api/admin/remoteLocationCharge?id=${remoteLocation.id}`;
			const _chargeList = chargeList;
			//const { data } = await axios.delete<RESPONSE_MESSAGE_TYPE>(url);
			const remoteLocationDeleteResp = await fetch(url, {
				method: 'DELETE',
			});

			if (!remoteLocationDeleteResp.ok) {
				toast.current?.show({
					severity: 'error',
					summary: 'Could not delete remote location charge',
					detail: `Reason ${remoteLocationDeleteResp.statusText}`,
					life: 3000,
				});
				throw new Error(
					`${remoteLocationDeleteResp.status} ${remoteLocationDeleteResp.statusText}`
				);
			}
			const deletedRemoteLocation =
				(await remoteLocationDeleteResp.json()) as REMOTE_LOCATION_TYPE;

			// const _chargeList = chargeList.filter(
			// 	(c) => {
			// 		c.id !== deletedRemoteLocation.deliveryCharge?.id
			// 	}

			// );
			const currentChargeId = _chargeList.findIndex(
				(item: DELIVERY_CHARGE_TYPE) => {
					return (item.id = selectedChargeId);
				}
			);
			const currentCharge = _chargeList[currentChargeId];
			const _remoteLocations = currentCharge.remoteLocations?.filter(
				(item: REMOTE_LOCATION_TYPE) => item.id !== remoteLocation.id
			);

			currentCharge.remoteLocations = _remoteLocations;
			_chargeList[currentChargeId] = currentCharge;
			setChargeList(_chargeList);
			setShowRemoteDeleteDlg(false);
			setRemoteLocation(emptyRemoteLocation);
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
	const deleteRemoteLocationDialogFooter = (
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
				onClick={deleteRemoteLocation}
			/>
		</>
	);
	const confirmDeleteCharge = (remoteLocation: REMOTE_LOCATION_TYPE) => {
		setSelectedRemoteLocation(remoteLocation);
		setRemoteLocation(remoteLocation);
		setShowRemoteDeleteDlg(true);
	};
	const actionBodyTemplate = (rowData: REMOTE_LOCATION_TYPE) => {
		return (
			<>
				<Button
					icon="pi pi-pencil"
					className="p-button-rounded p-button-success mr-2"
					onClick={() => editRemoteLocation(rowData)}
				/>

				<Button
					icon="pi pi-trash"
					className="p-button-rounded p-button-error"
					onClick={() => confirmDeleteCharge(rowData)}
				/>
			</>
		);
	};
	const header = (
		<div className="table-header">
			<div className="flex  justify-content-between gap-2">
				<h5 className="mx-0 my-1">Manage Remote Delivery Locations</h5>
				<Button onClick={() => setShowRemoteAddDlg(true)}>
					Add new remote location
				</Button>

				{/* updateRemoteChargeResp</div> */}
			</div>
		</div>
	);

	const allowExpansion = (rowData: DELIVERY_CHARGE_TYPE): boolean => {
		return rowData.remoteLocations ? true : false;
	};

	const surchargeTemplate = (data: REMOTE_LOCATION_TYPE) => {
		return data.surcharge ? 'Yes' : 'No';
	};
	const rowExpansionTemplate = (data: DELIVERY_CHARGE_TYPE) => {
		return (
			<div className="p-3">
				<h5>Remote locations for {data.courier?.name}</h5>
				<DataTable
					value={data.remoteLocations}
					emptyMessage="No remote location charges"
					sortField="postCode"
					sortOrder={1}>
					<Column field="postCode" header="Post Code" sortable />
					<Column
						field="remoteCharge"
						header="Charge"
						style={{ width: '6rem' }}
					/>
					<Column
						style={{ width: '10rem' }}
						field="surcharge"
						header="Is a surcharge"
						body={surchargeTemplate}
					/>
					<Column
						style={{ width: '10rem' }}
						field="days"
						header="Delivery days"
					/>
					<Column
						body={actionBodyTemplate}
						exportable={false}
						style={{ minWidth: '8rem' }}></Column>
				</DataTable>
			</div>
		);
	};
	const hideAddRemoteDld = () => {
		setShowRemoteAddDlg(false);
	};

	const hideUpdateRemoteDld = () => {
		setShowRemoteUpdateDlg(false);
	};

	const onSubmitAddRemote = async (remote: REMOTE_LOCATION_TYPE) => {
		// remote.deliveryId;
		const url = '/api/admin/remoteLocationCharge';
		const addRemoteChargeResp = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(remote),
		});
		if ((await addRemoteChargeResp).ok) {
			const remoteLocation =
				(await addRemoteChargeResp.json()) as REMOTE_LOCATION_RETURN;
			const currentDeliveryChargeIdx = chargeList.findIndex(
				(item: DELIVERY_CHARGE_TYPE) =>
					item.id === remoteLocation.deliveryCharge?.id
			);

			if (currentDeliveryChargeIdx !== -1) {
				const currentDeliveryCharge = chargeList[currentDeliveryChargeIdx];
				const remoteIdx = currentDeliveryCharge?.remoteLocations?.findIndex(
					(item) => item.id === remoteLocation.id
				);
				if (remoteIdx === -1) {
					currentDeliveryCharge?.remoteLocations?.push(remoteLocation);
				} else {
					if (currentDeliveryCharge.remoteLocations && remoteIdx) {
						currentDeliveryCharge!.remoteLocations[remoteIdx] = remoteLocation;
					}
				}
				const _chargeList = chargeList;
				_chargeList[currentDeliveryChargeIdx] = currentDeliveryCharge;
				setChargeList(_chargeList);
				setShowRemoteAddDlg(false);
			} else {
				toast.current?.show({
					severity: 'warn',
					summary: 'No delivery charge',
					detail: 'Could not find delivery charge',
					life: 3000,
				});
			}
		} else {
			toast.current?.show({
				severity: 'warn',
				summary: 'Update error',
				detail: 'Could not save remote charge',
				life: 3000,
			});
		}
	};

	const onSubmitUpdateRemote = async (remoteCharge: REMOTE_LOCATION_TYPE) => {
		const url = '/api/admin/remoteLocationCharge';
		const updateRemoteChargeResp = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(remoteCharge),
		});

		if ((await updateRemoteChargeResp).ok) {
			const remoteLocation =
				(await updateRemoteChargeResp.json()) as REMOTE_LOCATION_RETURN;

			const currentDeliveryChargeIdx = chargeList.findIndex(
				(item: DELIVERY_CHARGE_TYPE) => item.id === selectedChargeId
			);

			if (currentDeliveryChargeIdx !== -1) {
				const currentDeliveryCharge = chargeList[currentDeliveryChargeIdx];
				if (currentDeliveryCharge) {
					if (currentDeliveryCharge.remoteLocations) {
						const remoteLocIdx =
							currentDeliveryCharge.remoteLocations.findIndex(
								(item: REMOTE_LOCATION_TYPE) => item.id === remoteLocation.id
							);
						if (remoteLocIdx !== -1) {
							currentDeliveryCharge.remoteLocations[remoteLocIdx] =
								remoteLocation;
						} else {
							currentDeliveryCharge.remoteLocations.push(remoteLocation);
						}
					} else {
						const remoteLocations: REMOTE_LOCATION_TYPE[] = [];
						remoteLocations.push(remoteLocation);
						currentDeliveryCharge.remoteLocations = remoteLocations;
					}

					const _chargeList = chargeList;
					_chargeList[currentDeliveryChargeIdx] = currentDeliveryCharge;
					setChargeList(_chargeList);
					setShowRemoteUpdateDlg(false);
				}
			} else {
				console.warn('could not find delivery charge in ${chargeList}');
				toast.current?.show({
					severity: 'warn',
					summary: 'No remote location delivery charge',
					detail: 'Could not find remote delivery charge',
					life: 3000,
				});
			}
		} else {
			toast.current?.show({
				severity: 'warn',
				summary: 'Update error',
				detail: 'Could not save remote charge',
				life: 3000,
			});
		}
	};

	const addDialogFooter = (
		<div className="flex flex-row">
			<Button
				label="Cancel"
				icon="pi pi-times"
				className="p-button-text"
				onClick={hideAddRemoteDld}
			/>
			<Button
				label="Save remote location"
				type="submit"
				icon="pi pi-check"
				className="p-button-text"
			/>
		</div>
	);

	const getFormErrorMessage = (name: string) => {
		return (
			errors[name as keyof REMOTE_LOCATION_TYPE] && (
				<small className="p-error">
					{errors[name as keyof REMOTE_LOCATION_TYPE]?.message}
				</small>
			)
		);
	};

	const onRowExpand = (event: DataTableRowEvent) => {
		setSelectedChargeId(event.data.id);
	};

	const onRowToggle = (event: DataTableRowToggleEvent) => {
		setExpandedRows(event.data);
	};

	const selectedCourier = (option: DELIVERY_CHARGE_TYPE, props: any) => {
		if (option) {
			return (
				<div className="flex align-items-center">
					<div>{option.courier?.name}</div>
				</div>
			);
		} else {
			return <span>{props.placeholder}</span>;
		}
	};

	const courierOption = (option: DELIVERY_CHARGE_TYPE) => {
		return (
			<div className="flex align-items-center">
				<div>{option.courier?.name} - </div>
				<div className="mr-5">
					KG {option.minWeight} to {option.maxWeight}{' '}
				</div>
			</div>
		);
	};

	return (
		<>
			{/**   summary table */}
			<Toast ref={toast} position="top-center" />
			<div className="card flex justify-content-center align-content-center">
				<Card style={{ width: '80%' }} title="Delivery charges">
					<DataTable
						dataKey="id"
						header={header}
						value={chargeList}
						expandedRows={expandedRows}
						onRowToggle={onRowToggle}
						rowExpansionTemplate={rowExpansionTemplate}
						selectionMode="single"
						onRowExpand={onRowExpand}
						paginator
						rows={10}
						sortMode="single"
						sortOrder={1}
						sortField="courier.name"
						rowsPerPageOptions={[5, 10, 25]}
						paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
						currentPageReportTemplate="Showing {first} to {last} of {totalRecords} delivery charges">
						<Column expander={allowExpansion} style={{ width: '3em' }} />
						<Column
							field="courier.name"
							header="Courier"
							sortable={true}
							style={{ width: '30em' }}
						/>
						<Column
							field="minWeight"
							header="Min weight"
							sortable={true}
							style={{ width: '15em' }}
						/>
						<Column
							field="maxWeight"
							header="Max weight"
							sortable={true}
							style={{ width: '15em' }}
						/>
					</DataTable>
				</Card>
			</div>

			{/** add remote location dialog */}
			<Dialog
				visible={showRemoteAddDlg}
				breakpoints={{ '960px': '75vw', '641px': '90vw' }}
				style={{ width: '50vw' }}
				onHide={hideAddRemoteDld}
				header="Add remote location"
				modal
				className="p-fluid">
				<form onSubmit={handleSubmit(onSubmitAddRemote)} className="p-fluid">
					<div className="flex justify-content-center">
						<Card footer={addDialogFooter}>
							<div className="field">
								<Controller
									name="deliveryId"
									control={control}
									rules={{ required: 'Delivery Charge is required' }}
									render={({ field, fieldState }) => (
										<Dropdown
											id={field.name}
											{...field}
											autoFocus
											optionValue="id"
											optionLabel="courier.name"
											options={chargeList}
											// valueTemplate={selectedCourier}
											itemTemplate={courierOption}
											placeholder="Please select courier"
											className={classNames({
												'p-invalid': fieldState.error,
											})}
										/>
									)}
								/>
								<label
									htmlFor="deliveryId"
									className={classNames({
										'p-error': errors.deliveryId,
									})}>
									Delivery Courier
								</label>

								{getFormErrorMessage('deliveryCharge.courier.name')}
							</div>
							{/** post code field */}
							<div className="field">
								<Controller
									name="postCode"
									control={control}
									rules={{ required: 'Post Code must be entered' }}
									render={({ field, fieldState }) => (
										<>
											<label
												htmlFor={field.name}
												className={classNames({
													'p-error': errors.postCode,
												})}
											/>
											<span className="p-float-label">
												<InputText
													id={field.name}
													value={field.value}
													onChange={(e) => field.onChange(e.target.value)}
													className={classNames({
														'p-invalid': fieldState.error,
													})}
												/>
												<label htmlFor={field.name}>Post code</label>
											</span>
										</>
									)}
								/>
								{/* <label
									htmlFor="postCode"
									className={classNames({ 'p-error': errors.postCode })}>
									Post Code*
								</label> */}
							</div>
							{/** remote charge field */}
							<div className="field">
								<Controller
									name="remoteCharge"
									control={control}
									rules={{ required: 'Charge must be entered' }}
									render={({ field, fieldState }) => (
										<>
											<label
												htmlFor={field.name}
												className={classNames({
													'p-error': errors.remoteCharge,
												})}
											/>
											<span className="p-float-label">
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
												<label htmlFor={field.name}>Remote charge</label>
											</span>
											{getFormErrorMessage(field.name)}
										</>
									)}
								/>
							</div>

							{/* Surcharge filed */}
							<div className="field">
								<Controller
									name="surcharge"
									control={control}
									//rules={{ required: 'Charge must be entered' }}
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
												htmlFor="surcharge"
												className={classNames({
													'p-error': errors.surcharge,
												})}>
												<span className="ml-2">Is a surcharge</span>
											</label>

											{getFormErrorMessage(field.name)}
										</>
									)}
								/>
							</div>

							{/** days field */}
							<div className="field">
								<span className="p-float-label mb-5">
									<Controller
										name="days"
										control={control}
										render={({ field, fieldState }) => (
											<InputNumber
												id={field.name}
												ref={field.ref}
												value={field.value}
												onBlur={field.onBlur}
												onValueChange={(e) => field.onChange(e)}
												useGrouping={false}
												minFractionDigits={0}
												maxFractionDigits={2}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
											/>
										)}
									/>
									<label
										htmlFor="days"
										className={classNames({ 'p-error': errors.days })}>
										Delivery Days
									</label>
									{getFormErrorMessage('maxWeight')}
								</span>
							</div>
						</Card>
					</div>
				</form>
			</Dialog>

			{/** update remote location dialog */}
			<Dialog
				visible={showRemoteUpdateDlg}
				breakpoints={{ '960px': '75vw', '641px': '90vw' }}
				style={{ width: '50vw' }}
				onHide={hideUpdateRemoteDld}
				header="Update remote location"
				modal
				className="p-fluid">
				<form onSubmit={handleSubmit(onSubmitUpdateRemote)} className="p-fluid">
					<div className="flex justify-content-center">
						<Card footer={addDialogFooter}>
							{/** post code field */}
							<div className="field">
								<span className="p-float-label mb-5">
									<Controller
										name="postCode"
										control={control}
										rules={{ required: 'Post Code must be entered' }}
										render={({ field, fieldState }) => (
											<>
												<label
													htmlFor={field.name}
													className={classNames({
														'p-error': errors.postCode,
													})}></label>
												<span className="p-float-label">
													<InputText
														id={field.name}
														value={field.value}
														onChange={(e) => field.onChange(e.target.value)}
														className={classNames({
															'p-invalid': fieldState.error,
														})}
													/>
													<label htmlFor={field.name}>Post Code</label>
												</span>
												{/* {getFormErrorMessage(field.name)} */}
											</>
										)}
									/>
								</span>
							</div>

							{/** remote charge field */}
							<div className="field">
								<span className="p-float-label mb-5">
									<Controller
										name="remoteCharge"
										control={control}
										rules={{ required: 'Charge must be entered' }}
										render={({ field, fieldState }) => (
											<>
												{' '}
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
											</>
										)}
									/>
									<label
										htmlFor="remoteCharge"
										className={classNames({ 'p-error': errors.remoteCharge })}>
										Charge*
									</label>
								</span>
							</div>

							{/* Surcharge filed */}
							<div className="field">
								{/* <span className="p-float-label mb-5"> */}
								<div className="flex flex-column">
									<label
										htmlFor="surcharge"
										className={classNames({
											'p-error': errors.surcharge,
										})}>
										<span className="ml-2">Amount is a surcharge</span>
									</label>
									<Controller
										name="surcharge"
										control={control}
										//rules={{ required: 'Charge must be entered' }}
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

												{getFormErrorMessage('surcharge')}
											</>
										)}
									/>
								</div>
								{/* </span> */}
							</div>

							{/** days field */}
							<div className="field">
								<span className="p-float-label mt-5">
									<Controller
										name="days"
										control={control}
										render={({ field, fieldState }) => (
											<InputNumber
												id={field.name}
												ref={field.ref}
												value={field.value}
												onBlur={field.onBlur}
												onValueChange={(e) => field.onChange(e)}
												useGrouping={false}
												minFractionDigits={0}
												maxFractionDigits={2}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
											/>
										)}
									/>
									<label
										htmlFor="days"
										className={classNames({ 'p-error': errors.days })}>
										Delivery Days
									</label>
									{getFormErrorMessage('maxWeight')}
								</span>
							</div>
						</Card>
					</div>
				</form>
			</Dialog>

			{/** delete dialog */}
			<Dialog
				visible={showRemoDeleteDlg}
				style={{ width: '450px' }}
				header="Confirm"
				modal
				footer={deleteRemoteLocationDialogFooter}
				onHide={hideDeleteChargeDialog}>
				<div className="flex align-items-center justify-content-center">
					<i
						className="pi pi-exclamation-triangle mr-3"
						style={{ fontSize: '2rem' }}
					/>
					{remoteLocation && (
						<span>
							Are you sure you want to delete <br></br> remote location:{' '}
							<b>{remoteLocation.postCode}</b> ?
						</span>
					)}
				</div>
			</Dialog>
		</>
	);
}
