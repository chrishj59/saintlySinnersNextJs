'use client';
import { USER_ADDRESS_TYPE } from '@/interfaces/userAddress.type';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { RadioButton } from 'primereact/radiobutton';
import { USER_CONTACT_TYPE } from '@/interfaces/user-details.type';

export default function AddressBookUI({
	addresses,
	userId,
}: {
	addresses: USER_ADDRESS_TYPE[];
	userId: string;
}) {
	const toast = useRef<Toast>(null);
	const [addressList, setAddressList] =
		useState<USER_ADDRESS_TYPE[]>(addresses);
	const [newAddressDlgVisible, setNewAddressDlgVisible] =
		useState<boolean>(false);

	const defaultValues: USER_ADDRESS_TYPE = {
		addressName: '',
		firstName: '',
		lastName: '',
		default: false,
		street: '',
		street2: '',
		town: '',
		postCode: '',
		county: '',
		email: '',
	};

	const {
		control,
		register,
		formState: { errors },
		handleSubmit,
		reset,
		setValue,
		getValues,
	} = useForm<USER_ADDRESS_TYPE>({ defaultValues });
	const defaultBodyTemplate = (address: USER_ADDRESS_TYPE) => {
		// if (address.default) {
		// return <span className="pi pi-check style={{ color: 'green'}}" />;
		return <RadioButton checked={address.default} />;
		// }
	};

	const getFormErrorMessage = (name: string) => {
		return (
			errors[name as keyof USER_ADDRESS_TYPE] && (
				<small className="p-error">
					{errors[name as keyof USER_ADDRESS_TYPE]?.message}
				</small>
			)
		);
	};

	const onSubmitUpdate = async (address: USER_ADDRESS_TYPE) => {
		const url = `/api/user/address/${userId}`;
		const apiResp = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(address),
		});

		if (!apiResp.ok) {
			toast.current?.show({
				severity: 'error',
				summary: 'Could not add address',
				detail: `Please check you have not used the same address name.  ${apiResp.statusText}`,
				life: 3000,
			});
		} else {
			const newAddress = (await apiResp.json()) as USER_ADDRESS_TYPE;
			let _addressList: USER_ADDRESS_TYPE[] = addressList;
			if (newAddress.default) {
				_addressList = _addressList.map((addr) => {
					if (addr.default) {
						addr.default = false;
					}

					return addr;
				});
			}
			_addressList.push(newAddress);
			setAddressList(_addressList);
			toast.current?.show({
				severity: 'success',
				summary: 'Added address',
				detail: `Your new address has been added`,
				life: 3000,
			});
			setNewAddressDlgVisible(false);
		}
	};

	const onHideAddressDlg = (): undefined => {
		setNewAddressDlgVisible(!newAddressDlgVisible);
		// return !newAddressDlgVisible;
	};

	const onRowEditComplete = async (e: DataTableRowEditCompleteEvent) => {
		let _addressList = [...addressList];
		let { newData, index } = e;

		if (newData.default) {
			_addressList = _addressList.map((addr) => {
				if (addr.default) {
					addr.default = false;
				}
				return addr;
			});
		}
		const url = `/api/user/address/${userId}`;
		const addrResp = await fetch(url, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newData),
		});

		if (!addrResp.ok) {
			toast.current?.show({
				severity: 'error',
				summary: 'Could not Update address',
				detail: `Please check you have not used the same address name.  ${addrResp.statusText}`,
				life: 3000,
			});
		} else {
			_addressList[index] = newData as USER_ADDRESS_TYPE;

			setAddressList(_addressList);
			toast.current?.show({
				severity: 'success',
				summary: 'Updated address',
				detail: `Address ${newData.addressName} has been updated`,
				life: 3000,
			});
		}
	};

	const allowEdit = (rowData: USER_ADDRESS_TYPE) => {
		return true;
	};
	const textEditor = (options: ColumnEditorOptions) => {
		return (
			<InputText
				type="text"
				value={options.value}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					options.editorCallback!(e.target.value)
				}
			/>
		);
	};
	const booleanEditor = (options: ColumnEditorOptions) => {
		return (
			<InputSwitch
				type="text"
				checked={options.value}
				onChange={(e: InputSwitchChangeEvent) =>
					options.editorCallback!(e.target.value)
				}
			/>
		);
	};
	return (
		<>
			<Toast ref={toast} position="top-center" />
			<Card>
				<div className="flex flex-wrap justify-content-end">
					<Button onClick={() => onHideAddressDlg()}>Add Address</Button>
				</div>
				<DataTable
					header="My address book"
					scrollable
					scrollHeight="flex"
					editMode="row"
					dataKey="id"
					onRowEditComplete={onRowEditComplete}
					value={addressList}
					emptyMessage="No addresses saved"
					pt={{
						header: {
							className: ' text-center text-purple-500',
						},
					}}>
					<Column
						field="addressName"
						header="Address name"
						editor={(options) => textEditor(options)}
					/>
					<Column
						field="default"
						header="Default"
						editor={(options) => booleanEditor(options)}
						body={defaultBodyTemplate}
					/>
					<Column
						field="firstName"
						header="First name"
						editor={(options) => textEditor(options)}
					/>
					<Column
						field="lastName"
						header="Last Name"
						editor={(options) => textEditor(options)}
					/>
					<Column
						field="street"
						header="Street"
						editor={(options) => textEditor(options)}
					/>
					<Column
						field="street2"
						header="Street add'n"
						editor={(options) => textEditor(options)}
					/>
					<Column
						field="town"
						header="Town"
						editor={(options) => textEditor(options)}
					/>
					<Column
						field="county"
						header="County"
						editor={(options) => textEditor(options)}
					/>
					<Column
						field="postCode"
						header="Post Code"
						editor={(options) => textEditor(options)}
					/>
					<Column
						rowEditor={allowEdit}
						headerStyle={{ width: '10%', minWidth: '8rem' }}
						bodyStyle={{ textAlign: 'center' }}
					/>
				</DataTable>
			</Card>

			<Dialog
				onHide={onHideAddressDlg}
				visible={newAddressDlgVisible}
				style={{ width: '50vw' }}
				header="Address"
				pt={{
					header: {
						className: ' text-center text-purple-500',
					},
				}}>
				<form onSubmit={handleSubmit(onSubmitUpdate)}>
					<div className="formgrid grid">
						{/* Address Name */}
						<div className="field col-12 w-full">
							<Controller
								name="addressName"
								control={control}
								rules={{
									required: 'Address name is required.',
								}}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.addressName,
											})}></label>
										<span className="p-float-label">
											<InputText
												id={field.name}
												autoFocus={true}
												width={'100%'}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e) => field.onChange(e.target.value)}
											/>
											<label htmlFor={field.name}>Address Name</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>

						{/* Fist and Last named row */}
						<div className="field col-12 md:col-6">
							<Controller
								name="firstName"
								control={control}
								// rules={{
								// 	required: 'Name is required.',
								// }}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.firstName,
											})}></label>
										<span className="p-float-label">
											<InputText
												id={field.name}
												width={'100%'}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e) => field.onChange(e.target.value)}
											/>
											<label htmlFor={field.name}>First Name</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>
						<div className="field col-12 md:col-6">
							<Controller
								name="lastName"
								control={control}
								// rules={{
								// 	required: 'Last Name is required.',
								// }}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.lastName,
											})}></label>
										<span className="p-float-label">
											<InputText
												id={field.name}
												width={'100%'}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e) => field.onChange(e.target.value)}
											/>
											<label htmlFor={field.name}>Last Name</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>

						{/* Street row */}
						<div className="field col-12 md:col-6">
							<Controller
								name="street"
								control={control}
								// rules={{
								// 	required: 'LName is required.',
								// }}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.street,
											})}></label>
										<span className="p-float-label">
											<InputText
												id={field.name}
												width={'100%'}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e) => field.onChange(e.target.value)}
											/>
											<label htmlFor={field.name}>Street</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>
						<div className="field col-12 md:col-6">
							<Controller
								name="street2"
								control={control}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.street2,
											})}></label>
										<span className="p-float-label">
											<InputText
												id={field.name}
												width={'100%'}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e) => field.onChange(e.target.value)}
											/>
											<label htmlFor={field.name}>Street additional</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>

						{/* Town and County row */}
						<div className="field col-12 md:col-6">
							<Controller
								name="town"
								control={control}
								// rules={{
								// 	required: 'LName is required.',
								// }}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.town,
											})}></label>
										<span className="p-float-label">
											<InputText
												id={field.name}
												width={'100%'}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e) => field.onChange(e.target.value)}
											/>
											<label htmlFor={field.name}>Town</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>
						<div className="field col-12 md:col-6">
							<Controller
								name="county"
								control={control}
								// rules={{
								// 	required: 'LName is required.',
								// }}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.county,
											})}></label>
										<span className="p-float-label">
											<InputText
												id={field.name}
												width={'100%'}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e) => field.onChange(e.target.value)}
											/>
											<label htmlFor={field.name}>County</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>

						{/* Post Code field */}
						<div className="field col-12 ">
							<Controller
								name="postCode"
								control={control}
								// rules={{
								// 	required: 'LName is required.',
								// }}
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
												width={'100%'}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e) => field.onChange(e.target.value)}
											/>
											<label htmlFor={field.name}>Post Code</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>

						{/* Default adddress field */}
						<div className="field col-12 ">
							<Controller
								name="default"
								control={control}
								// rules={{
								// 	required: 'LName is required.',
								// }}
								render={({ field, fieldState }) => (
									<>
										{/* <label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.postCode,
											})}></label> */}
										<label htmlFor={field.name}>Default address</label>
										<span className="p-float-label">
											<InputSwitch
												id={field.name}
												width={'100%'}
												checked={field.value}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e) => field.onChange(e.target.value)}
											/>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>
					</div>
					<div>
						<div className="flex justify-content-center flex-wrap">
							<div className="flex align-items-center justify-content-center">
								<Button type="submit">Save</Button>
							</div>
							<div className="flex align-items-center justify-content-center ml-4">
								<Button type="submit" severity="secondary">
									Close
								</Button>
							</div>
						</div>
					</div>
				</form>
			</Dialog>
		</>
	);
}
