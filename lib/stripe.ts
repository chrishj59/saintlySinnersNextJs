import 'server-only';

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	// https://github.com/stripe/stripe-node#configuration for other config options
	apiVersion: '2023-10-16',
	appInfo: {
		name: 'SaintlySinners',
		url: 'https://SaintlySinners.co.uk',
	},
});
