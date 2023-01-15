import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';
import React, { useEffect, useState } from 'react';

import { ProductAxiosType } from '../interfaces/product.type';
import { basketContextType, useBasket } from './ui/context/BasketContext';

type DataViewLayoutType = 'list' | 'grid' | (string & Record<string, unknown>);
type DataViewSortOrderType = 1 | 0 | -1 | undefined | null;

type AwsImageType = { imageData: string; imageFormat: string };

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const ProductList = ({ productParam }: any) => {
	const [products, setProducts] = useState<ProductAxiosType[]>(productParam);
	const { addItem } = useBasket();
	const [layout, setLayout] = useState<DataViewLayoutType>('grid');
	const [sortKey, setSortKey] = useState<string>('');
	const [sortOrder, setSortOrder] = useState<DataViewSortOrderType>(0);
	const [sortField, setSortField] = useState<string>('');
	const sortOptions = [
		{ label: 'Price High to Low', value: '!price' },
		{ label: 'Price Low to High', value: 'price' },
	];
	const basket: basketContextType = useBasket();
	const router = useRouter();
	let variants: any;
	if (productParam[0]) {
		variants = productParam[0]['variants'];
	}
	useEffect(() => {
		(async () => {
			const prod = await Promise.all(
				productParam.map(async (p: any) => {
					p.stockStatus =
						p['variants'][0]['inStock'] === 'Y' ? 'Available' : 'Unavailable';
					const imgKey = p['images'][0]['key'];
					const { data } = await axios.get(`/api/v1/productImage/${imgKey}`);
					const { imageData, imageFormat } = data;

					p.imageData = imageData;
					p.imageFormat = imageFormat;
					return p;
				})
			);
			setProducts(prod);
		})();
	}, [productParam]);

	const updateBasket = async (
		e: React.MouseEvent<HTMLButtonElement>,
		value?: string
	) => {
		const selectedProd = products.find((el) => el.artnr === value);
		console.log('updateBasket');
		console.log(selectedProd);
		if (selectedProd) {
			basket.addItem(selectedProd, 1);
		}
	};

	const onSortChange = (event: any) => {
		const value = event.value;

		if (value.indexOf('!') === 0) {
			setSortOrder(-1);
			setSortField(value.substring(1, value.length));
			setSortKey(value);
		} else {
			setSortOrder(1);
			setSortField(value);
			setSortKey(value);
		}
	};

	const renderListItem = (data: ProductAxiosType) => {
		console.log(data);
		return (
			<div className="col-12">
				<div className="product-list-item">
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							padding: '2rem',
						}}>
						<div
							style={{
								position: 'relative',
								overflow: 'hidden',
								width: '100px',
								height: '100px',
							}}>
							<Image
								src={`data:image/jpeg;base64,${data.imageData}`}
								alt={data.title}
								fill={true}
								style={{ objectFit: 'cover' }}
							/>
						</div>
					</div>
					{/* <img src={`images/product/${data.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.name} /> */}
					<div className="product-list-detail">
						<div className="product-name">{data.title}</div>
						<div className="product-description">{data.description}</div>
						<Rating value={data.popularity} readOnly cancel={false}></Rating>
						<i className="pi pi-tag product-category-icon"></i>
						<span className="product-category">
							{data?.defaultCategory?.title}
						</span>
					</div>
					<div className="product-list-action">
						<span className="product-price">${data.b2c}</span>
						<Button
							icon="pi pi-shopping-cart"
							label="Add to Cart"
							disabled={data.stockStatus === 'OUTOFSTOCK'}></Button>
						<span
							className={`product-badge status-${data.stockStatus.toLowerCase()}`}>
							{data.stockStatus}
						</span>
					</div>
				</div>
			</div>
			// <div className="col-12">
			// 	<div className="product-list-item">
			// 		{/* <a
			// 			onClick={() => {
			// 				router.push(`/product/product-overview/${data.id}`);
			// 			}}
			// 			className="cursor-pointer "> */}
			// 		<div style={{ display: 'flex', justifyContent: 'center' }}>
			// 			<div
			// 				style={{
			// 					position: 'relative',
			// 					overflow: 'hidden',
			// 					width: '100px',
			// 					height: '100px',
			// 				}}>
			// 				<Image
			// 					src={`data:image/jpeg;base64,${data.imageData}`}
			// 					alt={data.title}
			// 					fill={true}
			// 					style={{ objectFit: 'cover' }}
			// 				/>
			// 			</div>
			// 		</div>
			// 		{/* <img src={`images/product/${data.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.name} /> */}
			// 		<div className="product-list-detail">
			// 			<div className={styles.name}>{data.title}</div>
			// 			<div className={styles.description}>{data.description}</div>
			// 			<Rating value={data.popularity} readOnly cancel={false}></Rating> s
			// 			<i className={styles.categoryIcon}></i>
			// 			<span className={styles.category}>{data.material}</span>
			// 		</div>
			// 		<div className={styles.listAction}>
			// 			<span className={styles.price}>€{data.b2c}</span>
			// 			<Button
			// 				icon="pi pi-shopping-cart"
			// 				label="Add to Cart"
			// 				onClick={(e) => updateBasket(e, data.artnr)}
			// 				disabled={data.stockStatus === 'OUTOFSTOCK'}></Button>
			// 			{/* <Button icon="pi pi-shopping-cart" label="Add to Cart" disabled={data.inventoryStatus === 'OUTOFSTOCK'}></Button>
			// 							<span className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}>{data.inventoryStatus}</span> */}
			// 		</div>
			// 		{/* </a> */}
			// 	</div>
			// </div>
		);
	};

	const renderGridItem = (data: ProductAxiosType) => {
		return (
			// <div className="col-3 ">
			<div className="col-12 md:col-6">
				<div className="product-grid-item card">
					<div className="product-grid-item-top">
						<div>
							<i className="pi pi-tag product-category-icon"></i>
							<span className="product-category">
								{data?.defaultCategory?.title}
							</span>
						</div>

						<span className={`status-${data?.stockStatus?.toLowerCase()}`}>
							{data.stockStatus}
						</span>
					</div>
					<div className="product-grid-item-content">
						<a
							onClick={() => {
								router.push(`/product/product-overview/${data.id}`);
							}}
							className="cursor-pointer ">
							<div style={{ display: 'flex', justifyContent: 'center' }}>
								<div
									style={{
										position: 'relative',
										overflow: 'hidden',
										width: '300px',
										height: '300px',
									}}>
									<Image
										src={`data:image/jpeg;base64,${data.imageData}`}
										alt={data.title}
										fill={true}
										style={{ objectFit: 'cover' }}
									/>
								</div>
							</div>

							<div className="product-name">{data.title}</div>
							<div className="product-description">{data.description}</div>
							<Rating value={data.popularity} readOnly cancel={false}></Rating>
						</a>
					</div>
					<div className="product-grid-item-bottom">
						<span className="product-price">€{data.b2c}</span>
						<Button
							icon="pi pi-shopping-cart"
							label="Add to Cart"
							onClick={(e) => updateBasket(e, data.artnr)}
							disabled={data.stockStatus === 'OUTOFSTOCK'}></Button>
					</div>
				</div>
			</div>
		);
	};

	const itemTemplate = (
		product: ProductAxiosType,
		layout: DataViewLayoutType
	) => {
		if (!product) {
			return;
		}

		if (layout === 'list') return renderListItem(product);
		else if (layout === 'grid') return renderGridItem(product);
	};

	const renderHeader = () => {
		return (
			<div className="grid grid-nogutter">
				<div className="col-6" style={{ textAlign: 'left' }}>
					<Dropdown
						options={sortOptions}
						value={sortKey}
						optionLabel="label"
						placeholder="Sort By Price"
						onChange={onSortChange}
					/>
				</div>
				<div className="col-6" style={{ textAlign: 'right' }}>
					<DataViewLayoutOptions
						layout={layout}
						onChange={(e) => setLayout(e.value)}
					/>
				</div>
			</div>
		);
	};

	const header = renderHeader();

	return (
		<>
			<DataView
				className="dataview-width"
				value={products}
				layout={layout}
				header={header}
				itemTemplate={itemTemplate}
				paginator
				rows={9}
				sortOrder={sortOrder}
				sortField={sortField}
			/>
		</>
	);
};

//export default ProductList;
