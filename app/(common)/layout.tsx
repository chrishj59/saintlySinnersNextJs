import { Metadata } from 'next';
import React from 'react';
import AppConfig from '../../layout/AppConfig';

interface CommonLayoutProps {
	children: React.ReactNode;
}

export const metadata: Metadata = {
	title: 'Saintly Sinners',
	description: 'The ultimate collection of all your lingerie and bedroom fun.',
	robots: {
		index: false,
		follow: true,
		nocache: true,
		googleBot: {
			index: true,
			follow: false,
			noimageindex: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	openGraph: {
		title: 'Saintly Sinners',
		description:
			'The ultimate collection of all your lingerie and bedroom fun.',
		url: 'https://www.saintlySinners.co.uk/',
		siteName: 'Saintly Sinners',
		locale: 'en-GB',
		type: 'website',
		images: [
			{
				url: 'https://www.saintlySinners.co.uk/layout/images/logo/logo.png',
				width: 3600,
				height: 2400,
			},
		],
	},
};
// export const metadata: Metadata = {
// 	title: 'Saintly Sinners',
// 	description: 'The ultimate collection of all your lingerie and bedroom fun.',
// };

export default function CommonLayout({ children }: CommonLayoutProps) {
	return (
		<React.Fragment>
			{children}
			<AppConfig minimal />
		</React.Fragment>
	);
}
