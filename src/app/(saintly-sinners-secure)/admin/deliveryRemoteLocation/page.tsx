import { DELIVERY_CHARGE_TYPE } from '@/interfaces/delivery-charge.type';
import DeliveryRemoteLocationMaintence from '../../../../components/ui/secure/DeliveryRemoteLocationMaint';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Delivery remote location',
};

export default async function DeliveryRemoteLocationMaintPage() {
	let charges: DELIVERY_CHARGE_TYPE[] = [];

	try {
		const chargesResp = await fetch(
			process.env.EDC_API_BASEURL + `/deliveryCharge`,
			{ cache: 'no-cache' }
		);
		if (!chargesResp.ok) {
			throw new Error(`${chargesResp.status} ${chargesResp.statusText}`);
		}
		charges = (await chargesResp.json()) as DELIVERY_CHARGE_TYPE[];
	} catch (error) {
		if (error instanceof SyntaxError) {
			// Unexpected token < in JSON
			console.log('There was a SyntaxError', error);
		} else {
			console.error('Could not find charges');
			console.error(error);
		}
	}
	return <DeliveryRemoteLocationMaintence charges={charges} />;
}
