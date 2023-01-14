import { useUser } from '@auth0/nextjs-auth0';
import axios from 'axios';
import { basketContextType, useBasket } from 'components/ui/context/BasketContext';
import { GetStaticProps, NextPage } from 'next';
import getConfig from 'next/config';
import Image from 'next/image';
import { Button } from 'primereact/button';
import { Galleria } from 'primereact/galleria';
import { InputNumber } from 'primereact/inputnumber';
import { TabPanel, TabView } from 'primereact/tabview';
import { classNames } from 'primereact/utils';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

import { bulletPoint, imageAWS, ProductAxiosType } from '../../../interfaces/product.type';

type AwsImageType = { imageData: string; imageFormat: string };

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const ProductOverview: NextPage = ({ prod, id }: any) => {
	console.log('products');
	console.log(prod);
	const [colour, setColour] = useState<string>('bluegray');
	const [colours, setColours] = useState<string[]>([]);
	const [clothingSize, setClothingSize] = useState<string[]>([]);
	const [size, setSize] = useState<string>('Medium');
	const [quantity, setQuantity] = useState<number>(1);
	const [liked, setLiked] = useState<boolean>(false);
	const [bullets, setBullets] = useState<string[]>([]);
	const [insertdepth, setInsertdepth] = useState<string>('');
	const [length, setlength] = useState<string>('');
	const [maxDiameter, setmaxDiameter] = useState<string>('');
	const [mainCategory, setMainCategory] = useState<string>('');
	const [fit, setFit] = useState<string>('');
	const [sizeFit, setSizeFit] = useState<string>('');
	const [ironing, setIroning] = useState<boolean>(false);
	const [washingTemp, setWashingTemp] = useState<string | undefined>(undefined);
	const [images, setImages] = useState<AwsImageType[]>([]);

	const { user, isLoading } = useUser();
	const basket: basketContextType = useBasket();
	const getPropStringValue = (propName: string): string | undefined => {
		const _prop = prod['properties'].find(
			(prop: any) => prop.propTitle === propName
		);
		if (_prop) {
			const _fitValues = _prop.values;
			const _propValue = _fitValues.map((v: any) => v.title);
			return _propValue;
		}
	};

	const galleriaResponsiveOptions = [
		{
			breakpoint: '1024px',
			numVisible: 5,
		},
		{
			breakpoint: '768px',
			numVisible: 3,
		},
		{
			breakpoint: '560px',
			numVisible: 1,
		},
	];

	useEffect(() => {
		console.log('start use effect');
		// main category
		const _categories = prod['newCategories'];
		const _mainCategory = _categories[0]['title'];
		setMainCategory(_mainCategory);
		// colours
		const _colour = prod['properties'].find(
			(prop: any) => prop.propTitle === 'Colour'
		);
		const _colourValues = _colour.values;
		const _colourNames = _colourValues.map((v: any) => {
			return v.title;
		});
		setColours(_colourNames);

		const _clothingSizeProp = prod['properties'].find(
			(prop: any) => prop.propTitle === 'Clothing sizes'
		);
		if (_clothingSizeProp) {
			const _clothungSizevalues = _clothingSizeProp.values;
			const _clothingSizeNames = _clothungSizevalues.map((c: any) => {
				return c.title;
			});
			setClothingSize(_clothingSizeNames);
		}
		// Set bullet points
		const _bulletPoints = prod['bullets'];
		const _bullets: string[] = _bulletPoints.map((b: bulletPoint) => {
			return b.description;
		});
		setBullets(_bullets);

		// insertion depth

		const _insertdepthProp = prod['properties'].find(
			(prop: any) => prop.propTitle === 'Insertion depth'
		);

		if (_insertdepthProp) {
			const _intertdepthvalues = _insertdepthProp.values;
			const _insertepth = _intertdepthvalues.map((v: any) => {
				return `${v.magnitude} ${v.unit}`;
			});
			setInsertdepth(_insertepth);
		}
		//length
		const _lengthProp = prod['properties'].find(
			(prop: any) => prop.propTitle === 'Length'
		);
		if (_lengthProp) {
			const _lengthValues = _lengthProp.values;
			const _length = _lengthValues.map((v: any) => {
				return `${v.magnitude} ${v.unit}`;
			});
			setlength(_length);
		}
		// maxDiameter
		const _maxDimeterProp = prod['properties'].find(
			(prop: any) => prop.propTitle === 'Maximum diameter'
		);
		if (_maxDimeterProp) {
			const _maxDiameterValues = _maxDimeterProp.values;
			const _maxDiamter = _maxDiameterValues.map((v: any) => {
				return `${v.magnitude} ${v.unit}`;
			});
			setmaxDiameter(_maxDiamter);
		}

		// fit
		const _fit = getPropStringValue('Fit');

		if (_fit) {
			setFit(_fit);
		}

		//Size Fit
		const _sizeFit = getPropStringValue('Size Fit');

		if (_sizeFit) {
			setSizeFit(_sizeFit);
		}
		// Washing temperature
		const _washingTemp = getPropStringValue('Washing temperature');
		setWashingTemp(_washingTemp);
	}, []);
	console.log(`fit: ${fit}`);

	const contextPath = getConfig().publicRuntimeConfig.contextPath;

	console.log(`user ${user}`);
	// get images

	const fetcher = async (apiURL: string) =>
		await axios.get(apiURL).then((res) => res.data);
	const imageList: imageAWS[] = prod['images'];
	imageList.forEach((el) => {
		console.log(`for loop key ${el['key']}`);
		const imgUrl = `/api/v1/productImage/${el['key']}`;

		const { data, error } = useSWR<AwsImageType, any>(imgUrl, fetcher);
		if (data) {
			if (!images) {
				const _images: any[][0] = data;
				setImages(_images);
			} else {
				const _images = { ...images };
				images?.push(data);
			}
		}
	});

	const updateBasket = async () => {
		basket.addItem(prod, quantity);
	};

	const likeProd = () => {
		if (user) {
			setLiked(!liked);
		}
	};
	// galeria item template and thumbnail
	const itemTemplate = (item: any): React.ReactNode => {
		return (
			<div
				style={{
					position: 'relative',
					overflow: 'hidden',
					width: '380px',
					height: '380px',
				}}>
				<Image
					src={`data:image/jpeg;base64,${item.imageData}`}
					alt={prod.title}
					fill={true}
					style={{ objectFit: 'cover' }}
				/>
			</div>
		);
	};

	const thumbnailTemplate = (item: any): React.ReactNode => {
		return (
			<div
				style={{
					position: 'relative',
					overflow: 'hidden',
					width: '60px',
					height: '60px',
				}}>
				<Image
					src={`data:image/jpeg;base64,${item.imageData}`}
					alt={prod.title}
					fill={true}
					style={{ objectFit: 'cover' }}
				/>
			</div>
		);
	};

	const colourLines = () => {
		return colours.map((c: string, i: number) => {
			/** white and black dont have gradients in colours */
			if (c === 'White') {
				return (
					<div
						key={`White${i}`}
						className="w-2rem h-2rem flex-shrink-0 border-circle bg-red-500 mr-3 cursor-pointer border-2 surface-border transition-all transition-duration-300"
						style={{
							boxShadow: colour === 'White' ? '0 0 0 0.2rem white' : undefined,
						}}
						onClick={() => setColour('White')}></div>
				);
			} else if (c === 'Black') {
				return (
					<div
						key={`Black${i}`}
						className="w-2rem h-2rem flex-shrink-0 border-circle bg-red-500 mr-3 cursor-pointer border-2 surface-border transition-all transition-duration-300"
						style={{
							boxShadow: colour === 'Black' ? '0 0 0 0.2rem black' : undefined,
						}}
						onClick={() => setColour('Black')}></div>
				);
			} else {
				const colourButton = `w-2rem h-2rem flex-shrink-0 border-circle bg-${c.toLowerCase()}-500 mr-3 cursor-pointer border-2 surface-border transition-all transition-duration-300`;
				return (
					<div
						key={`c${i}`}
						className={colourButton}
						style={{
							boxShadow:
								colour === c
									? `0 0 0 0.2rem var(--${c.toLowerCase()}-500)`
									: undefined,
						}}
						onClick={() => setColour(c)}></div>
				);
			}
		});
	};
	const renderColour = () => {
		if (!colours || colours.length === 0) {
			return <></>;
		}
		return (
			<>
				<div className="font-bold text-900 mb-3">Color</div>
				<ul>
					<div className="flex align-items-center mb-5">{colourLines()}</div>
				</ul>
			</>
		);
	};

	const renderSize = () => {
		if (clothingSize.length === 0) {
			return <div> NO size </div>;
		}
		return (
			// size label
			<>
				<div className="mb-3 flex align-items-center justify-content-between">
					<span className="font-bold text-900">Size</span>
				</div>

				{/* Size options */}

				<div className="grid grid-nogutter align-items-center mb-5">
					<div
						className={classNames(
							'col h-3rem border-1 border-300 text-900 inline-flex justify-content-center align-items-center flex-shrink-0 border-round mr-3 cursor-pointer hover:surface-100 transition-duration-150 transition-colors',
							{ 'border-primary border-2 text-primary': size === 'Small' }
						)}
						onClick={() => setSize('Small')}>
						S
					</div>
					<div
						className={classNames(
							'col h-3rem border-1 border-300 text-900 inline-flex justify-content-center align-items-center flex-shrink-0 border-round mr-3 cursor-pointer hover:surface-100 transition-duration-150 transition-colors',
							{ 'border-primary border-2 text-primary': size === 'Medium' }
						)}
						onClick={() => setSize('Medium')}>
						M
					</div>
					<div
						className={classNames(
							'col h-3rem border-1 border-300 text-900 inline-flex justify-content-center align-items-center flex-shrink-0 border-round mr-3 cursor-pointer hover:surface-100 transition-duration-150 transition-colors',
							{ 'border-primary border-2 text-primary': size === 'Large' }
						)}
						onClick={() => setSize('Large')}>
						L
					</div>
					<div
						className={classNames(
							'col h-3rem border-1 border-300 text-900 inline-flex justify-content-center align-items-center flex-shrink-0 border-round cursor-pointer hover:surface-100 transition-duration-150 transition-colors',
							{
								'border-primary border-2 text-primary': size === 'X-Large',
							}
						)}
						onClick={() => setSize('X-Large')}>
						XL
					</div>
				</div>
			</>
		);
	};

	const renderBullets = () => {
		return bullets.map((b: string, i: number) => (
			<li key={`b${i}`} className="mb-2">
				{b}
			</li>
		));
	};

	const col3lines = (): JSX.Element | null => {
		const _categories = prod['newCategories'];
		const analToy = _categories.find((cat: any) => cat.title === 'Anal Toys');
		const clothing = _categories.find(
			(cat: any) => cat.title === 'Sexy Lingerie & Clothing'
		);
		if (analToy) {
			return (
				<>
					<li className="mb-3">
						<span className="font-semibold">
							{length.length > 0 ? 'Length:' : undefined}
						</span>{' '}
						{length.length > 0 ? length : undefined}
					</li>
					<li className="mb-3">
						<span className="font-semibold">
							{insertdepth.length > 0 ? 'Insertion depth:' : undefined}
						</span>{' '}
						{insertdepth.length > 0 ? insertdepth : undefined}
					</li>
					<li className="mb-3">
						<span className="font-semibold">
							{maxDiameter.length > 0 ? 'Maximum diameter:' : undefined}
						</span>{' '}
						{maxDiameter.length > 0 ? maxDiameter : undefined}
					</li>
				</>
			);
		}
		if (clothing) {
			return (
				<>
					<li className="mb-3">
						<span className="font-semibold">
							{fit.length > 0 ? 'Fit:' : undefined}
						</span>{' '}
						{fit.length > 0 ? fit : undefined}
					</li>
					<li>
						<span className="font-semibold">
							{sizeFit.length > 0 ? 'Fit size:' : undefined}
						</span>{' '}
						{sizeFit.length > 0 ? sizeFit : undefined}
					</li>
				</>
			);
		}
		return (
			<>
				<li className="mb-3">
					<span className="font-semibold">Sociis natoque 2:</span> Parturient
					montes nascetur.
				</li>
				<li>
					<span className="font-semibold">Suspendisse in:</span> Purus sit amet
					volutpat.
				</li>
			</>
		);
	};
	const renderCol3 = () => {
		return (
			<>
				<span className="text-900 block mb-3 font-bold">
					{mainCategory === 'Sex Toys' ? 'Size' : 'Size and Fit'}{' '}
				</span>
				<ul className="list-none p-0 m-0 text-600 mb-4 text-600">
					{col3lines()}
				</ul>
			</>
		);
	};

	const materialLine = (name: string) => {
		if (name === 'Ironing') {
			if (!ironing) {
				return (
					<li className="mb-3">
						<i className="pi pi-times-circle mr-2 text-900"></i>
						<span>Do not iron</span>
					</li>
				);
			} else {
				return (
					<li className="mb-3">
						<i className="pi pi-check-circle mr-2 text-900"></i>
						<span>Iron medium heat</span>
					</li>
				);
			}
		}

		// washing temperature
		if (washingTemp) {
			return (
				<li className="mb-3">
					<i className="pi pi-cog mr-2 text-900"></i>
					<span>Washng temperature: </span> {washingTemp}
				</li>
			);
		}
	};
	const materialCare = () => {
		if (mainCategory === 'Sex Toys') {
			return (
				<>
					<span className="text-900 block mb-3 font-bold">Material</span>
					<ul className="list-none p-0 m-0 text-600 mb-4 text-600">
						<li className="mb-3">
							<i className=" mr-2 text-900"></i>
							<span>{prod.material}</span>
						</li>
					</ul>
				</>
			);
		}
		if (mainCategory === 'Sexy Lingerie & Clothing') {
			return (
				<>
					<span className="text-900 block mb-3 font-bold">Material & Care</span>

					<ul className="list-none p-0 m-0 text-600 mb-4 text-600">
						<>
							<li className="mb-3">
								<i className=" mr-2 text-900"></i>
								<span>{prod.material}</span>
							</li>
							{materialLine('Ironing')}
							{materialLine('Washing temperature')}
						</>
					</ul>
				</>
			);
		}
		return (
			<>
				{' '}
				<span className="text-900 block mb-3 font-bold">Material & Care</span>
				<ul className="p-0 m-0 flex flex-wrap flex-column xl:flex-row text-600">
					<li className="flex align-items-center white-space-nowrap w-10rem block mr-2 mb-3">
						<i className="pi pi-sun mr-2 text-900"></i>
						<span>Not dryer safe</span>
					</li>
					<li className="flex align-items-center white-space-nowrap w-10rem block mb-3">
						<i className="pi pi-times-circle mr-2 text-900"></i>
						<span>No chemical wash</span>
					</li>
					<li className="flex align-items-center white-space-nowrap w-10rem block mb-3 mr-2">
						<i className="pi pi-sliders-h mr-2 text-900"></i>
						<span>Iron medium heat</span>
					</li>
					<li className="flex align-items-center white-space-nowrap w-10rem block mb-3">
						<i className="pi pi-minus-circle mr-2 text-900"></i>
						<span>Dry flat</span>
					</li>
				</ul>
			</>
		);
	};
	return (
		<div className="surface-section px-6 py-6 border-1 surface-border border-round">
			<div className="grid mb-7">
				{/* top section of the page */}
				<div className="col-12 lg:col-7">
					{/* Left images block */}
					<div className="flex">
						<div className="pl-3 w-10 flex">
							<Galleria
								value={images}
								responsiveOptions={galleriaResponsiveOptions}
								numVisible={5}
								style={{ maxWidth: '380px' }}
								item={itemTemplate}
								thumbnail={thumbnailTemplate}
								autoPlay={true}
								circular={true}
							/>
						</div>
					</div>
				</div>
				<div className="col-12 lg:col-4 py-3 lg:pl-6">
					{/* Block to right of picture */}
					<div className="flex align-items-center text-xl font-medium text-900 mb-4">
						{prod.title}
					</div>
					<div className="flex align-items-center justify-content-between mb-5">
						{/* Price row */}
						<span className="text-900 font-medium text-3xl block">
							€ {prod.b2c}
						</span>
					</div>
					{/* Colour block */}
					{renderColour()}
					{/* <div className="font-bold text-900 mb-3">Color</div>
					<ul>
						<div className="flex align-items-center mb-5">
							<>{renderColour()}</>
						</div>
					</ul> */}
					{/* Size block */}
					<>{renderSize()}</>

					<div className="font-bold text-900 mb-3">Quantity</div>
					<div className="flex flex-column sm:flex-row sm:align-items-center sm:justify-content-between">
						<InputNumber
							showButtons
							buttonLayout="horizontal"
							min={0}
							inputClassName="w-3rem text-center"
							value={quantity}
							onChange={(e) => setQuantity(e.value || 1)}
							decrementButtonClassName="p-button-text"
							incrementButtonClassName="p-button-text"
							incrementButtonIcon="pi pi-plus"
							decrementButtonIcon="pi pi-minus"></InputNumber>
						<div className="flex align-items-center flex-1 mt-3 sm:mt-0 ml-0 sm:ml-5">
							<Button
								label="Add to Cart"
								className="flex-1 mr-5"
								onClick={() => updateBasket()}></Button>
							<i
								className={classNames('pi text-2xl cursor-pointer', {
									'pi-heart text-600': !liked,
									'pi-heart-fill text-orange-500': liked,
								})}
								onClick={() => likeProd()}></i>
						</div>
					</div>
				</div>
			</div>
			{/*info box at bottom of page  */}
			<TabView>
				<TabPanel header="Details">
					<div className="text-900 font-bold text-3xl mb-4 mt-2">
						Product Details
					</div>
					<p className="line-height-3 text-600 p-0 mx-0 mt-0 mb-4">
						{prod.description}
					</p>
					{/* details grid */}
					<div className="grid">
						<div className="col-12 lg:col-4">
							<span className="text-900 block font-medium mb-3 font-bold">
								Highlights
							</span>
							<ul className="py-0 pl-3 m-0 text-600 mb-3">
								{renderBullets()}
								{/* <li className="mb-2">Vulputate sapien nec.</li>
								<li className="mb-2">Purus gravida quis blandit.</li>
								<li className="mb-2">Nisi quis eleifend quam adipiscing.</li>
								<li>Imperdiet proin fermentum.</li> */}
							</ul>
						</div>

						{/* Size and fit block */}
						<div className="col-12 lg:col-4">{renderCol3()}</div>
						{/* Material and care */}
						<div className="col-12 lg:col-4">{materialCare()}</div>
					</div>
				</TabPanel>
				<TabPanel header="Reviews">
					<div className="text-900 font-bold text-3xl mb-4 mt-2">
						Customer Reviews
					</div>
					<div className="text-500  text-3xl mb-4 mt-2">
						<p>No reviews yet. After your purchase you can create a review. </p>
						<p>Only registered users can submit a review</p>
					</div>
				</TabPanel>
			</TabView>
		</div>
	);
};
export const getStaticPaths = async () => {
	const { data } = await axios.get<ProductAxiosType[]>(
		process.env.EDC_API_BASEURL + `/productId`
	);
	return {
		paths: data.map((b) => {
			return {
				params: {
					id: `${b.id}`,
				},
			};
		}),
		fallback: 'blocking',
	};
};
export const getStaticProps: GetStaticProps = async (context) => {
	const id = context.params?.id;
	let prod: any;
	try {
		const url = `/product/${id}`;
		const { data } = await axios.get(process.env.EDC_API_BASEURL + url);
		prod = data;
	} catch (e) {
		console.log('Could not find product');
		console.log(e);
	}
	return {
		props: { prod, id },
		revalidate: 1, // regenerate the page
	};
};

export default ProductOverview;
