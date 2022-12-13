import getConfig from 'next/config';
import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
	const contextPath = getConfig().publicRuntimeConfig.contextPath;
	console.log(`contextPath ${contextPath}`);
	return (
		<Html>
			<Head>
				{/* <link
					rel="stylesheet"
					href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
					integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
					crossOrigin="anonymous"
				/> */}
				<link
					id="theme-link"
					href={`${contextPath}/theme/theme-light/purple/theme.css`}
					rel="stylesheet"></link>
				<link
					rel="stylesheet"
					href="https://cdn.auth0.com/js/auth0-samples-theme/1.0/css/auth0-theme.min.css"
				/>
				{/* <title>Saintly Sinners</title> */}
			</Head>
			<body>
				<Main />
				<NextScript />
				<div className="layout-preloader-container">
					<div className="layout-preloader">
						<span></span>
					</div>
				</div>
			</body>
		</Html>
	);
}
