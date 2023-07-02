import { Metadata } from '@stripe/stripe-js';
import { buffer } from 'micro';
import Cors from 'micro-cors';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import Stripe from 'stripe';
import { RESPONSE_MESSAGE_TYPE } from 'interfaces/responseMessage.interface';
import { CustOrderStatusEnum } from 'utils/Message-status.enum';
import { CustOrderUpdatedResponseDto } from 'interfaces/custOrderUpdatedMessage.response';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	// https://github.com/stripe/stripe-node#configuration
	apiVersion: '2022-11-15',
});

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

// Stripe requires the raw body to construct the event.
export const config = {
	api: {
		bodyParser: false,
	},
};

const cors = Cors({
	allowMethods: ['POST', 'HEAD'],
});

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	console.warn(`webhookHandler called`);
	console.warn(`req method ${req.method}`);
	if (req.method === 'POST') {
		console.log('Inside Post');
		const buf = await buffer(req);
		console.log('after get buffer');
		const sig = req.headers['stripe-signature']!;

		let event: Stripe.Event;

		try {
			event = stripe.webhooks.constructEvent(
				buf.toString(),
				sig,
				webhookSecret
			);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Unknown error';
			// On error, log and return the error message.
			if (err! instanceof Error) console.log(err);
			console.log(`❌ Error message: ${errorMessage}`);
			res.status(400).send(`Webhook Error: ${errorMessage}`);
			return;
		}

		// Successfully constructed event.
		console.log('✅ Post event id:', event.id);

		// Cast event data to Stripe object.
		console.log(`stripe event type: ${event.type}`);
		if (event.type === 'payment_intent.succeeded') {
			const paymentIntent = event.data.object as Stripe.PaymentIntent;
			console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);
		}
		if (event.type === 'payment_intent.created') {
			const paymentIntent = event.data.object as Stripe.PaymentIntent;
			console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);
		} else if (event.type === 'payment_intent.payment_failed') {
			const paymentIntent = event.data.object as Stripe.PaymentIntent;
			console.log(
				`❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
			);
		} else if (event.type === 'strip charge.succeeded') {
			const charge = event.data.object as Stripe.Charge;
			console.log(`💵 charge.succeeded Charge id: ${charge.id}`);
		} else if (event.type === 'checkout.session.completed') {
			console.log(`💵 checkout.session.completed`);
			const session = event.data.object as Stripe.Checkout.Session;
			const metadata: Metadata | null = session.metadata;

			const orderId = metadata?.order_id;
			console.log(`metadata - order id ${JSON.stringify(orderId, null, 2)}`);
			/** call API to send order to EDC  and  email admin */
			const url = `${process.env.EDC_API_BASEURL}/order/${orderId}`;
			try {
				const { data, status } = await axios.post<RESPONSE_MESSAGE_TYPE>(url);
				// if (data) {
				//const status = data.status;
				console.log(
					`response data from ${url} is ${JSON.stringify(data, null, 3)} `
				);
				console.log(`response status from send order to edc ${status}`);
				if (status === 201) {
					const custOrderUrl = `${process.env.EDC_API_BASEURL}/customerOrder/${orderId}`;
					const orderUpdates = {
						stripeSession: session.id,
						orderStatus: CustOrderStatusEnum.EDC_ORDER_COMPLETE,
					};

					const { data, status } =
						await axios.patch<CustOrderUpdatedResponseDto>(
							custOrderUrl,
							orderUpdates
						);

					console.log(
						`update customer order updated ${data.orderMessage.rowsUpdated}`
					);
					console.log(`update order status ${status}`);
					const rowsUpdated: number = data.orderMessage.rowsUpdated;
				}
				// }else {

				// }
			} catch (error) {
				if (axios.isAxiosError(error)) {
					console.error('error message: ', error.message);
					//return error.message;
				} else {
					console.error('unexpected error: ', error);
					//return 'An unexpected error occurred';
				}
			}
		} else {
			console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
		}

		// Return a response to acknowledge receipt of the event.
		res.json({ received: true });
	} else {
		res.setHeader('Allow', 'POST');
		res.status(405).end('Method Not Allowed');
	}
	console.warn('End of webhookHandler');
};

export default cors(webhookHandler as any);

// //import { buffer } from 'micro';
// import Cors from 'micro-cors';
// import { NextApiRequest, NextApiResponse } from 'next';
// import Stripe from 'stripe';
// import getRawBody from 'raw-body';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
// 	// https://github.com/stripe/stripe-node#configuration
// 	apiVersion: '2022-11-15',
// });

// const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;
// const STRIPE_SIGNATURE_HEADER = 'stripe-signature';

// // Stripe requires the raw body to construct the event.
// export const config = {
// 	api: {
// 		bodyParser: false,
// 	},
// };

// const cors = Cors({
// 	allowMethods: ['POST', 'HEAD'],
// });

// const buffer = (req: any) => {
// 	return new Promise((resolve, reject) => {
// 		const chunks: any[] = [];

// 		req.on('data', (chunk: any) => {
// 			chunks.push(chunk);
// 		});

// 		req.on('end', () => {
// 			resolve(Buffer.concat(chunks));
// 		});

// 		req.on('error', reject);
// 	});
// };

// const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
// 	const signature = req.headers[STRIPE_SIGNATURE_HEADER];
// 	const rawBody = await getRawBody(req);

// 	console.log(`webhook called with method ${JSON.stringify(req.method)}`);

// 	if (req.method === 'POST') {
// 		console.log(`start of post method`);
// 		const buf = await buffer(req);
// 		console.log('after get buffer');
// 		// const sig = req.headers['stripe-signature']!;

// 		// let event: Stripe.Event;

// 		// try {
// 		// 	console.log('before stripe construct event');
// 		// 	event = stripe.webhooks.constructEvent(
// 		// 		buf.toString(),
// 		// 		sig,
// 		// 		webhookSecret
// 		// 	);
// 		// 	console.log('After  stripe construct event');
// 		// } catch (err) {
// 		// 	console.log(
// 		// 		`stripe construct event error ${JSON.stringify(err, null, 2)}`
// 		// 	);
// 		// 	const errorMessage = err instanceof Error ? err.message : 'Unknown error';
// 		// 	// On error, log and return the error message.
// 		// 	if (err! instanceof Error) console.log(err);
// 		// 	console.log(`❌ Error message: ${errorMessage}`);
// 		// 	res.status(400).send(`Webhook Error: ${errorMessage}`);
// 		// 	return;
// 		// }
// 		// res.send('webhook called');
// 		// // Successfully constructed event.
// 		// console.log('✅ stripe webhook Success:', event.id);

// 		// // Cast event data to Stripe object.
// 		// if (event.type === 'payment_intent.succeeded') {
// 		// 	const paymentIntent = event.data.object as Stripe.PaymentIntent;
// 		// 	console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);
// 		// } else if (event.type === 'payment_intent.payment_failed') {
// 		// 	const paymentIntent = event.data.object as Stripe.PaymentIntent;
// 		// 	console.log(
// 		// 		`❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
// 		// 	);
// 		// } else if (event.type === 'charge.succeeded') {
// 		// 	const charge = event.data.object as Stripe.Charge;
// 		// 	console.log(`💵 Charge id: ${charge.id}`);
// 		// } else {
// 		// 	console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
// 		// }

// 		// Return a response to acknowledge receipt of the event.
// 		res.json({ received: true });
// 	} else {
// 		res.setHeader('Allow', 'POST');
// 		res.status(405).end('Method Not Allowed');
// 	}
// 	console.log(`after post method`);
// 	// res.setHeader('Allow', 'POST');
// 	// res.status(405).end('Method Not Allowed');
// };

// export default cors(webhookHandler as any);
