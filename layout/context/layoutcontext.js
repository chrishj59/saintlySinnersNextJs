import getConfig from 'next/config';
import Head from 'next/head';
import React, { useState } from 'react';

export const LayoutContext = React.createContext();

export const LayoutProvider = (props) => {
	const contextPath = getConfig().publicRuntimeConfig.contextPath;
	const [breadcrumbs, setBreadcrumbs] = useState([]);
	const [layoutConfig, setLayoutConfig] = useState({
		ripple: false,
		inputStyle: 'outlined',
		menuMode: 'static',
		menuTheme: 'colorScheme',
		colorScheme: 'light',
		theme: 'indigo',
		scale: 14,
	});

	const [layoutState, setLayoutState] = useState({
		staticMenuDesktopInactive: false,
		overlayMenuActive: false,
		overlaySubmenuActive: false,
		profileSidebarVisible: false,
		cartSidebarVisible: false,
		configSidebarVisible: false,
		staticMenuMobileActive: false,
		menuHoverActive: false,
		resetMenu: false,
	});

	const onMenuToggle = () => {
		if (isOverlay()) {
			setLayoutState((prevLayoutState) => ({
				...prevLayoutState,
				overlayMenuActive: !prevLayoutState.overlayMenuActive,
			}));
		}

		if (isDesktop()) {
			setLayoutState((prevLayoutState) => ({
				...prevLayoutState,
				staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive,
			}));
		} else {
			setLayoutState((prevLayoutState) => ({
				...prevLayoutState,
				staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive,
			}));
		}
	};

	const showProfileSidebar = () => {
		setLayoutState((prevLayoutState) => ({
			...prevLayoutState,
			profileSidebarVisible: !prevLayoutState.profileSidebarVisible,
		}));
	};

	const showCartSidebar = () => {
		setLayoutState((prevLayoutState) => ({
			...prevLayoutState,
			cartSidebarVisible: !prevLayoutState.cartSidebarVisible,
		}));
	};

	const isOverlay = () => {
		return layoutConfig.menuMode === 'overlay';
	};

	const isSlim = () => {
		return layoutConfig.menuMode === 'slim';
	};

	const isHorizontal = () => {
		return layoutConfig.menuMode === 'horizontal';
	};

	const isDesktop = () => {
		return window.innerWidth > 991;
	};

	const value = {
		layoutConfig,
		setLayoutConfig,
		layoutState,
		setLayoutState,
		onMenuToggle,
		showProfileSidebar,
		showCartSidebar,
		isSlim,
		isHorizontal,
		isDesktop,
		breadcrumbs,
		setBreadcrumbs,
	};

	return (
		<LayoutContext.Provider value={value}>
			<>
				<Head>
					<title>SaintlySinners</title>
					<meta charSet="UTF-8" />
					<meta
						name="description"
						content="The ulitimate source for sexy lingerie"
					/>
					<meta name="robots" content="index, follow" />
					<meta name="viewport" content="initial-scale=1, width=device-width" />
					<meta property="og:type" content="website"></meta>
					<meta
						property="og:title"
						content="SainltlySinners by Rationem"></meta>
					<meta property="og:url" content="https:"></meta>
					<meta
						property="og:description"
						content="The ulitimate source for sexy lingerie"
					/>
					<meta property="og:image" content="https:"></meta>
					<meta property="og:ttl" content="604800"></meta>
					<link
						rel="icon"
						href={`${contextPath}/favicon.ico`}
						type="image/x-icon"></link>
				</Head>
				{props.children}
			</>
		</LayoutContext.Provider>
	);
};
