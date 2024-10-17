import { basketItemType, useBasket } from '@/app/basket-context';
import Checkout from '@/components/ui/Checkout';
import { COUNTRY_TYPE } from '@/interfaces/country.type';
import { DELIVERY_CHARGE_TYPE } from '@/interfaces/delivery-charge.type';
import { createCheckoutSession } from '@/app/actions/stripe';
import { Metadata } from 'next';
import { Suspense } from 'react';
import CheckoutLoading from './loading';
import { useSession } from 'next-auth/react';
import { auth } from '@/auth';
import { USER_ADDRESS_TYPE } from '@/interfaces/userAddress.type';

export const metadata: Metadata = {
	title: 'Cart Payment',
};

export default async function CheckOutPage() {
	let countries: COUNTRY_TYPE[] = [];
	const session = await auth();
	const user = session?.user;
	let addresses: USER_ADDRESS_TYPE[] = [];
	if (user) {
		const url = `${process.env.EDC_API_BASEURL}/userAddress/${user.id}`;
		const addrResp = await fetch(url);

		if (addrResp.ok) {
			addresses = (await addrResp.json()) as USER_ADDRESS_TYPE[];
		}
	}
	//get delivery charges
	const chargeResp = await fetch(
		`${process.env.EDC_API_BASEURL}/deliveryCharge`,
		{
			// next: { tags: ['deliveryCharge'] },
			cache: 'no-cache',
		}
	);
	if (!chargeResp.ok) {
		console.warn('could not get charges');
		throw new Error('Could not find charge');
	}
	const charges = (await chargeResp.json()) as DELIVERY_CHARGE_TYPE[];

	for (const charge of charges) {
		if (charge.country) {
			const _idx = countries.findIndex(
				(country) => country.id === charge.country?.id
			);
			if (_idx === -1) {
				countries.push(charge.country);
			}
		}
	}

	return (
		<Suspense fallback={<CheckoutLoading />}>
			<Checkout
				uiMode="hosted"
				countries={countries}
				addresses={addresses}
				charges={charges}></Checkout>
		</Suspense>
	);
}
