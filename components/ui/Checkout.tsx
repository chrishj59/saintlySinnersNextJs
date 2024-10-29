'use client';

import type Stripe from 'stripe';
import { useRouter } from 'next/navigation';
import { redirect, usePathname } from 'next/navigation';
import { basketItemType, useBasket } from '@/app/basket-context';
import {
	useState,
	useCallback,
	useEffect,
	ReactEventHandler,
	useRef,
	ChangeEvent,
	FocusEvent,
} from 'react';
import Image from 'next/image';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { Steps } from 'primereact/steps';
import { Controller, useForm } from 'react-hook-form';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTableExpandedRows } from 'primereact/datatable';
import { useLocalStorage } from 'primereact/hooks';
import { DELIVERY_CHARGE_TYPE } from '@/interfaces/delivery-charge.type';
import { REMOTE_LOCATION_TYPE } from '@/interfaces/delivery-charge.type';
import { DELIVERY_INFO_TYPE } from '@/interfaces/delivery-info.type';
import { classNames } from 'primereact/utils';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useSession } from 'next-auth/react';
import { createCheckoutSession } from '@/app/actions/stripe';

import getStripe from '@/utils/get-stripejs';
import { fetchPostJSON } from '@/utils/stripe-api-helpers';
import { formatCurrency } from '@/utils/helpers';
import { COUNTRY_TYPE } from '@/interfaces/country.type';
import {
	CUST_ORDER_TYPE,
	ORDER_PRODUCT,
	CUST_ORDER_DELIVERY,
	ORDER_ADDRESS,
	ORDER_CUSTOMER,
} from '@/interfaces/edcOrder.type';
import { STRIPE_ITEM } from '@/interfaces/stripeItem.type';

