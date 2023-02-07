import axios from 'axios';
import { useBasket } from 'components/ui/context/BasketContext';
import { COUNTRY, DELIVERY_CHARGE_TYPE } from 'interfaces/delivery-charge.type';
import { DELIVERY_INFO_TYPE } from 'interfaces/delivery-info.type';
import { isEqual } from 'lodash';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactNode from 'react';
import { Controller, useForm } from 'react-hook-form';

import CheckoutForm from '.';

// type Props = {
// 	children: React.ReactNode;
// 	props: React.ReactNode;
//};

const DeliveryForm = ({
	countries,
	charges,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
	const cart = useBasket();
	const [shippers, SetShippers] = useState<DELIVERY_CHARGE_TYPE[]>([]);
	const [selectedShipper, setSelectedShipper] = useState<string>();
	const [country, setCountry] = useState<number>();

	console.log('delivery form countries');
	console.log(countries.length);
	console.log(charges[0]);

	const {
		control,
		register,
		formState: { errors },
		handleSubmit,
		reset,
		setValue,
	} = useForm<DELIVERY_INFO_TYPE>();

	const onDeliverySubmit = async (brand: any) => {};

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
		setCountry(id);

		const items = cart.items;
		console.log('items');
		const weight =
			items.reduce((accum, current) => {
				return accum + current.item.weight;
			}, 0) / 1000;

		const _shippers = charges.filter((c: DELIVERY_CHARGE_TYPE) => {
			if (c.country.id === id && weight > c.minWeight && weight < c.maxWeight) {
				return c;
			}
		});

		SetShippers(_shippers);
	};

	const selectedShipperTemplate = (option: any) => {
		console.log(
			`selectedShipperTemplate called with ${JSON.stringify(option)}`
		);
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
		console.log('handleShipperChange called');
		const shipperId = e.value;
		alert(`Shipper id ${shipperId}`);
		const _shipper = shippers.find((s) => s.id === shipperId);
		if (_shipper) {
			setValue('shipper', _shipper);
			setSelectedShipper(shipperId);
		}
	};
	return (
		<CheckoutForm>
			<div className="flex align-items-center py-5 px-3">
				<div className="surface-card border-1 surface-border border-round">
					<form>
						<Card footer={footer}>
							<div className="grid formgrid">
								<div className="col-12 field mb-6">
									<span className="text-900 text-2xl block font-medium mb-5">
										Contact Information
									</span>

									{/* Email field */}
									<div className="field">
										<span className="p-float-label mt-5">
											<Controller
												name="email"
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
												htmlFor="email"
												className={classNames({ 'p-error': errors.email })}>
												Email
											</label>
										</span>
									</div>

									{/* Phone number field */}
									<div className="field">
										<span className="p-float-label mt-5">
											<Controller
												name="phone"
												control={control}
												rules={{ required: 'Tile is required.' }}
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
												Phone
											</label>
										</span>
									</div>
									{/* <input
										id="email"
										placeholder="Email"
										className="p-inputtext w-full mb-4"
									/> */}
									{/* <div className="field-checkbox">
										<Checkbox
											name="checkbox-1"
											// onChange={(e) => setChecked(e.checked)}
											// checked={checked}
											inputId="checkbox-1"></Checkbox>
										<label htmlFor="checkbox-1">
											Email me with news and offers
										</label>
									</div> */}
									<span className="text-900 text-2xl block font-medium mb-5">
										Address
									</span>

									{/* Street field */}
									<div className="field">
										<span className="p-float-label mt-5">
											<Controller
												name="street"
												control={control}
												rules={{ required: 'Tile is required.' }}
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
												htmlFor="street"
												className={classNames({ 'p-error': errors.street })}>
												Street
											</label>
										</span>
									</div>

									{/* Town field */}
									<div className="field">
										<span className="p-float-label mt-5">
											<Controller
												name="town"
												control={control}
												rules={{ required: 'Tile is required.' }}
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
									</div>

									{/* County field */}
									<div className="field">
										<span className="p-float-label mt-5">
											<Controller
												name="county"
												control={control}
												rules={{ required: 'Tile is required.' }}
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
									</div>

									{/* Post Code field */}
									<div className="field">
										<span className="p-float-label mt-5">
											<Controller
												name="postCode"
												control={control}
												rules={{ required: 'Tile is required.' }}
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
									</div>

									{/* Country */}
									<div className="field ">
										<span className="p-float-label mt-5">
											<Controller
												name="country"
												control={control}
												rules={{
													required: 'Type  required.',
													// pattern: {
													// 	value: /^[BCT]/,
													// 	message: 'Only category type B C T are allowed',
													// },
													// maxLength: {
													// 	value: 1,
													// 	message: 'Only 1 character allopwed',
													// },
												}}
												render={({ field, fieldState }) => (
													<Dropdown
														id={field.name}
														{...field}
														onChange={handleCountryChange}
														value={country}
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
										{/* {getFormErrorMessage('country')} */}
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
														// disabled={shippers.length < 1}
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
												htmlFor="shipping"
												className={classNames({ 'p-error': errors.shipper })}>
												Shipper
											</label>
										</span>
										{/* {getFormErrorMessage('country')} */}
									</div>
								</div>
							</div>
						</Card>
					</form>
				</div>
			</div>

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
			allCountries.push(e.country);
		});
		countries = uniqForObject<COUNTRY>(allCountries);
		//Add courier name to charge

		charges = _charges.map((c: DELIVERY_CHARGE_TYPE) => {
			c.courierName = c.courier.name;
			return c;
		});
	} catch (e) {
		console.log('Could not find brands');
		console.log(e);
	}
	countrySet.forEach((c) => {
		countries.push(c);
	});

	return {
		props: { charges, countries },
	};
};
export default DeliveryForm;
