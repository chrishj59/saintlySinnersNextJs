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

	const cart = useBasket();

	const router = useRouter();
	const [sessionId, setSessionId] = useState<string | string[] | undefined>('');
	const [orderId, setOrderId] = useLocalStorage('', 'orderKey');
	console.warn(`props: ${JSON.stringify(props, null, 2)}`);
	useEffect(() => {
		async () => {};
	}, [router.query.session_id]);
	console.warn(`'orderId after useEffect ${orderId}`);
	const saveEdcOrder = async () => {};
	// Fetch CheckoutSession from static page via
	// https://nextjs.org/docs/basic-features/data-fetching#static-generation
	//setSessionId(router.query.session_id);

	const deliveryInfo = cart.deliveryInfo;

	const items = cart.items;

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
