import VendorMaintence from '@/components/ui/secure/VendorMaintence';
// import { VENDOR } from '@/interfaces/delivery-charge.type';
import { VENDOR_TYPE } from '@/interfaces/vendor.type';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Vendor maintenance',
};
export default async function VendorPage() {
	try {
		const vendorResp = await fetch(process.env.EDC_API_BASEURL + '/vendor', {
			cache: 'no-cache',
		});
		if (!vendorResp.ok) {
			throw new Error(`${vendorResp.status} ${vendorResp.statusText}`);
		}
		const vendors = (await vendorResp.json()) as VENDOR_TYPE[];

		return <VendorMaintence vendors={vendors} />;
	} catch (error: any) {
		if (error instanceof SyntaxError) {
			// Unexpected token < in JSON
			console.warn('There was a SyntaxError', error);
		} else {
			console.error('Could not find charges');
			console.error(error);
		}
		return <div> Error loading vendors {error}</div>;
	}
	//VENDOR_TYPE
}
