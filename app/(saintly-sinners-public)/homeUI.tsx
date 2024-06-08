'use client';

import { Image } from 'primereact/image';
import { useRouter } from 'next/navigation';
import { Brand } from '../../interfaces/brand.interface';
import { Carousel } from 'primereact/carousel';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputSwitch } from 'primereact/inputswitch';
import { XtrBrand } from '@/interfaces/xtraderProduct.type';
import Link from 'next/link';
import { useEffect } from 'react';
import { useSessionStorage } from 'primereact/hooks';

export default function HomeUI({
	brands,
	children,
}: {
	brands: XtrBrand[];
	children: React.ReactNode;
}) {
	const router = useRouter();

	const responsiveOptions = [
		{
			breakpoint: '1199px',
			numVisible: 1,
			numScroll: 1,
		},
		{
			breakpoint: '991px',
			numVisible: 2,
			numScroll: 1,
		},
		{
			breakpoint: '767px',
			numVisible: 1,
			numScroll: 1,
		},
	];
	const [visits, setVisits] = useSessionStorage(0, 'visits');

	console.log(`vists ${visits}`);
	const brandTemplate = (brand: XtrBrand) => {
		return (
			<div className="border-1 surface-border border-round m-2 text-center py-5 px-3 ">
				<Link href={`/xtrader/brand-product/${brand.id}`}>
					<div>
						<Image
							src={`data:image/jpeg;base64,${brand.image?.imageData}`}
							alt={brand.name}
							width="300px"
							height="300px"
						/>
					</div>
				</Link>
				<div>
					<Link href={`/xtrader/brand-product/${brand.id}`}>
						<h4 className="mb-1">{brand.name}</h4>
					</Link>
					<div className="mt-5 flex flex-wrap gap-2 justify-content-center">
						<Button
							icon="pi pi-search"
							className="p-button p-button-rounded"
							onClick={() => {
								router.push(`/xtrader/brand-product/${brand.id}`);
							}}
						/>
						<Button
							disabled
							icon="pi pi-star-fill"
							className="p-button-success p-button-rounded"
						/>
					</div>
				</div>
			</div>
		);
	};
	return (
		<>
			<div className="grid align-items-center">
				<div className="col-12  ">
					<p className="text-center text-primary font-semibold text-4xl">
						Welcome to Saintly Sinners
					</p>
				</div>
				{/* <div className="col-12">
					<p className="text-left font-medium text text-lg">
						No one offers more choice on <b>Sexy Lingerie </b>for Men and Women
						dispatch in descrete packaging. 000's of products from famous brands
						waiting to be sent to you. Safe and secure shopping .
					</p>
				</div> */}

				{/* categories */}

				<div className="col-4">
					<a
						className="cursor-pointer "
						onClick={() => {
							router.push(`xtrader/category/426`);
						}}>
						<div>
							<Image
								src="/images/her_toys.JPEG"
								alt="Her toys"
								width="370px"
								height="200px"
							/>
						</div>
					</a>
				</div>
				<div className="col-4">
					<a
						className="cursor-pointer "
						onClick={() => {
							router.push(`/xtrader/category/426`);
						}}>
						<div>
							<Image
								src="/images/his_toys.jpg"
								alt="His Toys image"
								width="370px"
								height="200px"
							/>
						</div>
					</a>
				</div>

				<div className="col-4">
					<a
						className="cursor-pointer "
						onClick={() => {
							router.push(`/xtrader/category/62`);
						}}>
						<div>
							<Image
								src="/images/couples_toys.JPEG"
								alt="His and hers"
								width="370px"
								height="200px"
							/>
						</div>
					</a>
				</div>

				<div className="col-6">
					<a
						className="cursor-pointer "
						onClick={() => {
							router.push(`/xtrader/category/63`);
						}}>
						<div className="border-1 surface-border border-round m-2 text-center py-5 px-3 ">
							<div>
								<Image
									src="/images/lingerie_woman.JPEG"
									alt="Lingerie Women"
									width="370px"
									height="200px"
								/>
							</div>
						</div>
					</a>
				</div>

				<div className="col-6">
					<a
						className="cursor-pointer "
						onClick={() => {
							router.push(`/xtrader/category/81`);
						}}>
						<div>
							<Image
								src="/images/Lubricant.JPEG"
								alt="Lubricants image"
								width="370px"
								height="200px"
							/>
						</div>
					</a>
				</div>
			</div>
			<div className="col-12">
				<div className="text-900 font-medium text-4xl mb-4">
					Our Popular Brands
				</div>
				<div className="card">
					<Carousel
						value={brands}
						numVisible={3}
						numScroll={3}
						responsiveOptions={responsiveOptions}
						itemTemplate={brandTemplate}
						circular
						autoplayInterval={4000}
					/>
				</div>
			</div>
		</>
	);
}
