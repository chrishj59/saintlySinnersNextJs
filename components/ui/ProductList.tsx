'use client';
type DataViewLayoutType = 'list' | 'grid' | (string & Record<string, unknown>);
type DataViewSortOrderType = 1 | 0 | -1 | undefined | null;
import styles from '@/styles/ProductList.module.css';
import { useRouter } from 'next/navigation';
import { ProductAxiosType, variant, imageAWS } from '@/interfaces/product.type';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import Image from 'next/image';
import { basketContextType, useBasket } from '@/app/basket-context';
import { fetchGetJSON } from '@/utils/stripe-api-helpers';
import { AWS_DATA_TYPE } from '@/interfaces/awsData.type';
import {
	XtrProdAttributeValue,
	XtrProdEan,
	XtraderProduct,
	XtraderProductResp,
	xtrProdAttribute,
} from '@/interfaces/xtraderProduct.type';
import { JsxElement } from 'typescript';
import { isIterable } from '@/utils/helpers';
import { Editor } from 'primereact/editor';
import Link from 'next/link';

export default function ProductList({
	products,
	title,
	children,
}: {
	products: XtraderProductResp[];
	title: string;
	children: React.ReactNode;
}) {
	const toast = useRef<Toast>(null);
	const [productList, setProductList] =
		useState<XtraderProductResp[]>(products);
	const [sizeId, setSizeId] = useState<number>(0);
	const [subArtNr, setSubArtNr] = useState<string | undefined>(undefined);
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
	// if (products[0]) {
	// 	variants = products[0]['variants'];
	// }

	useEffect(() => {
		(async () => {
			// const _prodList = await Promise.all(
			// 	products.map(async (p: ProductAxiosType) => {
			// 		console.log(
			// 			`get stock status ${JSON.stringify(p.variants[0], null, 2)}`
			// 		);
			// 		if (p.variants[0]) {
			// 			p.stockStatus =
			// 				p.variants[0].inStock === 'Y' ? 'Available' : 'Unavailable';

			// 			p.subArtNr = p.variants[0].subArtNr;
			// 		}
			// 		// p.stockStatus =
			// 		// 	p['variants'][0]['inStock'] === 'Y' ? 'Available' : 'Unavailable';
			// 		// p.subArtNr = p['variants'][0]['subArtNr'];

			// 		return p;
			// 	})
			// );
			// for (const prod of _prodList) {
			// 	if (prod.images) {
			// 		prod.images.sort((a, b) =>
			// 			a.key > b.key ? 1 : b.key > a.key ? -1 : 0
			// 		);
			// 		if (prod.images[0]) {
			// 			const awsKey = prod.images[0].key;
			// 			const url = `/api/aws/productImage?awsKey=${awsKey}`;
			// 			const response = await fetch(url, { cache: 'no-cache' });
			// 			const awsData = (await response.json()) as AWS_DATA_TYPE[];
			// 			if (awsData[0]) {
			// 				const { imageData, imageFormat } = awsData[0];
			// 			}
			// 		}
			// 	}
			// }
			setProductList(products);
		})();
	}, [products]);
	const updateBasket = async (
		e: React.MouseEvent<HTMLButtonElement>,
		prod: XtraderProductResp
	) => {
		// const selectedProd = products.find((el) => el.subArtNr === value);

		// if (selectedProd) {
		// 	basket.addItem(selectedProd, 1);
		// }

		basket.addItem(prod, '', 1);

		toast.current?.show({
			severity: 'success',
			summary: 'Add to basket',
			// detail: `${selectedProd?.name} added to basket `,
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

	const onSetRadio = (e: RadioButtonChangeEvent, prod: XtraderProductResp) => {
		prod.sizeId = e.value;
		if (isIterable(prod.eans)) {
			const _selectedEan = prod.eans?.filter(
				(e: XtrProdEan) => e.value === e.value
			);
			if (_selectedEan && _selectedEan[0]) {
				prod.selectedEan = _selectedEan[0].value;
			}
		}

		setSizeId(e.value);
	};
	const renderRadioCheckBox = (prod: XtraderProductResp): React.ReactNode => {
		if (!prod.attributes) {
			return <></>;
		}
		if (!prod.attributes[0]) {
			return <></>;
		} else {
			const attribValues = prod.attributes[0].attributeValues;
			if (attribValues.length < 1) {
				return <></>;
			}

			return attribValues.map((attrib: XtrProdAttributeValue, i: number) => {
				const title = attrib.title;
				return (
					<div key={i + attrib.title} className="flex align-items-center mr-3">
						<RadioButton
							inputId={attrib.id?.toString()}
							name={attrib.title}
							value={attrib.id}
							onChange={(e) => onSetRadio(e, prod)}
							checked={prod.sizeId === attrib.id}
						/>
						<label htmlFor={attrib.id?.toString()} className="ml-2">
							{attrib.title}
						</label>
					</div>
				);
			});
		}
		// const eans = data.eans;
		// 	if(!eans){
		// 		return <></>
		// 	}
		// 	return eans.map((ean:XtrProdEan, i) => {
		// 		return (
		// 			<div key={i + ean.value} className="flex align-items-center mr-3">
		// 				<RadioButton
		// 					inputId={ean.value}
		// 					name={ean.code}
		// 					value={ean.value}
		// 					onChange={(e) => onSetVariant(e, data)}
		// 					checked={data.subArtNr === v.subArtNr}
		// 				/>
		// 				<label htmlFor={v.subArtNr} className="ml-2">
		// 					{v.sizeTitle}
		// 				</label>
		// 			</div>
		// 		);
		// 	});
		// return <div>radio</div>;
	};

	const renderSizeLine = (data: XtraderProductResp) => {
		if (!data.eans) {
			return <></>;
		}
		// const variants = data.variants;
		// // see if there is a sizeTitle in variants
		// const sizeIndex = variants.findIndex((v: variant) => v.sizeTitle);
		// if (sizeIndex === -1) {
		// 	//no size element exists
		// 	return <></>;
		// }
		return (
			<div className="flex flex-wrap gap-3">
				<div className="text-lg font-semibold">size:</div>
				<div className="flex align-items-center">
					{renderRadioCheckBox(data)}
				</div>
			</div>
		);
	};

	const renderGridItem = (data: XtraderProductResp) => {
		// if (data.variants && data.variants.length === 1) {
		// 	data.subArtNr = data.variants[0].subArtNr || '';
		// }
		// if (!data.variants) {
		// 	return <div></div>;
		// }
		// const itemVariant = data.variants[0];
		// console.log(`data.imageData ${data.imageData}`);

		const renderStockStatus = () => {
			const _stockStatus = data?.stockStatus
				? data?.stockStatus
				: 'Out of stock';
			if (_stockStatus === 'In Stock') {
				return (
					<span className={` ml-3 product-badge text-green-500`}>
						{_stockStatus}
					</span>
				);
			} else {
				return (
					<span className={` ml-3 product-badge text-red-500`}>
						{_stockStatus}
					</span>
				);
			}
		};

		const renderBrandImage = () => {
			if (data.brand && data.brand.imageData) {
				return (
					<Image
						src={`data:image/jpeg;base64,${data.brand && data.brand.imageData}`}
						alt={`waiting Brand image of ${data.name}`}
						// fill={true}
						// style={{ objectFit: 'cover' }}
						width={50}
						height={50}
					/>
				);
			} else {
				return <></>;
			}
			// return data.brand.imageName;
		};
		return (
			// <div className="col-3 ">
			<div className="col-12 md:col-6">
				<div className="product-grid-item card">
					<div className="product-grid-item-top">
						<div className="flex flex-row justify-content-between flex-wrap mb-3">
							<div>
								<i className="pi pi-tag product-category-icon"></i>
								{renderStockStatus()}
							</div>
							<span className="ml-3 font-medium text-500">
								{data.category && data.category.catName}
							</span>

							<div className="flex align-items-center justify-content-center">
								{renderBrandImage()}
							</div>
						</div>
						{/* <span className={`status-${data?.stockStatus?.toLowerCase()}`}>
							{data.stockStatus}
						</span> */}
					</div>
					<div className="product-grid-item-content">
						<a
							onClick={() => {
								router.push(`/product/productOverview/${data.id}`);
							}}
							className="cursor-pointer ">
							<div style={{ display: 'flex', justifyContent: 'center' }}>
								<div>
									<Image
										src={`data:image/jpeg;base64,${
											data.thumb && data.thumb.imageData
										}`}
										alt={`waiting image of ${data.name}`}
										// fill={true}
										// style={{ objectFit: 'cover' }}
										width={110}
										height={110}
									/>
								</div>
							</div>

							<div className={styles.name}>{data.name}</div>

							{/* <div
								className="product-description"
								dangerouslySetInnerHTML={{ __html: data.descriptionHtml }}
							/> */}
						</a>
						{/* <div className="mt-2">{renderSizeLine(data)}</div> */}
						<div className="mt-2">
							{/* <Rating value={data.popularity} readOnly cancel={false}></Rating> */}
						</div>
					</div>

					<div className={styles['product-grid-item-bottom']}>
						<span className="product-price">£ {data.retailPrice}</span>
						<Button
							icon="pi pi-shopping-cart"
							className="ml-3"
							label="Details"
							onClick={() => {
								router.push(`/product/productOverview/${data.id}`);
							}}
							disabled={data.stockStatus !== 'In Stock'}></Button>
					</div>
				</div>
			</div>
		);
	};

	const renderListItem = (data: XtraderProductResp) => {
		// if (data.variants && data.variants.length === 1) {
		// 	data.subArtNr = data.variants[0].subArtNr || '';
		// }
		return (
			<div className="col-12">
				<div className="grid">
					<div className="col-10">
						<Link href={`/product/productOverview/${data.id}`}>
							{/* <a
							onClick={() => {
								router.push(`/product/productOverview/${data.id}`);
							}}
							className="cursor-pointer "> */}
							<div className="grid">
								<div className="col-1">
									<Image
										src={`data:image/jpeg;base64,${
											data.thumb && data.thumb.imageData
										}`}
										alt={`waiting image of ${data.name}`}
										width={200}
										height={200}
									/>
								</div>
								<div className="col-10 flex align-items-center justify-content-center">
									<div className="text-bluegray-500">{data.name}</div>
								</div>
								<div className="col-1 flex align-items-center justify-content-center">
									<Image
										src={`data:image/jpeg;base64,${
											data.brand && data.brand.imageData
										}`}
										alt={`waiting image of ${data.name}`}
										width={100}
										height={100}
									/>
								</div>
							</div>
							{/* </a> */}
						</Link>
					</div>
					<div className="col-2 flex align-items-center justify-content-center">
						<Button
							icon="pi pi-shopping-cart"
							label="Details"
							style={{ marginLeft: '1rem' }}
							onClick={() => {
								router.push(`/product/productOverview/${data.id}`);
							}}
						/>
					</div>
				</div>
			</div>

			// <div className="col-12">
			// 	<div className="flex flex-row justify-content-between flex-wrap ">
			// 		<div>
			// 			{/* <a
			// 				onClick={() => {
			// 					router.push(`/product/productOverview/${data.id}`);
			// 				}}
			// 				className="cursor-pointer ">
			// 				{/* <div
			// 				style={{
			// 					display: 'flex',
			// 					justifyContent: 'left',
			// 					marginRight: '1rem',
			// 				}}> */}

			// 			<Image
			// 				src={`data:image/jpeg;base64,${
			// 					data.thumb && data.thumb.imageData
			// 				}`}
			// 				alt={`waiting image of ${data.name}`}
			// 				// fill={true}
			// 				// style={{ objectFit: 'cover' }}
			// 				width={200}
			// 				height={200}
			// 			/>

			// 			{/* </div> */}

			// 			{/* <div className="product-name">{data.title}</div>
			// 			<div className="product-description">{data.description}</div>
			// 			<Rating value={data.popularity} readOnly cancel={false}></Rating> */}

			// 			{/* <img src={`images/product/${data.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.name} /> */}
			// 			{/* <div className="product-list-detail"> */}
			// 			<div>{data.name}</div>

			// 			{/* <div
			// 					className={styles.description}
			// 					dangerouslySetInnerHTML={{
			// 						__html: data.descriptionHtml,
			// 					}}></div> */}
			// 			{/* {renderRadioCheckBox(data)} */}
			// 			{/* <Rating value={data.popularity} readOnly cancel={false}></Rating> */}
			// 			{/* <i className={styles.categoryIcon}></i>
			// 			<span className={styles.category}>{data.material}</span> */}
			// 			{/* </div> */}
			// 			{/* </a> */}
			// 		</div>
			// 		<div>
			// 			<div className="mt-3">
			// 				{/* <span className={styles.price}>£ {data.retailPrice}</span> */}
			// 				<Button
			// 					icon="pi pi-shopping-cart"
			// 					label="Details"
			// 					style={{ marginLeft: '1rem' }}
			// 					onClick={() => {
			// 						router.push(`/product/productOverview/${data.id}`);
			// 					}}
			// 					// onClick={(e) => updateBasket(e, data.subArtNr)}
			// 					// disabled={data.stockStatus === 'OUTOFSTOCK'}
			// 				></Button>
			// 			</div>
			// 			{/* <Button icon="pi pi-shopping-cart" label="Add to Cart" disabled={data.inventoryStatus === 'OUTOFSTOCK'}></Button>
			// 							<span className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}>{data.inventoryStatus}</span> */}
			// 		</div>
			// 	</div>
			// </div>
		);
	};

	const itemTemplate = (
		product: XtraderProductResp,
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
				<div className="col-2">
					<Dropdown
						options={sortOptions}
						value={sortKey}
						optionLabel="label"
						placeholder="Sort By Price"
						onChange={onSortChange}
					/>
				</div>
				<div className="col-8">
					<div className="flex justify-content-center">
						<div className="text-2xl font-bold text-900">{title}</div>
					</div>
				</div>
				<div className="col-2">
					<div className="flex justify-content-end">
						<DataViewLayoutOptions
							layout={layout}
							onChange={(e) => setLayout(e.value)}
						/>
					</div>
				</div>
			</div>
		);
	};

	const header = renderHeader();

	return (
		<>
			<Toast ref={toast} position="top-center" />
			<DataView
				className="dataview-width"
				emptyMessage="No products for this category. Please choose another category"
				value={productList}
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
}
