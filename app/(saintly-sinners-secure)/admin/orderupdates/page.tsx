import { Metadata } from 'next';
import { BadRequestException } from 'next-api-decorators';

export const metadata: Metadata = {
	title: 'Order Updates',
};
export default async function orderUpdatesPage() {
	const orderStatusurl = `${process.env.EDC_API_BASEURL}/orderStatus`;
	const orderStatusResp = await fetch(orderStatusurl, { cache: 'no-cache' });

	if (!orderStatusResp.ok) {
		// throw new BadRequestException(
		// 	`status ${orderStatusResp.status} message=${orderStatusResp.statusText}`
		// );
		throw new Error('could order status list');
	}
	const orderStatus = await orderStatusResp.text();

	return (
		<h3>
			Order status update complete -{' '}
			<span className="font-semibold">{orderStatus}</span>
		</h3>
	);
}
