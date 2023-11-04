import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
const ProductFiltered = () => {
	const searchParams = useSearchParams();
	const search = searchParams.get('search');

	return <div>Search: {search}</div>;
};

export default ProductFiltered;
