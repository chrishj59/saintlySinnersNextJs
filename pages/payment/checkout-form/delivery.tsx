import axios from 'axios';
import { useBasket } from 'components/ui/context/BasketContext';
import { COUNTRY, DELIVERY_CHARGE_TYPE } from 'interfaces/delivery-charge.type';
import { DELIVERY_INFO_TYPE } from 'interfaces/delivery-info.type';
import { isEqual } from 'lodash';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactNode from 'react';
import { Controller, useForm } from 'react-hook-form';

import CheckoutForm from '.';
import { InputNumber } from 'primereact/inputnumber';

// type Props = {
// 	children: React.ReactNode;
// 	props: React.ReactNode;
//};

const DeliveryForm = ({
	countries,
	charges,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
	const cart = useBasket();
	const router = useRouter();
	const [shippers, SetShippers] = useState<DELIVERY_CHARGE_TYPE[]>([]);
	const [selectedShipper, setSelectedShipper] = useState<string>();
	const [countryEntered, setCountryEntered] = useState<number>();
	const [delCharge, setDelCharge] = useState<number>(0);
	const [step, setStep] = useState<number>(cart.checkoutStep);
	const defaultValues: DELIVERY_INFO_TYPE = {
		name: '',
		email: '',
		phone: '',
		house_number_input: '',
		house_number: 0,
		street: '',
		street2: '',
		town: '',
		county: '',
		postCode: '',
		country: '',

		deliveryCharge: 0,

		shipper: undefined,
	};
	const {
		control,
		register,
		formState: { errors },
		handleSubmit,
		reset,
		setValue,
	} = useForm<DELIVERY_INFO_TYPE>({ defaultValues });

	const onDeliverySubmit = async (formData: DELIVERY_INFO_TYPE) => {
		console.warn(`Formdata ${JSON.stringify(formData, null, 2)}`);
		const _deliveryInfo: DELIVERY_INFO_TYPE = {
			name: formData.name,
			email: formData.email,
			phone: formData.phone,
			house_number_input: formData.house_number_input,
			house_number: parseInt(formData.house_number_input),
			street: formData.street,
			street2: formData.street2,
			town: formData.town,
			county: formData.county,
			postCode: formData.postCode,
			country: formData.country,

			deliveryCharge: delCharge,
			shipper: formData.shipper,
		};

		if (formData.shipper) {
			if (formData.shipper.amount) {
				cart.delivery = parseFloat(formData.shipper.amount);
			}
		}

		cart.addDeliveryInfo(_deliveryInfo);

		router.push('/payment/checkout-form/payment');
	};

	const footer = (
		<span>
			<Button label="Save" icon="pi pi-check" />
			<Button
				label="Cancel"
				icon="pi pi-times"
				className="p-button-secondary ml-2"
			/>
		</span>
	);

	const shippingOptionTemplate = (option: any) => {
		return (
			<div className="shipping-item">
				<div>
					{option.courierName} €{option.amount}{' '}
				</div>
			</div>
		);
	};

	const handleCountryChange = (e: { value: number }) => {
		const id: number = e.value;
		setCountryEntered(id);

		const items = cart.items;

		const weight =
			items.reduce((accum, current) => {
				return accum + current.item.weight;
			}, 0) / 1000;

		const _shippers: DELIVERY_CHARGE_TYPE[] = charges.filter(
			(c: DELIVERY_CHARGE_TYPE) => {
				const minWeight: number = c.minWeight || 0;
				const maxWeight: number = c.maxWeight || 0;
				if (c.country?.id === id && weight > minWeight && weight < maxWeight) {
					return c;
				}
			}
		);

		SetShippers(_shippers);
	};

	const selectedShipperTemplate = (option: any) => {
		if (option) {
			return (
				<div className="shipping-item">
					<div>
						{option.courierName} €{option.amount}{' '}
					</div>
				</div>
			);
		} else {
			return <span>{'Please select a shipper'}</span>;
		}
	};

	const handleShipperChange = (e: { value: string }) => {
		const shipperId = e.value;
		// alert(`Shipper id ${shipperId}`);
		const _shipper = shippers.find((s) => s.id === shipperId);
		if (_shipper) {
			setValue('shipper', _shipper);
			setSelectedShipper(shipperId);
			if (_shipper.amount) {
				setDelCharge(parseFloat(_shipper.amount));
			}
		}
	};

	const handlePaymentButtonClick = () => {
		router.push('/payment/checkout-form/payment');
		//setStep(2);
	};
	return (
		<CheckoutForm>
			<form onSubmit={handleSubmit(onDeliverySubmit)}>
				<div className="flex justify-content-center p-fluid  ">
					<Card style={{ width: '50%' }} title="Contact Information">
						{/* Name */}
						<div className="field">
							<span className="p-float-label">
								<Controller
									name="name"
									control={control}
									rules={{
										required: 'Name is required.',
									}}
									render={({ field, fieldState }) => (
										<InputText
											id={field.name}
											{...field}
											autoFocus
											width={'100%'}
											className={classNames({
												'p-invalid': fieldState.error,
											})}
										/>
									)}
								/>
								<label
									htmlFor="name"
									className={classNames({ 'p-error': errors.name })}>
									Name
								</label>
							</span>
							{errors?.name && (
								<p style={{ color: 'red', fontWeight: 'normal' }}>
									{errors.name.message}
								</p>
							)}
						</div>
						{/* Email address */}
						<div className="field">
							<span className="p-float-label">
								<Controller
									name="email"
									control={control}
									rules={{
										required: 'Email is required.',
										pattern: {
											value:
												// /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
												/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
											message: 'Please correct the invalid email address ',
										},
									}}
									render={({ field, fieldState }) => (
										<InputText
											id={field.name}
											{...field}
											// autoFocus
											width={'100%'}
											className={classNames({
												'p-invalid': fieldState.error,
											})}
										/>
									)}
								/>
								<label
									htmlFor="email"
									className={classNames({ 'p-error': errors.email })}>
									Email
								</label>
							</span>
							{errors?.email && (
								<p style={{ color: 'red', fontWeight: 'normal' }}>
									{errors.email.message}
								</p>
							)}
						</div>

						{/* Phone number field */}
						<div className="field">
							<span className="p-float-label mt-5">
								<Controller
									name="phone"
									control={control}
									rules={{ required: 'Phone number is required.' }}
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
									htmlFor="phone"
									className={classNames({ 'p-error': errors.phone })}>
									Telephone
								</label>
							</span>
							{errors?.phone && (
								<p style={{ color: 'red', fontWeight: 'normal' }}>
									{errors.phone.message}
								</p>
							)}
						</div>

						<span className="text-900 text-2xl block font-medium mb-5">
							Address
						</span>

						{/* Country */}
						<div className="field ">
							<span className="p-float-label mt-5">
								<Controller
									name="country"
									control={control}
									rules={
										{
											// required: 'Type  required.',
											// pattern: {
											// 	value: /^[BCT]/,
											// 	message: 'Only category type B C T are allowed',
											// },
											// maxLength: {
											// 	value: 1,
											// 	message: 'Only 1 character allopwed',
											// },
										}
									}
									render={({ field, fieldState }) => (
										<Dropdown
											id={field.name}
											{...field}
											onChange={handleCountryChange}
											value={countryEntered}
											optionValue="id"
											optionLabel="name"
											options={countries}
											className={classNames({
												'p-invalid': fieldState.error,
											})}
										/>
									)}
								/>

								<label
									htmlFor="country"
									className={classNames({ 'p-error': errors.country })}>
									Country
								</label>
							</span>
							{errors?.country && (
								<p style={{ color: 'red', fontWeight: 'normal' }}>
									{errors.country.message}
								</p>
							)}
							{/* {getFormErrorMessage('country')} */}
						</div>

						{/* Street line */}
						<div className="formgrid grid">
							{/* House number field */}

							<div className="field col-2">
								<span className="p-float-label mt-5">
									<Controller
										name="house_number_input"
										control={control}
										rules={{ required: 'House number is required.' }}
										render={({ field, fieldState }) => (
											<InputText
												id={field.name}
												keyfilter={'int'}
												{...field}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
											/>
										)}
									/>
									<label
										htmlFor="house_number"
										className={classNames({ 'p-error': errors.street })}>
										Number
									</label>
								</span>
								{errors?.street && (
									<p style={{ color: 'red', fontWeight: 'normal' }}>
										{errors.street.message}
									</p>
								)}
							</div>

							{/* Street field */}

							<div className="field col-10">
								<span className="p-float-label mt-5">
									<Controller
										name="street"
										control={control}
										rules={{ required: 'Street is required.' }}
										render={({ field, fieldState }) => (
											<InputText
												id={field.name}
												{...field}
												width={'80%'}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
											/>
										)}
									/>
									<label
										htmlFor="street"
										className={classNames({ 'p-error': errors.street })}>
										Street name
									</label>
								</span>
								{errors?.street && (
									<p style={{ color: 'red', fontWeight: 'normal' }}>
										{errors.street.message}
									</p>
								)}
							</div>
						</div>
						{/* Town field */}
						<div className="field">
							<span className="p-float-label mt-5">
								<Controller
									name="town"
									control={control}
									rules={{ required: 'Town is required.' }}
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
									htmlFor="town"
									className={classNames({ 'p-error': errors.town })}>
									Town
								</label>
							</span>
							{errors?.town && (
								<p style={{ color: 'red', fontWeight: 'normal' }}>
									{errors.town.message}
								</p>
							)}
						</div>

						{/* County field */}
						<div className="field">
							<span className="p-float-label mt-5">
								<Controller
									name="county"
									control={control}
									// rules={{ required: 'Tile is required.' }}
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
									htmlFor="county"
									className={classNames({ 'p-error': errors.county })}>
									County
								</label>
							</span>
							{errors?.county && (
								<p style={{ color: 'red', fontWeight: 'normal' }}>
									{errors.county.message}
								</p>
							)}
						</div>

						{/* Post Code field */}
						<div className="field">
							<span className="p-float-label mt-5">
								<Controller
									name="postCode"
									control={control}
									rules={{ required: 'Post Code / ZIP is required.' }}
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
									htmlFor="postCode"
									className={classNames({ 'p-error': errors.postCode })}>
									Post Code
								</label>
							</span>
							{errors?.postCode && (
								<p style={{ color: 'red', fontWeight: 'normal' }}>
									{errors.postCode.message}
								</p>
							)}
						</div>

						<span className="text-900 text-2xl block font-medium mb-5">
							Shipping
						</span>

						{/* Shipping */}
						{/* Dropdown value={selectedCountry} options={countries} onChange={onCountryChange} optionLabel="name" filter showClear filterBy="name" placeholder="Select a Country"
                    valueTemplate={selectedCountryTemplate} itemTemplate={countryOptionTemplate} /> */}

						<div className="field ">
							<span className="p-float-label mt-2">
								<Controller
									name="shipper"
									control={control}
									rules={{
										required: 'Type  required.',
									}}
									render={({ field, fieldState }) => (
										<Dropdown
											id={field.name}
											{...field}
											disabled={shippers.length < 1}
											value={selectedShipper}
											valueTemplate={selectedShipperTemplate}
											onChange={handleShipperChange}
											itemTemplate={shippingOptionTemplate}
											options={shippers}
											optionValue="id"
											optionLabel="courierName"
											placeholder="Select a shipper"
											className={classNames({
												'p-invalid': fieldState.error,
											})}
										/>
									)}
								/>

								<label
									htmlFor="shipper"
									className={classNames({ 'p-error': errors.shipper })}>
									Shipper
								</label>
							</span>
							{errors?.shipper && (
								<p style={{ color: 'red', fontWeight: 'normal' }}>
									{errors.shipper.message}
								</p>
							)}
							{/* {getFormErrorMessage('country')} */}
						</div>
					</Card>
				</div>
				{/* <div className="flex flex-row flex-wrap justify-content-between  "> */}
				{/* <div className="flex flex-wrap  mt-5">
						<Button type="submit" onClick={handleCartButtonClick}>
							Back to Cart
						</Button>
					</div> */}

				<div className="flex flex-wrap  justify-content-end mt-5">
					<Button
						type="submit"
						// onClick={handlePaymentButtonClick}
						disabled={
							selectedShipper === undefined || selectedShipper.length === 0
						}>
						Continue to Payment
					</Button>
				</div>
				{/* </div> */}
			</form>

			{/* <div className="flex align-items-center py-5 px-3">
				<i className="pi pi-fw pi-money-bill mr-2 text-2xl" />
				<p className="m-0 text-lg">
					Delivery Component Content via Child Route
				</p>
			</div> */}
		</CheckoutForm>
	);
};

function uniqForObject<T>(array: T[]): T[] {
	const result: T[] = [];
	for (const item of array) {
		const found = result.some((value) => isEqual(value, item));
		if (!found) {
			result.push(item);
		}
	}
	return result;
}
export const getStaticProps: GetStaticProps = async (context) => {
	//let brands: BrandTy[] = [];
	let charges: DELIVERY_CHARGE_TYPE[] | null[] = [];
	let countrySet = new Set<COUNTRY>();
	let countries: COUNTRY[] = [];
	try {
		const { data } = await axios.get<DELIVERY_CHARGE_TYPE[]>(
			process.env.EDC_API_BASEURL + `/deliveryCharge`
		);
		const _charges = data;
		const allCountries: COUNTRY[] = [];
		_charges.map((e: DELIVERY_CHARGE_TYPE) => {
			if (e.country) {
				allCountries.push(e.country);
			}
		});
		countries = uniqForObject<COUNTRY>(allCountries);
		//Add courier name to charge

		charges = _charges.map((c: DELIVERY_CHARGE_TYPE) => {
			c.courierName = c.courier?.name;
			return c;
		});
	} catch (e) {
		console.error('Could not find brands');
		console.error(e);
	}
	countrySet.forEach((c) => {
		countries.push(c);
	});

	return {
		props: { charges, countries },
		revalidate: false,
	};
};
export default DeliveryForm;
