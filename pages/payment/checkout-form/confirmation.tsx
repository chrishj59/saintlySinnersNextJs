import { useBasket } from 'components/ui/context/BasketContext';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactNode from 'react';
import useSWR from 'swr';
import { fetchGetJSON } from 'utils/stripe-api-helpers';

import CheckoutForm from '.';

// type Props = {
// 	children: React.ReactNode;
// 	props: React.ReactNode;
//};
//cs_test_b1j5vkOwRDgfhoSyCiiiioqGYLhp0OSMFW6hwLybqQBc2u1TC0rJ7i3maW

const ResultPage: NextPage = () => {
	const cart = useBasket();
	console.log('delivery form');
	const router = useRouter();
	// Fetch CheckoutSession from static page via
	// https://nextjs.org/docs/basic-features/data-fetching#static-generation
	let sessionID = router.query.session_id;
	console.log(`sessionId returned from checkout ${router.query.session_id}`);
	sessionID = sessionID?.toString();
	sessionID = sessionID?.substring(0, sessionID.length - 1);

	console.log(`session id: ${sessionID} length: ${sessionID?.length}`);
	const { data, error } = useSWR(
		router.query.session_id
			? `/api/checkout_sessions/${sessionID}`
			: // `/api/checkout_sessions/cs_test_b1j5vkOwRDgfhoSyCiiiioqGYLhp0OSMFW6hwLybqQBc2u1TC0rJ7i3maW`
			  null,
		fetchGetJSON
	);
	if (error) return <div>failed to load</div>;
	if (data) cart.clearAll();
	return (
		<CheckoutForm>
			<div className="flex align-items-center py-5 px-3">
				<i className="pi pi-fw pi-money-bill mr-2 text-2xl" />
				<p className="m-0 text-lg">Thank you for your purchase</p>
				<h2>Status: {data?.payment_intent?.status ?? 'loading...'}</h2>
			</div>
		</CheckoutForm>
	);
};
export default ResultPage;
// export default deliveryForm;
