import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import axios from 'axios';
import { CATEGORY_TYPE } from 'interfaces/category.type';
import { ProductList } from 'components/ProductList';

const CategoryProduct: NextPage = ({ products, title }: any) => {
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
export const getStaticPaths: GetStaticPaths = async () => {
	const { data } = await axios.get<CATEGORY_TYPE[]>(
		process.env.EDC_API_BASEURL + `/category`
	);

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
	let products: any;
	let title: string = 'Default Title';
	/***
	 * Get Products
	 ****/
	try {
		const { data } = await axios.get(
			process.env.EDC_API_BASEURL +
				`/productByCategoryId?id=${context.params?.id}`
		);
		products = data;
	} catch (e) {
		console.error('Could not product');
		console.error(e);
	}

	/***
	 * Get Category Name
	 ****/

	try {
		const { data } = await axios.get<CATEGORY_TYPE>(
			process.env.EDC_API_BASEURL + `/category?id=${context.params?.id}`
		);

		if (data) {
			title = data.title;
		}
	} catch (e) {
		console.error('Could not get brand');
		console.error(e);
	}
	return {
		props: { products, title },
		revalidate: false, // regenerate the page
	};
};

export default CategoryProduct;
