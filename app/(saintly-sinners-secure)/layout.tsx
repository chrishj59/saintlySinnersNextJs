import { Metadata } from 'next';
import { Viewport } from 'next';
import Layout from '../../layout/layout';
import { Suspense } from 'react';

interface MainLayoutProps {
	children: React.ReactNode;
}
export const viewport: Viewport = {
	initialScale: 1,
	width: 'device-width',
};

export const metadata: Metadata = {
	title: 'Saintly Sinners',
	description: 'The ultimate collection of all your lingerie and bedroom fun',
	robots: { index: false, follow: false },

	// TODO:Opengraph public image
	openGraph: {
		type: 'website',
		title: 'Saintly Sinners',
		url: 'https://www.saintlysinners.co.uk/',
		description: 'The ultimate collection of all your lingerie and bedroom fun',
		// images: ["https://www.primefaces.org/static/social/apollo-r"],
		ttl: 604800,
	},
	icons: {
		icon: '/favicon.ico',
	},
};

export default function MainLayout({ children }: MainLayoutProps) {
	return (
		<Suspense>
			<Layout>{children}</Layout>
		</Suspense>
	);
}
