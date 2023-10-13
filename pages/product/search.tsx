import { ProductList } from 'components/ProductList';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const fetcher = async (uri: string) => {
	const response = await fetch(uri);
	return response.json();
};
const ProductFiltered = () => {
	const searchParams = useSearchParams();
	const search = searchParams.get('search');

	const {
		data: products,
		isLoading,
		error,
	} = useSWR(`/api/v1/product/search?search=${search}`, fetcher);
	//console.log(`products returned ${JSON.stringify(data)}`);

	if (products) {
		return (
			<div className="flex justify-content-center">
				<div className="card min-w-full">
					<h3 className="text-center"> Products with {search} in the title</h3>

					<ProductList productParam={products} />
				</div>
			</div>
		);
	} else {
		return (
			<div className="flex justify-content-center">
				<div className="card min-w-full">
					<h3 className="text-center"> Products with {search} in the title</h3>
					No products with selection
				</div>
			</div>
		);
	}
};

export default ProductFiltered;
