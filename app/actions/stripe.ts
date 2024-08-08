'use server';

import type { Stripe } from 'stripe';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { CURRENCY } from '@/config/stripe';
import { formatAmountForStripe } from '@/utils/stripe-helpers';
import { stripe } from '@/lib/stripe';

export async function createCheckoutSession(
	data: FormData
): Promise<{ client_secret: string | null; url: string | null }> {
	const ui_mode = data.get(
		'uiMode'
	) as Stripe.Checkout.SessionCreateParams.UiMode;
	console.log(`ui_mode ${ui_mode}`);
	const origin: string = headers().get('origin') as string;

	const deliveryCost = Number(data.get('delivery_charge') as string);
	console.log(`stripe delvery cost ${deliveryCost}`);
	const email = data.get('email') as string;
	const orderId = data.get('orderId') as string;
	const orderTotal = data.get('orderTotal') as string;
	const addressLine = data.get('addressLine') as string;
	let titles: FormDataEntryValue[] = data.getAll('title');
	if (!titles) {
		titles = [];
	}
	let descriptions: FormDataEntryValue[] = data.getAll('title');
	if (!descriptions) {
		descriptions = [];
	}

	let lineAmounts: FormDataEntryValue[] = data.getAll('lineAmount');

	const title = titles[0] as string;

	let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
	const buildLineItems = () => {
		for (let i = 0; i < titles.length; i++) {
			const _lineItem = {
				quantity: 1,
				price_data: {
					currency: CURRENCY,
					product_data: {
						// name: 'Custom amount donation',
						name: titles[i] as string,
						description: descriptions[i] as string,
					},
					unit_amount: formatAmountForStripe(
						// Number(data.get('customDonation') as string),
						Number(lineAmounts[i] as string),
						CURRENCY
					),
				},
			};
			lineItems.push(_lineItem);
		}
	};

	buildLineItems();

	const checkoutParams1: Stripe.Checkout.SessionCreateParams = {
		client_reference_id: orderId,
		mode: 'payment',
		payment_method_types: ['card'],
		submit_type: 'pay',
		line_items: lineItems,
		shipping_options: [
			{
				shipping_rate_data: {
					display_name: `Deliver to ${addressLine}`,
					type: 'fixed_amount',
					fixed_amount: {
						amount: Number((deliveryCost * 100).toFixed(0)),
						currency: CURRENCY,
					},
				},
			},
		],
		success_url: `${origin}/cartPayment/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${origin}/cartPayment/paymentCancelled`,
		// ...(ui_mode === 'hosted' && {
		// 	success_url: `${origin}/cartPayment/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
		// 	cancel_url: `${origin}/cartPayment/paymentCancelled`,
		// }),
		// ui_mode,
		// success_url: `${headers().get(
		// 	'origin'
		// )}/cartPayment/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
		// cancel_url: `${headers().get(
		// 	'origin'
		// )}/cartPayment/paymentCancelled?session_id={CHECKOUT_SESSION_ID}`,
	};

	const checkoutSession: Stripe.Checkout.Session =
		await stripe.checkout.sessions.create(checkoutParams1);
	await stripe.checkout.sessions.create({
		client_reference_id: orderId,
		mode: 'payment',
		submit_type: 'pay',
		line_items: [
			{
				quantity: 1,
				price_data: {
					currency: CURRENCY,
					product_data: {
						// name: 'Custom amount donation',
						name: titles[0] as string,
						description: descriptions[0] as string,
					},
					unit_amount: formatAmountForStripe(
						// Number(data.get('customDonation') as string),
						Number(orderTotal),
						CURRENCY
					),
				},
			},
		],
		success_url: `${headers().get(
			'origin'
		)}/cartPayment/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${headers().get('origin')}/cartPayment/checkoutForm`,
	});

	redirect(checkoutSession.url as string);
}

export async function createPaymentIntent(
	data: FormData
): Promise<{ client_secret: string }> {
	const paymentIntent: Stripe.PaymentIntent =
		await stripe.paymentIntents.create({
			amount: formatAmountForStripe(
				Number(data.get('customDonation') as string),
				CURRENCY
			),
			automatic_payment_methods: { enabled: true },
			currency: CURRENCY,
		});

	return { client_secret: paymentIntent.client_secret as string };
}
// 'use server';

// import type { Stripe } from 'stripe';

// import { headers } from 'next/headers';

// import { CURRENCY } from '@/config/stripe';
// import { formatAmountForStripe } from '@/utils/stripe-helpers';
// import { stripe } from '@/lib/stripe';

// export async function createCheckoutSession(
// 	data: FormData
// ): Promise<{ client_secret: string | null; url: string | null }> {
// 	const ui_mode = data.get(
// 		'uiMode'
// 	) as Stripe.Checkout.SessionCreateParams.UiMode;

// 	const origin: string = headers().get('origin') as string;

// 	const checkoutSession: Stripe.Checkout.Session =
// 		await stripe.checkout.sessions.create({
// 			mode: 'payment',
// 			submit_type: 'donate',
// 			line_items: [
// 				{
// 					quantity: 1,
// 					price_data: {
// 						currency: CURRENCY,
// 						product_data: {
// 							name: 'Custom amount donation',
// 						},
// 						unit_amount: formatAmountForStripe(
// 							Number(data.get('customDonation') as string),
// 							CURRENCY
// 						),
// 					},
// 				},
// 			],
// 			...(ui_mode === 'hosted' && {
// 				success_url: `${origin}/donate-with-checkout/result?session_id={CHECKOUT_SESSION_ID}`,
// 				cancel_url: `${origin}/donate-with-checkout`,
// 			}),
// 			...(ui_mode === 'embedded' && {
// 				return_url: `${origin}/donate-with-embedded-checkout/result?session_id={CHECKOUT_SESSION_ID}`,
// 			}),
// 			ui_mode,
// 		});

// 	return {
// 		client_secret: checkoutSession.client_secret,
// 		url: checkoutSession.url,
// 	};
// }

// export async function createPaymentIntent(
// 	data: FormData
// ): Promise<{ client_secret: string }> {
// 	const paymentIntent: Stripe.PaymentIntent =
// 		await stripe.paymentIntents.create({
// 			amount: formatAmountForStripe(
// 				Number(data.get('customDonation') as string),
// 				CURRENCY
// 			),
// 			automatic_payment_methods: { enabled: true },
// 			currency: CURRENCY,
// 		});

// 	return { client_secret: paymentIntent.client_secret as string };
// }
