import type { Stripe } from 'stripe';
import { stripe } from '@/lib/stripe';
import { CUSTOMER_ORDER_UPDATE } from '@/interfaces/customerOrderUpdate.type';
import { BadRequestException } from 'next-api-decorators';
import { CUSTOMER_ORDER } from '@/interfaces/customerOrder.type';
import PaymentSuccess from '@/components/ui/PaymentSuccess';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Payment Accepted',
};
export default async function ResultPage({
	searchParams,
}: {
	searchParams: { session_id: string };
}) {
	if (!searchParams.session_id) {
		throw new Error('error gettting paid session isd');
	}
	const checkoutSession: Stripe.Checkout.Session =
		await stripe.checkout.sessions.retrieve(searchParams.session_id, {
			expand: ['line_items', 'payment_intent'],
		});

	//** update order to paid */
	const orderStatus: CUSTOMER_ORDER_UPDATE = {
		stripeSession: checkoutSession.id,
		orderStatus: 1,
	};

	const url = `${process.env.EDC_API_BASEURL}/customerOrderPaid/${checkoutSession.client_reference_id}`;
	try {
		const custOrderPaidResp = await fetch(url, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},

			body: JSON.stringify(orderStatus),
		});

		const paymentIntent =
			checkoutSession.payment_intent as Stripe.PaymentIntent;
	} catch (e: any) {}
	return (
		<>
			{' '}
			<PaymentSuccess />
			{/* <h2>Status: {paymentIntent.status}</h2>
			<h3>Checkout Session response:</h3>
			{JSON.stringify(checkoutSession, null, 2)} */}
			{/* {JSON.stringify(custOrder, null, 2)} */}
			{/* <PrintObject content={checkoutSession} /> */}
		</>
	);
}
