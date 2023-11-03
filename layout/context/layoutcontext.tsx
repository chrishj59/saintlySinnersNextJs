import getConfig from 'next/config';
import Head from 'next/head';
import React, { useState } from 'react';
import type {
	ChildContainerProps,
	LayoutContextProps,
	LayoutConfig,
	LayoutState,
	Breadcrumb,
} from '../../types/types';

export const LayoutContext = React.createContext({} as LayoutContextProps);

export const LayoutProvider = (props: ChildContainerProps) => {
	const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
	const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
		ripple: true,
		inputStyle: 'outlined',
		menuMode: 'overlay',
		menuTheme: 'colorScheme',
		colorScheme: 'light',
		theme: 'indigo',
		scale: 14,
	});

	const [layoutState, setLayoutState] = useState<LayoutState>({
		staticMenuDesktopInactive: false,
		overlayMenuActive: false,
		overlaySubmenuActive: false,
		cartSidebarVisible: false,
		profileSidebarVisible: false,
		configSidebarVisible: false,
		staticMenuMobileActive: false,
		menuHoverActive: false,
		resetMenu: false,
		sidebarActive: false,
		anchored: false,
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

	const showConfigSidebar = () => {
		setLayoutState((prevLayoutState) => ({
			...prevLayoutState,
			configSidebarVisible: true,
		}));
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

	const isSlimPlus = () => {
		return layoutConfig.menuMode === 'slim-plus';
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
		showConfigSidebar,
		showProfileSidebar,
		showCartSidebar,
		isSlim,
		isSlimPlus,
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
						content="The ultimate source for sexy lingerie"
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
					<link rel="icon" href={`/favicon.ico`} type="image/x-icon"></link>
				</Head>
				{props.children}
			</>
		</LayoutContext.Provider>
	);
};
