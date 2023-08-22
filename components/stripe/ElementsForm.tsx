import {
	PaymentElement,
	useElements,
	useStripe,
} from '@stripe/react-stripe-js';
import { PaymentIntent } from '@stripe/stripe-js';
import { useBasket } from 'components/ui/context/BasketContext';
import * as stripeConfig from 'config/stripe';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchPostJSON } from 'utils/stripe-api-helpers';
import {
	formatAmountForDisplay,
	formatAmountFromStripe,
} from 'utils/stripe-helpers';

type PayValuesTy = {
	paymentAmount: number;
	cardholderName: string;
};

type PayValuesTyRec = Record<keyof PayValuesTy, string | number>;

// const ElementsForm: FC<{
// 	paymentIntent?: PaymentIntent | null;
// }> = ({ paymentIntent = null }) => {
const ElementsForm = ({
	paymentIntent,
	setPaymentIntent,
}: {
	paymentIntent: PaymentIntent;
	setPaymentIntent: {};
}) => {
	const cart = useBasket();
	const defaultAmout = paymentIntent
		? formatAmountFromStripe(paymentIntent.amount, paymentIntent.currency)
		: Math.round(stripeConfig.MAX_AMOUNT / stripeConfig.AMOUNT_STEP);
	const [input, setInput] = useState({
		paymentAmount: 0.0,
		cardholderName: '',
	});
	const [paymentType, setPaymentType] = useState('');
	const [payment, setPayment] = useState({ status: 'initial' });
	const [errorMessage, setErrorMessage] = useState('');
	const stripe = useStripe();
	const elements = useElements();

	// useEffect(() => {
	// 	const _input = input;
	// 	_input.paymentAmount = cart.payable;
	// 	setInput(_input);
	// }, [input]);

	const PaymentStatus = ({ status }: { status: string }) => {
		switch (status) {
			case 'processing':
			case 'requires_payment_method':
			case 'requires_confirmation':
				return <h2>Processing...</h2>;

			case 'requires_action':
				return <h2>Authenticating...</h2>;

			case 'succeeded':
				return <h2>Payment Succeeded 🥳</h2>;

			case 'error':
				return (
					<>
						<h2>Error 😭</h2>
						<p className="error-message">{errorMessage}</p>
					</>
				);

			default:
				return null;
		}
	};

	const [formData, setFormData] = useState({});
	const [showMessage, setShowMessage] = useState(false);

	const defaultValues = {
		cardholderName: '',
		paymentAmount: 0.0,
	};

	const {
		control,
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm<PayValuesTy>({ defaultValues });

	const handlePaySubmit: React.FormEventHandler<HTMLFormElement> = async (
		e
	) => {
		e.preventDefault();
		alert(`payment amount ${input.paymentAmount}`);
		// Abort if form isn't valid
		if (!e.currentTarget.reportValidity()) return;
		if (!elements) return;
		setPayment({ status: 'processing' });

		// Create a PaymentIntent with the specified amount.

		const response = await fetchPostJSON('/api/v1/payment_intents', {
			amount: cart.payable,
			payment_intent_id: paymentIntent?.id,
		});
		setPayment(response);

		// Use your card Element with other Stripe.js APIs
		const { error } = await stripe!.confirmPayment({
			elements,
			confirmParams: {
				return_url: 'http://localhost:3000/payment/checkout-form/payment',
				payment_method_data: {
					billing_details: {
						name: input.cardholderName,
					},
				},
			},
		});
		if (!error) {
		}

		alert(`Payment status: ${JSON.stringify(payment)}`);
	};
	const onSubmit = async (payment: any) => {
		payment.paymentAmount = input.paymentAmount;
		alert(JSON.stringify(payment));
	};

	const getFormErrorMessage = (name: string) => {
		return (
			errors[name as keyof PayValuesTy] && (
				<small className="p-error">
					{errors[name as keyof PayValuesTy]?.message}
				</small>
			)
		);
	};

	const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		setInput({
			...input,
			['cardholderName']: e.currentTarget.value,
		});
	};

	return (
		<>
			<form onSubmit={handlePaySubmit} className="p-fluid">
				<div className="flex justify-content-center">
					<Card style={{ width: '80%' }} title="Payment Information">
						<div className="field">
							<span className="p-float-label">
								<InputText
									value={input.cardholderName}
									onChange={(e) => handleInputChange(e)}
									aria-describedby="cardholderName-help"
									required
								/>
								<small id="username-help">Enter the name on the card.</small>
								{/* <Controller
									name="cardholderName"
									control={control}
									rules={{ required: 'Cardholder name  is required.' }}
									render={({ field, fieldState }) => (
										<InputText
											id={field.name}
											{...field}
											autoFocus
											className={classNames({
												'p-invalid': fieldState.error,
											})}
										/>
									)}
								/> */}
								<label
									htmlFor="cardholderName"
									className={classNames({ 'p-error': errors.cardholderName })}>
									Cardholder name
								</label>
							</span>
							{getFormErrorMessage('cardholderName')}
						</div>
						<div className="field">
							<span className="p-float-label">
								<PaymentElement
									onChange={(e) => {
										setPaymentType(e.value.type);
									}}
								/>
							</span>
						</div>
						{payment.status}
						<Button
							type="submit"
							disabled={
								!['initial', 'succeeded', 'error'].includes(payment.status) ||
								!stripe
							}>
							Make Payment{' '}
							{formatAmountForDisplay(
								input.paymentAmount,
								stripeConfig.CURRENCY
							)}
						</Button>
					</Card>
				</div>
			</form>
		</>
	);
};

export default ElementsForm;
