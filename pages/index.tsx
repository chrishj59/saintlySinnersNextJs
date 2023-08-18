import axios from 'axios';
import { useRouter } from 'next/router';
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Image from 'next/image';
import { s3Client } from 'utils/s3-utils';
import { Carousel } from 'primereact/carousel';

import { GetObjectCommand, GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';

type BrandType = {
	id: number;
	title: string;
	categoryType: string;
	catLevel: number;
	catDescription: string;
	awsKey: string;
	onHomePage: boolean;
	awsImageData?: string;
	awsImageType?: string;
};

const Home: NextPage = ({
	brandItems,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
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
	const brandTemplate = (brand: BrandType) => {
		return (
			<div className="border-1 surface-border border-round m-2 text-center py-5 px-3 ">
				<div
					style={{
						position: 'relative',
						// overflow: 'hidden',
						width: '370px',
						height: '200px',
					}}>
					<Image
						src={`data:image/jpeg;base64,${brand.awsImageData}`}
						alt={brand.title}
						fill={true}
						style={{ objectFit: 'cover' }}
					/>
				</div>
				<div>
					<h4 className="mb-1">{brand.title}</h4>

					<div style={{ height: '15em' }} className="mt-0 mb-3">
						{brand.catDescription}
					</div>
					{/* <InputTextarea
						style={{
							border: 'none',
							overflow: 'auto',
							outline: 'none',
							boxShadow: 'none',

							resize: 'none',
						}}
						value={brand.catDescription}
						rows={10}
						cols={20}
					/> */}
					<div className="mt-5 flex flex-wrap gap-2 justify-content-center">
						<Button
							icon="pi pi-search"
							className="p-button p-button-rounded"
							onClick={() => {
								router.push(`/product/brandProduct/${brand.id}`);
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
				<div className="col-12">
					<p className="text-left font-medium text text-lg">
						No one offers more choice on <b>Sexy Lingerie </b>for Men and Women
						and <b>Sex Toys </b>this side of the planet. We offer immediate
						dispatch to 50 countries in descrete packaging. Over 65,000 products
						and counting waiting to be sent to you. Safe and secure shopping .
					</p>
				</div>
				{/* categories */}
				<div className="col-4">
					<a
						className="cursor-pointer "
						onClick={() => {
							router.push(`/product/categoryProduct/32884`);
						}}>
						<div className="border-1 surface-border border-round m-2 text-center py-5 px-3 ">
							<div
								style={{
									position: 'relative',
									// overflow: 'hidden',
									width: '370px',
									height: '200px',
								}}>
								<Image
									fill
									src="/images/lingerie_woman.JPEG"
									alt="Lingerie Women"
									sizes="300px"
									style={{
										objectFit: 'cover',
									}}
									// style={{ objectFit: 'cover' }}
								/>
							</div>
						</div>
					</a>
				</div>
				<div className="col-4">
					<a
						className="cursor-pointer "
						onClick={() => {
							router.push(`/product/categoryProduct/32881`);
						}}>
						<div
							style={{
								position: 'relative',
								// overflow: 'hidden',
								width: '370px',
								height: '200px',
							}}>
							<Image
								fill
								src="/images/Lingerie_men.JPEG"
								alt="Lingerie Men"
								sizes="300px"
								style={{
									objectFit: 'fill',
								}}
								// style={{ objectFit: 'cover' }}
							/>
						</div>
					</a>
				</div>
				<div className="col-4">
					<a
						className="cursor-pointer "
						onClick={() => {
							router.push(`/product/categoryProduct/32857`);
						}}>
						<div
							style={{
								position: 'relative',
								// overflow: 'hidden',
								width: '370px',
								height: '200px',
							}}>
							<Image
								fill
								src="/images/couples_toys.jpeg"
								alt="His and hers"
								// sizes="300px"
								sizes="33vw"
								style={{
									objectFit: 'contain',
								}}
							/>
						</div>
					</a>
				</div>
				<div className="col-4">
					<a
						className="cursor-pointer "
						onClick={() => {
							router.push(`/product/categoryProduct/32932`);
						}}>
						<div
							style={{
								position: 'relative',
								// overflow: 'hidden',
								width: '370px',
								height: '200px',
							}}>
							<Image
								fill
								src="/images/her_toys.JPEG"
								alt="Her toys"
								// sizes="300px"
								sizes="33vw"
								style={{
									objectFit: 'contain',
								}}
							/>
						</div>
					</a>
				</div>
				<div className="col-4">
					<a
						className="cursor-pointer "
						onClick={() => {
							router.push(`/product/categoryProduct/32929`);
						}}>
						<div
							style={{
								position: 'relative',
								// overflow: 'hidden',
								width: '370px',
								height: '200px',
							}}>
							<Image
								fill
								src="/images/his_toys.JPEG"
								alt="His Toys image"
								// sizes="300px"
								sizes="33vw"
								style={{
									objectFit: 'contain',
								}}
							/>
						</div>
					</a>
				</div>
				<div className="col-4">
					<a
						className="cursor-pointer "
						onClick={() => {
							router.push(`/product/categoryProduct/152`);
						}}>
						<div
							style={{
								position: 'relative',
								// overflow: 'hidden',
								width: '370px',
								height: '200px',
							}}>
							<Image
								fill
								src="/images/Lubricant.JPEG"
								alt="Lubricants image"
								// sizes="300px"
								sizes="33vw"
								style={{
									objectFit: 'contain',
								}}
							/>
						</div>
					</a>
				</div>

				{/* Popular brands */}
				<div className="col-12">
					<div className="text-900 font-medium text-4xl mb-4">
						Our Popular Brands
					</div>
					<div className="card">
						<Carousel
							value={brandItems}
							numVisible={3}
							numScroll={3}
							responsiveOptions={responsiveOptions}
							itemTemplate={brandTemplate}
							circular
							// autoplayInterval={4000}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export const getStaticProps: GetStaticProps = async (context) => {
	let brandItems: BrandType[] = [];
	const bucketName = process.env.AWS_PUBLIC_BUCKET_NAME || '';

	try {
		const { data } = await axios.get<BrandType[]>(
			process.env.EDC_API_BASEURL + `/brand`,
			{
				params: { category: 'B', catLevel: 6, onHomePage: true },
			}
		);

		brandItems = data;
		for (const brand of brandItems) {
			const key = brand.awsKey;
			const imgFormat = key.split('.')[1];

			const bucketParams = {
				Bucket: bucketName,
				Key: key,
			};
			const data: GetObjectCommandOutput = await s3Client.send(
				new GetObjectCommand(bucketParams)
			);
			if (data) {
				const imgData = await data.Body?.transformToString('base64');
				if (imgData) {
					brand.awsImageType = imgFormat;
					brand.awsImageData = imgData;
				}
			}
		}
	} catch (e) {
		console.error(`Could not find brands ${JSON.stringify(e, null, 2)}`);
	}

	return {
		props: {
			brandItems,
		},
	};
};

export default Home;
