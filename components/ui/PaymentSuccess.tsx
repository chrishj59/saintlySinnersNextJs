'use client';

import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

export default function PaymentSuccess() {
	console.log('called components/Paymentsuccess');
	const router = useRouter();
	const footer = (
		<div className="flex flex-wrap justify-content-center gap-2">
			<Button
				className="p-button-primary"
				label="Continue shopping"
				icon="pi pi-home"
				onClick={() => router.push('/')}
			/>
		</div>
	);
	return (
		<div className="flex justify-content-center">
			<Card
				title="Payment successful"
				// subTitle="Thank you for your payment"
				footer={footer}
				className="md:w-25rem">
				<div className="flex flex-column gap-column-40">
					<div>
						<p className="m-0 text-lg ">Thank you for your purchase.</p>
					</div>
					<div className="mt-1">
						<p className="text-lg">
							We have sent an email with your invoice and the elves are
							processing your order.
						</p>
						<p className="text-lg">
							We will email you when your order has been dispatched.
						</p>
					</div>
				</div>
			</Card>
		</div>
	);
}
