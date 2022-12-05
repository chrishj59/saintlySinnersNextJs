import axios from 'axios';
import Image from 'next/image';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';
import React, { useEffect, useState } from 'react';

import { ProductAxiosType } from '../interfaces/product.type';
import styles from '../styles/BrandProduct.module.css';

type DataViewLayoutType = 'list' | 'grid' | (string & Record<string, unknown>);
type DataViewSortOrderType = 1 | 0 | -1 | undefined | null;

type AwsImageType = { imageData: string; imageFormat: string };

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const ProductList = ({ productParam }: any) => {
	const [products, setProducts] = useState<ProductAxiosType | any>(
		productParam
	);
	const [layout, setLayout] = useState<DataViewLayoutType>('grid');
	const [sortKey, setSortKey] = useState<string>('');
	const [sortOrder, setSortOrder] = useState<DataViewSortOrderType>(0);
	const [sortField, setSortField] = useState<string>('');
	const sortOptions = [
		{ label: 'Price High to Low', value: '!price' },
		{ label: 'Price Low to High', value: 'price' },
	];
	console.log('productParam');
	console.log(productParam);
	console.log('prodPam index 0');
	console.log(productParam[0]);
	console.log('product image key');
	console.log(productParam[0]['images'][0]['key']);
	let variants: any;
	if (productParam[0]) {
		variants = productParam[0]['variants'];
	}
	console.log('variants');
	console.log(variants);
	// const { data, error } = useSwr<AwsImageType>(
	// 	'/api/v1/productImage/cdn.edc.nl_500_560430_2.jpg',
	// 	fetcher
	// );
	console.log('image from useSwr');
	// console.log(data?.imageData);
	// console.log(error);
	useEffect(() => {
		(async () => {
			console.log('async called');
			const prod = await Promise.all(
				productParam.map(async (p: any) => {
					console.log(`prod id ${p.id}`);
					console.log(p['variants'][0]['inStock']);
					p.stockStatus =
						p['variants'][0]['inStock'] === 'Y' ? 'Available' : 'Unavailable';
					const imgKey = p['images'][0]['key'];
					// console.log('imgkey');
					// console.log(imgKey);
					// const { data, error } = useSWR<AwsImageType>(
					// 	`/api/v1/productImage/${imgKey}`,
					// 	fetcher
					// );
					const { data } = await axios.get(`/api/v1/productImage/${imgKey}`);
					const { imageData, imageFormat } = data;

					p.imageData = imageData;
					p.imageFormat = imageFormat;
					//const imageData = await axios.get('/api/productImage', { params: {imgKey}})
					return p;
				})
			);
			setProducts(prod);
		})();
	}, [productParam]);
	console.log('products');
	console.log(products);

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
		return (
			<div className="col-12">
				<div className="product-list-item">
					{/* <img src={`images/product/${data.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.name} /> */}
					<div className="product-list-detail">
						<div className={styles.name}>{data.title}</div>
						<div className={styles.description}>{data.description}</div>
						{/* <Rating value={data.rating} readOnly cancel={false}></Rating> */}
						<i className={styles.categoryIcon}></i>
						<span className={styles.category}>{data.material}</span>
					</div>
					<div className={styles.listAction}>
						<span className={styles.price}>€{data.b2c}</span>
						{/* <Button icon="pi pi-shopping-cart" label="Add to Cart" disabled={data.inventoryStatus === 'OUTOFSTOCK'}></Button>
										<span className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}>{data.inventoryStatus}</span> */}
					</div>
				</div>
			</div>
		);
	};

	const renderGridItem = (data: ProductAxiosType) => {
		return (
			// <div className="col-3 ">
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
					{/* <img src={`images/product/${data.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.name} /> */}
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
				</div>
				<div className="product-grid-item-bottom">
					<span className="product-price">€{data.b2c}</span>
					<Button
						icon="pi pi-shopping-cart"
						label="Add to Cart"
						disabled={data.stockStatus === 'OUTOFSTOCK'}></Button>
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
			{/* <Image
				src={`data:image/jpeg;base64,${data?.imageData}`}
				alt="Landscape picture"
				width={300}
				height={300}
			/> */}

			<DataView
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
