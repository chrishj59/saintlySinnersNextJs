import Head from 'next/head';
import React, { useEffect } from 'react';

import Footer from './Footer';
import NavBar from './NavBar';

type Brand = {
	id: number;
	categoryType: string;
	title: string;
	catDescription: string;
	catLevel: number;
};

const Layout = ({ menuItems, props, children }: any) => {
	console.log('layout props');
	console.log(props);
	console.log('Layout menuItems');
	console.log(menuItems);
	const _menuItems = menuItems;
	let menuData: Brand[] | null = [];

	// useEffect(() => {
	// 	(async () => {
	// 		console.log('useEffect in layout');
	// 		try {
	// 			const { data } = await axios.get(
	// 				process.env.NEXT_PUBLIC_EDC_API_BASEURL + `/brand`,
	// 				{
	// 					params: { category: 'B', catLevel: 6 },
	// 				}
	// 			);
	// 			console.log('Layout use useEffect');
	// 			console.log(data);
	// 			menuData = data;
	// 			console.log(menuData);
	// 		} catch (err) {
	// 			console.log(err);
	// 		}
	// 	})();
	// }, []);
	console.log('menuData');
	console.log(menuData);
	// const { data } = await axios.get(
	// 	process.env.NEXT_PUBLIC_EDC_API_BASEURL + `/brand`,
	// 	{
	// 		params: { category: 'B', catLevel: 6 },
	// 	}
	// );
	// console.log('layout data');
	// console.log(data);
	return (
		<>
			<Head>
				{/* <link
				rel="stylesheet"
				href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
				integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
				crossOrigin="anonymous"
			/>
			<link
				rel="stylesheet"
				href="https://cdn.auth0.com/js/auth0-samples-theme/1.0/css/auth0-theme.min.css"
			/> */}
				<title>Saintly Sinners</title>
			</Head>
			<main id="app" className="d-flex flex-column h-100" data-testid="layout">
				<NavBar menuItems={_menuItems} />
				{/* <NavBar brands={children.props.brands} /> */}
				{/* <Container className="flex-grow-1 mt-5">{children}</Container> */}
				{children}
				<Footer />
			</main>
		</>
	);
};

export default Layout;
