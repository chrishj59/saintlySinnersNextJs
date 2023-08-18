import { CURRENCY, MAX_AMOUNT, MIN_AMOUNT } from 'config/stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { formatAmountForStripe } from 'utils/stripe-helpers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	// https://github.com/stripe/stripe-node#configuration
	apiVersion: '2022-11-15',
});

type productDataType = {
	name: string;
	description: string;
};
type priceDataType = {
	unit_amount: number;
	currency: string;
	product_data: productDataType;
};
type lineType = {
	price_data: priceDataType;
	quantity: number;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		const amount: number = req.body.amount;
		const deliveryharge: number = req.body.delivery_charge | 0;
		const email: string = req.body.email;
		const lines = req.body.lines;
		const orderId: string = req.body.orderId || 'no orderid';
		const items = lines.find((i: any) => i.id === 1).items;
		const delivery_charge: number = lines.find((i: any) => i.id === 2).amount;
		const prodLines: lineType[] = items.map((i: any) => {
			const item = i.item;
			const prodData: productDataType = {
				name: item.title,
				description: item.description,
			};
			const priceData: priceDataType = {
				unit_amount: formatAmountForStripe(item.b2c, item.currency),
				currency: item.currency,
				product_data: prodData,
			};
			const line: lineType = {
				price_data: priceData,
				quantity: 1,
			};
			return line;
		});

		try {
			// Validate the amount that was passed from the client.
			if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
				throw new Error('Invalid amount.');
			} // Create Checkout Sessions from body params.

			const checkoutParams: Stripe.Checkout.SessionCreateParams = {
				submit_type: 'pay',
				payment_method_types: ['card'],
				mode: 'payment',
				customer_email: email,
				currency: CURRENCY,
				metadata: { order_id: orderId },

				shipping_options: [
					{
						shipping_rate_data: {
							display_name: 'Deliver to your address',
							type: 'fixed_amount',
							fixed_amount: {
								amount: delivery_charge * 100,
								currency: CURRENCY,
							},
						},
					},
				],
				//prodLines,
				line_items: prodLines,

				success_url: `${req.headers.origin}/payment/success/payment-success?session_id={CHECKOUT_SESSION_ID},`,
				cancel_url: `${req.headers.origin}/payment/checkout-form/payment`,
			};

			const checkoutSession: Stripe.Checkout.Session =
				await stripe.checkout.sessions.create(checkoutParams);

			res.status(200).json(checkoutSession);
			// res.status(200);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Internal server error';
			res.status(500).json({ statusCode: 500, message: errorMessage });
		}
	}
}
