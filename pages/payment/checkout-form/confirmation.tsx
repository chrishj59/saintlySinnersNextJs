import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactNode from 'react';

import CheckoutForm from '.';

// type Props = {
// 	children: React.ReactNode;
// 	props: React.ReactNode;
//};

const deliveryForm = (props: React.ReactNode) => {
	console.log('delivery form');
	console.log(props);
	return (
		<CheckoutForm>
			<div className="flex align-items-center py-5 px-3">
				<i className="pi pi-fw pi-money-bill mr-2 text-2xl" />
				<p className="m-0 text-lg">
					confirmation Component Content via Child Route
				</p>
			</div>
		</CheckoutForm>
	);
};

export default deliveryForm;
