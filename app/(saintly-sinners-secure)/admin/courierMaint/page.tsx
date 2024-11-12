import { COURIER_TYPE } from '@/interfaces/courier.type';
import { Metadata } from 'next';

import CourierMaintence from '@/components/ui/secure/CourierMaint';

export const metadata: Metadata = {
	title: 'Courier Upload',
};

export default async function CourierMaintPage() {
	const courierUrl = `${process.env.EDC_API_BASEURL}/courier`;
	const courierResp = await fetch(courierUrl, { cache: 'no-cache' });
	if (!courierResp.ok) {
		throw new Error('Could not Couriers');
	}
	const couriers = (await courierResp.json()) as COURIER_TYPE[];

	if (couriers) {
		return <CourierMaintence couriers={couriers} />;
	}
	return <div> No couriers found</div>;
}
