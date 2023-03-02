import { basketItemType, useBasket } from 'components/ui/context/BasketContext';
import { DELIVERY_INFO_TYPE } from 'interfaces/delivery-info.type';
import { NextPage } from 'next';
import getConfig from 'next/config';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Steps } from 'primereact/steps';
import React, { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
	children: React.ReactNode;
};

type item = {
	element: string;
	visible: boolean;
	options?: number[];
	materialId?: number | null;
};
type Test = {
	id: string;
	items: item[];
};
const CheckoutForm: NextPage<Props> = ({ children }: Props) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const cart = useBasket();
	const router = useRouter();
	const [items, setItems] = useState<basketItemType[]>(cart.items);
	const [deliveryInfo, setDEliveryInfo] = useState<DELIVERY_INFO_TYPE>();

	const checkActiveIndex = useCallback(() => {
		const paths = router.pathname.split('/');
		const currentPath = paths[paths.length - 1];

		const test: Test = {
			id: '5693d42d-dacd-4b6d-907c-c17cf91a3185',
			items: [
				{ element: 'B1', visible: true },
				{
					element: 'F1.S1',
					options: [150, 155],
					visible: true,
					materialId: 3543,
				},
			],
		};
		console.log('Before update');
		console.log(test);
		test.items.map((i: item) => {
			if (i.element === 'F1.S1') {
				(i.visible = false), (i.materialId = null);
			}
		});
		console.log('after update');
		console.log(test);

		switch (currentPath) {
			case 'delivery':
				setActiveIndex(1);
				break;
			case 'payment':
				setActiveIndex(2);
				break;
			case 'confirmation':
				setActiveIndex(3);
				break;
			default:
				setActiveIndex(0);
				break;
		}
	}, [router]);

	useEffect(() => {
		checkActiveIndex();
	}, [checkActiveIndex]);

	const wizardItems = [
		{ label: 'Cart', command: () => router.push('/payment/checkout-form') },
		{
			label: 'Delivery',
			command: () => router.push('/payment/checkout-form/delivery'),
			disabled: activeIndex !== 0,
		},
		{
			label: 'Payment',
			command: () => router.push('/payment/checkout-form/payment'),
			disabled: activeIndex !== 1,
		},
		{
			label: 'Confirmation',
			command: () => router.push('/payment/checkout-form/confirmation'),
			disabled: activeIndex !== 2,
		},
	];

	const contextPath = getConfig().publicRuntimeConfig.contextPath;
	console.log(`activeIndex ${activeIndex}`);

	const cartLineItems = () => {
		console.log('in cartLineItems');
		console.log(items);
		if (items.length < 1) {
			return (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<h4>There are no items in your cart</h4>
				</div>
			);
		}

		return items.map((p, i) => (
			<li
				key={i + p.item.artnr}
				className="flex flex-column md:flex-row py-6 border-top-1 border-bottom-1 surface-border md:align-items-center">
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<div
						style={{
							position: 'relative',
							overflow: 'hidden',
							width: '250px',
							height: '250px',
						}}>
						<Image
							src={`data:image/jpeg;base64,${p.item.imageData}`}
							alt={p.item.title}
							fill={true}
							style={{ objectFit: 'cover' }}
						/>
					</div>
				</div>
				<div className="flex-auto py-5 md:pl-5">
					<div className="flex flex-wrap align-items-start sm:align-items-center sm:flex-row sm:justify-content-between surface-border pb-6">
						<div className="w-full sm:w-6 flex flex-column">
							<span className="text-900 text-xl font-medium mb-3">
								Product Name
							</span>
							<span className="text-700">{p.item.title}</span>
						</div>
						<div className="w-full sm:w-6 flex align-items-start justify-content-between mt-3 sm:mt-0">
							<div>
								{/* <Dropdown
									style={{ width: '40%' }}
									options={quantityOptions}
									value={p.quantity}
									onChange={(e) =>
										updateQuanity(e.value, p.item.artnr)
									}></Dropdown> */}
							</div>
							<div className="flex flex-column sm:align-items-end">
								<span className="text-900 text-xl font-medium mb-2 sm:mb-3">
									€ {p.linePrice}
								</span>
								{/* <a
									className="cursor-pointer text-pink-500 font-medium text-sm hover:text-pink-600 transition-colors transition-duration-300"
									tabIndex={0}
									onClick={(e) => deleteItem(e, p.id)}>
									Remove
								</a> */}
							</div>
						</div>
					</div>
					<div className="flex flex-column">
						<span className="inline-flex align-items-center mb-3">
							<i className="pi pi-envelope text-700 mr-2"></i>
							<span className="text-700 mr-2">Order today.</span>
						</span>
						{/* <span className="inline-flex align-items-center mb-3">
							<i className="pi pi-send text-700 mr-2"></i>
							<span className="text-700 mr-2">
								Delivery by <span className="font-bold">Dec 23.</span>
							</span>
						</span>
						<span className="flex align-items-center">
							<i className="pi pi-exclamation-triangle text-700 mr-2"></i>
							<span className="text-700">Only 2 Available.</span>
						</span> */}
					</div>
				</div>
			</li>
		));
	};
	return (
		<>
			<div className="flex justify-content-center">
				<span className="text-900 block font-bold text-xl">Checkout</span>
			</div>

			<div className="surface-card border-1 surface-border border-round">
				<div className="col-12 px-4 mt-4 md:mt-6 md:px-6">
					<Steps
						model={wizardItems}
						activeIndex={activeIndex}
						onSelect={(e) => setActiveIndex(e.index)}
						readOnly={false}
					/>
					{router.pathname === '/payment/checkout-form' ? (
						<div className="flex align-items-center py-5 px-3">
							<>
								<div className="flex flex-column align-items-center mb-6">
									<ul className="list-none p-0 m-0">
										{/* <i className="pi pi-fw pi-user mr-2 text-2xl" /> */}
										{cartLineItems()}
										{/* //<p className="m-0 text-lg">Cart details via children</p> */}
									</ul>
								</div>
							</>
						</div>
					) : (
						<>{children}</>
					)}
				</div>
			</div>
		</>
		// <div className="surface-card border-1 surface-border border-round">
		// 	<div className="grid grid-nogutter">
		// 		<div className="col-12 px-4 mt-4 md:mt-6 md:px-6">
		// 			<span className="text-900 block font-bold text-xl">Checkout</span>
		// 		</div>
		// 		<div className="col-12 lg:col-6 h-full px-4 py-4 md:px-6">
		// 			<ul className="flex list-none flex-wrap p-0 mb-6">
		// 				<li className="flex align-items-center text-primary mr-2">
		// 					Cart <i className="pi pi-chevron-right text-500 text-xs ml-2"></i>
		// 				</li>
		// 				<li className="flex align-items-center text-500 mr-2">
		// 					Information
		// 					<i className="pi pi-chevron-right text-500 text-xs ml-2"></i>
		// 				</li>
		// 				<li className="flex align-items-center text-500 mr-2">
		// 					Shipping
		// 					<i className="pi pi-chevron-right text-500 text-xs ml-2"></i>
		// 				</li>
		// 				<li className="flex align-items-center text-500 mr-2">Payment</li>
		// 			</ul>
		// 			<div className="grid formgrid">
		// 				<div className="col-12 field mb-6">
		// 					<span className="text-900 text-2xl block font-medium mb-5">
		// 						Contact Information
		// 					</span>
		// 					<input
		// 						id="email"
		// 						placeholder="Email"
		// 						type="text"
		// 						className="p-inputtext w-full mb-4"
		// 					/>
		// 					{/* <div className="field-checkbox">
		// 						<Checkbox
		// 							name="checkbox-1"
		// 							onChange={(e) => setChecked(e.checked)}
		// 							checked={checked}
		// 							inputId="checkbox-1"></Checkbox>
		// 						<label htmlFor="checkbox-1">
		// 							Email me with news and offers
		// 						</label>
		// 					</div> */}
		// 				</div>
		// 				<div className="col-12 field mb-4">
		// 					<span className="text-900 text-2xl block font-medium mb-5">
		// 						Shipping
		// 					</span>
		// 					<Dropdown
		// 						options={cities}
		// 						value={selectedCity}
		// 						onChange={(e) => setSelectedCity(e.value)}
		// 						placeholder="Country / Region"
		// 						optionLabel="name"
		// 						showClear
		// 						className="w-full"></Dropdown>
		// 				</div>
		// 				<div className="col-12 lg:col-6 field mb-4">
		// 					<input
		// 						id="name"
		// 						placeholder="Name"
		// 						type="text"
		// 						className="p-inputtext w-full"
		// 					/>
		// 				</div>
		// 				<div className="col-12 lg:col-6 field mb-4">
		// 					<input
		// 						id="lastname"
		// 						placeholder="Last Name"
		// 						type="text"
		// 						className="p-inputtext w-full"
		// 					/>
		// 				</div>
		// 				<div className="col-12 field mb-4">
		// 					<input
		// 						id="address"
		// 						placeholder="Address"
		// 						type="text"
		// 						className="p-inputtext w-full"
		// 					/>
		// 				</div>
		// 				<div className="col-12 field mb-4">
		// 					<input
		// 						id="address2"
		// 						placeholder="Apartment, suite, etc"
		// 						type="text"
		// 						className="p-inputtext w-full"
		// 					/>
		// 				</div>
		// 				<div className="col-12 lg:col-6 field mb-4">
		// 					<input
		// 						id="pc"
		// 						placeholder="Postal Code"
		// 						type="text"
		// 						className="p-inputtext w-full"
		// 					/>
		// 				</div>
		// 				<div className="col-12 lg:col-6 field mb-4">
		// 					<input
		// 						id="city"
		// 						placeholder="City"
		// 						type="text"
		// 						className="p-inputtext w-full"
		// 					/>
		// 				</div>
		// 				<div className="col-12 lg:col-6 field mb-4">
		// 					<div className="field-checkbox">
		// 						<Checkbox
		// 							name="checkbox-2"
		// 							onChange={(e) => setChecked2(e.checked)}
		// 							checked={checked2}
		// 							inputId="checkbox-2"></Checkbox>
		// 						<label htmlFor="checkbox-2">Save for next purchase</label>
		// 					</div>
		// 				</div>
		// 				<div className="col-12 flex flex-column lg:flex-row justify-content-center align-items-center lg:justify-content-end my-6">
		// 					<Button
		// 						className="p-button-secondary p-button-outlined mt-3 lg:mt-0 w-full lg:w-auto flex-order-2 lg:flex-order-1 lg:mr-4"
		// 						label="Return to Cart"
		// 						icon="pi pi-fw pi-arrow-left"></Button>
		// 					<Button
		// 						className="p-button-primary w-full lg:w-auto flex-order-1 lg:flex-order-2"
		// 						label="Continue to Shipping"
		// 						icon="pi pi-fw pi-check"></Button>
		// 				</div>
		// 			</div>
		// 		</div>
		// 		<div className="col-12 lg:col-6 px-4 py-4 md:px-6">
		// 			<div className="pb-3 surface-border">
		// 				<span className="text-900 font-medium text-xl">Your Cart</span>
		// 			</div>
		// 			<div className="flex flex-column lg:flex-row flex-wrap lg:align-items-center py-2 mt-3 surface-border">
		// 				<img
		// 					src={`${contextPath}/demo/images/ecommerce/shop/shop-1.png`}
		// 					className="w-8rem h-8rem flex-shrink-0 mb-3"
		// 					alt="product"
		// 				/>
		// 				<div className="flex-auto lg:ml-3">
		// 					<div className="flex align-items-center justify-content-between mb-3">
		// 						<span className="text-900 font-bold">Product Name</span>
		// 						<span className="text-900 font-bold">$123.00</span>
		// 					</div>
		// 					<div className="text-600 text-sm mb-3">Black | Large</div>
		// 					<div className="flex flex-auto justify-content-between align-items-center">
		// 						<InputNumber
		// 							showButtons
		// 							buttonLayout="horizontal"
		// 							min={0}
		// 							inputClassName="w-2rem text-center py-2 px-1 border-transparent outline-none shadow-none"
		// 							value={quantities[0]}
		// 							className="border-1 surface-border border-round"
		// 							decrementButtonClassName="p-button-text text-600 hover:text-primary py-1 px-1"
		// 							incrementButtonClassName="p-button-text text-600 hover:text-primary py-1 px-1"
		// 							incrementButtonIcon="pi pi-plus"
		// 							decrementButtonIcon="pi pi-minus"></InputNumber>
		// 						<Button
		// 							icon="pi pi-trash"
		// 							className="p-button-text p-button-rounded"></Button>
		// 					</div>
		// 				</div>
		// 			</div>
		// 			<div className="py-2 mt-3 surface-border">
		// 				<div className="p-inputgroup mb-3">
		// 					<InputText
		// 						type="text"
		// 						value={value}
		// 						onChange={(e) => setValue(e.target.value)}
		// 						placeholder="Promo code"
		// 						className="w-full"
		// 					/>
		// 					<Button type="button" label="Apply" disabled={!value}></Button>
		// 				</div>
		// 			</div>
		// 			<div className="py-2 mt-3">
		// 				<div className="flex justify-content-between align-items-center mb-3">
		// 					<span className="text-900 font-medium">Subtotal</span>
		// 					<span className="text-900">$123.00</span>
		// 				</div>
		// 				<div className="flex justify-content-between align-items-center mb-3">
		// 					<span className="text-900 font-medium">Shipping</span>
		// 					<span className="text-primary font-bold">Free</span>
		// 				</div>
		// 				<div className="flex justify-content-between align-items-center mb-3">
		// 					<span className="text-900 font-bold">Total</span>
		// 					<span className="text-900 font-medium text-xl">$123.00</span>
		// 				</div>
		// 			</div>
		// 			<div className="py-2 mt-3 bg-yellow-100 flex align-items-center justify-content-center border-round">
		// 				<img
		// 					src={`${contextPath}/demo/images/ecommerce/shop/flag.png`}
		// 					className="mr-2"
		// 					alt="Country Flag"
		// 				/>
		// 				<span className="text-black-alpha-90 font-medium">
		// 					No additional duties or taxes.
		// 				</span>
		// 			</div>
		// 		</div>
		// 	</div>
		// </div>
	);
};

export default CheckoutForm;
