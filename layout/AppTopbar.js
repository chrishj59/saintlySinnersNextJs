import { useUser } from '@auth0/nextjs-auth0/client';
import { useBasket } from 'components/ui/context/BasketContext';
import getConfig from 'next/config';
import Image from 'next/image';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import {
	forwardRef,
	useContext,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';

import AppBreadcrumb from './AppBreadCrumb';
import { LayoutContext } from './context/layoutcontext';
import { Badge } from 'primereact/badge';
import { useRouter } from 'next/router';

const AppTopbar = forwardRef((props, ref) => {
	const { onMenuToggle, showProfileSidebar, showCartSidebar } =
		useContext(LayoutContext);
	const menubuttonRef = useRef(null);
	const contextPath = getConfig().publicRuntimeConfig.contextPath;
	const [globalSearch, setGlobalSearch] = useState('');
	const router = useRouter();
	const onConfigButtonClick = () => {
		showConfigSidebar();
	};
	useImperativeHandle(ref, () => ({
		menubutton: menubuttonRef.current,
	}));
	const { user, error, isLoading } = useUser();

	const basket = useBasket();
	const defaultimgSrc = `${contextPath}/layout/images/avatar.png`;
	const renderIcon = () => {
		if (isLoading || error || !user) {
			return <Image src={defaultimgSrc} alt="Profile" width={50} height={50} />;
		} else {
			const imgSrc = user.picture;
			return <Image src={imgSrc} alt="Profile" width={50} height={50} />;
		}
	};
	const handleInputChange = (e) => {
		console.log(e.currentTarget.value);

		setGlobalSearch(e.currentTarget.value);
	};
	const searchButtonOnClick = () => {
		router.push(`/product/search?search=${globalSearch}`);
	};

	return (
		<div className="layout-topbar">
			<div className="topbar-start">
				<button
					ref={menubuttonRef}
					type="button"
					className="topbar-menubutton p-link p-trigger"
					onClick={onMenuToggle}>
					<i className="pi pi-bars"></i>
				</button>

				<AppBreadcrumb className="topbar-breadcrumb"></AppBreadcrumb>
			</div>

			<div className="topbar-end">
				<ul className="topbar-menu">
					<li className="topbar-search">
						<span className="p-input-icon-left">
							{/* <i className="pi pi-search"></i> */}
							<InputText
								type="text"
								placeholder="Search"
								value={globalSearch}
								onChange={(e) => {
									handleInputChange(e);
								}}
								className="w-12rem sm:w-full"
							/>
						</span>
					</li>
					<li>
						<Button
							icon="pi pi-search"
							rounded
							// severity="success"
							aria-label="Search"
							onClick={searchButtonOnClick}
							disabled={!globalSearch || globalSearch.length <= 3}
						/>
					</li>
					<li className="topbar-basket p-overlay-badge">
						<span style={{ marginLeft: '1.5rem' }}>
							<Button
								// label="Cart"
								className="p-button-rounded p-button-outlined "
								aria-label="Cart"
								icon="pi pi-shopping-cart"
								badge={basket.getQuantity()}
								onClick={showCartSidebar}
								badgeClassName="p-badge-danger p-overlay-badge"
							/>
							{/* <Badge value={basket.getQuantity()} className="p-badge-danger" /> */}
						</span>
					</li>
					<li className="topbar-profile">
						<Button
							type="button"
							className="p-link"
							onClick={showProfileSidebar}>
							{renderIcon()}
							<img
								src={`${contextPath}/layout/images/avatar.png`}
								alt="Profile"
							/>
						</Button>
					</li>
				</ul>
			</div>
		</div>
	);
});

export default AppTopbar;
