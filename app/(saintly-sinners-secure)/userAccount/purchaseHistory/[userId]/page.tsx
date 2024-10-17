import { auth } from '@/auth';
import OrderHistoryUI from '@/components/ui/secure/user/orderHistory';
import { USER_TYPE } from '@/interfaces/user.type';
import { redirect } from 'next/navigation';
import { CUSTOMER_ORDER_RESPONSE } from '@/interfaces/customerOrderResponse.type';
import { CUSTOMER_ORDER } from '@/interfaces/customerOrder.type';

export async function generateStaticParams() {
	const url = `${process.env.EDC_API_BASEURL}/user`;
	const users = (await fetch(url).then((res) => res.json())) as USER_TYPE[];

	return users.map((user) => ({
		userId: user.id,
	}));
}

export default async function PurchaseHistory({
	params,
}: {
	params: { userId: string };
}) {
	const session = await auth();
	if (!session) {
		redirect('/');
	}
	const userId = params.userId;
	const url = `${process.env.EDC_API_BASEURL}/userOrders/${userId};`;

	const ordersResp = await fetch(
		`${process.env.EDC_API_BASEURL}/userOrders/${params.userId}`
	);
	if (!ordersResp.ok) {
		new Error(
			'An error occured loading your purchase history. Please email support'
		);
	}

	const user = (await ordersResp.json()) as USER_TYPE;

	const orderHistory = user.orders;

	return (
		<>
			<OrderHistoryUI orders={orderHistory} />
		</>
	);
}
