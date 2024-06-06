import type { Stripe } from 'stripe';

import CategoryMaint from '@/components/ui/secure/CategoryMaint';
import { CustOrderStatusEnum } from '@/utils/Message-status.enum';
import { stripe } from '@/lib/stripe';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { redirect } from 'next/navigation';
import PaymentEmailError from './notfound';

export default async function ResultPage({
	searchParams,
}: {
	searchParams: { session_id: string };
}): Promise<React.JSX.Element> {
	if (!searchParams.session_id)
		throw new Error('Please provide a valid session_id (`cs_test_...`)');

	const checkoutSession: Stripe.Checkout.Session =
		await stripe.checkout.sessions.retrieve(searchParams.session_id, {
			expand: ['line_items', 'payment_intent'],
		});

	console.log(`checkoutSession ${JSON.stringify(checkoutSession, null, 2)}`);
	const paymentIntent = checkoutSession.payment_intent as Stripe.PaymentIntent;
	let orderId = checkoutSession.client_reference_id;
	if (!orderId) {
		orderId = '';
	}
	try {
		const url = `${process.env.EDC_API_BASEURL}/customerOrder/${orderId}`;
		const orderStatusResp = await fetch(url, {
			method: 'PATCH',
		});
		if (!orderStatusResp.ok) {
			console.log(
				`orderStatusResp status ${orderStatusResp.status} statusText ${orderStatusResp.statusText}`
			);
			<PaymentEmailError
				orderId={orderId}
				stripeId={searchParams.session_id}
			/>;
		}
	} catch (error) {
		if (error instanceof SyntaxError) {
			// Unexpected token < in JSON
			console.log('There was a SyntaxError', error);
			// throw new Error(
			// 	`Syntax error sending customer email stripeid ${searchParams.session_id} customer order id {orderId}`
			// );
			// return NextResponse.json(
			// 	{ message: 'nest - JSON response error' },
			// 	{ status: 500 }
			// );
		} else {
			console.error('Could not send order email');
			console.error(error);
			// 	return NextResponse.json(
			// 		{ message: `Unexpected error ${error}` },
			// 		{ status: 500 }
			// 	);
			// throw new Error(
			// 	`Unxepected error stripeid ${searchParams.session_id} customer order id {orderId}`
			// );
			<PaymentEmailError
				orderId={orderId}
				stripeId={searchParams.session_id}
			/>;
		}
	}
	const footer = (
		<div className="flex flex-wrap justify-content-center gap-2">
			<Button
				className="p-button-primary"
				label="Continue shopping"
				icon="pi pi-home"
				onClick={() => redirect('/')}
			/>
		</div>
	);
	return (
		<>
			<div className="flex justify-content-center">
				<Card
					title="Payment successful"
					subTitle="Thank you for your payment"
					footer={footer}
					className="md:w-25rem">
					<div className="flex flex-column gap-column-40">
						<div>
							<p className="m-0 text-lg ">Thank you for your purchase</p>
						</div>
						<div>
							<p className="margin-top: 30px">
								We have sent an email with your invoice and expected despatch
								date.
							</p>
						</div>
					</div>
				</Card>
			</div>
			{/* <h2>Status: {paymentIntent.status}</h2>
			<h3>Checkout Session response:</h3>
			customer order id {checkoutSession.client_reference_id} */}
			{/* <PrintObject content={checkoutSession} /> */}
			{/* <PrintPaymentResult content={checkoutSession} /> */}
		</>
	);
}
