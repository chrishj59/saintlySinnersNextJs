import Head from 'next/head';
import React from 'react';

import Footer from './Footer';

type Brand = {
	id: number;
	categoryType: string;
	title: string;
	catDescription: string;
	catLevel: number;
};

const Layout = ({ children }: any) => {
	let menuData: Brand[] | null = [];

	return (
		<>
			<Head>
				<title>Saintly Sinners</title>
			</Head>
			<main id="app" className="d-flex flex-column h-100" data-testid="layout">
				{/* <NavBar /> */}
				{/* <NavBar brands={children.props.brands} /> */}
				{/* <Container className="flex-grow-1 mt-5">{children}</Container> */}
				{children}
				<Footer />
			</main>
		</>
	);
};

export default Layout;
