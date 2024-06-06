'use client';

import React, { useState } from 'react';

// import CustomDonationInput from '@/app/components/stripe/CustomeDonationInput';
// import StripeTestCards from '@/app/components/stripe/StripeTestCards';

import { formatAmountForDisplay } from '@/utils/stripe-helpers';
import * as config from '@/config/stripe';
import { createCheckoutSession } from '@/app/actions/stripe';

export default function CheckoutForm(): JSX.Element {
	const [loading] = useState<boolean>(false);
	const [input, setInput] = useState<{ customDonation: number }>({
		customDonation: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
	});

	const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
		e
	): void =>
		setInput({
			...input,
			[e.currentTarget.name]: e.currentTarget.value,
		});

	return (
		<form action={createCheckoutSession}>
			<button
				className="checkout-style-background"
				type="submit"
				disabled={loading}>
				Donate {formatAmountForDisplay(input.customDonation, config.CURRENCY)}
			</button>
		</form>
	);
}
