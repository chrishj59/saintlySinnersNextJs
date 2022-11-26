import axios from 'axios';
import { GetStaticProps } from 'next';
import { useState } from 'react';

import { ProductList } from '../../../components/ProductList';
import Brand from '../../secure/admin/brand';

import type { NextPage } from 'next';
type DataViewLayoutType = 'list' | 'grid' | (string & Record<string, unknown>);
type DataViewSortOrderType = 1 | 0 | -1 | undefined | null;

type BrandId = {
	id: number;
};

type Brand = {
	id: string;
	title: string;

	categoryType: string;
	catLevel: number;
	catDescription: string;
};
const BrandProduct: NextPage = ({ products, title }: any) => {
	console.log('products');
	console.log(products);
	console.log(`Title ${title}`);
	return (
		<div className="flex justify-content-center">
			<div className="card">
				<h5 className="text-center">Products for {title}</h5>

				<ProductList productParam={products} />
			</div>
		</div>
	);
};

export const getAllBrands = () => {};

export const getStaticPaths = async () => {
	const { data } = await axios.get<Brand[]>(
		process.env.EDC_API_BASEURL + `/brand`,
		{
			params: { category: 'B', catLevel: 6 },
		}
	);
	// const paths = data.map((b) => ({
	// 	params: { id: b.id },
	// }));

	return {
		paths: data.map((b) => {
			return {
				params: {
					id: `${b.id}`,
					title: `${b.title}`,
				},
			};
		}),
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps = async (context) => {
	//let brands: BrandTy[] = [];
	let products: any = [];

	/**
	 * get products for brand
	 */
	const url = `/product/brandProduct/${context.params?.id}`;

	try {
		const { data } = await axios.get(
			process.env.EDC_API_BASEURL + `/productByBrandId?id=${context.params?.id}`
		);
		products = data;
	} catch (e) {
		console.log('Could not product');
		console.log(e);
	}

	/**
	 * Get Brand into
	 */
	let title: string = '';
	try {
		const { data } = await axios.get<Brand>(
			process.env.EDC_API_BASEURL + `/brand?id=${context.params?.id}`
		);
		title = data.title;
	} catch (e) {
		console.log('Could not get brand');
		console.log(e);
	}

	return {
		props: { products, title },
	};
};

export default BrandProduct;
