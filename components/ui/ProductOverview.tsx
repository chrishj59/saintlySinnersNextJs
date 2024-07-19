'use client';

import { GetObjectCommand } from '@aws-sdk/client-s3';
import { classNames } from 'primereact/utils';
import {
	ProductAxiosType,
	bulletPoint,
	property,
	propertyValue,
	variant,
} from '@/interfaces/product.type';
import {
	MouseEventHandler,
	useState,
	useEffect,
	useRef,
	MouseEvent,
} from 'react';
import { basketContextType, useBasket } from '@/app/basket-context';
import Image from 'next/image';
import { Toast } from 'primereact/toast';
// import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Galleria } from 'primereact/galleria';
import { AWS_DATA_TYPE } from '@/interfaces/awsData.type';
import { Button } from 'primereact/button';
import { TabPanel, TabView } from 'primereact/tabview';
import {
	XtrProdAttributeValue,
	XtrProdEan,
	XtrStockImage,
	XtraderProduct,
	XtraderProductResp,
	xtrProdAttribute,
} from '@/interfaces/xtraderProduct.type';
import { Card } from 'primereact/card';
import { useRouter } from 'next/navigation';
import { listenerCount } from 'stream';
import { isIterable } from '@/utils/helpers';
import { Dialog } from 'primereact/dialog';
import { useSession } from 'next-auth/react';

