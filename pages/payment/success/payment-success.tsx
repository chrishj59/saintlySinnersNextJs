import { NextPage } from 'next';
import { useLocalStorage } from 'primereact/hooks';
import { useEffect } from 'react';

const PaymentSucess: NextPage = () => {
	const [orderId, setOrderId] = useLocalStorage('', 'orderKey');
	useEffect(() => {
		console.log(`useEffect called ${orderId}`);
	}, [orderId]);

	return (
		<div className="flex align-items-center py-5 px-3">
			<i className="pi pi-fw pi-money-bill mr-2 text-2xl" />
			<p className="m-0 text-lg">Thank you for your purchase</p>
			<p>PaymentSucess order id {orderId}</p>
			{/* <h2>Status: {data?.payment_intent?.status ?? 'loading...'}</h2> */}
		</div>
	);
};

export default PaymentSucess;
