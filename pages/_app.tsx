import '../styles/globals.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/md-light-deeppurple/theme.css';

import { UserProvider } from '@auth0/nextjs-auth0';
import Head from 'next/head';

import Layout from '../components/Layout';

import type { AppProps } from 'next/app';
function MyApp({ Component, pageProps }: AppProps) {
	console.log('Component');
	console.log(Component);
	console.log('pageProps');
	console.log(pageProps['menuItems']);
	const menuItems = pageProps['menuItems'];
	return (
		<>
			<Head>
				<title>Saintly Sinners</title>
			</Head>
			<UserProvider>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</UserProvider>
		</>
	);
}

export default MyApp;
