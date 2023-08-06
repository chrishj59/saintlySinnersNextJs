import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import useSWR from 'swr';
import Image from 'next/image';
import { s3Client } from 'utils/s3-utils';
import { Carousel } from 'primereact/carousel';
import styles from '../styles/Home.module.css';

import {
	GetObjectAclCommandOutput,
	GetObjectCommand,
	GetObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { useEffect } from 'react';
import ImageData from './api/v1/productImage/[imageKey]';
import brands from './api/v1/brand/[withImage]';
import { SWRConfig } from 'swr/_internal';
import { fetchGetJSON } from 'utils/stripe-api-helpers';
import { Button } from 'primereact/button';

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

type AwsImageType = {
	imageData: string;
	imageFormat: string;

	brandId?: number;
	brandName?: string;
	brandDescription?: string;
};

type BrandInfoType = {
	id?: number;
	name?: string;
	description?: string;
	ImageData?: string;
	ImageFormat?: string;
};

const fetcher = (url: any) => axios.get(url).then((res) => res.data);

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
			<div className="text-900 font-medium text-4xl mb-4">Popular Brands</div>
			<div className="card">
				<Carousel
					value={brandItems}
					numVisible={3}
					numScroll={3}
					responsiveOptions={responsiveOptions}
					itemTemplate={brandTemplate}
					circular
					autoplayInterval={4000}
				/>
			</div>
		</>
	);
};

export const getStaticProps: GetStaticProps = async (context) => {
	let brandItems: BrandType[] = [];
	const bucketName = process.env.AWS_PUBLIC_BUCKET_NAME || '';

	try {
		console.log('about to get brands');
		const { data } = await axios.get<BrandType[]>(
			process.env.EDC_API_BASEURL + `/brand`,
			{
				params: { category: 'B', catLevel: 6, onHomePage: true },
			}
		);

		brandItems = data;
		let awsImages: AwsImageType[] = [];
		let index: number = 0;
		for (const brand of brandItems) {
			const key = brand.awsKey;
			const imgFormat = key.split('.')[1];
			console.log(`imgFormat ${imgFormat}`);
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
		console.log('Could not find brands');
		console.log(e);
	}

	return {
		props: {
			brandItems,
		},
	};
};

export default Home;
