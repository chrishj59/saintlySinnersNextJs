import DeliveryChargeMaintence from '@/components/ui/secure/DeliveryChargeMaintenance';
import { COUNTRY_NAME_TYPE } from '@/interfaces/countryName.type';
import { COURIER_TYPE } from '@/interfaces/courier.type';
import { DELIVERY_CHARGE_TYPE } from '@/interfaces/delivery-charge.type';
import { VENDOR_TYPE } from '@/interfaces/vendor.type';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Delivery charge maintenance',
};

export default async function DeliveryChargeMaint() {
	let charges: DELIVERY_CHARGE_TYPE[] = [];
	let vendors: VENDOR_TYPE[] = [];
	let countries: COUNTRY_NAME_TYPE[] = [];
	let couriers: COURIER_TYPE[] = [];
	/** delivery charges */
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
			console.error('There was a SyntaxError', error);
		} else {
			console.error('Could not find charges');
			console.error(error);
		}
	}

	/**country name */

	try {
		const countryEdcResp = await fetch(
			process.env.EDC_API_BASEURL + `/country/delivery`,
			{ cache: 'no-cache' }
		);
		if (!countryEdcResp.ok) {
			throw new Error(`${countryEdcResp.status} ${countryEdcResp.statusText}`);
		}
		countries = (await countryEdcResp.json()) as COUNTRY_NAME_TYPE[];
	} catch (error) {
		if (error instanceof SyntaxError) {
			// Unexpected token < in JSON
			console.error('There was a SyntaxError', error);
		} else {
			console.error('Could not find charges');
			console.error(error);
		}
	}

	/** get Vendors  */
	try {
		const vendorResp = await fetch(process.env.EDC_API_BASEURL + `/vendor`, {
			cache: 'no-cache',
		});

		if (!vendorResp.ok) {
			throw new Error(`${vendorResp.status} ${vendorResp.statusText}`);
		}
		vendors = (await vendorResp.json()) as VENDOR_TYPE[];
	} catch (error) {
		if (error instanceof SyntaxError) {
			// Unexpected token < in JSON
			console.error('There was a SyntaxError', error);
		} else {
			console.error('Could not find vendors');
			console.error(error);
		}
	}

	/** upload couriers */
	try {
		const courierResp = await fetch(process.env.EDC_API_BASEURL + `/courier`, {
			cache: 'no-cache',
		});

		if (!courierResp.ok) {
			throw new Error(`${courierResp.status} ${courierResp.statusText}`);
		}
		couriers = (await courierResp.json()) as COURIER_TYPE[];
	} catch (error) {
		if (error instanceof SyntaxError) {
			// Unexpected token < in JSON
			console.error('There was a SyntaxError', error);
		} else {
			console.error('Could not find vendors');
			console.error(error);
		}
	}

	return (
		<DeliveryChargeMaintence
			charges={charges}
			vendors={vendors}
			countries={countries}
			couriers={couriers}
		/>
	);
}
