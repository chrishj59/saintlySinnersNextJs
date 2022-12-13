import '../styles/globals.css';
import '../styles/layout/layout.scss';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';

import { UserProvider } from '@auth0/nextjs-auth0';
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
	// console.log('Component');
	// console.log(Component);
	// console.log('pageProps');
	// console.log(pageProps['menuItems']);
	// const menuItems = pageProps['menuItems'];
	// return (
	// 	<>
	// 		<Head>
	// 			<title>Saintly Sinners</title>
	// 		</Head>
	// 		<BasketProvider>
	// 			<UserProvider>
	// 				<Layout>
	// 					<Component {...pageProps} />
	// 				</Layout>
	// 			</UserProvider>
	// 		</BasketProvider>
	// 	</>
	// );
	if (Component.getLayout) {
		return (
			<LayoutProvider>
				{Component.getLayout(<Component {...pageProps} />)}
			</LayoutProvider>
		);
	} else {
		return (
			<BasketProvider>
				<UserProvider>
					<LayoutProvider>
						<Layout>
							<Component {...pageProps} />
						</Layout>
					</LayoutProvider>
				</UserProvider>
			</BasketProvider>
		);
	}
}

export default MyApp;
