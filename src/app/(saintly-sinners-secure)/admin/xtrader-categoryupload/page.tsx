import XTraderCategoryUpload from '@/components/ui/secure/XtraderCategoryUpload';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Upload Xtrader categories',
};

export default async function XtraderCategoryPage() {
	return <XTraderCategoryUpload />;
}
