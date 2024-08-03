import { LayoutProvider } from '@/layout/context/layoutcontext';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';

import 'primereact/resources/primereact.css';
// import '../styles/demo/Demos.scss';
import '@/styles/layout/layout.scss';
import Footer from '@/components/Footer';
import { BasketContext, BasketProvider } from './basket-context';
import { SessionProvider } from 'next-auth/react';
import Providers from '@/utils/providers';

interface RootLayoutProps {
	children: React.ReactNode;
}
export const metadata = {
	metadataBase: new URL('https://www.saintlySinners.co.uk/'),
	alternates: {
		canonical: '/',
		languages: {
			'en-US': '/en-US',
		},
	},
	//title: 'Saintly Sinners',
	title: {
		template: '%s - Saintly Sinners',
		default: 'Saintly Sinners',
	},
	description: 'The ultimate collection of all your lingerie and bedroom fun.',
	generator: 'Next.js',
	keywords: ['lingerie', 'adult-toys', 'sex-toys'],
	referrer: 'origin-when-cross-origin',
	themeColor: '#8b5cf6',
	colorScheme: 'light',
	viewport: 'width=device-width, initial-scale=1',
	publisher: 'Rationem Ltd',

	openGraph: {
		title: 'Saintly Sinners',
		description:
			'The ultimate collection of all your lingerie and bedroom fun.',
		url: 'https://www.saintlySinners.co.uk/',
		siteName: 'Saintly Sinners',
		locale: 'en-GB',
		type: 'website',
	},
	// Twitter metadata
	twitter: {
		card: 'summary_large_image',
		title: 'SaintlySinners',
		description: 'Discover amazing lingerie and adult toys',
		creator: 'Rationem',
	},
	// verification: {
	//   google: 'google-site-verification=1234567890',
	//   yandex: 'yandex-verification=1234567890',
	//   yahoo: 'yahoo-site-verification=1234567890',
	// },
	icons: {
		icon: '/favicon.ico',
	},
	robots: {
		index: true,
		follow: true,
		nocache: true,
		googleBot: {
			index: true,
			follow: true,
			noimageindex: false,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
};
export default function RootLayout({ children }: RootLayoutProps) {
	const value = {
		nullSortOrder: 1,
	};
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link
					id="theme-link"
					href={`/theme/theme-light/purple/theme.css`}
					rel="stylesheet"></link>
				<link rel="icon" href="/favicon.ico" sizes="any" />
			</head>
			<body>
				{/* <BasketProvider>
					<SessionProvider>
						<PrimeReactProvider>
							<LayoutProvider>{children}</LayoutProvider>
							<div className="flex flex justify-content-center flex-wrap text-primary">
								<Footer />
							</div>
						</PrimeReactProvider>
					</SessionProvider>
				</BasketProvider> */}
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
