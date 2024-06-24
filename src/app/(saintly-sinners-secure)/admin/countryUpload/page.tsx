import CountryUpload from '@/components/ui/secure/UploadCountry';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Country upload',
};

export default async function UploadCountryPage() {
	return <CountryUpload />;
}
