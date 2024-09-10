import { auth } from '@/auth';
import LoadingPage from '@/components/ui/Loading';
import ProductList from '@/components/ui/ProductList';

import { XtraderProductResp } from '@/interfaces/xtraderProduct.type';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function UserPersonalDetailsPage() {
	const session = await auth();
	if (!session?.user) {
		redirect('/');
	}

	const url = `${process.env.NEXT_URL}/api/user/liked/${session.user.id}`;

	const productsLiked = await fetch(url, { cache: 'no-cache' });

	const productsLikedResp =
		(await productsLiked.json()) as XtraderProductResp[];

	return (
		<Suspense fallback={<LoadingPage />}>
			<ProductList products={productsLikedResp} title={`My Liked `}>
				children
			</ProductList>
		</Suspense>
	);
}
