import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';

import { ProductAxiosType, variant } from '../interfaces/product.type';
import styles from '../styles/BrandProduct.module.css';
import { basketContextType, useBasket } from './ui/context/BasketContext';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { imageAWS } from '../interfaces/product.type';

type DataViewLayoutType = 'list' | 'grid' | (string & Record<string, unknown>);
type DataViewSortOrderType = 1 | 0 | -1 | undefined | null;

type AwsImageType = { imageData: string; imageFormat: string };

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const ProductList = ({ productParam }: any) => {
	const toast = useRef<Toast>(null);
	const [products, setProducts] = useState<ProductAxiosType[]>(productParam);
	const [subArtNr, setSubArtNr] = useState<string | undefined>(undefined);
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
	let variants;
	if (productParam[0]) {
		variants = productParam[0]['variants'];
	}
	useEffect(() => {
		(async () => {
			const prod = await Promise.all(
				productParam.map(async (p: any) => {
					p.stockStatus =
						p['variants'][0]['inStock'] === 'Y' ? 'Available' : 'Unavailable';
					p.subArtNr = p['variants'][0]['subArtNr'];
					const images: imageAWS[] = p['images'];
					images.sort((a, b) => (a.key > b.key ? 1 : b.key > a.key ? -1 : 0));
					if (p['images'][0]) {
						//const imgKey = p['images'][0]['key'];
						const imgKey = images[0].key;
						try {
							const { data } = await axios.get(
								`/api/v1/productImage/${imgKey}`
							);
							const { imageData, imageFormat } = data;
							p.variants = p['variants'];
							p.imageData = imageData;
							p.imageFormat = imageFormat;
						} catch (e) {
							console.log(`error getting image ${JSON.stringify(e, null, 2)}`);
						}
					}

					return p;
				})
			);
			setProducts(prod);
		})();
	}, [productParam]);

	const updateBasket = async (
		e: React.MouseEvent<HTMLButtonElement>,
		value?: string | undefined
	) => {
		console.log(`UpdateBasket called with value ${value}`);

		const selectedProd = products.find((el) => el.subArtNr === value);

		if (selectedProd) {
			basket.addItem(selectedProd, 1);
		}
		toast.current?.show({
			severity: 'success',
			summary: 'Add to basket',
			detail: `${selectedProd?.title} added to basket `,
			life: 4000,
		});
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
		if (data.variants && data.variants.length === 1) {
			data.subArtNr = data.variants[0].subArtNr || '';
		}
		return (
			<div className="col-12">
				<div className="product-list-item">
					<a
						onClick={() => {
							router.push(`/product/product-overview/${data.id}`);
						}}
						className="cursor-pointer ">
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								marginRight: '1rem',
							}}>
							<div
								style={{
									position: 'relative',
									overflow: 'hidden',
									width: '150px',
									height: '150px',
								}}>
								<Image
									src={`data:image/jpeg;base64,${data.imageData}`}
									alt={data.title}
									fill={true}
									style={{ objectFit: 'cover' }}
								/>
							</div>
						</div>

						{/* <div className="product-name">{data.title}</div>
						<div className="product-description">{data.description}</div>
						<Rating value={data.popularity} readOnly cancel={false}></Rating> */}
					</a>
					{/* <img src={`images/product/${data.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.name} /> */}
					<div className="product-list-detail">
						<div className={styles.name}>{data.title}</div>
						<div className={styles.description}>{data.description}</div>
						{renderRadioCheckBox(data)}
						<Rating value={data.popularity} readOnly cancel={false}></Rating>
						<i className={styles.categoryIcon}></i>
						<span className={styles.category}>{data.material}</span>
					</div>
					<div className={styles.listAction}>
						<span className={styles.price}>€{data.b2c}</span>
						<Button
							icon="pi pi-shopping-cart"
							label="Add to Cart"
							style={{ marginLeft: '1rem' }}
							onClick={(e) => updateBasket(e, data.subArtNr)}
							disabled={data.stockStatus === 'OUTOFSTOCK'}></Button>
						{/* <Button icon="pi pi-shopping-cart" label="Add to Cart" disabled={data.inventoryStatus === 'OUTOFSTOCK'}></Button>
										<span className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}>{data.inventoryStatus}</span> */}
					</div>
				</div>
			</div>
		);
	};

	const onSetVariant = (e: any, data: ProductAxiosType) => {
		console.log(`product id ${data.id}`);
		console.log(`e value ${e.value} target ${e.target.id}`);
		const newSubArtNr = e.value;
		console.log(`newSubArtNr ${newSubArtNr}`);
		setSubArtNr(e.vaue);
		data.subArtNr = e.value;
		console.log(`onSetVariant data.subArtNr ${e.value}`);
		renderRadioCheckBox(data);
	};

	const renderRadioCheckBox = (data: ProductAxiosType) => {
		const variants = data.variants;
		return variants.map((v: variant, i) => {
			return (
				<div key={i + v.subArtNr} className="flex align-items-center mr-3">
					<RadioButton
						inputId={v.subArtNr}
						name={v.sizeTitle}
						value={v.subArtNr}
						onChange={(e) => onSetVariant(e, data)}
						checked={data.subArtNr === v.subArtNr}
					/>
					<label htmlFor={v.subArtNr} className="ml-2">
						{v.sizeTitle}
					</label>
				</div>
			);
		});
	};

	const renderSizeLine = (data: ProductAxiosType) => {
		if (!data.variants) {
			return <></>;
		}
		const variants = data.variants;
		// see if there is a sizeTitle in variants
		const sizeIndex = variants.findIndex((v: variant) => v.sizeTitle);
		if (sizeIndex === -1) {
			//no size element exists
			return <></>;
		}
		return (
			<div className="flex flex-wrap gap-3">
				<div className="text-lg font-semibold">size:</div>
				<div className="flex align-items-center">
					{renderRadioCheckBox(data)}
				</div>
			</div>
		);
	};
	const renderGridItem = (data: ProductAxiosType) => {
		if (data.variants && data.variants.length === 1) {
			data.subArtNr = data.variants[0].subArtNr || '';
		}
		if (!data.variants) {
			return <div></div>;
		}
		const itemVariant = data.variants[0];

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
						</a>
						<div className="product-name">{data.title}</div>
						<div className="product-description">{data.description}</div>

						{renderSizeLine(data)}

						<div className="mt-2">
							<Rating value={data.popularity} readOnly cancel={false}></Rating>
						</div>
					</div>
					<div className="product-grid-item-bottom">
						<span className="product-price">€{data.b2c}</span>
						<Button
							icon="pi pi-shopping-cart"
							label="Add to Cart"
							onClick={(e) => updateBasket(e, data.subArtNr)}
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
			<Toast ref={toast} />
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
