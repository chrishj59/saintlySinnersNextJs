import { Brand } from '@/interfaces/brand.interface';
import { ProductAxiosType } from '@/interfaces/product.type';
import { Metadata } from 'next';

// export async function generateStaticParams() {
// 	const resp = await fetch(
// 		process.env.EDC_API_BASEURL + `/brand?category=B&catLevel=6`
// 	).then((res) => res.json());
// 	const brands = (await resp.json()) as Brand[];

// 	return {
// 		paths: brands.map((b: Brand) => {
// 			return {
// 				params: {
// 					id: `${b.id}`,

// 				},
// 			};
// 		}),
// 		fallback: 'blocking',
// 	};
// }
export const metadata: Metadata = {
	title: 'Products by Brand list',
};

export async function generateStaticParams() {
	const brands = (await fetch(
		process.env.EDC_API_BASEURL + `/brand?category=B&catLevel=6`
	).then((res) => res.json())) as Brand[];

	return brands.map((b: Brand) => ({
		id: b.id.toString(),
	}));
}

export default function Page({ params }: { params: { id: string } }) {
	return <div>Product id: {params.id}</div>;
}
