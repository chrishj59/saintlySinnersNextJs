import CategoryMaint from '@/components/ui/secure/CategoryMaint';
import { CATEGORY_TYPE } from '@/interfaces/category.type';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Category maintenance',
};

export default async function CategoryPage() {
	try {
		const categoryResp = await fetch(process.env.EDC_API_BASEURL + '/category');

		if (!categoryResp.ok) {
			console.log(
				`get categories status ${categoryResp.status} ${categoryResp.statusText}`
			);
			return <div>Could not load categories</div>;
		}
		const categories = (await categoryResp.json()) as CATEGORY_TYPE[];

		return <CategoryMaint categories={categories} />;
	} catch (error) {
		if (error instanceof SyntaxError) {
			// Unexpected token < in JSON
			console.log('There was a SyntaxError', error);
			return <div>Could not load categories - unexpected error format</div>;
		} else {
			console.error('Could not find categories');

			console.error(error);
			return <div>Could not load categories - unexpected error </div>;
		}
	}
}
