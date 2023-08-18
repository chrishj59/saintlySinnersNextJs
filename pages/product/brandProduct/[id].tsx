import axios from 'axios';
import { ProductList } from 'components/ProductList';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useState } from 'react';
import { useEffect } from 'react';

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
	return (
		<div className="flex justify-content-center">
			<div className="card min-w-full">
				<h3 className="text-center"> {title}</h3>
				product
				<ProductList productParam={products} />
			</div>
		</div>
	);
};

export const getAllBrands = () => {};

export const getStaticPaths: GetStaticPaths = async () => {
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
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async (context) => {
	let products: any;
	let title: string = 'Default Title';

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
		console.error('Could not product');
		console.error(e);
	}

	/**
	 * Get Brand into
	 */
	try {
		const { data } = await axios.get<Brand>(
			process.env.EDC_API_BASEURL + `/brand?id=${context.params?.id}`
		);

		title = data.title;
	} catch (e) {
		console.error('Could not get brand');
		console.error(e);
	}

	return {
		props: { products, title },
		revalidate: 1, // regenerate the page
	};
};

export default BrandProduct;
