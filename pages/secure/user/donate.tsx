import { Elements } from '@stripe/react-stripe-js';
import { PaymentIntent } from '@stripe/stripe-js';
import ElementsForm from 'components/stripeExample/ElementsForm';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';

import * as config from '../../../config/stripe';
import getStripe from '../../../utils/get-stripejs';
import { fetchPostJSON } from '../../../utils/stripe-api-helpers';

const DonatePage: NextPage = () => {
	const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(
		null
	);
	useEffect(() => {
		fetchPostJSON('/api/v1/payment_intents', {
			amount: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
		}).then((data) => {
			setPaymentIntent(data);
		});
	}, [setPaymentIntent]);
	return (
		<div className="donateStyles.page-container">
			<h1>Donate with Elements</h1>
			<p>Donate to our project 💖</p>
			{paymentIntent && paymentIntent.client_secret ? (
				<Elements
					stripe={getStripe()}
					options={{
						appearance: {
							variables: {
								colorIcon: '#6772e5',
								fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
							},
						},
						clientSecret: paymentIntent.client_secret,
					}}>
					<ElementsForm paymentIntent={paymentIntent} />
				</Elements>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
};

export default DonatePage;