export default function ProductOverview({
	product,
	images,
	children,
}: {
	product: XtraderProductResp;
	images: AWS_DATA_TYPE[];
	children: React.ReactNode;
}) {
	console.log(
		`Product passed to Paroduct Overview ${JSON.stringify(
			product.brand,
			null,
			2
		)}`
	);
	const session = useSession();
	const user = session.data?.user;
	const router = useRouter();
	const toast = useRef<Toast>(null);
	const [colour, setColour] = useState<string>('bluegray');
	const [colours, setColours] = useState<string[]>([]);
	const [clothingSize, setClothingSize] = useState<string[]>([]);
	const [subArtNr, setSubArtNr] = useState<string>('');
	const [currEan, setCurrEan] = useState<string>(' ');
	const [sizeId, setSizeId] = useState<number>(0);
	const [canAddToCart, setCanAddToCart] = useState<boolean>(false);
	const [restricted, setRestricted] = useState<boolean>(false);
	const [item, setItem] = useState<XtraderProductResp>();
	const [xtrImages, setXtrImages] = useState<XtrStockImage[]>();
	const [quantity, setQuantity] = useState<number>(1);
	const [liked, setLiked] = useState<boolean>(false);
	const [sizeDialog, setSizeDialog] = useState<boolean>(false);
	const [bullets, setBullets] = useState<string[]>([]);
	const [insertdepth, setInsertdepth] = useState<string>('');
	const [length, setlength] = useState<string>('');
	const [maxDiameter, setmaxDiameter] = useState<string>('');
	const [mainCategory, setMainCategory] = useState<string>('');
	const [fit, setFit] = useState<string>('');
	const [sizeFit, setSizeFit] = useState<string>('');
	const [ironing, setIroning] = useState<boolean>(false);
	const [washingTemp, setWashingTemp] = useState<string | undefined>(undefined);
	// const { user, isLoading } = useUser();
	const basket: basketContextType = useBasket();

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
		if (product.stripeRestricted) {
			setRestricted(true);
		}
		if (!product.attributes) {
			setCanAddToCart(true);
		} else {
			if (isIterable(product.attributes)) {
				for (const attribute of product.attributes) {
					attribute.attributeValues.sort((a, b) =>
						b.title.localeCompare(a.title)
					);

					if (attribute.name === 'Size') {
						if (isIterable(attribute.attributeValues)) {
							const attrValue = attribute.attributeValues[0];
							const sockStatus =
								attrValue.stockStatus === 'In Stock' ? true : false;
							setSizeId(attrValue.id);
							setCanAddToCart(sockStatus);
						}
					}
				}
			}
		}
		setItem(product);
		if (product.ean) {
			setCurrEan(product.ean);
		}
		const _ximages: XtrStockImage[] = [];
		if (product.ximage?.imageData) {
			_ximages.push(product.ximage);
		}
		if (product.ximage2?.imageData) {
			_ximages.push(product.ximage2);
		}
		if (product.ximage3?.imageData) {
			_ximages.push(product.ximage3);
		}
		if (product.ximage4?.imageData) {
			_ximages.push(product.ximage4);
		}
		if (product.ximage5?.imageData) {
			_ximages.push(product.ximage5);
		}
		if (product.bigmulti1?.imageData) {
			_ximages.push(product.bigmulti1);
		}
		if (product.bigmulti2?.imageData) {
			_ximages.push(product.bigmulti2);
		}
		if (product.bigmulti3?.imageData) {
			_ximages.push(product.bigmulti3);
		}

		setXtrImages(_ximages);

		// main category

		const _category = product.category;
		const _mainCategory = _category.catName;
		setMainCategory(_mainCategory);
	}, [product]);

	const updateBasket = async () => {
		const _prod = product;

		let attributeStr: string = '';
		const attributes = _prod.attributes;
		if (attributes && isIterable(attributes)) {
			for (const attr of attributes) {
				const attrValues = attr.attributeValues;
				if (attrValues && isIterable(attrValues)) {
					const itemAttrVal = attrValues.find(
						(item: XtrProdAttributeValue) => item.id === sizeId
					);

					if (itemAttrVal) {
						attributeStr = attributeStr.concat(
							`\{${attr.name}\}${itemAttrVal?.title}`
						);
						attributeStr = attributeStr.trim();
						console.log(`build attributeStr ${attributeStr}`);
					}
				}
			}
		}

		console.log(
			`before call add item ${JSON.stringify(attributeStr, null, 2)}`
		);
		basket.addItem(_prod, attributeStr, quantity);
		toast.current?.show({
			severity: 'success',
			summary: 'Add to basket',
			// detail: `${selectedProd?.name} added to basket `,
			life: 4000,
		});
	};
	const likeProd = () => {
		if (session.status === 'authenticated') {
			setLiked(!liked);
		}
	};

	// galeria item template and thumbnail
	const itemTemplate = (item: XtrStockImage): React.ReactNode => {
		return (
			<Image
				src={`data:image/jpeg;base64,${item.imageData}`}
				alt={product.name}
				// fill={true}
				sizes="100vw"
				width={400}
				height={400}
				// style={{ marginLeft: '15px' }}
				style={{
					width: '100%',
					height: 'auto',
				}}
			/>
		);
	};
	const thumbnailTemplate = (item: XtrStockImage): React.ReactNode => {
		return (
			<div
			// style={{
			// 	position: 'relative',
			// 	overflow: 'hidden',
			// 	width: '60px',
			// 	height: '60px',
			// }}
			>
				<Image
					src={`data:image/jpeg;base64,${item.imageData}`}
					alt={product.name}
					width={60}
					height={60}
					// fill={true}
					// style={{ objectFit: 'cover' }}
				/>
			</div>
		);
	};

	// const onSetRadio = (e: RadioButtonChangeEvent) => {
	// 	setSizeId(e.value);
	// };

	const onRadioChange = (e: any) => {
		console.log(`e.currentTarget.value ${e.currentTarget.value}`);
		setSizeId(Number(e.currentTarget.value));
	};

	const colourLines = () => {
		return colours.map((c: string, i: number) => {
			/** white and black dont have gradients in colours */
			if (c === 'White') {
				return (
					<div
						key={`White${i}`}
						className="w-2rem h-2rem flex-shrink-0 border-circle bg-bluegray-50 mr-3 cursor-pointer border-2 surface-border transition-all transition-duration-300"
						style={{
							boxShadow: colour === 'White' ? '0 0 0 0.2rem white' : undefined,
						}}
						onClick={() => setColour('White')}></div>
				);
			} else if (c === 'Black') {
				return (
					<div
						key={`Black${i}`}
						className="w-2rem h-2rem flex-shrink-0 border-circle bg-bluegray-900 mr-3 cursor-pointer border-2 surface-border transition-all transition-duration-300"
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

	const renderRadioCheckBox = (attributes: xtrProdAttribute[]) => {
		if (!product.attributes) {
			return <></>;
		}

		const attribValues = attributes[0].attributeValues;

		if (attribValues.length < 1) {
			return <></>;
		}

		const nonXsizes = attribValues.filter(
			(attrib: XtrProdAttributeValue) => !attrib.title.startsWith('X')
		);
		const xsizes = attribValues.filter((attrib: XtrProdAttributeValue) =>
			attrib.title.startsWith('X')
		);
		const _attribValues = nonXsizes;
		for (const xsize of xsizes) {
			_attribValues.push(xsize);
		}

		let _sizeId = _attribValues[0].id;
		if (_sizeId && _sizeId === 0) {
			setSizeId(_sizeId);
		}
		return _attribValues.map((attrib: XtrProdAttributeValue, i: number) => {
			const attrKey = `${i}${attrib.atrributeValueId}`;

			return (
				<div key={attrKey} className="flex align-items-center mr-3">
					<input
						type="radio"
						name="size"
						value={attrib.id}
						id={attrib.id.toString()}
						checked={sizeId === attrib.id}
						disabled={!canAddToCart}
						onChange={(e) => onRadioChange(e)}
					/>
					<label htmlFor={attrib.id.toString()} className="ml-2">
						{attrib.title}
					</label>
				</div>
			);
		});
	};

	const renderSize = () => {
		if (!product.attributes) {
			return <></>;
		}
		const sizeAttribute = product.attributes.filter((i) => i.attributeId === 2);
		if (sizeAttribute.length === 0) {
			// return <div>no size attribute</div>;
			return <></>;
		}
		return (
			// size label
			<>
				<div className="mb-3 flex align-items-center justify-content-between">
					<span className="font-bold text-900">Size</span>
				</div>

				{/* Size options */}

				<div className="grid grid-nogutter align-items-center mb-5">
					{renderRadioCheckBox(sizeAttribute)}
				</div>
			</>
		);
	};

	const prodLineStr = (lineNum: number, label: string, value: string) => {
		const line = (
			<li key={lineNum}>
				<div className="grid">
					<div className="col-fixed" style={{ width: '100px' }}>
						<div className="text-left font-bold">{label}:</div>
					</div>
					<div className="col">
						<div className="text-left">{value}</div>
					</div>
				</div>
			</li>
		);
		return line;
	};

	const prodLineBoolean = (
		lineNum: number,
		label: string,
		value: boolean | undefined
	) => {
		const valueText = value === true ? 'Yes' : 'No';
		const line = (
			<li key={lineNum}>
				<div className="grid">
					<div className="col-fixed" style={{ width: '100px' }}>
						<div className="text-left font-bold">{label}:</div>
					</div>
					<div className="col">
						<div className="text-left">{valueText}</div>
					</div>
				</div>
			</li>
		);
		return line;
	};
	const productInfoList = () => {
		const lines: JSX.Element[] = [];

		if (product.length) {
			lines.push(prodLineStr(lines.length + 1, 'Length', product.length));
		}

		if (product.insertable) {
			lines.push(
				prodLineStr(lines.length + 1, 'Insertable', product.insertable)
			);
		}

		if (product.diameter) {
			lines.push(prodLineStr(lines.length + 1, 'Diameter', product.diameter));
		}

		if (product.circumference) {
			lines.push(
				prodLineStr(lines.length + 1, 'Circumference', product.circumference)
			);
		}

		if (product.controller) {
			lines.push(
				prodLineStr(lines.length + 1, 'Controller', product.controller)
			);
		}

		if (product.washing) {
			lines.push(prodLineStr(lines.length + 1, 'Washing', product.washing));
		}

		if (product.colour) {
			lines.push(prodLineStr(lines.length + 1, 'Colour', product.colour));
		}

		if (product.waterProof) {
			lines.push(
				prodLineBoolean(lines.length + 1, 'Waterproof', product.waterProof)
			);
		}

		if (product.flexibility) {
			lines.push(prodLineStr(lines.length + 1, 'Colour', product.flexibility));
		}

		if (product.material) {
			lines.push(prodLineStr(lines.length + 1, 'Material', product.material));
		}

		if (product.brand) {
			lines.push(prodLineStr(lines.length + 1, 'Brand', product.brand.name));
		}

		if (product.model) {
			lines.push(prodLineStr(lines.length + 1, 'Model', product.model));
		}

		if (product.style) {
			lines.push(prodLineStr(lines.length + 1, 'Style', product.style));
		}

		if (product.features) {
			lines.push(
				prodLineStr(lines.length + 1, 'Main Fetures', product.features)
			);
		}

		if (product.forWho) {
			lines.push(prodLineStr(lines.length + 1, 'Him or Her', product.forWho));
		}

		if (product.condomSafe) {
			lines.push(
				prodLineBoolean(lines.length + 1, 'Condom Safe', product.condomSafe)
			);
		}

		if (product.motion) {
			lines.push(prodLineStr(lines.length + 1, 'Motion', product.model));
		}

		if (product.fastening) {
			lines.push(prodLineStr(lines.length + 1, 'Fastening', product.fastening));
		}

		if (product.harnessCompatible !== null) {
			lines.push(
				prodLineBoolean(
					lines.length + 1,
					'Harness Compatible',
					product.harnessCompatible
				)
			);
		}

		if (product.misc) {
			lines.push(prodLineStr(lines.length + 1, 'Other', product.misc));
		}

		if (product.lubeType) {
			lines.push(prodLineStr(lines.length + 1, 'Lube Type', product.lubeType));
		}

		if (product.liquidVolume) {
			lines.push(
				prodLineStr(lines.length + 1, 'Liquid Volume', product.liquidVolume)
			);
		}

		if (product.power) {
			lines.push(prodLineStr(lines.length + 1, 'Power', product.power));
		}

		if (product.size) {
			lines.push(prodLineStr(lines.length + 1, 'Power', product.size));
		}

		return lines;
	};

	const sizeDialogFooter = (
		<div className="flex justify-content-center">
			<Button
				label="Close"
				icon="pi pi-times"
				outlined
				onClick={() => setSizeDialog(false)}
			/>
		</div>
	);

	const ballerinaSizeChart = () => {
		return (
			<Image
				src="https://www.xtrader.co.uk/catalog/images/2209_3.jpg"
				sizes="100vw"
				style={{
					width: '100%',
					height: 'auto',
				}}
				width={1000}
				height={500}
				alt="Ballerina Fantasy tights Size Chart"
			/>
		);
	};
	const rimbaSizeChart = () => {
		return (
			<Image
				src="https://www.xtrader.co.uk/catalog/images/rimbachart.jpg"
				sizes="100vw"
				style={{
					width: '100%',
					height: 'auto',
				}}
				width={1000}
				height={500}
				alt="Rimba Size Chart"
			/>
		);
	};
	const lateXSize = () => {
		return (
			<>
				<div className="grid mt-2">
					<div className="col">
						<div className="text-left font-bold text-gray-600 ">
							International
						</div>
						<div className="text-left font-bold ml-5 text-gray-500">Sizes</div>
						<div className="text-left font-bold ml-5 text-gray-500">Chest</div>
						<div className="text-left font-bold ml-5 text-gray-500">Waist</div>
						<div className="text-left font-bold ml-5 text-gray-500">Hips</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">XS</div>
						<div className="text-left text-gray-500">32/34</div>
						<div className="text-left text-gray-500">74-81</div>
						<div className="text-left text-gray-500">59-64</div>
						<div className="text-left text-gray-500">84-91</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">S</div>
						<div className="text-left text-gray-500">36/38</div>
						<div className="text-left text-gray-500">82-89</div>
						<div className="text-left text-gray-500">65-73</div>
						<div className="text-left text-gray-500">92-98</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">M</div>
						<div className="text-left text-gray-500">40/42</div>
						<div className="text-left text-gray-500">90-97</div>
						<div className="text-left text-gray-500">74-81</div>
						<div className="text-left text-gray-500">99-104</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">L</div>
						<div className="text-left text-gray-500">44/46</div>
						<div className="text-left text-gray-500">98-106</div>
						<div className="text-left text-gray-500">82-90</div>
						<div className="text-left text-gray-500">105-112</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">XL</div>
						<div className="text-left text-gray-500">48/50</div>
						<div className="text-left text-gray-500">107-118</div>
						<div className="text-left text-gray-500">91-102</div>
						<div className="text-left text-gray-500">113-121</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">2XL</div>
						<div className="text-left text-gray-500">52/54</div>
						<div className="text-left text-gray-500">119-130</div>
						<div className="text-left text-gray-500">103-114</div>
						<div className="text-left text-gray-500">122-132</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">3XL</div>
						<div className="text-left text-gray-500">56/58</div>
						<div className="text-left text-gray-500">131-142</div>
						<div className="text-left text-gray-500">115-128</div>
						<div className="text-left text-gray-500">133-144</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">4XL</div>
						<div className="text-left text-gray-500">60/62</div>
						<div className="text-left text-gray-500">143-154</div>
						<div className="text-left text-gray-500">129-140</div>
						<div className="text-left text-gray-500">145-156</div>
					</div>
				</div>
			</>
		);
	};

	const nekSizeChart = () => {
		return (
			<div className="grid mt-2">
				<div className="col-2">
					<div className="text-left font-bold text-gray-600">International</div>
					<div className="text-left font-bold text-gray-600">DE</div>
					<div className="text-left font-bold text-gray-600">EU</div>
					<div className="text-left font-bold text-gray-600">
						Chest circumference
					</div>
					<div className="text-left font-bold text-gray-600">Waistband</div>
					<div className="text-left font-bold text-gray-600">
						Buttocks circumference
					</div>
				</div>
				<div className="col">
					<div className="text-left text-gray-500">S</div>
					<div className="text-left text-gray-500">4th</div>
					<div className="text-left text-gray-500">44/46</div>
					<div className="text-left text-gray-500 ">86-93</div>
					<div className="text-left text-gray-500">74-81 </div>
					<div className="text-left text-gray-500">90-91 </div>
				</div>
				<div className="col">
					<div className="text-left text-gray-500">M</div>
					<div className="text-left text-gray-500">5th-6th</div>
					<div className="text-left text-gray-500">48/50</div>
					<div className="text-left text-gray-500">94-101</div>
					<div className="text-left text-gray-500">82-89 </div>
					<div className="text-lef text-gray-500">98-105 </div>
				</div>
				<div className="col">
					<div className="text-left text-gray-500">L</div>
					<div className="text-left text-gray-500">7th-8th</div>
					<div className="text-left text-gray-500">52/54</div>
					<div className="text-left text-gray-500">102-109 </div>
					<div className="text-left text-gray-500 ">90-99 </div>
					<div className="text-left text-gray-500">106-113 </div>
				</div>
				<div className="col">
					<div className="text-left text-gray-500">XL</div>
					<div className="text-left text-gray-500 ">9th</div>
					<div className="text-left text-gray-500">56/58</div>
					<div className="text-left text-gray-500">110-117 </div>
					<div className="text-left text-gray-500">100-109 </div>
					<div className="text-left text-gray-500">114-121 </div>
				</div>
				<div className="col">
					<div className="text-left text-gray-500">2XL</div>
					<div className="text-left text-gray-500">10th</div>
					<div className="text-left text-gray-500">60/62</div>
					<div className="text-left text-gray-500">118-125 </div>
					<div className="text-left text-gray-500">110-119 </div>
					<div className="text-left text-gray-500">122-129 </div>
				</div>
				<div className="col">
					<div className="text-left text-gray-500">3XL</div>
					<div className="text-left text-gray-500">12th</div>
					<div className="text-left text-gray-500">64/66</div>
					<div className="text-left text-gray-500">126-133 </div>
					<div className="text-left text-gray-500">120-129 </div>
					<div className="text-left text-gray-500">130-137 </div>
				</div>
			</div>
		);
	};

	const blackLevelSizeChart = () => {
		return (
			<>
				<div>*Please keep garments away from fire.</div>
				<div className="grid mt-2">
					<div className="col">
						<div className="text-left font-bold text-gray-600">
							International
						</div>
						<div className="text-left font-bold text-gray-600">Sizes</div>
						<div className="text-left font-bold text-gray-600">Chest</div>
						<div className="text-left font-bold text-gray-600">Waist</div>
						<div className="text-left font-bold text-gray-600">Hips</div>
					</div>
					<div className="col">
						<div className="text-left font-bold  text-gray-600">XS</div>
						<div className="text-left text-gray-500">32/34</div>
						<div className="text-left text-gray-500">74-81</div>
						<div className="text-left text-gray-500">59-64</div>
						<div className="text-left text-gray-500">84-91</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">S</div>
						<div className="text-left text-gray-500">36/38</div>
						<div className="text-left text-gray-500">82-89</div>
						<div className="text-left text-gray-500">65-73</div>
						<div className="text-left text-gray-500">92-98</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">M</div>
						<div className="text-left text-gray-500">40/42</div>
						<div className="text-left text-gray-500">90-97</div>
						<div className="text-left text-gray-500">74-81</div>
						<div className="text-left text-gray-500">99-104</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">L</div>
						<div className="text-left text-gray-500">44/46</div>
						<div className="text-left text-gray-500">98-106</div>
						<div className="text-left text-gray-500">82-90</div>
						<div className="text-left text-gray-500">105-112</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">XL</div>
						<div className="text-left text-gray-500">48/50</div>
						<div className="text-left text-gray-500">107-118</div>
						<div className="text-left text-gray-500">91-102</div>
						<div className="text-left text-gray-500">113-121</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">2XL</div>
						<div className="text-left text-gray-500">52/54</div>
						<div className="text-left text-gray-500">119-130</div>
						<div className="text-left text-gray-500">103-114</div>
						<div className="text-left text-gray-500">122-132</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">3XL</div>
						<div className="text-left text-gray-500">56/58</div>
						<div className="text-left text-gray-500">131-142</div>
						<div className="text-left text-gray-500">115-128</div>
						<div className="text-left text-gray-500">133-144</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">4XL</div>
						<div className="text-left text-gray-500">60/62</div>
						<div className="text-left text-gray-500">143-154</div>
						<div className="text-left text-gray-500">129-140</div>
						<div className="text-left text-gray-500">145-156</div>
					</div>
				</div>
			</>
		);
	};

	const corsettiSizeChart = () => {
		return (
			<>
				<div>*Please keep garments away from fire.</div>
				<div className="grid mt-2">
					<div className="col">
						<div className="text-left font-bold text-gray-600">Dress Size</div>
						<div className="text-left text-gray-500">Small</div>
						<div className="text-left text-gray-500">Medium</div>
						<div className="text-left text-gray-500">Large</div>
						<div className="text-left text-gray-500">XL</div>
						<div className="text-left text-gray-500">XXL</div>
						<div className="text-left text-gray-500">3XL</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-500">UK</div>
						<div className="text-left text-gray-500">8</div>
						<div className="text-left text-gray-500">10</div>
						<div className="text-left text-gray-500">12</div>
						<div className="text-left text-gray-500">14</div>
						<div className="text-left text-gray-500">16</div>
						<div className="text-left text-gray-500">18</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-500">USA</div>
						<div className="text-left text-gray-500">6</div>
						<div className="text-left text-gray-500">8</div>
						<div className="text-left text-gray-500">10</div>
						<div className="text-left text-gray-500">12</div>
						<div className="text-left text-gray-500">14</div>
						<div className="text-left text-gray-500">16</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">EUR</div>
						<div className="text-left text-gray-500">36</div>
						<div className="text-left text-gray-500">38</div>
						<div className="text-left text-gray-500">40</div>
						<div className="text-left text-gray-500">42</div>
						<div className="text-left text-gray-500">44</div>
						<div className="text-left text-gray-500">46</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">Bust (cm)</div>
						<div className="text-left text-gray-500">84-88</div>
						<div className="text-left text-gray-500">89-92</div>
						<div className="text-left text-gray-500">93-96</div>
						<div className="text-left text-gray-500">97-100</div>
						<div className="text-left text-gray-500">101-104</div>
						<div className="text-left text-gray-500">105-108</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">Waist (cm)</div>
						<div className="text-left text-gray-500">62-68</div>
						<div className="text-left text-gray-500">69-74</div>
						<div className="text-left text-gray-500">75-78</div>
						<div className="text-left text-gray-500">79-82</div>
						<div className="text-left text-gray-500">83-90</div>
						<div className="text-left text-gray-500">91-100</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">Hips (cm)</div>
						<div className="text-left text-gray-500">88-93</div>
						<div className="text-left text-gray-500">94-98</div>
						<div className="text-left text-gray-500">99-104</div>
						<div className="text-left text-gray-500">105-109</div>
						<div className="text-left text-gray-500">110-117</div>
						<div className="text-left text-gray-500 ">118-122</div>
					</div>
				</div>
			</>
		);
	};

	const svenjoymentSizeChart = () => {
		return (
			<div className="grid mt-2">
				<div className="col">
					<div className="text-left font-bold text-gray-600">International</div>
					<div className="text-left font-bold text-gray-600">DE</div>
					<div className="text-left font-bold text-gray-600">EU</div>
					<div className="text-left font-bold text-gray-600">Chest</div>
					<div className="text-left font-bold text-gray-600">Waist</div>
					<div className="text-left font-bold text-gray-600">Hips</div>
					<div className="text-left font-bold text-gray-600">Height</div>
				</div>
				<div className="col">
					<div className="text-left font-bold text-gray-600">S</div>
					<div className="text-left text-gray-500">4</div>
					<div className="text-left  text-gray-500">44/46</div>
					<div className="text-left  text-gray-500">86-93</div>
					<div className="text-left  text-gray-500">74-81</div>
					<div className="text-left  text-gray-500">90-91</div>
					<div className="text-left  text-gray-500">166-173</div>
				</div>
				<div className="col">
					<div className="text-left font-bold text-gray-600">M</div>
					<div className="text-left  text-gray-500">5-6</div>
					<div className="text-left  text-gray-500">48/50</div>
					<div className="text-left  text-gray-500">94-101</div>
					<div className="text-left  text-gray-500">82-89</div>
					<div className="text-left  text-gray-500">98-105 </div>
					<div className="text-left  text-gray-500">171-179</div>
				</div>
				<div className="col">
					<div className="text-left font-bold text-gray-600">L</div>
					<div className="text-left  text-gray-500">7-8</div>
					<div className="text-left  text-gray-500">52/54</div>
					<div className="text-left  text-gray-500">102-109</div>
					<div className="text-left  text-gray-500">90-99</div>
					<div className="text-left text-gray-500">106-113 </div>
					<div className="text-left text-gray-500">177-184 </div>
				</div>
				<div className="col">
					<div className="text-left font-bold text-gray-600">XL</div>
					<div className="text-left text-gray-500 ">9</div>
					<div className="text-left text-gray-500 ">56/58</div>
					<div className="text-left text-gray-500 ">110-117</div>
					<div className="text-left text-gray-500 ">100-109 </div>
					<div className="text-left text-gray-500 ">114-121 </div>
					<div className="text-left text-gray-500 ">182-188 </div>
				</div>
				<div className="col">
					<div className="text-left font-bold text-gray-5600">2XL</div>
					<div className="text-left text-gray-500 ">10</div>
					<div className="text-left text-gray-500 ">60/62</div>
					<div className="text-left text-gray-500 ">118-125</div>
					<div className="text-left text-gray-500 ">110-119 </div>
					<div className="text-left text-gray-500 ">122-129 </div>
					<div className="text-left text-gray-500 ">185-191 </div>
				</div>
				<div className="col">
					<div className="text-left font-bold text-gray-600">3XL</div>
					<div className="text-left text-gray-500 ">12</div>
					<div className="text-left text-gray-500 ">64/66</div>
					<div className="text-left text-gray-500 ">126-133 </div>
					<div className="text-left text-gray-500 ">120-129 </div>
					<div className="text-left text-gray-500 ">130-137 </div>
				</div>
			</div>
		);
	};

	const kissableSizeChart = () => {
		return (
			<div className="grid mt-2">
				<div className="col">
					<div className="text-left font-bold text-gray-600">EUR/USA</div>
					<div className="text-left font-bold text-gray-600">EUR</div>
					<div className="text-left font-bold text-gray-600">UK</div>
					<div className="text-left font-bold text-gray-600">Hips</div>
					<div className="text-left font-bold text-gray-600">Waist</div>
					<div className="text-left font-bold text-gray-600">Chest</div>
				</div>
				<div className="col">
					<div className="text-left font-bold text-gray-600">S/M</div>
					<div className="text-left text-gray-500 ">36/38</div>
					<div className="text-left text-gray-500">8/10</div>
					<div className="text-left text-gray-500">92-99</div>
					<div className="text-left text-gray-500">65-72</div>
					<div className="text-left text-gray-500">86-93</div>
				</div>
				<div className="col">
					<div className="text-left font-bold text-gray-600">L/XL</div>
					<div className="text-left text-gray-500">40/42</div>
					<div className="text-left text-gray-500">12/14</div>
					<div className="text-left text-gray-500">100-107</div>
					<div className="text-left text-gray-500">73-80</div>
					<div className="text-left text-gray-500">94-101</div>
				</div>
				<div className="col-8"></div>
			</div>
		);
	};

	const rougeGarmentsSizeChart = () => {
		return (
			<div className="grid mt-2">
				<div className="col">
					<div className="text-left font-bold text-gray-600">Sizes</div>
					<div className="text-left  text-gray-500">Chest</div>
					<div className="text-left text-gray-500">Waist</div>
					<div className="text-left text-gray-500">Wrist Wallets</div>
				</div>
				<div className="col">
					<div className="text-left font-bold text-gray-500">Small</div>
					<div className="text-left text-gray-500">35&rdquo-37&rdquo</div>
					<div className="text-left text-gray-500">30&rdquo-32&rdquo</div>
					<div className="text-left text-gray-500">24cm x 8cm</div>
				</div>
				<div className="col">
					<div className="text-left font-bold text-gray-600">Medium</div>
					<div className="text-left  text-gray-500">38&rdquo-40&rdquo</div>
					<div className="text-left text-gray-500">33&rdquo-35&rdquo</div>
					<div className="text-left text-gray-500">25cm x 8cm</div>
				</div>
				<div className="col">
					<div className="text-left font-bold text-gray-600">Large</div>
					<div className="text-left text-gray-500 ">41&rdquo-43&rdquo</div>
					<div className="text-left text-gray-500">36&rdquo-38&rdquo</div>
					<div className="text-left text-gray-500">26cm x 8cm</div>
				</div>
				<div className="col">
					<div className="text-left font-bold text-gray-600">XL</div>
					<div className="text-left  text-gray-500">44&rdquo-46&rdquo</div>
					<div className="text-left text-gray-500">39&rdquo-42&rdquo</div>
					<div className="text-left text-gray-500">27cm x 8cm</div>
				</div>
			</div>
		);
	};
	const zadoSizeChart = () => {
		return (
			<>
				<div className="grid mt-2">
					<div className="col">
						<div className="text-left font-bold text-gray-600">
							International
						</div>
						<div className="text-left font-bold text-gray-600">Sizes</div>
						<div className="text-left font-bold text-gray-600">Chest</div>
						<div className="text-left font-bold text-gray-600">Waist</div>
						<div className="text-left font-bold text-gray-600">Hips</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">XS</div>
						<div className="text-left text-gray-500">32/34</div>
						<div className="text-left text-gray-500">74-81</div>
						<div className="text-left text-gray-500">59-64</div>
						<div className="text-left text-gray-500">84-91</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">S</div>
						<div className="text-left text-gray-500">36/38</div>
						<div className="text-left text-gray-500">82-89</div>
						<div className="text-left text-gray-500">65-73</div>
						<div className="text-left text-gray-500">92-98</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">M</div>
						<div className="text-left text-gray-500">40/42</div>
						<div className="text-left text-gray-500">90-97</div>
						<div className="text-left text-gray-500">74-81</div>
						<div className="text-left text-gray-500">99-104</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">L</div>
						<div className="text-left text-gray-500">44/46</div>
						<div className="text-left text-gray-500">98-106</div>
						<div className="text-left text-gray-500">82-90</div>
						<div className="text-left text-gray-500">105-112</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">XL</div>
						<div className="text-left text-gray-500">48/50</div>
						<div className="text-left text-gray-500">107-118</div>
						<div className="text-left text-gray-500">91-102</div>
						<div className="text-left text-gray-500">113-121</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">2XL</div>
						<div className="text-left text-gray-500">52/54</div>
						<div className="text-left text-gray-500">119-130</div>
						<div className="text-left text-gray-500">103-114</div>
						<div className="text-left text-gray-500">122-132</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">3XL</div>
						<div className="text-left text-gray-500">56/58</div>
						<div className="text-left text-gray-500">131-142</div>
						<div className="text-left text-gray-500">115-128</div>
						<div className="text-left text-gray-500">133-144</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">4XL</div>
						<div className="text-left text-gray-500">60/62</div>
						<div className="text-left text-gray-500">143-154</div>
						<div className="text-left text-gray-500">129-140</div>
						<div className="text-left text-gray-500">145-156</div>
					</div>
				</div>
			</>
		);
	};

	const noirSizeChart = () => {
		return (
			<div className="grid mt-2">
				<div className="col">
					<div className="text-left font-bold text-gray-600">International</div>
					<div className="text-left font-bold text-gray-600">EU</div>
					<div className="text-left font-bold text-gray-600">UK</div>
					<div className="text-left font-bold text-gray-600">Hips</div>
					<div className="text-left font-bold text-gray-600">Waist</div>
					<div className="text-left font-bold text-gray-600">Chest</div>
				</div>
				<div className="col">
					<div className="text-left font-bold text-gray-500  ">S</div>
					<div className="text-left text-gray-500 ">36</div>
					<div className="text-left text-gray-500 ">8</div>
					<div className="text-left text-gray-500">92-95</div>
					<div className="text-left text-gray-500">66-69</div>
					<div className="text-left text-gray-500">88-91</div>
				</div>
				<div className="col">
					<div className="text-left font-bold text-gray-600 ">M</div>
					<div className="text-left text-gray-500">38</div>
					<div className="text-left text-gray-500">10</div>
					<div className="text-left text-gray-500">96-99</div>
					<div className="text-left text-gray-500">70-73</div>
					<div className="text-left text-gray-500">92-95</div>
				</div>
				<div className="col">
					<div className="text-left  font-bold text-gray-600">L</div>
					<div className="text-left text-gray-500">40</div>
					<div className="text-left text-gray-500">12</div>
					<div className="text-left text-gray-500">100-103</div>
					<div className="text-left text-gray-500">74-77</div>
					<div className="text-left text-gray-500">96-99</div>
				</div>
				<div className="col">
					<div className="text-left font-bold text-gray-500 ">XL</div>
					<div className="text-left text-gray-500">42</div>
					<div className="text-left text-gray-500">14</div>
					<div className="text-left text-gray-500">104-107</div>
					<div className="text-left text-gray-500">78-81</div>
					<div className="text-left text-gray-500">100-103</div>
				</div>
				<div className="col">
					<div className="text-left  font-bold text-gray-500">2XL</div>
					<div className="text-left text-gray-500">44</div>
					<div className="text-left text-gray-500">16</div>
					<div className="text-left text-gray-500">108-111</div>
					<div className="text-left text-gray-500">82-85</div>
					<div className="text-left text-gray-500">104-107</div>
				</div>
				<div className="col">
					<div className="text-left font-bold text-gray-500 ">3XL</div>
					<div className="text-left text-gray-500">46</div>
					<div className="text-left text-gray-500">18</div>
					<div className="text-left text-gray-500">112-115</div>
					<div className="text-left text-gray-500">86-89</div>
					<div className="text-left text-gray-500">108-111</div>
				</div>
			</div>
		);
	};
	const obsessiveSizeChart = () => {
		return (
			<div className="grid mt-2">
				<div className="col">
					<div className="text-left font-bold text-gray-600">Size</div>
					<div className="text-left text-gray-500">S/M</div>
					<div className="text-left text-gray-500">L/XL</div>
					<div className="text-left text-gray-500">XXL</div>
				</div>
				<div className="col">
					<div className="text-left font-bold text-gray-600">EU</div>
					<div className="text-left text-gray-500">34-38</div>
					<div className="text-left text-gray-500">40-42</div>
					<div className="text-left text-gray-500">44</div>
				</div>
				<div className="col">
					<div className="text-left font-bold text-gray-600">USA</div>
					<div className="text-left text-gray-500">2-8</div>
					<div className="text-left text-gray-500">10-12</div>
					<div className="text-left text-gray-500">14</div>
				</div>
				<div className="col">
					<div className="text-left font-bold text-gray-500">UK / AU / NZ</div>
					<div className="text-left text-gray-500">6-10</div>
					<div className="text-left text-gray-500">12-14</div>
					<div className="text-left text-gray-500">16</div>
				</div>
				<div className="col">
					<div className="text-left font-bold text-gray-600">Italy</div>
					<div className="text-left text-gray-500">38-44</div>
					<div className="text-left text-gray-500">46-48</div>
					<div className="text-left text-gray-500">50</div>
				</div>
				<div className="col">
					<div className="text-left font-bold text-gray-600">France</div>
					<div className="text-left text-gray-500">36-38</div>
					<div className="text-left text-gray-500">40-42</div>
					<div className="text-left text-gray-500">44</div>
				</div>
				<div className="col">
					<div className="text-left font-bold text-gray-600">Russia</div>
					<div className="text-left text-gray-500">40-46</div>
					<div className="text-left text-gray-500">48-50</div>
					<div className="text-left text-gray-500">52</div>
				</div>
			</div>
		);
	};

	const badKittySizeChart = () => {
		return (
			<>
				<div>*Please keep garments away from fire.</div>
				<div className="grid mt-2">
					<div className="col">
						<div className="text-left font-bold text-gray-600">
							International
						</div>
						<div className="text-left text-gray-500">Sizes</div>
						<div className="text-left text-gray-500">Chest</div>
						<div className="text-left text-gray-500">Waist</div>
						<div className="text-left text-gray-500">Hips</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">XS</div>
						<div className="text-left text-gray-500">32/34</div>
						<div className="text-left text-gray-500">74-81</div>
						<div className="text-left text-gray-500">59-64</div>
						<div className="text-left text-gray-500">84-91</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">S</div>
						<div className="text-left text-gray-500">36/38</div>
						<div className="text-left text-gray-500">82-89</div>
						<div className="text-left text-gray-500">65-73</div>
						<div className="text-left text-gray-500">92-98</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">M</div>
						<div className="text-left text-gray-500">40/42</div>
						<div className="text-left text-gray-500">90-97</div>
						<div className="text-left text-gray-500">74-81</div>
						<div className="text-left text-gray-500">99-104</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600 ">L</div>
						<div className="text-left text-gray-500">44/46</div>
						<div className="text-left text-gray-500">98-106</div>
						<div className="text-left text-gray-500">82-90</div>
						<div className="text-left text-gray-500">105-112</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">XL</div>
						<div className="text-left text-gray-500">48/50</div>
						<div className="text-left text-gray-500">107-118</div>
						<div className="text-left text-gray-500">91-102</div>
						<div className="text-left text-gray-500">113-121</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">2XL</div>
						<div className="text-left text-gray-500">52/54</div>
						<div className="text-left text-gray-500">119-130</div>
						<div className="text-left text-gray-500">103-114</div>
						<div className="text-left text-gray-500">122-132</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">3XL</div>
						<div className="text-left text-gray-500">56/58</div>
						<div className="text-left text-gray-500">131-142</div>
						<div className="text-left text-gray-500">115-128</div>
						<div className="text-left text-gray-500">133-144</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">4XL</div>
						<div className="text-left text-gray-500">60/62</div>
						<div className="text-left text-gray-500">143-154</div>
						<div className="text-left text-gray-500">129-140</div>
						<div className="text-left text-gray-500">145-156</div>
					</div>
				</div>
			</>
		);
	};
	const passionLingerieSizeChart = () => {
		return (
			<>
				<div>*Please keep garments away from fire.</div>
				<div className="grid mt-2">
					<div className="col">
						<div className="text-left font-bold text-gray-600">
							Passion Lingerie Size
						</div>
						<hr />
						<div className="text-left font-bold text-gray-500">S/M</div>
						<div className="text-left font-bold text-gray-500">L/XL</div>
						<div className="text-left font-bold text-gray-500">XXL/XXXL</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">
							UK Dress size
						</div>
						<hr />
						<div className="text-left text-gray-500">8 - 12</div>
						<div className="text-left text-gray-500">12 - 16</div>
						<div className="text-left text-gray-500">6 - 22</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">Growth</div>
						<hr />
						<div className="text-left text-gray-500">158 - 164 cm</div>
						<div className="text-left text-gray-500">164 - 170 cm</div>
						<div className="text-left text-gray-500">170 - 172 cm</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">Bust</div>
						<hr />
						<div className="text-left text-gray-500">A - C</div>
						<div className="text-left text-gray-500">B - D</div>
						<div className="text-left text-gray-500">C - E</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">Waist</div>
						<hr />
						<div className="text-left text-gray-500">60 - 72 cm</div>
						<div className="text-left text-gray-500">72 - 84 cm</div>
						<div className="text-left text-gray-500">84 - 96 cm</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">Hips</div>
						<hr />
						<div className="text-left text-gray-500">88 - 100 cm</div>
						<div className="text-left text-gray-500">100 - 112 cm</div>
						<div className="text-left text-gray-500">112 - 124 cm</div>
					</div>
				</div>
				<div className="grid mt-2">
					<div className="col-4">
						<div className="text-left font-bold text-gray-600">Mens Size</div>
						<hr />
						<div className="text-left  text-gray-500">Small</div>
						<div className="text-left text-gray-500">Medium</div>
						<div className="text-left ftext-gray-500">Large</div>
						<div className="text-left text-gray-500">XL</div>
					</div>
					<div className="col-8">
						<div className="text-left font-bold text-gray-600">Waist</div>
						<hr />
						<div className="text-left text-gray-500">28 -30 </div>
						<div className="text-left text-gray-500">32 - 34</div>
						<div className="text-left text-gray-500">36 - 38</div>
						<div className="text-left text-gray-500">38 - 40</div>
					</div>
				</div>
				<div className="grid mt-2">
					<div className="col-4">
						<div className="text-left font-bold text-gray-600">
							Passion Mens Size
						</div>
						<hr />
						<div className="text-left text-gray-500">Chest</div>
						<div className="text-left text-gray-500">Waist</div>
					</div>
					<div className="col-1">
						<div className="text-left font-bold text-gray-600">S/M</div>
						<hr />
						<div className="text-left text-gray-500">92-104</div>
						<div className="text-left text-gray-500">80-92</div>
					</div>
					<div className="col-1">
						<div className="text-left font-bold text-gray-600">L/XL</div>
						<hr />
						<div className="text-left text-gray-500">104-116</div>
						<div className="text-left text-gray-500">92-104</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">XXL/XXL</div>
						<hr />
						<div className="text-left text-gray-500">116-128</div>
						<div className="text-left text-gray-500">104-116</div>
					</div>
					{/**
					 *  Mens size table
					 * */}
					<div className="col">
						<div className="text-left font-bold text-gray-600">XXL/XXL</div>
						<hr />
						<div className="text-left text-gray-500">116-128</div>
						<div className="text-left text-gray-500">104-116</div>
					</div>
				</div>
			</>
		);
	};

	const aliertaFinaSizeChart = () => {
		return (
			<>
				<div className="grid mt-2">
					<div className="col">
						<div className="text-left font-bold text-gray-600">Bra size</div>
						<div className="text-left text-gray-500">Underbust girth in cm</div>
						<div className="text-left text-gray-500 mt-2">Cup size</div>
						<div className="text-left text-gray-500 ">Cup AA</div>
						<div className="text-left text-gray-500 ">Cup A</div>
						<div className="text-left text-gray-500">Cup B</div>
						<div className="text-left text-gray-500 ">Cup C</div>
						<div className="text-left text-gray-500 ">Cup D</div>
						<div className="text-left ftext-gray-500 ">Cup E (DD)</div>
						<div className="text-left text-gray-500 ">Cup F</div>
					</div>
					<div className="col">
						<div className="text-left  text-gray-500">65</div>
						<div className="text-left  text-gray-500">63-67</div>
						<div className="text-left text-gray-600 font-bold mt-2">
							Difference between bust girth minus underbust girth in cm
						</div>
						<div className="text-left  text-gray-500">10-12</div>
						<div className="text-left  text-gray-500">12-14</div>
						<div className="text-left  text-gray-500">14-16</div>
						<div className="text-left  text-gray-500">16-18</div>
						<div className="text-left  text-gray-500">18-20</div>
						<div className="text-left text-gray-500">20-22</div>
						<div className="text-left text-gray-500">22-24</div>
					</div>
					<div className="col">
						<div className="text-left  text-gray-500">70</div>
						<div className="text-left  text-gray-500">67-72</div>
					</div>
					<div className="col">
						<div className="text-left  text-gray-500">75</div>
						<div className="text-left  text-gray-500">73-77</div>
					</div>
					<div className="col">
						<div className="text-left  text-gray-500">80</div>
						<div className="text-left  text-gray-500">78-82</div>
					</div>
					<div className="col">
						<div className="text-left  text-gray-500">85</div>
						<div className="text-left  text-gray-500">83-87</div>
					</div>
					<div className="col">
						<div className="text-left  text-gray-500">90</div>
						<div className="text-left  text-gray-500">88-92</div>
					</div>
					<div className="col">
						<div className="text-left  text-gray-500">95</div>
						<div className="text-left  text-gray-500">93-97</div>
					</div>
					<div className="col">
						<div className="text-left  text-gray-500">100</div>
						<div className="text-left  text-gray-500">98-102</div>
					</div>
					<div className="col">
						<div className="text-left  text-gray-500">105</div>
						<div className="text-left  text-gray-500">103-107</div>
					</div>
					<div className="col">
						<div className="text-left  text-gray-500">110 </div>
						<div className="text-left  text-gray-500">108-112</div>
					</div>
				</div>
			</>
		);
	};
	const legAvenueSizeChart = () => {
		return (
			<>
				<div>*Please keep garments away from fire.</div>
				<div className="grid mt-2">
					<div className="col">
						<div className="text-left font-bold text-gray-600">
							Leg Avenue size
						</div>
						<div className="text-left text-gray-500">XS</div>
						<div className="text-left text-gray-500">S</div>
						<div className="text-left text-gray-500">M</div>
						<div className="text-left text-gray-500">L</div>
						<div className="text-left text-gray-500">XL</div>
						<div className="text-left text-gray-500">S/M</div>
						<div className="text-left text-gray-500">M/L</div>
						<div className="text-left text-gray-500">1X/2X</div>
						<div className="text-left text-gray-500">3X/4X</div>
						<div className="text-left text-gray-500">
							O/S<br></br>
							<span className="font-italic text-gray-500">
								(weight 40-70 kg){' '}
							</span>
						</div>
						<div className="text-left ">
							PLUSSIZE<br></br>
							<span className="font-italic text-gray-500">
								(weight 40-70 kg)
							</span>
						</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">Europe</div>
						<div className="text-left text-gray-500">34</div>
						<div className="text-left text-gray-500">36</div>
						<div className="text-left text-gray-500">38</div>
						<div className="text-left text-gray-500">40</div>
						<div className="text-left text-gray-500">42</div>
						<div className="text-left text-gray-500">36/38</div>
						<div className="text-left text-gray-500">38/40</div>
						<div className="text-left text-gray-500">42/44</div>
						<div className="text-left text-gray-500">46/48</div>
						<div className="text-left text-gray-500">46/40</div>
						<div className="text-left text-gray-500">42/46</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">Italy</div>
						<div className="text-left text-gray-500">38</div>
						<div className="text-left text-gray-500">40</div>
						<div className="text-left text-gray-500">42</div>
						<div className="text-left text-gray-500">44</div>
						<div className="text-left text-gray-500">46</div>
						<div className="text-left text-gray-500">38/40</div>
						<div className="text-left text-gray-500">40/42</div>
						<div className="text-left text-gray-500">44/46</div>
						<div className="text-left text-gray-500">48/50</div>
						<div className="text-left text-gray-500">36/42</div>
						<div className="text-left text-gray-500">44/48</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">Italy</div>
						<div className="text-left text-gray-500">38</div>
						<div className="text-left text-gray-500">40</div>
						<div className="text-left text-gray-500">42</div>
						<div className="text-left text-gray-500">44</div>
						<div className="text-left text-gray-500">46</div>
						<div className="text-left text-gray-500">40/42</div>
						<div className="text-left text-gray-500">42/44</div>
						<div className="text-left text-gray-500">46/48</div>
						<div className="text-left text-gray-500">50/52</div>
						<div className="text-left text-gray-500">38/44</div>
						<div className="text-left text-gray-500">46/50</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">France</div>
						<div className="text-left text-gray-500">36</div>
						<div className="text-left text-gray-500">38</div>
						<div className="text-left text-gray-500">40</div>
						<div className="text-left text-gray-500">42</div>
						<div className="text-left text-gray-500">44</div>
						<div className="text-left text-gray-500">38/40</div>
						<div className="text-left text-gray-500">40/42</div>
						<div className="text-left text-gray-500">44/46</div>
						<div className="text-left text-gray-500">48/50</div>
						<div className="text-left text-gray-500">36/42</div>
						<div className="text-left text-gray-500">44/48</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">
							United Kingdom
						</div>
						<div className="text-left text-gray-500">6</div>
						<div className="text-left text-gray-500">8</div>
						<div className="text-left text-gray-500">10</div>
						<div className="text-left text-gray-500">12</div>
						<div className="text-left text-gray-500">14</div>
						<div className="text-left text-gray-500">8/10</div>
						<div className="text-left text-gray-500">10/12</div>
						<div className="text-left text-gray-500">14/16</div>
						<div className="text-left text-gray-500">18/20</div>
						<div className="text-left text-gray-500">6/12</div>
						<div className="text-left text-gray-500">14/18</div>
					</div>
				</div>
			</>
		);
	};

	const cottelliSizeChart = () => {
		return (
			<>
				<div>*Please keep garments away from fire.</div>
				<div className="mt-2">
					<Image
						src="https://www.xtrader.co.uk/catalog/img/size-chart.jpg"
						sizes="75vw"
						style={{
							width: '100%',
							height: 'auto',
						}}
						width={1000}
						height={500}
						alt="Size Chart"
					/>
				</div>
				{/* <div className="mt-2"> */}
				<div className="grid mt-2">
					<div className="col">
						<div className="text-left font-bold text-gray-600">
							International
						</div>
						<div className="text-left font-bold ml-5 text-gray-600">Sizes</div>
						<div className="text-left font-bold ml-5 text-gray-600">Chest</div>
						<div className="text-left font-bold ml-5 text-gray-600">Waist</div>
						<div className="text-left font-bold ml-5 text-gray-500">Hips</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">XS</div>
						<div className="text-left text-gray-500">32/34</div>
						<div className="text-left text-gray-500">74-81</div>
						<div className="text-left text-gray-500">59-64</div>
						<div className="text-left text-gray-500">84-91</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">S</div>
						<div className="text-left text-gray-500">36/38</div>
						<div className="text-left text-gray-500">82-89</div>
						<div className="text-left text-gray-500">65-73</div>
						<div className="text-left text-gray-500">92-98</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">M</div>
						<div className="text-left text-gray-500">40/42</div>
						<div className="text-left text-gray-500">90-97</div>
						<div className="text-left text-gray-500">74-81</div>
						<div className="text-left text-gray-500">99-104</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">L</div>
						<div className="text-left text-gray-500">44/46</div>
						<div className="text-left text-gray-500">98-106</div>
						<div className="text-left text-gray-500">82-90</div>
						<div className="text-left text-gray-500">105-112</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">XL</div>
						<div className="text-left text-gray-500">48/50</div>
						<div className="text-left text-gray-500">107-118</div>
						<div className="text-left text-gray-500">91-102</div>
						<div className="text-left text-gray-500">113-121</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">2XL</div>
						<div className="text-left text-gray-500">52/54</div>
						<div className="text-left text-gray-500">119-130</div>
						<div className="text-left text-gray-500">103-114</div>
						<div className="text-left text-gray-500">122-132</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">3XL</div>
						<div className="text-left text-gray-500">56/58</div>
						<div className="text-left text-gray-500">131-142</div>
						<div className="text-left text-gray-500">115-128</div>
						<div className="text-left text-gray-500">133-144</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">4XL</div>
						<div className="text-left text-gray-500">60/62</div>
						<div className="text-left text-gray-500">143-154</div>
						<div className="text-left text-gray-500">129-140</div>
						<div className="text-left text-gray-500">145-156</div>
					</div>
				</div>

				<div className="mt-3 text-gray-500">
					<h2>Corsetry: bra’s, corsages, body suits and corselets</h2>
				</div>
				<div className="grid mt-2">
					<div className="col-2">
						<div className="text-left font-bold text-gray-600">Bra size</div>
						<div className="text-left font-bold text-gray-600">
							Underbust girth in cm
						</div>
						<div className="text-left font-bold mt-2 text-gray-600">
							Cup size
						</div>
						<div className="text-left font-bold text-gray-600">Cup AA</div>
						<div className="text-left font-bold text-gray-600">Cup A</div>
						<div className="text-left font-bold text-gray-600">Cup B</div>
						<div className="text-left font-bold text-gray-600">Cup C</div>
						<div className="text-left font-bold text-gray-600">Cup D</div>
						<div className="text-left font-bold text-gray-600">Cup E (DD)</div>
						<div className="text-left font-bold text-gray-600">Cup F</div>
					</div>
					<div className="col">
						<div className="text-left text-gray-500">65</div>
						<div className="text-left text-gray-500">63-67</div>
						<div className="text-left font-bold text-gray-600 mt-2 ">
							Difference between bust girth minus underbust girth in cm
						</div>
						<div className="text-left text-gray-500">10-12</div>
						<div className="text-left  text-gray-500">12-14</div>
						<div className="text-left  text-gray-500">14-16</div>
						<div className="text-left  text-gray-500">16-18</div>
						<div className="text-left  text-gray-500">18-20</div>
						<div className="text-left  text-gray-500">20-22</div>
						<div className="text-left  text-gray-500">22-24</div>
					</div>
				</div>

				<span className="text-gray-500">
					First measure underneath your bust to find your &ldquobra size&rdquo,
					then measure around the fullest part of your bust for the &ldquo cup
					size &rdquo. Example: Underbust girth 81cm, Bust 96cm, i.e. 96cm-81cm
					= 15cm = bra size 80B.
				</span>
				<h2 className="text-gray-600">Corsets (measurements in cm)</h2>
				<div className="grid">
					<div className="col">
						<div className="text-left font-bold text-gray-600">
							International
						</div>
						<div className="text-left font-bold text-gray-600">Waist</div>
						<div className="text-left font-bold text-gray-600">Corset size</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">S</div>
						<div className="text-left text-gray-500 ">65-73</div>
						<div className="text-left text-gray-500 ">56</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">M</div>
						<div className="text-left text-gray-500">74-81</div>
						<div className="text-left text-gray-500 ">66</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">L</div>
						<div className="text-left text-gray-500 ">82-90</div>
						<div className="text-left text-gray-500 ">76</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">XL</div>
						<div className="text-left text-gray-500">91-102</div>
						<div className="text-left text-gray-500 ">86</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">2XL</div>
						<div className="text-left text-gray-500 ">103-114</div>
						<div className="text-left text-gray-500 ">96</div>
					</div>
					<div className="col">
						<div className="text-left font-bold text-gray-600">3XL</div>
						<div className="text-left font-bold text-gray-500">115-128</div>
						<div className="text-left font-bold text-gray-500">106</div>
					</div>
				</div>

				<span className="text-gray-500">
					Corsets are suitable for waist reduction. The sizes indicate the
					minimum lacing. We advise you to subtract 10 cm from your measured
					waist girth - the result is the recommended corset size.
				</span>
				<div className="mt-2 text-gray-600">
					<h2>Size of shoes, stockings, tights</h2>
				</div>

				<div className="grid">
					<div className="col-3">
						<div className="text-left font-bold text-gray-600">
							Stockings size
						</div>
						<div className="text-left font-bold text-gray-600">Sizes</div>
						<div className="text-left font-bold text-gray-600">
							International
						</div>
						<div className="text-left font-bold text-gray-600">
							Shoe size (strapless stockings, tights)
						</div>
					</div>
					<div className="col">
						<div className="text-left text-gray-500">I (1)</div>
						<div className="text-left text-gray-500">XS</div>
						<div className="text-left text-gray-500">34/36</div>
					</div>
					<div className="col">
						<div className="text-left text-gray-500">II (2)</div>
						<div className="text-left text-gray-500">S</div>
						<div className="text-left text-gray-500">36/38</div>
						<div className="text-left text-gray-500 ">35-37</div>
					</div>
					<div className="col">
						<div className="text-left text-gray-500">III (3)</div>
						<div className="text-left text-gray-500">M</div>
						<div className="text-left text-gray-500">40/42</div>
						<div className="text-left text-gray-500">38-39</div>
					</div>
					<div className="col">
						<div className="text-left text-gray-500">III-IV (3-4)</div>
						<div className="text-left text-gray-500">M/L</div>
						<div className="text-left text-gray-500">42/44</div>
						<div className="text-left text-gray-500">40-42</div>
					</div>
					<div className="col">
						<div className="text-left text-gray-500">IV (4)</div>
						<div className="text-left text-gray-500">L</div>
						<div className="text-left text-gray-500">44/46</div>
					</div>
					<div className="col">
						<div className="text-left text-gray-500">V (5)</div>
						<div className="text-left text-gray-500">XL</div>
						<div className="text-left text-gray-500">48/50</div>
					</div>
					<div className="col">
						<div className="text-left text-gray-500">VI(6)</div>
						<div className="text-left text-gray-500">2XL</div>
						<div className="text-left text-gray-500">52/54</div>
					</div>
					<div className="col">
						<div className="text-left text-gray-500">VII (7)</div>
						<div className="text-left text-gray-500">3XL</div>
						<div className="text-left text-gray-500">56/58</div>
					</div>
					<div className="col">
						<div className="text-left text-gray-500">VIII (8)</div>
						<div className="text-left text-gray-500">4XL</div>
						<div className="text-left text-gray-500">60/62</div>
					</div>
				</div>

				{/* </div> */}
			</>
		);
	};
	const renderSizeChart = () => {
		console.log(
			`renderSizeChart ${JSON.stringify(product, ['id', 'name', 'brand'])}`
		);
		const brandId = product.brand.id;
		switch (brandId) {
			case 17:
				return rimbaSizeChart();
				break;
			case 1:
				return cottelliSizeChart();
			case 46:
				return blackLevelSizeChart();
			case 40:
				return passionLingerieSizeChart();
			case 42:
				return legAvenueSizeChart();
			case 45:
				return noirSizeChart();
			case 43:
				return obsessiveSizeChart();

			case 47:
				return corsettiSizeChart();
			case 41:
				return aliertaFinaSizeChart();
			case 82:
				return rougeGarmentsSizeChart();
			case 48:
				return badKittySizeChart();
			case 52:
				return zadoSizeChart();
			case 125:
				return svenjoymentSizeChart();
			case 93:
				return lateXSize();
			case 94:
				return nekSizeChart();
			case 54:
				return ballerinaSizeChart();
			case 145:
				return kissableSizeChart();
			default:
				return <div>no such brand</div>;
		}
	};
	const renderBrandImage = () => {
		return (
			<Image
				src={`data:image/jpeg;base64,${product.brand.imageData}`}
				alt={product.brand.name}
				// fill={true}
				width={100}
				height={100}
			/>
		);
	};

	const renderSizeChartButton = () => {
		console.log(
			`renderSizeChartButton attributes ${JSON.stringify(
				product.attributes && product.attributes.length,
				null,
				2
			)}`
		);
		if (product.attributes && product.attributes?.length < 1) {
			return <></>;
		} else {
			return (
				<Button onClick={() => setSizeDialog(true)}>
					<span className="text-gray-100 font-bold text-xl">Size chart </span>
				</Button>
			);
		}
	};
	return (
		<>
			<div className="surface-section px-6 py-6 border-1 surface-border border-round">
				<Toast ref={toast} position="top-center" />
				<div className="grid mb-7">
					{/* top section of the page */}
					<div className="col-12 lg:col-7">
						{/* Left images block */}
						<div className="flex flex-row justify-content-between ml-2">
							<div className="flex align-self-start flex-wrap">
								<Galleria
									value={xtrImages}
									responsiveOptions={galleriaResponsiveOptions}
									numVisible={5}
									style={{ maxWidth: '500px' }}
									item={itemTemplate}
									thumbnail={thumbnailTemplate}
									autoPlay={true}
									circular={true}
								/>
								<div className="flex  flex-wrap">{renderBrandImage()}</div>
							</div>
						</div>
					</div>
					<div className="col-12 lg:col-4 py-3 lg:pl-6">
						{/* Block to right of picture */}
						<div className="flex align-items-center text-xl font-medium text-900 text-gray-600 mb-4">
							{product.name}
						</div>
						<div className="flex align-items-center justify-content-between mb-5">
							{/* Price row */}
							<span className="text-900 font-medium text-3xl text-gray-600 block">
								£ {product.retailPrice}
							</span>
						</div>
						{/* Colour block */}
						{/* {renderColour()} */}
						{/* <div className="font-bold text-900 mb-3">Color</div>
					<ul>
						<div className="flex align-items-center mb-5">
							<>{renderColour()}</>
						</div>
					</ul> */}
						{/* Size block */}
						<>{renderSize()}</>

						{/* <div className="font-bold text-900 mb-3">Quantity</div> */}

						<div className="flex flex-row sm:flex-row sm:align-items-center sm:justify-content-between">
							{/* <InputNumber
							showButtons
							buttonLayout="horizontal"
							min={0}
							inputClassName="w-3rem text-center"
							value={quantity}
							onChange={(e) => setQuantity(e.value || 1)}
							decrementButtonClassName="p-button-text"
							incrementButtonClassName="p-button-text"
							incrementButtonIcon="pi pi-plus"
							decrementButtonIcon="pi pi-minus"></InputNumber> */}
							<div className="flex align-items-center flex-1 mt-3 sm:mt-0 ml-0 sm:ml-5">
								<Button
									label="Add to Cart"
									className="flex-1 mr-5"
									onClick={(e) => updateBasket()}
									// onClick={() => updateBasket()}
								/>

								<i
									className={classNames('pi text-2xl cursor-pointer', {
										'pi-heart text-600': !liked,
										'pi-heart-fill text-orange-500': liked,
									})}
									onClick={() => likeProd()}></i>
							</div>
						</div>
						<div
							className={
								'flex flex-row sm:flex-row sm:align-items-center sm:justify-content-between mt-2'
							}>
							<Button
								label="Back to list of products"
								className="flex-1 mr-5"
								onClick={() => router.back()}
								// onClick={() => updateBasket()}
							/>
						</div>
					</div>
				</div>
				{/*info box at bottom of page  */}
				<TabView>
					<TabPanel header="Details">
						<div className="text-900 font-bold text-3xl mb-4 mt-2 text-gray-600">
							Product Details
						</div>
						<p
							className="line-height-3 text-600 p-0 mx-0 mt-0 mb-4 text-gray-500"
							dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}>
							{/* {product.descriptionHtml} */}
							{/* product description */}
						</p>

						{renderSizeChartButton()}

						{/* details grid */}
						<div className="grid">
							<div className="md:col-6, col-12">
								<Card
									title="Product Information"
									pt={{
										title: {
											className:
												'bg-primary border-round-lg flex align-items-center justify-content-center',
										},
									}}>
									<ul className="list-disc ">{productInfoList()}</ul>
								</Card>
							</div>

							{/* Additional Information */}
							<div className="md:col-4 col-12">
								<Card
									title="Additional  Information"
									pt={{
										// root: { className: 'w-500rem' },
										title: {
											className:
												'bg-primary border-round-lg flex align-items-center justify-content-center',
										},
									}}>
									<ul className="py-0 pl-3 m-0 text-600 mb-3">
										<li key={product.weight}>
											<div className="grid">
												<div className="col-fixed" style={{ width: '100px' }}>
													<div className="text-left font-bold text-gray-600">
														Weight:
													</div>
												</div>
												<div className="col">
													<div className="text-left text-gray-500 ">
														{product.weight} kg
													</div>
												</div>
											</div>
										</li>
									</ul>
								</Card>
							</div>
							<div className="col-2" />
							{/* Material and care */}
							{/* <div className="col-12 lg:col-4">{materialCare()}</div> */}
						</div>
					</TabPanel>
					<TabPanel header="Reviews">
						<div className="text-900 font-bold text-3xl mb-4 mt-2 text-gray-600">
							Customer Reviews
						</div>
						<div className="text-500  text-3xl mb-4 mt-2 text-gray-500">
							<p>
								No reviews yet. After your purchase you can create a review.{' '}
							</p>
							<p>Only registered users can submit a review</p>
						</div>
					</TabPanel>
				</TabView>
			</div>

			<Dialog
				visible={sizeDialog}
				style={{ width: '75vw' }}
				breakpoints={{ '960px': '75vw', '641px': '90vw' }}
				header="Size Chart"
				modal
				className="p-fluid"
				footer={sizeDialogFooter}
				onHide={() => setSizeDialog(false)}>
				<Card>{renderSizeChart()}</Card>
			</Dialog>
		</>
	);
}
