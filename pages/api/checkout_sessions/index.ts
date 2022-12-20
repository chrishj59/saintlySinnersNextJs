import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	// https://github.com/stripe/stripe-node#configuration
	apiVersion: '2022-11-15',
});

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {}
