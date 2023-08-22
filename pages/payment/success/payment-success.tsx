import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useLocalStorage } from 'primereact/hooks';
import { useEffect } from 'react';
import { CustOrderStatusEnum } from '../../../utils/Message-status.enum';
import { Button } from 'primereact/button';

import { Card } from 'primereact/card';

const PaymentSucess: NextPage = () => {
	const router = useRouter();
	const [orderId, setOrderId] = useLocalStorage('', 'orderKey');
	// useEffect(() => {}, [orderId]);

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
		<>
			<div className="flex justify-content-center">
				<Card
					title="Payment successful"
					subTitle="Thank you for your payment"
					footer={footer}
					className="md:w-25rem">
					<div className="flex flex-column gap-column-40">
						<div>
							<p className="m-0 text-lg ">Thank you for your purchase</p>
						</div>
						<div>
							<p className="margin-top: 30px">
								We have sent an email with your invoice and expected despatch
								date.
							</p>
						</div>
					</div>
				</Card>
			</div>
		</>
	);
};

export default PaymentSucess;
