import CustomerOrderView from '@/components/ui/secure/CustomerOrder';
import { CUSTOMER_ORDER } from '@/interfaces/customerOrder.type';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Customer Orders',
};

export default async function customerOrdersPage() {
	const orderurl = `${process.env.EDC_API_BASEURL}/order`;
	const orderResp = await fetch(orderurl, { cache: 'no-cache' });

	if (!orderResp.ok) {
		throw new Error('could not find customer orders');
	}

	const orders = (await orderResp.json()) as CUSTOMER_ORDER[];

	return <CustomerOrderView orders={orders} />;
}
