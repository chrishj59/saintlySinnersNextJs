import XtraderRestrictedStock from '@/components/ui/secure/XtraderRestrictedProduct';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Xtrader resticted stock maintenance',
};

export default async function XtraderRestrictedStockPage() {
	return <XtraderRestrictedStock />;
}
