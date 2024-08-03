import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'SaintlySinners - thank you for your payment',
};

export default function ResultLayout({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element {
	return (
		<div className="card ">
			<div className="flex justify-content-center mb-2">
				<h2>Thank you for your payment</h2>
			</div>
			{children}
		</div>
	);
}
