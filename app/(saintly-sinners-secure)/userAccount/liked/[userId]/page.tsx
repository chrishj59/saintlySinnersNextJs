import { auth } from '@/auth';
import LoadingPage from '@/components/ui/Loading';
import ProductList from '@/components/ui/ProductList';
import ProductListSuspense from '@/components/ui/ProductListSuspense';
import { USER_TYPE } from '@/interfaces/user.type';
import { XtraderProductResp } from '@/interfaces/xtraderProduct.type';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export async function generateStaticParams() {
	const url = `${process.env.EDC_API_BASEURL}/user`;
	const users = (await fetch(url).then((res) => res.json())) as USER_TYPE[];

	return users.map((user) => ({
		userId: user.id,
	}));
}

export default async function UserPersonalDetailsPage({
	params,
}: {
	params: { userId: string };
}) {
	const session = await auth();
	if (!session?.user) {
		redirect('/');
	}

	const url = `${process.env.NEXT_URL}/api/user/liked/${params.userId}`;

	const productsLiked = await fetch(url);

	const productsLikedResp =
		(await productsLiked.json()) as XtraderProductResp[];

	return (
		<Suspense fallback={<ProductListSuspense />}>
			<ProductList products={productsLikedResp} title={`My Liked `}>
				children
			</ProductList>
		</Suspense>
	);
}
