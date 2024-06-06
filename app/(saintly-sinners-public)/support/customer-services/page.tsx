'use client';

import { Card } from 'primereact/card';

export default function CustomerServices() {
	const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
	return (
		<Card
			title="Customer Services"
			pt={{
				title: { className: 'flex justify-content-center text-primary' },
				body: { className: 'border-round-lg' },
			}}>
			<p className="text-gray-600 ">We are here to help! </p>
			<p className="text-gray-600 ">
				Please contact us if you have any questions or would like suggest
				features you would like.
			</p>
			<p className="m-0 font-semibold  text-gray-600 ">
				Email: <span className="text-green-600">{email} </span>
			</p>
		</Card>
	);
}
