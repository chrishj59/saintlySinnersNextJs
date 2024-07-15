'use client';
import { COUNTRY_TYPE } from '@/interfaces/country.type';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Toast } from 'primereact/toast';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from 'primereact/inputswitch';
import { useSession } from 'next-auth/react';

type COUNTRY_TY = {
	id: number;
	name: string;
	edcCountryCode: number;
	deliveryActive: boolean;
};

export default function CountryMaintence({
	countries,
}: {
	countries: COUNTRY_TYPE[];
}) {
	const session = useSession();
	const adminUser = adminUser === 'cly5hach00000ch5e4mz3h8tt' ? true : false;
	if (adminUser) {
		throw new Error('Not authorised');
	}
	const emptyCountry = {
		id: 0,
		name: '',
		edcCountryCode: 0,
		deliveryActive: false,
	};

	const toast = useRef<Toast | null>(null);
	const [countryList, setCountryList] = useState<COUNTRY_TYPE[]>(countries);
	const [country, setCountry] = useState<COUNTRY_TY>(emptyCountry);
	const [countryDialog, setCountryDialog] = useState<boolean>(false);

	const {
		control,
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm<COUNTRY_TY>();
	const dt = useRef<DataTable<COUNTRY_TYPE[]>>(null);

	const editCountry = (country: COUNTRY_TYPE) => {
		const _country = {
			id: country.id,
			name: country.name,
			edcCountryCode: country.edcCountryCode ? country.edcCountryCode : 0,
			deliveryActive: country.deliveryActive,
		};
		setCountry(_country);
		setCountryDialog(true);
		reset(country);
	};

	const actionBodyTemplate = (rowData: COUNTRY_TYPE) => {
		return (
			<>
				<Button
					icon="pi pi-pencil"
					className="p-button-rounded p-button-success mr-2"
					onClick={() => editCountry(rowData)}
				/>
			</>
		);
	};

	const hideCountryDialog = () => {
		setCountryDialog(false);
	};

	// 	const getFormErrorMessage = (name:string) => {
	// 		return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
	// };

	const onSubmit = async (country: COUNTRY_TY) => {
		try {
			const url = `/api/admin/country`;
			console.log(`update country body ${JSON.stringify(country, null, 2)}`);
			const countryResp = await fetch(url, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				cache: 'no-store',
				body: JSON.stringify(country),
			});

			if (!countryResp.ok) {
				// issue saving country
				toast.current?.show({
					severity: 'error',
					summary: 'Could not update category',
					detail: `Could not update category ${countryResp.statusText} `,
					life: 3000,
				});
				return;
			}

			const updated = (await countryResp.json()) as number;
			console.log(`updated from api ${updated}`);
			const _countryList = countryList.map((c) => {
				if (c.id === country.id) {
					c.edcCountryCode = country.edcCountryCode;
					c.deliveryActive = country.deliveryActive;
				}
				return c;
			});
			setCountryList(_countryList);
			if (updated === 1) {
				toast.current?.show({
					severity: 'success',
					summary: 'Updated Country',
					detail: `Saved ${updated} Countries `,
					life: 3000,
				});
			}
			hideCountryDialog();

			reset();
		} catch (error) {
			if (error instanceof SyntaxError) {
				// Unexpected token < in JSON
				console.warn('There was a SyntaxError', error);
			} else {
				console.error('Could not update country');
				console.error(error);
			}
		}
	};

	return (
		<div className="p-3">
			<Toast ref={toast} position="top-center" />
			<h5>Countries </h5>
			<DataTable
				value={countryList}
				responsiveLayout="stack"
				filterDisplay="row">
				<Column
					field="name"
					header="Name"
					sortable
					style={{ width: '25rem' }}
					filter
					filterPlaceholder="Search by name"
				/>
				<Column
					field="edcCountryCode"
					header="EDC Country Code"
					sortable
					filter
					filterPlaceholder="Search by EDC coountry code"
					style={{ width: '15rem', textAlign: 'right' }}
				/>
				<Column
					field="deliveryActive"
					header="Delivery Country"
					sortable
					filter
					style={{ width: '15rem', textAlign: 'right' }}
				/>
				<Column
					body={actionBodyTemplate}
					exportable={false}
					style={{ minWidth: '1rem' }}></Column>
			</DataTable>

			<Dialog
				visible={countryDialog}
				style={{ width: '450px' }}
				header="Update Country"
				modal
				className="p-fluid"
				onHide={hideCountryDialog}>
				<form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
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
											disabled={true}
											className={classNames({
												'p-invalid': fieldState.error,
											})}
										/>
									)}
								/>
								<label
									htmlFor="name"
									className={classNames({ 'p-error': errors.name })}>
									Country
								</label>
							</span>
							{/* {getFormErrorMessage('name')} */}
						</div>

						{/* EDC country code Field */}
						<div className="field">
							<span className="p-float-label mb-5">
								<Controller
									name="edcCountryCode"
									control={control}
									rules={{
										required: 'EDC country code is required',

										validate: (value) =>
											(value >= 0 && value <= 50) ||
											'Enter a valid EDC country code.',
									}}
									render={({ field, fieldState }) => (
										<InputNumber
											id={field.name}
											inputRef={field.ref}
											value={field.value}
											onBlur={field.onBlur}
											onValueChange={(e) => field.onChange(e)}
											useGrouping={false}
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
									EDC country code
								</label>
							</span>
							{/* {getFormErrorMessage('name')} */}
						</div>

						{/* Delivery Field */}
						<div className="field">
							<label
								htmlFor="name"
								className={classNames({ 'p-error': errors.name })}>
								Delivery active
							</label>
							<span className="p-float-label mb-5">
								<Controller
									name="deliveryActive"
									control={control}
									// rules={{
									// 	required: 'EDC country code is required',

									// 	// validate: (value) =>
									// 	// 	(value >= 0 && value <= 50) ||
									// 	// 	'Enter a valid EDC country code.',
									// }}
									render={({ field, fieldState }) => (
										// <InputNumber
										// 	id={field.name}
										// 	inputRef={field.ref}
										// 	value={field.value}
										// 	onBlur={field.onBlur}
										// 	onValueChange={(e) => field.onChange(e)}
										// 	useGrouping={false}
										// 	autoFocus
										// 	className={classNames({
										// 		'p-invalid': fieldState.error,
										// 	})}
										// />
										<InputSwitch
											inputId={field.name}
											checked={field.value}
											inputRef={field.ref}
											className={classNames({ 'p-invalid': fieldState.error })}
											onChange={(e) => field.onChange(e.value)}
										/>
									)}
								/>
							</span>

							{/* {getFormErrorMessage('name')} */}
						</div>

						<div className="flex flex-row">
							<Button
								label="Cancel"
								icon="pi pi-times"
								className="p-button-text"
								onClick={hideCountryDialog}
							/>
							<Button
								label="Save"
								type="submit"
								icon="pi pi-check"
								className="p-button-text"
							/>
						</div>
					</div>
				</form>
			</Dialog>
		</div>
	);
}
