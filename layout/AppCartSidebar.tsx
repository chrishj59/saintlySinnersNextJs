import { basketItemType, useBasket } from 'components/ui/context/BasketContext';
import { ProductAxiosType } from 'interfaces/product.type';
import Image from 'next/image';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Sidebar } from 'primereact/sidebar';
import { useContext, useEffect, useState } from 'react';

import { LayoutContext } from './context/layoutcontext';

const AppCartSidebar = () => {
	const { layoutState, setLayoutState } = useContext(LayoutContext);
	//const contextPath = getConfig().publicRuntimeConfig.contextPath;
	const cart = useBasket();
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

	console.log('AppCartSidebar');
	console.log(cart);
	console.log(cart.items);
	const [items, setItems] = useState<basketItemType[]>(cart.items);
	const [products, setProducts] = useState<ProductAxiosType[]>([]);
	//let cartItems = cart.items;

	console.log(items);
	console.log(products);

	// if (products.length === 0 || items.length !== products.length) {
	// 	const _products = items.map((i: basketItemType) => {
	// 		let product = i.item;
	// 		product.cartQuantity = 1;
	// 		product.cartPrice = i.item.b2c;
	// 		return product;
	// 	});
	// 	setProducts(_products);
	// }
	useEffect(() => {
		console.log('useEffect called');
		let _cartItems = cart.items;
		console.log(cart.items);
		const _products = _cartItems.map((i: basketItemType) => {
			let product = i.item;
			product.cartQuantity = 1;
			product.cartPrice = i.item.b2c;
			return product;
		});
		console.log('_products');
		console.log(_products);
		setProducts(_products);
		console.log('in use effect cartItems');
		console.log(products);
	}, [cart.items]);

	const updateQuanity = (
		e: React.MouseEvent<HTMLButtonElement>,
		artnr: string
	) => {
		const _prods = products.map((p) => {
			if (p.artnr === artnr) {
				p.cartQuantity = Number(e);
			}
			return p;
		});

		console.log(_prods);
		setProducts(_prods);
		console.log(products);
	};

	const deleteItem = (e: React.MouseEvent<HTMLAnchorElement>, id: number) => {
		console.log(`deleteItem id: ${id}`);
		console.log(products);
		const _prods = products.filter((p) => {
			console.log(`p.id ${p.id} id ${id}`);
			if (p.id !== id) {
				console.log(`return p.id ${p.id}`);
				return p;
			}
		});
		console.log('after filter');
		console.log(_prods);
		setProducts(_prods);
		console.log(products);
	};

	const cartLineItems = () => {
		console.log('in cartLineItems');
		console.log(products);
		if (!products) {
			return <div></div>;
		}
		return products.map((p, i) => (
			<li
				key={i + p.artnr}
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
							src={`data:image/jpeg;base64,${p.imageData}`}
							alt={p.title}
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
							<span className="text-700">{p.title}</span>
						</div>
						<div className="w-full sm:w-6 flex align-items-start justify-content-between mt-3 sm:mt-0">
							<div>
								<Dropdown
									style={{ width: '40%' }}
									options={quantityOptions}
									value={p.cartQuantity}
									onChange={(e) => updateQuanity(e.value, p.artnr)}></Dropdown>
							</div>
							<div className="flex flex-column sm:align-items-end">
								<span className="text-900 text-xl font-medium mb-2 sm:mb-3">
									€ {p.cartPrice}
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
	console.log('run return');
	return (
		<Sidebar
			visible={layoutState.cartSidebarVisible}
			onHide={onCartSidebarHide}
			position="right"
			className="layout-cart-sidebar w-full sm:w-6">
			<div className="surface-section border-1 surface-border border-round px-4 py-8 md:px-6 lg:px-8">
				<div className="flex flex-column align-items-center mb-6">
					<div className="text-900 text-4xl mb-4 font-medium">
						Your cart total is €{cart.totalCost}
					</div>
					<Button label="Check Out" />
				</div>
				<ul className="list-none p-0 m-0">
					<>{cartLineItems()}</>
				</ul>

				<div className="flex flex-column align-items-center mb-6">
					<Button label="Check Out"></Button>
				</div>
			</div>
		</Sidebar>
	);
};

export default AppCartSidebar;
