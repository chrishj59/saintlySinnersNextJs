'use client';

import Image from 'next/image';
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
	cats,
	children,
}: {
	brands: XtrBrand[];
	cats: number;
	children: React.ReactNode;
}) {
	const router = useRouter();
	console.log(`HomeUI cats ${cats} `);
	const responsiveOptions = [
		{
			breakpoint: '1400px',
			numVisible: 2,
			numScroll: 1,
		},
		{
			breakpoint: '1199px',
			numVisible: 3,
			numScroll: 1,
		},
		{
			breakpoint: '767px',
			numVisible: 2,
			numScroll: 1,
		},
		{
			breakpoint: '575px',
			numVisible: 1,
			numScroll: 1,
		},
	];
	const [visits, setVisits] = useSessionStorage(0, 'visits');

	const brandTemplate = (brand: XtrBrand) => {
		return (
			<div className="border-1 surface-border border-round m-2 text-center py-5 px-3">
				<div className="mb-3">
					<div
						style={{ position: 'relative', width: '150px', height: '150px' }}>
						<Image
							src={`data:image/jpeg;base64,${brand.image?.imageData}`}
							alt={brand.name}
							sizes="150px"
							fill
							style={{
								objectFit: 'contain',
							}}
						/>
					</div>
				</div>
				<div>
					<h4 className="mb-1">{brand.name}</h4>
				</div>
				<div className="mt-5 flex flex-wrap gap-2 justify-content-center">
					<Button
						icon="pi pi-search"
						rounded
						onClick={() => router.push(`/xtrader/brand-product/${brand.id}`)}
					/>
				</div>
			</div>
		);
	};

	const renderCategories = () => {
		if (cats === 6) {
			return (
				<>
					<div className="lg:col-4 md:col-6 col-12">
						<a
							className="cursor-pointer "
							onClick={() => {
								router.push(`xtrader/category/426`);
							}}>
							<div>
								<Image
									src="/images/her_toys.JPEG"
									alt="Her toys"
									width="278"
									height="150"
								/>
							</div>
						</a>
					</div>
					<div className="lg:col-4 md:col-6 col-12 ">
						<a
							className="cursor-pointer "
							onClick={() => {
								router.push(`/xtrader/category/426`);
							}}>
							<div>
								<Image
									src="/images/his_toys.jpg"
									alt="His Toys image"
									width="278"
									height="150"
								/>
							</div>
						</a>
					</div>

					<div className="lg:col-4 md:col-6 col-12">
						<a
							className="cursor-pointer "
							onClick={() => {
								router.push(`/xtrader/category/62`);
							}}>
							<div>
								<Image
									src="/images/couples_toys.JPEG"
									alt="His and hers"
									width="278"
									height="150"
								/>
							</div>
						</a>
					</div>

					<div className="lg:col-4 md:col-6 col-12">
						<a
							className="cursor-pointer "
							onClick={() => {
								router.push(`/xtrader/category/63`);
							}}>
							<div>
								<Image
									src="/images/lingerie_woman.JPEG"
									alt="Lingerie Women"
									width="278"
									height="150"
								/>
							</div>
						</a>
					</div>
					<div className="lg:col-4 md:col-6 col-12">
						<a
							className="cursor-pointer "
							onClick={() => {
								router.push(`/xtrader/category/186`);
							}}>
							<div>
								<Image
									src="/images/Lingerie_men.JPEG"
									alt="Lingerie men"
									width="278"
									height="150"
								/>
							</div>
						</a>
					</div>

					<div className="lg:col-4 md:col-6 col-12">
						<a
							className="cursor-pointer "
							onClick={() => {
								router.push(`/xtrader/category/81`);
							}}>
							<div>
								<Image
									src="/images/Lubricant.JPEG"
									alt="Lubricants image"
									width="278"
									height="150"
								/>
							</div>
						</a>
					</div>
				</>
			);
		} else {
			return (
				<>
					<div className="md:col-6 col-12">
						<a
							className="cursor-pointer "
							onClick={() => {
								router.push(`/xtrader/category/63`);
							}}>
							<div>
								<Image
									src="/images/lingerie_woman.JPEG"
									alt="Lingerie Women"
									width="278"
									height="150"
								/>
							</div>
						</a>
					</div>
					<div className="md:col-6 col-12">
						<a
							className="cursor-pointer "
							onClick={() => {
								router.push(`/xtrader/category/186`);
							}}>
							<div>
								<Image
									src="/images/Lingerie_men.JPEG"
									alt="Lingerie men"
									width="278"
									height="150"
								/>
							</div>
						</a>
					</div>
				</>
			);
		}
	};
	return (
		<>
			{/* TODO:change to grid layout and responsive  */}

			<div className="grid align-items-center">
				<div className="col-12">
					<div className="text-center text-primary font-semibold text-3xl">
						Welcome to Saintly Sinners
					</div>
				</div>
				{/* <div className="col-12">
					<p className="text-left font-medium text text-lg">
						No one offers more choice on <b>Sexy Lingerie </b>for Men and Women
						dispatch in descrete packaging. 000's of products from famous brands
						waiting to be sent to you. Safe and secure shopping .
					</p>
				</div> */}

				{/* categories */}
				{renderCategories()}
			</div>
			{/* <div className="col-12">
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
						
					/>
				</div>
			</div> */}
		</>
	);
}
