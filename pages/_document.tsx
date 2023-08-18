import getConfig from 'next/config';
import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
	const contextPath = getConfig().publicRuntimeConfig.contextPath;
	return (
		<Html>
			<Head>
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
