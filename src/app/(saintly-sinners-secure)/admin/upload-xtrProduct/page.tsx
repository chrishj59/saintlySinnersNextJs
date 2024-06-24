import XtraderStockUpload from '@/components/ui/secure/XtraderStockUpload';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Xtrader stock upload',
};

export default async function uploadXtrProduct() {
	return <XtraderStockUpload />;
}
