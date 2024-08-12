import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import {
	forwardRef,
	useContext,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import type { AppTopbarRef } from '../types/types';
import AppBreadcrumb from './AppBreadCrumb';
import { LayoutContext } from './context/layoutcontext';
import { useRouter } from 'next/navigation';
import { Badge } from 'primereact/badge';
import { useBasket } from '@/app/basket-context';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
	const [globalSearch, setGlobalSearch] = useState<string>('');
	const [quantity, setQuantity] = useState<string>('0');
	const {
		onMenuToggle,
		showProfileSidebar,
		showCartSidebar,
		showConfigSidebar,
	} = useContext(LayoutContext);
	const menubuttonRef = useRef(null);
	const router = useRouter();
	const basket = useBasket();

	useEffect(() => {
		const _quantity = basket.quantity.toString();
		setQuantity(_quantity);
	}, [quantity]);

	const onConfigButtonClick = () => {
		showConfigSidebar();
	};

	useImperativeHandle(ref, () => ({
		menubutton: menubuttonRef.current,
	}));

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setGlobalSearch(e.currentTarget.value);
	};

	const searchButtonOnClick = () => {
		router.push(`/product/search?search=${globalSearch}`);
	};

	return (
		<div className="layout-topbar flex flex-wrap">
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
			<div className="font-bold text-3xl text-primary ">Saintly Sinners</div>
			<div className="topbar-end">
				<ul className="topbar-menu">
					<li className="topbar-search">
						<span className="p-input-icon-left">
							{/* <i className="pi pi-search"></i> */}
							<InputText
								type="text"
								placeholder="Search by title or description"
								value={globalSearch}
								className="w-12rem sm:w-full"
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									handleInputChange(e);
								}}
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
					{/* TODO: add in basket context */}
					<li className="topbar-basket p-overlay-badge">
						<span style={{ marginLeft: '1.5rem' }}>
							<Button
								// label="Cart"
								className="p-button-rounded p-button-outlined "
								aria-label="Cart"
								icon="pi pi-shopping-cart"
								// badge={basket.getQuantity()}
								onClick={showCartSidebar}
								// badgeClassName="p-badge-danger p-overlay-badge"
							></Button>
							<Badge value={basket.getQuantity()} className="p-badge-danger" />
						</span>
					</li>
					{/* <li className="ml-3">
            <Button
              type="button"
              icon="pi pi-cog"
              text
              rounded
              severity="secondary"
              className="flex-shrink-0"
              onClick={onConfigButtonClick}
            > click config</Button>
          </li> */}
					<li className="topbar-profile">
						<button
							type="button"
							className="p-link"
							onClick={showProfileSidebar}>
							<img src="/layout/images/avatar/avatar.png" alt="Profile" />
						</button>
					</li>
				</ul>
			</div>
		</div>
	);
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
