'use client';

import { CUSTOMER, CUSTOMER_ORDER } from '@/interfaces/customerOrder.type';
import { formatCurrency } from '@/utils/helpers';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { ChevronDownIcon } from 'primereact/icons/chevrondown';
import { ChevronRightIcon } from 'primereact/icons/chevronright';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Card } from 'primereact/card';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';

export default function CustomerOrderView({
	orders,
}: {
	orders: CUSTOMER_ORDER[];
}) {
	const emptyCustomer: CUSTOMER = {
		title: '',
		firstName: '',
		lastName: '',
		street: '',
		street2: '',
		city: '',
		county: '',
		country: 0,
		postCode: '',
		telephone: '',
		orderRef: '',
		ioss: 0,
	};
	let emptyOrder: CUSTOMER_ORDER = {
		id: '',
		orderNumber: 0,
		orderStatus: 0,
		vendorNumber: 0,
		vendOrderNumber: '',
		oneTimeCustomer: true,
		goodsValue: 0,
		tax: 0,
		total: 0,
		deliveryCost: 0,
		vendGoodCost: 0,
		vendDelCost: 0,
		vendTotalPayable: 0,
		currencyCode: 'GBP',
		customer: emptyCustomer,
		products: undefined,
		stripeSession: '',
		confirmOrder: '',
		xtraderError: '',
		xtraderStatus: '',
		trackingRef: '',
	};
	interface OrderStatus {
		status: string;
		value: number;
	}
	const orderStatus: OrderStatus[] = [
		{ status: 'Created', value: 0 },
		{ status: 'Customer paid', value: 1 },
		{ status: 'Order emailed', value: 2 },
		{ status: 'Ordered from Xtrader', value: 3 },
		{ status: 'Paid Xtrader', value: 4 },
		{ status: 'Delivered', value: 5 },
	];

	const {
		control,
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm<CUSTOMER_ORDER>();

	const editOrder = (order: CUSTOMER_ORDER) => {
		//setCharge({ ...charge });

		setSelectedOrder(order);
		setOrderUpdateDialog(true);

		reset(order);
	};

	const toast = useRef<Toast>(null);
	const dt = useRef(null);
	const [selectedOrder, setSelectedOrder] =
		useState<CUSTOMER_ORDER>(emptyOrder);
	const [orderUpdateDialog, setOrderUpdateDialog] = useState<boolean>(false);

	const hideChargeUpdateDialog = () => {
		setOrderUpdateDialog(false);
	};
	const actionBodyTemplate = (rowData: CUSTOMER_ORDER) => {
		return (
			<>
				<Button
					icon="pi pi-pencil"
					className="p-button-rounded p-button-success mr-2"
					onClick={() => editOrder(rowData)}
				/>
			</>
		);
	};

	const statusTemplate = (rowData: CUSTOMER_ORDER): JSX.Element | undefined => {
		switch (rowData.orderStatus) {
			case 0:
				return <span className=" t ext-500"> Created</span>;
				break;
			case 1:
				return <span className="text-color"> Customer paid</span>;
				break;
			case 2:
				return <span className="text-color">Order emailed</span>;
				break;
			case 3:
				return <span className="text-color"> Paid Xtrader</span>;
				break;
			case 4:
				return <span className="text-color"> Paid Xtrader</span>;
				break;
			case 5:
				return <span className="text-color"> Delivered</span>;
				break;
		}

		if (rowData.orderStatus === 0) {
		} else if (rowData.orderStatus === 1) {
			return <span className="text-color"> Pending</span>;
		}
	};
	const orderTotalTemplate = (rowData: CUSTOMER_ORDER): string => {
		return formatCurrency(rowData.total);
	};

	const vendorPayableTemplate = (rowData: CUSTOMER_ORDER): string => {
		return formatCurrency(rowData.vendTotalPayable);
	};

	const oneTimeTemplate = (rowData: CUSTOMER_ORDER) => {
		if (rowData.oneTimeCustomer) {
			return (
				<i
					className="pi pi-check"
					style={{ fontSize: '1.5rem', color: 'green' }}
				/>
			);
		} else {
			return (
				<i
					className="pi pi-times"
					style={{ fontSize: '1.5rem', color: 'red' }}
				/>
			);
		}
	};

	const onSubmitOrder = async (order: CUSTOMER_ORDER) => {};

	const getFormErrorMessage = (name: string) => {
		return (
			errors[name as keyof CUSTOMER_ORDER] && (
				<small className="p-error">
					{errors[name as keyof CUSTOMER_ORDER]?.message}
				</small>
			)
		);
	};

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
	const selectedOrderStatusTemplate = (option: OrderStatus, props: any) => {
		if (option) {
			return (
				<div className="flex align-items-center">
					<div>{option.status}</div>
				</div>
			);
		}

		return <span>{props.placeholder}</span>;
	};

	const orderStatusOptionTemplate = (option: OrderStatus) => {
		return (
			<div className="flex align-items-center">
				<div className="mr-2">status:</div>
				<div>{option.status}</div>
			</div>
		);
	};
	return (
		<>
			<DataTable
				value={orders}
				dataKey="id"
				ref={dt}
				paginator
				stripedRows
				rows={10}
				sortMode="single"
				rowsPerPageOptions={[5, 10, 25]}
				paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
				currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Orders"
				sortField="orderNumber"
				sortOrder={1}>
				<Column
					field="orderNumber"
					header="Number"
					style={{ width: '1rem' }}
					sortable
				/>
				<Column
					field="orderStatus"
					header="Status"
					body={statusTemplate}
					style={{ width: '15rem' }}
					sortable
				/>
				{/* <Column
					field="stripeSession"
					header="Stripe Session"
					style={{ width: '8rem' }}
					sortable
				/> */}
				<Column
					field="confirmOrder"
					header="Supplier Order"
					style={{ width: '4rem' }}
					sortable
				/>
				<Column
					field="oneTimeCustomer"
					body={oneTimeTemplate}
					header="One time"
					style={{ width: '10px' }}
					sortable
				/>
				<Column
					field="total"
					header="Order Amount"
					body={orderTotalTemplate}
					style={{ width: '10px' }}
					sortable
				/>
				<Column
					field="vendTotalPayable"
					header="vendor payable"
					body={vendorPayableTemplate}
					style={{ width: '10px' }}
					sortable
				/>
				<Column field="trackingRef" header="Tracking ref" />

				<Column field="xtraderStatus" header="Xtrader status" />
				<Column field="xtraderError" header="Xtrader error" sortable />
				<Column
					body={actionBodyTemplate}
					exportable={false}
					style={{ minWidth: '8rem' }}
				/>
			</DataTable>

			<Dialog
				visible={orderUpdateDialog}
				style={{ width: '450px' }}
				header="Edit Delivery charge"
				modal
				className="p-fluid"
				onHide={hideChargeUpdateDialog}>
				<form onSubmit={handleSubmit(onSubmitOrder)} className="p-fluid">
					<div className="flex justify-content-center">
						<Card footer={updateDialogFooter}>
							{/* Order number field */}
							<div className="field">
								<Controller
									name="orderNumber"
									control={control}
									render={({ field, fieldState }) => (
										<>
											<label
												htmlFor={field.name}
												className={classNames({
													'p-error': errors.orderNumber,
												})}></label>
											<span className="p-float-label">
												<InputNumber
													id={field.name}
													value={field.value}
													inputRef={field.ref}
													onBlur={field.onBlur}
													onValueChange={(e) => field.onChange(e)}
													useGrouping={false}
													disabled={true}
													className={classNames({
														'p-invalid': fieldState.error,
													})}
												/>
												<label htmlFor={field.name}>Order Number</label>
											</span>
											{getFormErrorMessage(field.name)}
										</>
									)}
								/>
							</div>

							{/* Order status field */}
							<div className="field">
								<Controller
									name="orderStatus"
									control={control}
									render={({ field, fieldState }) => (
										<>
											<label
												htmlFor={field.name}
												className={classNames({
													'p-error': errors.orderNumber,
												})}></label>
											<span className="p-float-label">
												<Dropdown
													id={field.name}
													value={field.value}
													focusInputRef={field.ref}
													onBlur={field.onBlur}
													optionLabel="status"
													options={orderStatus}
													placeholder="Select the current status"
													onChange={(e) => field.onChange(e.value)}
													className={classNames({
														'p-invalid': fieldState.error,
													})}
													valueTemplate={selectedOrderStatusTemplate}
													itemTemplate={orderStatusOptionTemplate}
												/>
												{getFormErrorMessage(field.name)}
												<label htmlFor={field.name}>Order status</label>
											</span>
										</>
									)}
								/>
							</div>

							{/* Xtrader Order */}
							<div className="field">
								<Controller
									name="confirmOrder"
									control={control}
									render={({ field, fieldState }) => (
										<>
											<label
												htmlFor={field.name}
												className={classNames({
													'p-error': errors.confirmOrder,
												})}></label>
											<span className="p-float-label">
												<InputText
													id={field.name}
													value={field.value}
													onBlur={field.onBlur}
													onChange={(e) => field.onChange(e.target.value)}
													className={classNames({
														'p-invalid': fieldState.error,
													})}
												/>
												<label htmlFor={field.name}>Xtrader Order number</label>
											</span>
											{getFormErrorMessage(field.name)}
										</>
									)}
								/>
							</div>

							{/* Xtrader Tracking */}
							<div className="field">
								<Controller
									name="trackingRef"
									control={control}
									render={({ field, fieldState }) => (
										<>
											<label
												htmlFor={field.name}
												className={classNames({
													'p-error': errors.trackingRef,
												})}></label>
											<span className="p-float-label">
												<InputText
													id={field.name}
													value={field.value}
													onBlur={field.onBlur}
													onChange={(e) => field.onChange(e.target.value)}
													className={classNames({
														'p-invalid': fieldState.error,
													})}
												/>
												<label htmlFor={field.name}>Xtrader Tracking ref</label>
											</span>
											{getFormErrorMessage(field.name)}
										</>
									)}
								/>
							</div>

							{/* Xtrader Status */}
							<div className="field">
								<Controller
									name="xtraderStatus"
									control={control}
									render={({ field, fieldState }) => (
										<>
											<label
												htmlFor={field.name}
												className={classNames({
													'p-error': errors.xtraderStatus,
												})}></label>
											<span className="p-float-label">
												<InputText
													id={field.name}
													value={field.value}
													onBlur={field.onBlur}
													onChange={(e) => field.onChange(e.target.value)}
													className={classNames({
														'p-invalid': fieldState.error,
													})}
												/>
												<label htmlFor={field.name}>Xtrader status</label>
											</span>
											{getFormErrorMessage(field.name)}
										</>
									)}
								/>
							</div>

							{/* xtraderError */}
							<div className="field">
								<Controller
									name="xtraderError"
									control={control}
									render={({ field, fieldState }) => (
										<>
											<label
												htmlFor={field.name}
												className={classNames({
													'p-error': errors.xtraderError,
												})}></label>
											<span className="p-float-label">
												<InputText
													id={field.name}
													value={field.value}
													onBlur={field.onBlur}
													onChange={(e) => field.onChange(e.target.value)}
													className={classNames({
														'p-invalid': fieldState.error,
													})}
												/>
												<label htmlFor={field.name}>Xtrader Error</label>
											</span>
											{getFormErrorMessage(field.name)}
										</>
									)}
								/>
							</div>
						</Card>
					</div>
				</form>
			</Dialog>
		</>
	);
}
