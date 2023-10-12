import '../styles/globals.css';
import '../styles/layout/layout.scss';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { BasketProvider } from 'components/ui/context/BasketContext';
import React from 'react';

import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';

import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
// import { UserProvider } from '@auth0/nextjs-auth0';
// import { BasketProvider } from 'components/ui/context/BasketContext';
// import Head from 'next/head';

//import Layout from '../components/Layout';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};
function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	if (Component.getLayout) {
		return (
			<LayoutProvider>
				{Component.getLayout(<Component {...pageProps} />)}
			</LayoutProvider>
		);
	} else {
		return (
			<UserProvider>
				<LayoutProvider>
					<BasketProvider>
						<Layout>
							<Component {...pageProps} />
						</Layout>
					</BasketProvider>
				</LayoutProvider>
			</UserProvider>
		);
	}
}

export default MyApp;
