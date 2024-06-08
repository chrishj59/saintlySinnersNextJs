import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Payment Cancelled',
};
export default async function ResultPage({
	searchParams,
}: {
	searchParams: { session_id: string };
}): Promise<React.JSX.Element> {
	return <div> You have cancelled your payment</div>;
}
