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
		const buf = await buffer(req);

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
			if (err! instanceof Error) console.error(err);
			console.error(`❌ Error message: ${errorMessage}`);
			res.status(400).send(`Webhook Error: ${errorMessage}`);
			return;
		}

		// Successfully constructed event.

		// Cast event data to Stripe object.

		if (event.type === 'payment_intent.succeeded') {
			const paymentIntent = event.data.object as Stripe.PaymentIntent;
		}
		if (event.type === 'payment_intent.created') {
			const paymentIntent = event.data.object as Stripe.PaymentIntent;
		} else if (event.type === 'payment_intent.payment_failed') {
			const paymentIntent = event.data.object as Stripe.PaymentIntent;
			console.error(
				`❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
			);
		} else if (event.type === 'strip charge.succeeded') {
			const charge = event.data.object as Stripe.Charge;
		} else if (event.type === 'checkout.session.completed') {
			const session = event.data.object as Stripe.Checkout.Session;
			const metadata: Metadata | null = session.metadata;

			const orderId = metadata?.order_id;

			/** call API to send order to EDC  and  email admin */

			const url = `${process.env.EDC_API_BASEURL}/order/${orderId}`;
			try {
				const { data, status } = await axios.post<RESPONSE_MESSAGE_TYPE>(url);
				// if (data) {
				//const status = data.status;

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
