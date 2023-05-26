import { useBasket } from 'components/ui/context/BasketContext';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useLocalStorage } from 'primereact/hooks';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactNode from 'react';

import CheckoutForm from '.';

// type Props = {
// 	children: React.ReactNode;
// 	props: React.ReactNode;
//};
//cs_test_b1j5vkOwRDgfhoSyCiiiioqGYLhp0OSMFW6hwLybqQBc2u1TC0rJ7i3maW

const ConfirmationPage: NextPage = (props: any) => {
	//const confirmation = async () => {
	console.log(`Confirmation props ${JSON.stringify(props)}`);
	const cart = useBasket();
	console.log('confirmation page');
	console.log(JSON.stringify(cart, null, 2));
	const router = useRouter();
	const [sessionId, setSessionId] = useState<string | string[] | undefined>('');
	const [orderId, setOrderId] = useLocalStorage('', 'orderKey');

	useEffect(() => {
		async () => {
			console.log(`called useEffect`);
		};
	}, [sessionId]);
	const saveEdcOrder = async () => {};
	// Fetch CheckoutSession from static page via
	// https://nextjs.org/docs/basic-features/data-fetching#static-generation
	//setSessionId(router.query.session_id);
	console.log(`sessionId returned from checkout ${router.query.session_id}`);
	const deliveryInfo = cart.deliveryInfo;
	console.log(`cart deliveryinfo ${JSON.stringify(deliveryInfo, null, 2)}`);
	const items = cart.items;
	console.log(`cart items ${JSON.stringify(items, null, 2)}`);
	console.log(`cart quantity ${cart.quantity}`);

	// const { data, error } = useSWR(
	// 	router.query.session_id
	// 		? `/api/checkout_sessions/${sessionID}`
	// 		: // `/api/checkout_sessions/cs_test_b1j5vkOwRDgfhoSyCiiiioqGYLhp0OSMFW6hwLybqQBc2u1TC0rJ7i3maW`
	// 		  null,
	// 	fetchGetJSON
	// );
	// if (error) return <div>failed to load</div>;
	// if (data) {
	// 	// call api to save order and send to EDC
	// 	// await axios.post(
	// 	// 	process.env.NEXT_PUBLIC_EDC_API_BASEURL + '/edc_order/saveEdcOrder',
	// 	// 	cart
	// 	// );
	// 	// axios
	// 	// 	.post(process.env.NEXT_PUBLIC_EDC_API_BASEURL + '/edc_order/saveEdcOrder')
	// 	// 	.then((resp: AxiosResponse) => {
	// 	// 		console.log(
	// 	// 			`called saveEdcOrder resp ${JSON.stringify((resp.data, null, 2))}`
	// 	// 		);
	// 	// 	})
	// 	// 	.catch((err: AxiosError) => {
	// 	// 		console.error(`Axios error status ${err.status}`);
	// 	// 	});
	// 	console.log('confirmation page after call to /edc_order/saveEdcOrder');
	// 	cart.clearAll();
	// }
	return (
		<CheckoutForm>
			<div className="flex align-items-center py-5 px-3">
				<i className="pi pi-fw pi-money-bill mr-2 text-2xl" />
				<p className="m-0 text-lg">Thank you for your purchase</p>
				<p>order id {orderId}</p>
				{/* <h2>Status: {data?.payment_intent?.status ?? 'loading...'}</h2> */}
			</div>
		</CheckoutForm>
	);
};
export default ConfirmationPage;
//export default confirmation;
