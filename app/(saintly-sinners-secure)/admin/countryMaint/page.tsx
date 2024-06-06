import CountryMaintence from '@/components/ui/secure/CountryMaint';
import { COUNTRY_TYPE } from '@/interfaces/country.type';
import { Metadata } from 'next';
import { cache } from 'react';

export const metadata: Metadata = {
	title: 'Country maintenance',
};
export default async function CountryPage() {
	const countryResp = await fetch(process.env.EDC_API_BASEURL + '/country');
	if (!countryResp.ok) {
		return <div> could not find country</div>;
	}
	const countries = await countryResp.json();

	return <CountryMaintence countries={countries} />;
}
