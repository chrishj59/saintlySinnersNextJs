'use client';

import { COURIER_TYPE } from '@/interfaces/courier.type';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function CourierMaintence({
	couriers,
}: {
	couriers: COURIER_TYPE[];
}) {
	const defaultValues: COURIER_TYPE = {
		id: '',
		name: '',
		shippingModule: '',
		cutoffTime: '',
	};

	const {
		control,
		formState: { errors },
		handleSubmit,
		setValue,
		getValues,
		reset,
	} = useForm<COURIER_TYPE>({ defaultValues });
	const toast = useRef<Toast | null>(null);
	const [couriersList, setCouriersList] = useState<COURIER_TYPE[]>(couriers);
	const dt = useRef<DataTable<COURIER_TYPE[]>>(null);

	const [courierDialog, setCourierDialog] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);

	const actionBodyTemplate = (rowData: COURIER_TYPE) => {
		return (
			<>
				<Button
					icon="pi pi-pencil"
					rounded
					outlined
					className="mr-2"
					onClick={() => editCourier(rowData)}
				/>
			</>
		);
	};

	const editCourier = async (courierParam: COURIER_TYPE) => {
		console.log(`open dialog with ${JSON.stringify(courierParam, null, 2)}`);
		setValue('id', courierParam.id);
		setValue('name', courierParam.name ? courierParam.name : '');
		setValue(
			'shippingModule',
			courierParam.shippingModule ? courierParam.shippingModule : ''
		);
		setValue(
			'cutoffTime',
			courierParam.cutoffTime ? courierParam.cutoffTime : ''
		);

		setCourierDialog(true);
	};

	const onSubmitUpdateCourier = async (courier: COURIER_TYPE) => {
		console.log(
			`onSubmitUpdateCourier called with ${JSON.stringify(courier, null, 2)}`
		);
		setSubmitted(true);
		const url = '/api/admin/deliveryCourier';
		if (courier.id.length === 0) {
			//new courier
			const courierResp = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},

				body: JSON.stringify(courier),
			});
			if (!courierResp.ok) {
				toast.current?.show({
					severity: 'error',
					summary: 'Could not add Courier',
					detail: `Could not add courier ${JSON.stringify(courier, null, 2)} `,
					life: 3000,
				});
				return;
			}

			const _courier = (await courierResp.json()) as COURIER_TYPE;
			toast.current?.show({
				severity: 'success',
				summary: 'Added Courier',
				detail: `Saved  courier ${courierResp.statusText} `,
				life: 3000,
			});

			couriersList.push(_courier);
		} else {
			// update existing courier

			const apiResp = await fetch(url, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},

				body: JSON.stringify(courier),
			});

			if (!apiResp.ok) {
				toast.current?.show({
					severity: 'error',
					summary: 'Could not update Courier',
					detail: `Could not update courier ${JSON.stringify(
						courier,
						null,
						2
					)} `,
					life: 3000,
				});
				return;
			}

			toast.current?.show({
				severity: 'success',
				summary: 'Updated Courier',
				detail: `Saved  courier ${apiResp.statusText} `,
				life: 3000,
			});
			const corrierIdx = couriersList.findIndex((c) => c.id === courier.id);
			if (corrierIdx !== -1) {
				//found courir to update
				const _courier = couriersList[corrierIdx];
				_courier.name = courier.name;
				_courier.cutoffTime = courier.cutoffTime;
				_courier.shippingModule = courier.shippingModule;
			}
		}
		reset();
		setSubmitted(false);
		setCourierDialog(false);
	};

	const hideCourierDialog = () => {
		setSubmitted(false);
		setCourierDialog(false);
	};
	const getFormErrorMessage = (name: string) => {
		return (
			errors[name as keyof COURIER_TYPE] && (
				<small className="p-error">
					{errors[name as keyof COURIER_TYPE]?.message}
				</small>
			)
		);
	};
	const courierDialogFooter = (
		<div className="flex flex-row ">
			<Button
				label="Cancel"
				icon="pi pi-times"
				outlined
				onClick={hideCourierDialog}
			/>
			<Button
				label="Save"
				type="submit"
				icon="pi pi-check"
				// onClick={saveCourier}
			/>
		</div>
	);
	return (
		<>
			<Toast ref={toast} position="top-center" />
			<div className="card">
				<div className="flex flex-wrap justify-content-end">
					<Button onClick={() => editCourier(defaultValues)}>
						Add Courier
					</Button>
				</div>
				<DataTable
					ref={dt}
					id="list"
					header="Couriers"
					value={couriersList}
					selectionMode="single"
					dataKey="id"
					paginator
					removableSort
					rows={10}
					rowsPerPageOptions={[5, 10, 25]}
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Couriers">
					<Column
						selectionMode="single"
						exportable={false}
						style={{ width: '2rem' }}
					/>
					<Column field="name" header="Name" />
					<Column field="shippingModule" header="Shipping Module" />
					<Column field="cutoffTime" header="Cutoff time" />
					<Column
						body={actionBodyTemplate}
						exportable={false}
						style={{ minWidth: '12rem' }}
					/>
				</DataTable>
			</div>
			<Dialog
				visible={courierDialog}
				style={{ width: '50vw' }}
				breakpoints={{ '960px': '75vw', '641px': '90vw' }}
				header="Edit Brand Details"
				modal
				className="p-fluid"
				// footer={courierDialogFooter}
				onHide={hideCourierDialog}>
				<form onSubmit={handleSubmit(onSubmitUpdateCourier)}>
					{/* Name */}
					<div className="field col-12 ">
						<Controller
							name="name"
							control={control}
							rules={{
								required: 'Name is required.',
							}}
							render={({ field, fieldState }) => (
								<>
									<label
										htmlFor={field.name}
										className={classNames({
											'p-error': errors.name,
										})}></label>
									<span className="p-float-label">
										<InputText
											id={field.name}
											autoFocus={true}
											width={'100%'}
											value={field.value}
											className={classNames({
												'p-invalid': fieldState.error,
											})}
											onChange={(e) => field.onChange(e.target.value)}
										/>
										<label htmlFor={field.name}>Name</label>
									</span>
									{getFormErrorMessage(field.name)}
								</>
							)}
						/>
					</div>

					{/* Shipping module */}
					<div className="field col-12 ">
						<Controller
							name="shippingModule"
							control={control}
							rules={{
								required: 'Shipping Module is required is required.',
							}}
							render={({ field, fieldState }) => (
								<>
									<label
										htmlFor={field.name}
										className={classNames({
											'p-error': errors.shippingModule,
										})}></label>
									<span className="p-float-label">
										<InputText
											id={field.name}
											autoFocus={true}
											width={'100%'}
											value={field.value}
											className={classNames({
												'p-invalid': fieldState.error,
											})}
											onChange={(e) => field.onChange(e.target.value)}
										/>
										<label htmlFor={field.name}>Shipping Module</label>
									</span>
									{getFormErrorMessage(field.name)}
								</>
							)}
						/>
					</div>

					{/* Cut off time module */}
					<div className="field col-12 ">
						<Controller
							name="cutoffTime"
							control={control}
							rules={{
								required: 'Cut off time is required is required.',
							}}
							render={({ field, fieldState }) => (
								<>
									<label
										htmlFor={field.name}
										className={classNames({
											'p-error': errors.cutoffTime,
										})}></label>
									<span className="p-float-label">
										<InputText
											id={field.name}
											autoFocus={true}
											width={'100%'}
											value={field.value}
											className={classNames({
												'p-invalid': fieldState.error,
											})}
											onChange={(e) => field.onChange(e.target.value)}
										/>
										<label htmlFor={field.name}>Cut off time</label>
									</span>
									{getFormErrorMessage(field.name)}
								</>
							)}
						/>
					</div>
					{courierDialogFooter}
				</form>
			</Dialog>
		</>
	);
}
