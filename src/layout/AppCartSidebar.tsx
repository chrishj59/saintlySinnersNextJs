import { basketItemType, useBasket } from '@/app/basket-context';
import { ProductAxiosType } from '@/interfaces/product.type';
import Image from 'next/image';
// import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Sidebar } from 'primereact/sidebar';
import { useContext, useEffect, useState } from 'react';

import { LayoutContext } from './context/layoutcontext';
import { redirect } from 'next/navigation';
//import { forEach } from 'lodash';
import { useRouter } from 'next/navigation';
import { XtraderProductResp } from '@/interfaces/xtraderProduct.type';
const AppCartSidebar = () => {
	const router = useRouter();
	const { layoutState, setLayoutState } = useContext(LayoutContext);
	//const contextPath = getConfig().publicRuntimeConfig.contextPath;
	const cart = useBasket();

	// const router = useRouter();
	const onCartSidebarHide = () => {
		setLayoutState((prevState: any) => ({
			...prevState,
			cartSidebarVisible: false,
		}));
	};

	const quantityOptions = [
		{ label: '1', value: 1 },
		{ label: '2', value: 2 },
		{ label: '3', value: 3 },
		{ label: '4', value: 4 },
	];

	const [items, setItems] = useState<basketItemType[]>(cart.items);
	const [products, setProducts] = useState<XtraderProductResp[]>([]);

	// const updateQuanity = (
	// 	e: React.MouseEvent<HTMLButtonElement>,
	// 	artnr: string
	// ) => {
	// 	let total = 0;
	// 	const _prods = items.map((p) => {
	// 		if (p.item.artnr === artnr) {
	// 			p.quantity = Number(e);

	// 			p.linePrice = p.unitPrice * p.quantity;
	// 		}
	// 		total += p.linePrice;

	// 		return p;
	// 	});
	// 	cart.totalCost = total;

	// 	setItems(_prods);
	// };

	const deleteItem = (
		e: React.MouseEvent<HTMLAnchorElement>,
		// subArtNr: string
		id: number
	) => {
		console.log(`cart side bar delete item `);
		let total = 0;
		const _prods = items.filter((p) => p.id !== id);
		//  const _prods = items.filter((p) => p. {
		// 	if (p.subArtNr !== subArtNr) {

		// 		return p;
		// 	}
		//});

		_prods.map((p) => {
			console.log(`appCartSidebar item ${JSON.stringify(p, null, 2)} `);
			total += p.linePrice;
		});
		cart.totalCost = Number(total.toFixed(2));
		cart.removeItem(id);
		setItems(_prods);
		// remove from basket context
	};

	const cartLineItems = () => {
		const items = cart.items;
		if (items.length < 1) {
			return (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<h4>There are no items in your cart</h4>
				</div>
			);
		}

		return items.map((p, i) => {
			p.linePrice = p.quantity * p.unitPrice;
			console.log(
				`appCarSideBar item qty amount ${JSON.stringify(
					p,
					['quantity', 'unitPrice', 'linePrice'],
					2
				)}`
			);
			if (!p.item.thumb || !p.item.thumb.imageData) {
				if (p.item.ximage?.imageData) {
					p.item.thumb = p.item.ximage;
				} else if (p.item.ximage2?.imageData) {
					p.item.thumb = p.item.ximage2;
				} else if (p.item.ximage3?.imageData) {
					p.item.thumb = p.item.ximage3;
				} else if (p.item.ximage4?.imageData) {
					p.item.thumb = p.item.ximage4;
				}
			}
			return (
				<li
					key={i + p.item.id}
					className="flex flex-column md:flex-row py-6 border-top-1 border-bottom-1 surface-border md:align-items-center">
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<div
						// style={{
						// 	position: 'relative',
						// 	overflow: 'hidden',
						// 	width: '250px',
						// 	height: '300px',
						// }}
						>
							<Image
								src={`data:image/jpeg;base64,${
									p.item.thumb && p.item.thumb.imageData
								}`}
								alt={p.item.name}
								// fill={true}
								// style={{ objectFit: 'cover' }}
								width={100}
								height={100}
							/>
						</div>
					</div>
					<div className="flex-auto py-5 md:pl-5">
						<div className="flex flex-wrap align-items-start sm:align-items-center sm:flex-row sm:justify-content-between surface-border pb-6">
							<div className="w-full sm:w-6 flex flex-column">
								{/* <span className="text-900 text-xl font-medium mb-3">
								Product Name
							</span> */}
								<span> quantity: {p.quantity}</span>
								<span className="text-700">{p.item.name}</span>
							</div>
							<div className="w-full sm:w-6 flex align-items-start justify-content-between mt-3 sm:mt-0">
								{/* <div>
								<Dropdown
									style={{ width: '40%' }}
									options={quantityOptions}
									value={p.quantity}
									onChange={(e) =>
										updateQuanity(e.value, p.item.artnr)
									}></Dropdown>
							</div> */}
								<div className="flex flex-column sm:align-items-end">
									<span className="text-900 text-xl font-medium mb-2 sm:mb-3">
										£ {p.linePrice}
									</span>
									<a
										className="cursor-pointer text-pink-500 font-medium text-sm hover:text-pink-600 transition-colors transition-duration-300"
										tabIndex={0}
										onClick={(e) => deleteItem(e, p.id)}>
										Remove
									</a>
								</div>
							</div>
						</div>
						{/* <div className="flex flex-column">
						<span className="inline-flex align-items-center mb-3">
							<i className="pi pi-envelope text-700 mr-2"></i>
							<span className="text-700 mr-2">Order today.</span>
						</span>
					</div> */}
					</div>
				</li>
			);
		});
	};

	return (
		<Sidebar
			visible={layoutState.cartSidebarVisible}
			onHide={onCartSidebarHide}
			position="right"
			className="layout-cart-sidebar w-full sm:w-6">
			<div className="surface-section border-1 surface-border border-round px-4 py-8 md:px-6 lg:px-8">
				<div className="flex flex-column align-items-center mb-6">
					<div className="text-900 text-4xl mb-4 font-medium">
						Your cart total is £ {cart.totalCost.toFixed(2)}
					</div>
					<Button
						label="Check Out"
						onClick={() => {
							onCartSidebarHide();
							router.push('/cartPayment/checkout-form');
							//redirect('/payment/checkout-form');
						}}
					/>
				</div>
				<ul className="list-none p-0 m-0">
					<>{cartLineItems()}</>
				</ul>

				<div className="flex flex-column align-items-center mb-6">
					<Button
						label="Check Out"
						onClick={() => {
							onCartSidebarHide();
							router.push('/cartPayment/checkout-form');
							//redirect('/payment/checkout-form');
						}}></Button>
				</div>
			</div>
		</Sidebar>
	);
};

export default AppCartSidebar;