import {
	EmbeddedCheckout,
	EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { isSyntheticExpression, setTokenSourceMapRange } from 'typescript';
import { json } from 'stream/consumers';
import { USER_ADDRESS_TYPE } from '@/interfaces/userAddress.type';
import { FloatLabel } from 'primereact/floatlabel';
import { CUSTOMER } from '@/interfaces/customerOrder.type';
import CategoryLoading from '../../app/(saintly-sinners-public)/xtrader/category/loading';
import { TrendingUpRounded } from '@mui/icons-material';
type lineItem = {
	id: number;
	title: string;
	amount: number;
	items?: basketItemType[];
};

type ordermessage = {
	orderNumber: number;
	orderId: string;
};
type orderResponse = {
	status: string;
	orderMessage: ordermessage;
};
interface CheckoutFormProps {
	uiMode: Stripe.Checkout.SessionCreateParams.UiMode;
	charges: DELIVERY_CHARGE_TYPE[];
	addresses: USER_ADDRESS_TYPE[];
	countries: COUNTRY_TYPE[];
}
export default function Checkout(props: CheckoutFormProps) {
	const router = useRouter();
	const session = useSession();
	const user = session.data?.user;

	const cart = useBasket();
	const [items, setItems] = useState<basketItemType[]>(cart.items);
	const [stepsActiveIndex, setStepsActiveIndex] = useState(0);
	const [activeIndex, setActiveIndex] = useState(cart.checkoutStep);
	const [shippers, SetShippers] = useState<DELIVERY_CHARGE_TYPE[]>(
		props.charges
	);
	const [userAddressList, setUserAddressList] = useState<USER_ADDRESS_TYPE[]>(
		props.addresses
	);

	const [defaultAddress, setDefaultAddress] = useState<USER_ADDRESS_TYPE>();

	const [selectedAddressId, setSelectedAddressId] = useState<string>();
	const [shipPostCode, setShipPostCode] = useState('');
	const [selectedShipper, setSelectedShipper] = useState<string>();
	const [isShippersDisabled, setIsShippersDisabled] = useState<boolean>(true);
	const [countryEntered, setCountryEntered] = useState<number>();
	const [delCharge, setDelCharge] = useState<number>(0);
	const [deliveryInfo, setDeiveryInfo] = useState<
		DELIVERY_INFO_TYPE | undefined
	>(undefined);
	const [total, setTotal] = useState<number>(0);
	const [lines, setLines] = useState<lineItem[]>([]);
	const [expandedRows, setExpandedRows] = useState<
		any[] | basketItemType[] | DataTableExpandedRows
	>();
	const [loading, setLoading] = useState(false);
	const toast = useRef<Toast>(null);
	const [orderId, setOrderId] = useLocalStorage('', 'orderKey');
	const [orderNumber, setOrderNumber] = useState<number>();

	const defaultValues: DELIVERY_INFO_TYPE = {
		firstName: defaultAddress?.firstName ? defaultAddress?.firstName : '',
		lastName: defaultAddress?.lastName ? defaultAddress?.lastName : '',
		email: '', //user?.email ? user?.email : '',
		phone: user?.mobPhone ? user?.mobPhone : '',
		house_number_input: '',
		house_number: 0,
		street: defaultAddress?.street ? defaultAddress?.street : '',
		street2: defaultAddress?.street2 ? defaultAddress?.street2 : '',
		town: defaultAddress?.town ? defaultAddress?.town : '',
		county: defaultAddress?.county ? defaultAddress?.county : '',
		postCode: defaultAddress?.postCode ? defaultAddress?.postCode : '',
		country: 232,

		deliveryCost: 0,

		shipper: undefined,
		addresses: userAddressList,
	};

	const {
		control,

		formState: { errors },
		handleSubmit,

		setValue,

		getValues,
	} = useForm<DELIVERY_INFO_TYPE>({ defaultValues });

	const getFormErrorMessage = (name: string) => {
		return (
			errors[name as keyof DELIVERY_INFO_TYPE] && (
				<small className="p-error">
					{errors[name as keyof DELIVERY_INFO_TYPE]?.message}
				</small>
			)
		);
	};

	const onDeliverySubmit = async (formData: DELIVERY_INFO_TYPE) => {
		const _deliveryInfo: DELIVERY_INFO_TYPE = {
			firstName: formData.firstName,
			lastName: formData.lastName,
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

			deliveryCost: formData.shipper?.deliveryCharge
				? formData.shipper?.deliveryCharge
				: 0,
			shipper: formData.shipper,
		};

		if (formData.shipper) {
			if (formData.shipper.deliveryCharge) {
				if (typeof formData.shipper.deliveryCharge === 'number') {
					cart.delivery = formData.shipper.deliveryCharge;
				} else {
					cart.delivery = parseFloat(formData.shipper.deliveryCharge);
				}
			}
		}

		setDeiveryInfo(_deliveryInfo);
		cart.addDeliveryInfo(_deliveryInfo);

		const cartLine = {
			id: 1,
			title: 'Cart',
			amount: cart.totalCost,
			items: cart.items,
		};

		const delivery = {
			id: 2,
			title: 'Delivery',
			amount: _deliveryInfo.deliveryCost,
		};
		const payable: number =
			parseFloat(cart.payable.toString()) +
			parseFloat(delivery.amount.toString());

		const total = {
			id: 3,
			title: 'Total',
			amount: payable,
		};

		setTotal(total.amount);

		const _lines: lineItem[] = [];
		_lines.push(cartLine);
		_lines.push(delivery);
		_lines.push(total);

		setLines(_lines);
		setActiveIndex(2);
	};

	const selectedShipperTemplate = (
		option: DELIVERY_CHARGE_TYPE,
		props: any
	) => {
		if (option) {
			return (
				<div className="flex align-items-center">
					<div>{option.courier!.name}</div>
					<div className="ml-3">£ {option.deliveryCharge.toFixed(2)}</div>
				</div>
			);
		}

		return <span>{props.placeholder}</span>;
	};

	const shippingOptionTemplate = (option: DELIVERY_CHARGE_TYPE) => {
		return (
			<div className="flex flex-column">
				<div className="flex flex-row flex-wrap">
					<div className="flex align-items-center">
						<div>Service: {option.courier?.name}</div>
						<div className="ml-2">
							Cost: £ {option.deliveryCharge.toFixed(2)}
						</div>
					</div>
				</div>
				<div className="flex flex-row flex-wrap">
					<div className="flex align-items-center"></div>
					{/* <div className="ml-2">max weight: {option.maxWeight} kg.</div> */}
					<div className="ml-2">
						Expected delivery: {option.durationDescription}
					</div>
					<div className="ml-2">
						Tracking: {option.hasTracking ? 'Yes' : 'No'}
					</div>
					<div className="ml-2">
						Lost item claim: {option.hasLostClaim ? 'Yes' : 'No'}
					</div>
				</div>
			</div>
			// <div className="shipping-item">
			// 	<div>
			// 		{option.courier!.name} €{option.amount}{' '}
			// 	</div>
			// </div>
		);
	};

	const cartLineItems = () => {
		if (items.length < 1) {
			return (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<h4>There are no items in your cart</h4>
				</div>
			);
		}

		return items.map((p, i) => {
			let imageData;
			if (p.item.image && p.item.image.imageData) {
				imageData = p.item.image.imageData;
			} else if (p.item.thumb && p.item.thumb.imageData) {
				imageData = p.item.thumb.imageData;
			} else if (p.item.ximage && p.item.ximage?.imageData) {
				imageData = p.item.ximage.imageData;
			} else if (p.item.ximage2 && p.item.ximage2?.imageData) {
				imageData = p.item.ximage2.imageData;
			}
			return (
				<li key={i} className="flex flex-column max-w-full md:flex-row mt-4">
					<div className="flex lign-items-center justify-content-center">
						<Image
							src={`data:image/jpeg;base64,${imageData}`}
							alt={p.item.name}
							width={110}
							height={110}
							// fill={true}
							// style={{ objectFit: 'cover' }}
						/>

						{/* <div className="flex "> */}
						<div className="flex align-items-center justify-content-center">
							<span className="ml-5 mr-5">Qty: {p.quantity} </span>
							<span className="font-medium  mr-5">{p.item.name}</span>
						</div>
						{/* </div> */}

						{/* <div className="flex align-items-center justify-content-center"> */}
						<div className="flex align-items-center justify-content-center">
							<span className="font-semibold ">Total £ {p.linePrice}</span>
						</div>
						{/* </div> */}
					</div>
				</li>
			);
		});
	};
	const handleShippingButtonClick = () => {
		setActiveIndex(1);
	};

	/**Delivery functions */

	const handleCountryChange = (e: { value: number }) => {
		const id: number = e.value;
		setCountryEntered(id);
		const selectedCountry = props.countries.find((c) => c.id === e.value);

		if (selectedCountry) {
			setValue('country', selectedCountry.id);
		}
		determineCourier(selectedCountry);
	};

	const handleShipperChange = (e: { value: string }) => {
		const shipperId = e.value;
		const _shipper = shippers.find((s) => s.id === shipperId);
		if (_shipper) {
			setValue('shipper', _shipper);
			setSelectedShipper(shipperId);
			if (_shipper.amount) {
				if (typeof _shipper.amount === 'number') {
					setDelCharge(_shipper.amount);
				} else {
					setDelCharge(parseFloat(_shipper.amount));
				}
			}
		}
	};

	const onRowExpand = (event: any) => {
		toast.current?.show({
			severity: 'success',
			summary: 'Successful',
			detail: 'Product Deleted',
			life: 3000,
		});
	};

	const onRowCollapse = (event: any) => {
		toast.current?.show({
			severity: 'success',
			summary: 'Cart Collapsed',
			life: 3000,
		});
	};

	const balanceBodyTemplate = (rowData: lineItem) => {
		if (rowData.title === 'Delivery') {
			rowData.amount = parseFloat(rowData.amount.toString());
		}
		return formatCurrency(rowData.amount);
	};

	const lineAmountBodyTemplate = (rowData: basketItemType) => {
		return formatCurrency(rowData.linePrice);
	};

	const allowExpansion = (rowData: lineItem) => {
		return rowData.title === 'Cart';
	};

	const rowExpansionTemplate = (data: lineItem) => {
		const _expandedRows = lines[0].items;

		return (
			<div className="Item-subtable">
				<h5>Cart line items</h5>
				<DataTable value={_expandedRows}>
					<Column field="item.name" header="Title" />
					<Column
						field="unitPrice"
						header="Unit price"
						headerStyle={{ width: '8rem', textAlign: 'center' }}
						bodyStyle={{ textAlign: 'right', overflow: 'visible' }}
					/>
					<Column
						field="quantity"
						header="Quanity"
						headerStyle={{ width: '4rem', textAlign: 'center' }}
						bodyStyle={{ textAlign: 'right', overflow: 'visible' }}
					/>
					<Column
						field="linePrice"
						header="Line total"
						headerStyle={{ width: '8rem', textAlign: 'center' }}
						bodyStyle={{ textAlign: 'right', overflow: 'visible' }}
						body={lineAmountBodyTemplate}
					/>
				</DataTable>
			</div>
		);
	};

	const handlePaymentSubmit: React.FormEventHandler<HTMLFormElement> = async (
		e
	) => {
		e.preventDefault();
		setLoading(true);

		const data = new FormData();

		const deliveryInfo: DELIVERY_INFO_TYPE | undefined = cart.deliveryInfo;

		//const edcCountryCode = deliveryInfo?.country?
		const items: basketItemType[] | undefined = lines[0].items;
		//TODO: populate email address
		if (items) {
			const products: ORDER_PRODUCT[] = [];
			items.map((i: basketItemType) => {
				const item = i.item;

				const models = products.filter((prod) => prod.model === item.model);
				const _prod: ORDER_PRODUCT = {
					model: item.model,
					quantity: i.quantity,
					attributeStr: i.itemStr,
				};

				products.push(_prod);
			});

			/** save order  */

			if (deliveryInfo) {
				const delCost = deliveryInfo.deliveryCost.toFixed(2);
				deliveryInfo.deliveryCost = parseFloat(delCost);
				// const tempProd: ORDER_PRODUCT[] = [];
				const custDelivery: CUST_ORDER_DELIVERY = {
					deliveryCost: deliveryInfo.deliveryCost,
					shippingModule: deliveryInfo.shipper?.courier?.shippingModule
						? deliveryInfo.shipper.courier?.shippingModule
						: '',
					deliveryChargeId: deliveryInfo.shipper?.id
						? deliveryInfo.shipper?.id
						: '',
				};

				let orderAddress: ORDER_ADDRESS = {
					firstName: deliveryInfo.firstName,
					lastName: deliveryInfo.lastName,
					street: deliveryInfo.street,
					street2: deliveryInfo.street2,
					city: deliveryInfo.town,
					houseNumber: deliveryInfo.house_number,
					country: deliveryInfo.country,
					postCode: deliveryInfo.postCode,
					county: deliveryInfo.county,
					telephone: deliveryInfo.phone,
					email: deliveryInfo.email,
				};

				// const customer: ORDER_CUSTOMER = {
				// 	firstName: deliveryInfo.firstName,
				// 	lastName: deliveryInfo.lastName,
				// 	street: deliveryInfo.street,
				// 	street2: deliveryInfo.street2,
				// 	city: deliveryInfo.town,
				// 	houseNumber: deliveryInfo.house_number,
				// 	country: deliveryInfo.country,
				// 	postCode: deliveryInfo.postCode,
				// 	telephone: deliveryInfo.phone,
				// 	email: deliveryInfo.email,
				// };

				const customerOrder: CUST_ORDER_TYPE = {
					vendorNumber: deliveryInfo?.shipper?.vendor?.id || 0,
					orderedOn: new Date(),
					delivery: deliveryInfo.deliveryCost,
					oneTimeCustomer: user ? false : true,
					customerId: user?.id ? user?.id : undefined,
					goodsValue: total,
					tax: 0,
					total: total,
					currencyCode: 'GBP',
					orderAddress: orderAddress,
					// customerOneTime: customerOneTime ? customerOneTime : undefined,
					// customer: customer ? customer : undefined,
					products,
					customerDelivery: custDelivery
						? custDelivery
						: { deliveryCost: 0, shippingModule: '', deliveryChargeId: '' },
				};

				try {
					const custOrderUrl = '/api/xtrader/custorder';
					const custOrderResp = await fetch(custOrderUrl, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						// cache: 'no-store',
						body: JSON.stringify(customerOrder),
					});

					if (!custOrderResp.ok) {
						console.error(
							`error saving order ${custOrderResp.status}  ${custOrderResp.statusText}`
						);
						toast.current?.show({
							severity: 'error',
							summary: 'Could not save your order',
							detail:
								'Could not save your order. Please try or email customer support',
							life: 3000,
						});
						return;
					}
					const custOrder = (await custOrderResp.json()) as orderResponse;

					setOrderId(custOrder.orderMessage.orderId);
					setOrderNumber(custOrder.orderMessage.orderNumber);

					data.append('orderId', custOrder.orderMessage.orderId);
					data.append(
						'delivery_charge',
						Number(deliveryInfo.deliveryCost).toFixed(2)
					);
					data.append('email', deliveryInfo.email);
					data.append('orderTotal', total.toFixed(2));

					for (const line of lines) {
						const stripeItems: STRIPE_ITEM[] = [];
						if (line.items) {
							for (const item of line.items) {
								// const _stripItem:STRIPE_ITEM = {name:item.item.title, description:item.item.description}
								// stripeItems.push(_stripItem)
								data.append('title', item.item.name);
								data.append('description', item.item.description);

								data.append('lineAmount', item.linePrice.toFixed(2));
							}
						}
					}

					// Add address line
					const addressLine = `${customerOrder.orderAddress.street} ${customerOrder.orderAddress.postCode}`;
					data.append(`addressLine`, addressLine);
					await createCheckoutSession(data);
				} catch (error: any) {
					if (error instanceof SyntaxError) {
						// Unexpected token < in JSON
						console.warn('SyntaxError saving customer order', error);
					} else {
						console.error('Could not save customer order');
						console.error(error);
						toast.current?.show({
							severity: 'error',
							summary: 'Could not save your order',
							detail: 'Pleae retry or email customer support',
							life: 3000,
						});
					}
				}
			}
		}

		setLoading(false);
	};

	const onPostCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
		const _postCode = e.target.value.toLocaleUpperCase();

		setShipPostCode(_postCode);
		setValue('postCode', _postCode);
	};

	const shipperDropdownFocus = (e: FocusEvent<HTMLInputElement>) => {
		if (!shippers) {
			return;
		}

		determineCourier();
	};

	const determineIsShippersDisabled = () => {
		const _countryEntered = getValues('country');
		const countryNum = countryEntered ? countryEntered : _countryEntered;

		if (shippers.length > 0 && shipPostCode.length > 0 && countryNum > 0) {
			setIsShippersDisabled(false);
		} else {
			setIsShippersDisabled(true);
		}
	};

	const determineCourier = (country?: COUNTRY_TYPE, countryNum?: number) => {
		const vatRate = Number(process.env.NEXT_PUBLIC_VAT_STANDARD) / 100;

		if (!country) {
			// const selectedCountry = props.countries.find((c) => c.id === countryNum);
			// country = selectedCountry;
			country = props.countries.find((c) => c.id === countryNum);
		}

		const items = cart.items;

		const weight = items.reduce((accum: number, current: basketItemType) => {
			const itemWight = Number(current.item.weight) * current.quantity;
			return accum + itemWight;
		}, 0);

		let _shippers: DELIVERY_CHARGE_TYPE[] = props.charges.filter(
			(c: DELIVERY_CHARGE_TYPE) => {
				const minWeight = c.minWeight;
				const maxWeight = c.maxWeight;

				let _shipAmnt: number | string;
				if (typeof c.totalAmount !== 'number') {
					_shipAmnt = parseFloat(c.totalAmount);
				} else {
					_shipAmnt = c.totalAmount;
				}
				c.deliveryCharge = _shipAmnt;

				if (minWeight === 0 && maxWeight === 0) {
					return c;
				} else {
					if (weight >= minWeight && weight <= maxWeight) {
						return c;
					}
				}
			}
		);

		let _shipPostCodeCheck = shipPostCode ? shipPostCode : getValues().postCode;

		if (_shipPostCodeCheck) {
			const _shipPostCode = _shipPostCodeCheck.toLocaleUpperCase();

			const shippersRemote = _shippers.map((shipper: DELIVERY_CHARGE_TYPE) => {
				const hasRemoteLocation = shipper.remoteLocations ? true : false;
				if (hasRemoteLocation) {
					const remoteLocation = shipper.remoteLocations?.find(
						(remoteLoc: REMOTE_LOCATION_TYPE) =>
							_shipPostCode.startsWith(remoteLoc.postCode)
					);

					if (remoteLocation) {
						if (remoteLocation.surcharge) {
							const _totalAmount: number = Number(shipper.totalAmount);
							const _remoteAmount: number = Number(remoteLocation.remoteCharge);
							const _remoteVat: number = _remoteAmount * vatRate;

							shipper.deliveryCharge =
								_totalAmount + _remoteAmount + _remoteVat;
						} else {
							const _remoteCharge = Number(remoteLocation.remoteCharge);
							const _remoteVat = _remoteCharge * vatRate;

							shipper.deliveryCharge =
								Number(remoteLocation.remoteCharge) + Number(_remoteVat);
						}
					}
				}

				return shipper;
			});

			_shippers = shippersRemote;
		}

		//set delivery charge to 2 decimal Places
		_shippers = _shippers.map((s) => {
			const _deliverCharge = Number(s.deliveryCharge.toFixed(2));
			s.deliveryCharge = _deliverCharge;
			return s;
		});

		_shippers.sort((a: DELIVERY_CHARGE_TYPE, b: DELIVERY_CHARGE_TYPE) =>
			a.deliveryCharge > b.deliveryCharge
				? 1
				: b.deliveryCharge > a.deliveryCharge
				? -1
				: 0
		);

		if (_shippers) {
			SetShippers(_shippers);
		}
	};

	const stepsItems = [
		{
			label: 'Cart',
		},
		{
			label: 'Delivery Details',
		},
		{
			label: 'Payment',
		},
	];

	const handleUserAddressChange = (e: DropdownChangeEvent) => {
		const id: string = e.value;
		setSelectedAddressId(id);

		const _country = props.countries.find((cntry) => cntry.id === 232);
		const _selectedAddressList = userAddressList.filter(
			(addr) => addr.id === e.value
		);

		if (_selectedAddressList) {
			const _selectedAddress = _selectedAddressList[0];

			setValue('firstName', _selectedAddress.firstName);
			setValue('lastName', _selectedAddress.lastName);

			setValue('street', _selectedAddress.street);
			setValue('street2', _selectedAddress.street2);
			setValue('town', _selectedAddress.town);
			setValue('postCode', _selectedAddress.postCode);
			setValue('country', 232);
			setCountryEntered(232);
			setShipPostCode(_selectedAddress.postCode);
			const countryValue = getValues('country');

			determineIsShippersDisabled();

			if (_country) {
				determineCourier(_country);
			}
		}
	};
	const cartStep = (): JSX.Element => {
		return (
			<>
				<div className="flex justify-content-left">
					{/* <div className="flex align-items-center "> */}
					<>
						<div className="flex flex-column align-items-center mb-6">
							<ul className="list-none max-w-full">
								{/* <i className="pi pi-fw pi-user mr-2 text-2xl" /> */}
								{cartLineItems()}
								{/* //<p className="m-0 text-lg">Cart details via children</p> */}
							</ul>
						</div>
					</>
					{/* </div> */}
				</div>
				<div className="flex justify-content-end">
					<Button
						type="submit"
						onClick={handleShippingButtonClick}
						disabled={items && items.length < 1}>
						Continue to Delivery{' '}
					</Button>
				</div>
			</>
		);
	};

	const deliveryInfoStep = (): JSX.Element => {
		const addressOptionTemplate = (option: USER_ADDRESS_TYPE) => {
			if (option) {
				return (
					<div className="flex align-items-center">
						<div>
							{option.addressName} {option.postCode}
						</div>
					</div>
				);
			}
		};

		const renderUserAddressDropdown = () => {
			if (user) {
				return (
					<div className="field col-12 ">
						<FloatLabel>
							<Dropdown
								id="userAddress"
								onChange={handleUserAddressChange}
								placeholder="Please select your saved address to use"
								// itemTemplate={addressOptionTemplate}
								value={selectedAddressId}
								options={userAddressList}
								optionValue="id"
								optionLabel="addressName"
							/>
							<label htmlFor="userAddress">Saved Addresses</label>
						</FloatLabel>
					</div>
				);
			} else {
				return <></>;
			}
		};

		return (
			<form onSubmit={handleSubmit(onDeliverySubmit)}>
				<div className="flex justify-content-center p-fluid  ">
					<Card style={{ width: '50%' }} title="Contact Information">
						{/* Name line */}
						<div className="formgrid grid">
							{/* address dropdown */}
							{renderUserAddressDropdown()}
							{/* User address list */}
							{/* First Name */}
							<div className="field col-12 md:col-6">
								<Controller
									name="firstName"
									control={control}
									rules={{
										required: 'Name is required.',
									}}
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
													autoFocus={true}
													width={'100%'}
													value={field.value}
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
							{/* Last Name */}
							<div className="field col-12 md:col-6">
								<Controller
									name="lastName"
									control={control}
									rules={{
										required: 'Last Name is required.',
									}}
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
													value={field.value}
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
						</div>

						{/* Email address */}
						<div className="field">
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
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.email,
											})}></label>
										<span className="p-float-label">
											<InputText
												id={field.name}
												width={'100%'}
												value={field.value}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e) => field.onChange(e.target.value)}
											/>
											<label htmlFor={field.name}>Email</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>

						{/* Phone number field */}
						<div className="field">
							<Controller
								name="phone"
								control={control}
								rules={{ required: 'Phone number is required.' }}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.phone,
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
											<label htmlFor={field.name}>Phone</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>

							{/* {errors?.phone && (
												<p style={{ color: 'red', fontWeight: 'normal' }}>
													{errors.phone.message}
												</p>
											)} */}
						</div>

						<span className="text-900 text-2xl block font-medium ">
							Address
						</span>

						{/* Country */}
						<div className="field ">
							<Controller
								name="country"
								control={control}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.country,
											})}
										/>
										<span className="p-float-label">
											<Dropdown
												id={field.name}
												onChange={handleCountryChange}
												defaultValue={232}
												value={countryEntered}
												optionValue="id"
												optionLabel="name"
												options={props.countries}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
											/>
											<label htmlFor={field.name}>Country</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>

						{/* Street field */}
						<div className="field ">
							<Controller
								name="street"
								control={control}
								rules={{ required: 'Street is required.' }}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.street,
											})}
										/>
										<span className="p-float-label">
											<InputText
												id={field.name}
												onChange={(e) => field.onChange(e.target.value)}
												value={field.value}
												width={'80%'}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
											/>
											<label htmlFor={field.name}>Street</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>

						{/* Street2 field */}
						<div className="field ">
							<Controller
								name="street2"
								control={control}
								// rules={{ required: 'Street is required.' }}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.street2,
											})}
										/>
										<span className="p-float-label">
											<InputText
												id={field.name}
												onChange={(e) => field.onChange(e.target.value)}
												width={'80%'}
												value={field.value}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
											/>
											<label htmlFor={field.name}>Street2</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>

						{/* Town field */}
						<div className="field">
							<Controller
								name="town"
								control={control}
								rules={{ required: 'Town is required.' }}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.town,
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
											<label htmlFor={field.name}>Town</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>

						{/* County field */}
						<div className="field">
							<Controller
								name="county"
								control={control}
								// rules={{ required: 'Tile is required.' }}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.county,
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
											<label htmlFor={field.name}>County</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>

						{/* Post Code field */}
						<div className="field">
							<Controller
								name="postCode"
								control={control}
								rules={{ required: 'Post Code is required.' }}
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
												onChange={(e) => onPostCodeChange(e)}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
											/>
											<label htmlFor={field.name}>Post Code</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>

						<span className="text-900 text-2xl block font-medium mb-5">
							Shipping{' '}
						</span>

						{/* Shipping */}

						<div className="field ">
							<span className="p-float-label mt-2">
								<Controller
									name="shipper"
									control={control}
									rules={{
										required: 'Shipper is required.',
									}}
									render={({ field, fieldState }) => (
										<Dropdown
											filter
											id={field.name}
											// disabled={isShippersDisabled}
											value={selectedShipper}
											onFocus={shipperDropdownFocus}
											valueTemplate={selectedShipperTemplate}
											onChange={handleShipperChange}
											itemTemplate={shippingOptionTemplate}
											options={shippers}
											optionValue="id"
											optionLabel="courier.name"
											placeholder="Select a shipper"
											emptyMessage="No shippers, please select country and post code for your shippers"
											className={classNames({
												'p-invalid': fieldState.error,
											})}
										/>
									)}
								/>

								<label
									htmlFor="shipper"
									className={classNames({ 'p-error': errors.shipper })}>
									Shipper (After country and Post Code)
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
		);
	};

	const paymentStep = (): JSX.Element => {
		return (
			<form onSubmit={handlePaymentSubmit}>
				<div className="flex align-items-center py-5 px-3">
					<Card style={{ width: '80%' }} title="Payment">
						<DataTable
							value={lines}
							expandedRows={expandedRows}
							onRowExpand={onRowExpand}
							onRowCollapse={onRowCollapse}
							onRowToggle={(e) => setExpandedRows(e.data)}
							responsiveLayout="scroll"
							rowExpansionTemplate={rowExpansionTemplate}
							dataKey="id">
							<Column expander={allowExpansion} style={{ width: '3em' }} />
							<Column field="title" header="Item" />
							<Column
								field="amount"
								header="Amount"
								headerStyle={{ width: '4rem', textAlign: 'center' }}
								bodyStyle={{ textAlign: 'right', overflow: 'visible' }}
								body={balanceBodyTemplate}
							/>
						</DataTable>

						<Button type="submit">Pay now</Button>
					</Card>
				</div>
			</form>
		);
	};

	const stepsBody = () => {
		switch (activeIndex) {
			case 0:
				return cartStep();

			case 1:
				return deliveryInfoStep();
			case 2:
				return paymentStep();
		}
	};
	return (
		<>
			<div className="flex justify-content-center">
				<span className="text-900 block font-bold text-xl">Checkout</span>
			</div>
			<div className="card">
				<Steps model={stepsItems} activeIndex={activeIndex} />
				{stepsBody()}
			</div>
		</>
	);
}
