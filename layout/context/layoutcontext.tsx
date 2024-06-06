'use client';
import Head from 'next/head';
import { Viewport } from 'next';
import React, { useState } from 'react';
import type {
	ChildContainerProps,
	LayoutContextProps,
	LayoutConfig,
	LayoutState,
	Breadcrumb,
} from '@/types/types';

export const LayoutContext = React.createContext({} as LayoutContextProps);
export const viewport: Viewport = {
	initialScale: 1,
	width: 'device-width',
};
export const LayoutProvider = (props: ChildContainerProps) => {
	const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
	const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
		ripple: false,
		inputStyle: 'outlined',
		menuMode: 'slim-plus',
		menuTheme: 'colorScheme',
		colorScheme: 'light',
		theme: 'purple',
		scale: 14,
	});

	const [layoutState, setLayoutState] = useState<LayoutState>({
		staticMenuDesktopInactive: false,
		overlayMenuActive: false,
		overlaySubmenuActive: false,
		profileSidebarVisible: false,
		cartSidebarVisible: false,
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
			<>{props.children}</>
		</LayoutContext.Provider>
	);
};
