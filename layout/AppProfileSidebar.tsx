import { Badge } from 'primereact/badge';
import { Sidebar } from 'primereact/sidebar';
import { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';
import { useSession, signOut } from 'next-auth/react';
import * as actions from '@/actions';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { PanelMenu } from 'primereact/panelmenu';
import { MenuItem } from 'primereact/menuitem';
import { AccountBox, HomeOutlined } from '@mui/icons-material';
import { User } from '@auth0/auth0-react';

const AppProfileSidebar = () => {
	const session = useSession();

	const loginActive: boolean =
		process.env.NEXT_PUBLIC_LOGIN_ACTIVE === 'true' ? true : false;
	const user = session.data?.user;
	const adminUser = user?.role === 'admin' ? true : false;

	const router = useRouter();
	const { layoutState, setLayoutState } = useContext(LayoutContext);

	const onProfileSidebarHide = () => {
		setLayoutState((prevState) => ({
			...prevState,
			profileSidebarVisible: false,
		}));
	};
	const logout = () => {
		signOut({ redirect: false });
		router.refresh();
		onProfileSidebarHide();
	};

	const items: MenuItem[] = [
		{
			label: 'My account',
			icon: <AccountBox />,
			items: [
				{
					label: 'Account Overview',
					icon: 'pi pi-user',
					command: () => handleAccountOverviewClick(),
				},
				{
					label: 'Order history',
					icon: 'pi pi-shopping-bag',
					command: () => handlePurchaseHistoryClick(),
				},
				{
					label: 'Personal Details',
					icon: 'pi pi-user',
					command: () => handlePersonalDetailsClick(),
				},

				{
					label: 'Liked items',
					icon: 'pi pi-heart',
					command: () => handleLikedItemsClick(),
				},
				{
					label: 'Address Book',
					icon: <HomeOutlined />,
					command: () => handleAddressBookClick(),
				},
			],
		},
	];

	const handleAccountOverviewClick = () => {
		router.push(`/userAccount/accountOverview/${user?.id}`);
		onProfileSidebarHide();
	};

	const handleAddressBookClick = () => {
		router.push(`/userAccount/addressBook/${user?.id}`);
		onProfileSidebarHide();
	};

	const handleLikedItemsClick = () => {
		router.push(`/userAccount/liked/${user?.id}`);
		onProfileSidebarHide();
	};

	const handlePersonalDetailsClick = () => {
		router.push(`/userAccount/personalDetails/${user?.id}`);
		onProfileSidebarHide();
	};

	const handlePurchaseHistoryClick = () => {
		router.push(`/userAccount/purchaseHistory/${user?.id}`);
		onProfileSidebarHide();
	};

	const renderProfile = () => {
		if (!user) {
			// Not currently logged in
			return (
				<div>
					{/* <a href="/api/auth/login"> */}
					<span>
						<i className="pi pi-sign-in text-xl text-primary" />
					</span>
					<div className="ml-3">
						{/* <span className="mb-2 font-semibold">Sign In</span>
							<p className="text-color-secondary m-0">Log in or sign up</p> */}
						<form action={actions.signIn}>
							<Button type="submit" disabled={!loginActive}>
								Sigin in
							</Button>
						</form>
					</div>
					{/* </a> */}
				</div>
			);
		} else {
			/** Logged in */
			const displayName = user?.displayName ? user?.displayName : user?.name;
			return (
				<>
					<span className="mb-2 font-semibold">Welcome</span>
					<span className="text-color-secondary font-medium mb-5">
						{displayName}
					</span>
					<ul className="list-none m-0 p-0">
						<li>
							<div className="ml-3">
								<form
									action={async () => {
										// await actions.signOut();
										await logout();
									}}>
									<Button
										severity="secondary"
										icon="pi pi-sign-out"
										label="Sigin out"
										type="submit"
										text
									/>
								</form>
							</div>
						</li>
						<li>
							{/* <a className="cursor-pointer flex  mb-3 p-3 align-items-center  hover:surface-hover transition-colors transition-duration-150"> */}
							<div className="ml-3 mt-5">
								<p className="text-color-secondary m-0">
									<PanelMenu
										model={items}
										pt={{
											headerLabel: {
												className: 'flex justify-content-left text-primary',
											},
											label: {
												className: 'flex justify-content-left text-primary',
											},
										}}
									/>
								</p>
							</div>
							{/* </a> */}
						</li>
					</ul>
				</>
			);
		}
	};

	return (
		<Sidebar
			visible={layoutState.profileSidebarVisible}
			onHide={onProfileSidebarHide}
			position="right"
			className="layout-profile-sidebar w-full sm:w-25rem">
			<div className="flex flex-column mx-auto md:mx-0">{renderProfile()}</div>

			{/* <div className="flex flex-column mt-5 mx-auto md:mx-0">
        <span className="mb-2 font-semibold">Notifications</span>
        <span className="text-color-secondary font-medium mb-5">
          You have 3 notifications
        </span>

        <ul className="list-none m-0 p-0">
          <li>
            <a className="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150">
              <span>
                <i className="pi pi-comment text-xl text-primary"></i>
              </span>
              <div className="ml-3">
                <span className="mb-2 font-semibold">
                  Your post has new comments
                </span>
                <p className="text-color-secondary m-0">5 min ago</p>
              </div>
            </a>
          </li>
          <li>
            <a className="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150">
              <span>
                <i className="pi pi-trash text-xl text-primary"></i>
              </span>
              <div className="ml-3">
                <span className="mb-2 font-semibold">
                  Your post has been deleted
                </span>
                <p className="text-color-secondary m-0">15min ago</p>
              </div>
            </a>
          </li>
          <li>
            <a className="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150">
              <span>
                <i className="pi pi-folder text-xl text-primary"></i>
              </span>
              <div className="ml-3">
                <span className="mb-2 font-semibold">
                  Post has been updated
                </span>
                <p className="text-color-secondary m-0">3h ago</p>
              </div>
            </a>
          </li>
        </ul>
      </div>

      <div className="flex flex-column mt-5 mx-auto md:mx-0">
        <span className="mb-2 font-semibold">Messages</span>
        <span className="text-color-secondary font-medium mb-5">
          You have new messages
        </span>

        <ul className="list-none m-0 p-0">
          <li>
            <a className="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150">
              <span>
                <img
                  src="/demo/images/avatar/circle/avatar-m-8.png"
                  alt="Avatar"
                  className="w-2rem h-2rem"
                />
              </span>
              <div className="ml-3">
                <span className="mb-2 font-semibold">James Robinson</span>
                <p className="text-color-secondary m-0">10 min ago</p>
              </div>
              <Badge value="3" className="ml-auto"></Badge>
            </a>
          </li>
          <li>
            <a className="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150">
              <span>
                <img
                  src="/demo/images/avatar/circle/avatar-f-8.png"
                  alt="Avatar"
                  className="w-2rem h-2rem"
                />
              </span>
              <div className="ml-3">
                <span className="mb-2 font-semibold">Mary Watson</span>
                <p className="text-color-secondary m-0">15min ago</p>
              </div>
              <Badge value="1" className="ml-auto"></Badge>
            </a>
          </li>
          <li>
            <a className="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150">
              <span>
                <img
                  src="/demo/images/avatar/circle/avatar-f-4.png"
                  alt="Avatar"
                  className="w-2rem h-2rem"
                />
              </span>
              <div className="ml-3">
                <span className="mb-2 font-semibold">Aisha Webb</span>
                <p className="text-color-secondary m-0">3h ago</p>
              </div>
              <Badge value="2" className="ml-auto"></Badge>
            </a>
          </li>
        </ul>
      </div> */}
		</Sidebar>
	);
};

export default AppProfileSidebar;
