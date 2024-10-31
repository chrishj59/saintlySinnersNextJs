import AppSubMenu from './AppSubMenu';
import type { MenuModel } from '../types/types';

import { useState } from 'react';
import useSWR from 'swr';
import { isIterable } from '@/utils/helpers';
import { useSession } from 'next-auth/react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const AppMenu = () => {
	const session = useSession();
	const user: any = session.data?.user;

	let adminUser: boolean = false;
	if (user) {
		adminUser = user.role === 'admin' ? true : false;
	}

	// const adminUser =
	// 	session.data?.user?.id === 'clzz7maxl000014g0mzb8j5ou' ? true : false;
	// session.data?.user?.role
	const [categories, setCategories] = useState(null);

	const { data, error, isLoading } = useSWR(
		'/api/admin/xtrcategory/menu',
		fetcher
	);

	if (error) return 'An error has occurred.';
	if (isLoading) return 'Loading...';
	const catsData = data;

	const menuCategories = (): MenuModel => {
		if (!isIterable(catsData)) {
			const catItem: MenuModel = {
				label: 'Categories',
				icon: 'pi pi-fw pi-box',
			};
			return catItem;
		}
		const catItem: MenuModel = {
			label: 'Categories',
			icon: 'pi pi-fw pi-box',
			items: catsData.map((c: any) => {
				const catItem: MenuModel = {
					label: c.catName,
					to: `/xtrader/category/${c.id}`,
				};
				return catItem;
			}),
		};

		return catItem;
	};

	const menuItems = (): MenuModel[] => {
		return [
			{
				label: 'Shopping',
				icon: 'pi pi-home',
				items: [
					{
						label: 'Start shopping',
						icon: 'pi pi-fw pi-home',
						to: '/',
					},
				],
			},
			menuCategories(),
			{
				label: 'Information',
				icon: 'pi pi-fw pi-question',
				items: [
					{
						label: 'Frequentlty asked questions',
						icon: 'pi pi-fw pi-question',
						to: '/support/frequent-questions',
					},
					{
						label: 'Customer Services',
						icon: 'pi pi-fw pi-exclamation-circle',
						to: '/support/customer-services',
					},
					{
						label: 'Terms and conditions',
						icon: 'pi pi-fw pi-exclamation-circle',
						to: '/support/terms-and-conditions',
					},
				],
			},
			{
				visible: adminUser,
				label: 'Admin',
				icon: 'pi pi-fw pi-desktop',
				items: [
					{
						label: 'stock',
						icon: 'pi pi-fw pi-truck',
						items: [
							{
								label: 'Upload EDC',

								to: '/admin/upload-edc',
							},
							{ label: 'Upload Xtrader', to: '/admin/upload-xtrProduct' },
						],
					},
					{
						label: 'Master data',
						items: [
							{
								label: 'Brands',
								to: '/admin/brand',
							},
							{ label: 'Categories', to: '/admin/category' },
							{ label: 'Upload countries ', to: '/admin/countryUpload' },
							{ label: 'Courier  upload', to: '/admin/courierUpload' },
							{ label: 'Courier  Maintenance', to: '/admin/courierMaint' },
							{
								label: 'Delivery Charge Maintenance',
								to: '/admin/deliveryCharge',
							},
							{
								label: 'Delivery - remote location',
								to: '/admin/deliveryRemoteLocation',
							},
							{ label: 'vendor', to: '/admin/vendor' },
							{ label: 'Country Maint', to: '/admin/countryMaint' },
						],
					},
					{
						label: 'Xtrader',
						items: [
							{ label: 'Category upload', to: '/admin/xtrader-categoryupload' },
							{
								label: 'Stock status upload',
								to: '/admin/xtrader-stock-level',
							},
							{
								label: 'Restricted Stock update',
								to: '/admin/xtrader-restricted-stock',
							},
							{ label: 'Manage Orders', to: '/admin/customerorders' },
							{ label: 'Update Order Status ', to: '/admin/orderupdates' },
						],
					},
				],
			},
		];
	};
	// const model: MenuModel[] = [
	// 	{
	// 		label: 'Dashboards',
	// 		icon: 'pi pi-home',
	// 		items: [
	// 			{
	// 				label: 'E-Commerce',
	// 				icon: 'pi pi-fw pi-home',
	// 				to: '/',
	// 			},
	// 			{
	// 				label: 'Banking',
	// 				icon: 'pi pi-fw pi-image',
	// 				to: '/dashboard-banking',
	// 			},
	// 		],
	// 	},
	// 	{
	// 		label: 'Apps',
	// 		icon: 'pi pi-th-large',
	// 		items: [
	// 			{
	// 				label: 'Blog',
	// 				icon: 'pi pi-fw pi-comment',
	// 				items: [
	// 					{
	// 						label: 'List',
	// 						icon: 'pi pi-fw pi-image',
	// 						to: '/apps/blog/list',
	// 					},
	// 					{
	// 						label: 'Detail',
	// 						icon: 'pi pi-fw pi-list',
	// 						to: '/apps/blog/detail',
	// 					},
	// 					{
	// 						label: 'Edit',
	// 						icon: 'pi pi-fw pi-pencil',
	// 						to: '/apps/blog/edit',
	// 					},
	// 				],
	// 			},
	// 			{
	// 				label: 'Calendar',
	// 				icon: 'pi pi-fw pi-calendar',
	// 				to: '/apps/calendar',
	// 			},
	// 			{
	// 				label: 'Chat',
	// 				icon: 'pi pi-fw pi-comments',
	// 				to: '/apps/chat',
	// 			},
	// 			{
	// 				label: 'Files',
	// 				icon: 'pi pi-fw pi-folder',
	// 				to: '/apps/files',
	// 			},
	// 			{
	// 				label: 'Mail',
	// 				icon: 'pi pi-fw pi-envelope',
	// 				items: [
	// 					{
	// 						label: 'Inbox',
	// 						icon: 'pi pi-fw pi-inbox',
	// 						to: '/apps/mail/inbox',
	// 					},
	// 					{
	// 						label: 'Compose',
	// 						icon: 'pi pi-fw pi-pencil',
	// 						to: '/apps/mail/compose',
	// 					},
	// 					{
	// 						label: 'Detail',
	// 						icon: 'pi pi-fw pi-comment',
	// 						to: '/apps/mail/detail/1000',
	// 					},
	// 				],
	// 			},
	// 			{
	// 				label: 'Task List',
	// 				icon: 'pi pi-fw pi-check-square',
	// 				to: '/apps/tasklist',
	// 			},
	// 		],
	// 	},
	// 	{
	// 		label: 'UI Kit',
	// 		icon: 'pi pi-fw pi-star-fill',
	// 		items: [
	// 			{
	// 				label: 'Form Layout',
	// 				icon: 'pi pi-fw pi-id-card',
	// 				to: '/uikit/formlayout',
	// 			},
	// 			{
	// 				label: 'Input',
	// 				icon: 'pi pi-fw pi-check-square',
	// 				to: '/uikit/input',
	// 			},
	// 			{
	// 				label: 'Float Label',
	// 				icon: 'pi pi-fw pi-bookmark',
	// 				to: '/uikit/floatlabel',
	// 			},
	// 			{
	// 				label: 'Invalid State',
	// 				icon: 'pi pi-fw pi-exclamation-circle',
	// 				to: '/uikit/invalidstate',
	// 			},
	// 			{
	// 				label: 'Button',
	// 				icon: 'pi pi-fw pi-box',
	// 				to: '/uikit/button',
	// 			},
	// 			{
	// 				label: 'Table',
	// 				icon: 'pi pi-fw pi-table',
	// 				to: '/uikit/table',
	// 			},
	// 			{
	// 				label: 'List',
	// 				icon: 'pi pi-fw pi-list',
	// 				to: '/uikit/list',
	// 			},
	// 			{
	// 				label: 'Tree',
	// 				icon: 'pi pi-fw pi-share-alt',
	// 				to: '/uikit/tree',
	// 			},
	// 			{
	// 				label: 'Panel',
	// 				icon: 'pi pi-fw pi-tablet',
	// 				to: '/uikit/panel',
	// 			},
	// 			{
	// 				label: 'Overlay',
	// 				icon: 'pi pi-fw pi-clone',
	// 				to: '/uikit/overlay',
	// 			},
	// 			{
	// 				label: 'Media',
	// 				icon: 'pi pi-fw pi-image',
	// 				to: '/uikit/media',
	// 			},
	// 			{
	// 				label: 'Menu',
	// 				icon: 'pi pi-fw pi-bars',
	// 				to: '/uikit/menu',
	// 			},
	// 			{
	// 				label: 'Message',
	// 				icon: 'pi pi-fw pi-comment',
	// 				to: '/uikit/message',
	// 			},
	// 			{
	// 				label: 'File',
	// 				icon: 'pi pi-fw pi-file',
	// 				to: '/uikit/file',
	// 			},
	// 			{
	// 				label: 'Chart',
	// 				icon: 'pi pi-fw pi-chart-bar',
	// 				to: '/uikit/charts',
	// 			},
	// 			{
	// 				label: 'Misc',
	// 				icon: 'pi pi-fw pi-circle-off',
	// 				to: '/uikit/misc',
	// 			},
	// 		],
	// 	},
	// 	{
	// 		label: 'Prime Blocks',
	// 		icon: 'pi pi-fw pi-prime',
	// 		items: [
	// 			{
	// 				label: 'Free Blocks',
	// 				icon: 'pi pi-fw pi-eye',
	// 				to: '/blocks',
	// 			},
	// 			{
	// 				label: 'All Blocks',
	// 				icon: 'pi pi-fw pi-globe',
	// 				url: 'https://blocks.primefaces.org',
	// 				target: '_blank',
	// 			},
	// 		],
	// 	},
	// 	{
	// 		label: 'Utilities',
	// 		icon: 'pi pi-fw pi-compass',
	// 		items: [
	// 			{
	// 				label: 'PrimeIcons',
	// 				icon: 'pi pi-fw pi-prime',
	// 				to: '/utilities/icons',
	// 			},
	// 			{
	// 				label: 'Colors',
	// 				icon: 'pi pi-fw pi-palette',
	// 				to: '/utilities/colors',
	// 			},
	// 			{
	// 				label: 'PrimeFlex',
	// 				icon: 'pi pi-fw pi-desktop',
	// 				url: 'https://www.primefaces.org/primeflex/',
	// 				target: '_blank',
	// 			},
	// 			{
	// 				label: 'Figma',
	// 				icon: 'pi pi-fw pi-pencil',
	// 				url: 'https://www.figma.com/file/zQOW0XBXdCTqODzEOqwBtt/Preview-%7C-Apollo-2022?node-id=335%3A21768&t=urYI89V3PLNAZEJG-1/',
	// 				target: '_blank',
	// 			},
	// 		],
	// 	},
	// 	{
	// 		label: 'Pages',
	// 		icon: 'pi pi-fw pi-briefcase',
	// 		items: [
	// 			{
	// 				label: 'Landing',
	// 				icon: 'pi pi-fw pi-globe',
	// 				to: '/landing',
	// 			},
	// 			{
	// 				label: 'Auth',
	// 				icon: 'pi pi-fw pi-user',
	// 				items: [
	// 					{
	// 						label: 'Login',
	// 						icon: 'pi pi-fw pi-sign-in',
	// 						to: '/auth/login',
	// 					},
	// 					{
	// 						label: 'Error',
	// 						icon: 'pi pi-fw pi-times-circle',
	// 						to: '/auth/error',
	// 					},
	// 					{
	// 						label: 'Access Denied',
	// 						icon: 'pi pi-fw pi-lock',
	// 						to: '/auth/access',
	// 					},
	// 					{
	// 						label: 'Register',
	// 						icon: 'pi pi-fw pi-user-plus',
	// 						to: '/auth/register',
	// 					},
	// 					{
	// 						label: 'Forgot Password',
	// 						icon: 'pi pi-fw pi-question',
	// 						to: '/auth/forgotpassword',
	// 					},
	// 					{
	// 						label: 'New Password',
	// 						icon: 'pi pi-fw pi-cog',
	// 						to: '/auth/newpassword',
	// 					},
	// 					{
	// 						label: 'Verification',
	// 						icon: 'pi pi-fw pi-envelope',
	// 						to: '/auth/verification',
	// 					},
	// 					{
	// 						label: 'Lock Screen',
	// 						icon: 'pi pi-fw pi-eye-slash',
	// 						to: '/auth/lockscreen',
	// 					},
	// 				],
	// 			},
	// 			{
	// 				label: 'Crud',
	// 				icon: 'pi pi-fw pi-pencil',
	// 				to: '/pages/crud',
	// 			},
	// 			{
	// 				label: 'Timeline',
	// 				icon: 'pi pi-fw pi-calendar',
	// 				to: '/pages/timeline',
	// 			},
	// 			{
	// 				label: 'Invoice',
	// 				icon: 'pi pi-fw pi-dollar',
	// 				to: '/pages/invoice',
	// 			},
	// 			{
	// 				label: 'About Us',
	// 				icon: 'pi pi-fw pi-user',
	// 				to: '/pages/aboutus',
	// 			},
	// 			{
	// 				label: 'Help',
	// 				icon: 'pi pi-fw pi-question-circle',
	// 				to: '/pages/help',
	// 			},
	// 			{
	// 				label: 'Not Found',
	// 				icon: 'pi pi-fw pi-exclamation-circle',
	// 				to: '/pages/notfound',
	// 			},
	// 			{
	// 				label: 'Empty',
	// 				icon: 'pi pi-fw pi-circle-off',
	// 				to: '/pages/empty',
	// 			},
	// 			{
	// 				label: 'FAQ',
	// 				icon: 'pi pi-fw pi-question',
	// 				to: '/pages/faq',
	// 			},
	// 			{
	// 				label: 'Contact Us',
	// 				icon: 'pi pi-fw pi-phone',
	// 				to: '/pages/contact',
	// 			},
	// 		],
	// 	},
	// 	{
	// 		label: 'E-Commerce',
	// 		icon: 'pi pi-fw pi-wallet',
	// 		items: [
	// 			{
	// 				label: 'Product Overview',
	// 				icon: 'pi pi-fw pi-image',
	// 				to: '/ecommerce/product-overview',
	// 			},
	// 			{
	// 				label: 'Product List',
	// 				icon: 'pi pi-fw pi-list',
	// 				to: '/ecommerce/product-list',
	// 			},
	// 			{
	// 				label: 'New Product',
	// 				icon: 'pi pi-fw pi-plus',
	// 				to: '/ecommerce/new-product',
	// 			},
	// 			{
	// 				label: 'Shopping Cart',
	// 				icon: 'pi pi-fw pi-shopping-cart',
	// 				to: '/ecommerce/shopping-cart',
	// 			},
	// 			{
	// 				label: 'Checkout Form',
	// 				icon: 'pi pi-fw pi-check-square',
	// 				to: '/ecommerce/checkout-form',
	// 			},
	// 			{
	// 				label: 'Order History',
	// 				icon: 'pi pi-fw pi-history',
	// 				to: '/ecommerce/order-history',
	// 			},
	// 			{
	// 				label: 'Order Summary',
	// 				icon: 'pi pi-fw pi-file',
	// 				to: '/ecommerce/order-summary',
	// 			},
	// 		],
	// 	},
	// 	{
	// 		label: 'User Management',
	// 		icon: 'pi pi-fw pi-user',
	// 		items: [
	// 			{
	// 				label: 'List',
	// 				icon: 'pi pi-fw pi-list',
	// 				to: '/profile/list',
	// 			},
	// 			{
	// 				label: 'Create',
	// 				icon: 'pi pi-fw pi-plus',
	// 				to: '/profile/create',
	// 			},
	// 		],
	// 	},
	// 	{
	// 		label: 'Hierarchy',
	// 		icon: 'pi pi-fw pi-align-left',
	// 		items: [
	// 			{
	// 				label: 'Submenu 1',
	// 				icon: 'pi pi-fw pi-align-left',
	// 				items: [
	// 					{
	// 						label: 'Submenu 1.1',
	// 						icon: 'pi pi-fw pi-align-left',
	// 						items: [
	// 							{
	// 								label: 'Submenu 1.1.1',
	// 								icon: 'pi pi-fw pi-align-left',
	// 							},
	// 							{
	// 								label: 'Submenu 1.1.2',
	// 								icon: 'pi pi-fw pi-align-left',
	// 							},
	// 							{
	// 								label: 'Submenu 1.1.3',
	// 								icon: 'pi pi-fw pi-align-left',
	// 							},
	// 						],
	// 					},
	// 					{
	// 						label: 'Submenu 1.2',
	// 						icon: 'pi pi-fw pi-align-left',
	// 						items: [
	// 							{
	// 								label: 'Submenu 1.2.1',
	// 								icon: 'pi pi-fw pi-align-left',
	// 							},
	// 						],
	// 					},
	// 				],
	// 			},
	// 			{
	// 				label: 'Submenu 2',
	// 				icon: 'pi pi-fw pi-align-left',
	// 				items: [
	// 					{
	// 						label: 'Submenu 2.1',
	// 						icon: 'pi pi-fw pi-align-left',
	// 						items: [
	// 							{
	// 								label: 'Submenu 2.1.1',
	// 								icon: 'pi pi-fw pi-align-left',
	// 							},
	// 							{
	// 								label: 'Submenu 2.1.2',
	// 								icon: 'pi pi-fw pi-align-left',
	// 							},
	// 						],
	// 					},
	// 					{
	// 						label: 'Submenu 2.2',
	// 						icon: 'pi pi-fw pi-align-left',
	// 						items: [
	// 							{
	// 								label: 'Submenu 2.2.1',
	// 								icon: 'pi pi-fw pi-align-left',
	// 							},
	// 						],
	// 					},
	// 				],
	// 			},
	// 		],
	// 	},
	// 	{
	// 		label: 'Start',
	// 		icon: 'pi pi-fw pi-download',
	// 		items: [
	// 			{
	// 				label: 'Buy Now',
	// 				icon: 'pi pi-fw pi-shopping-cart',
	// 				url: 'https://www.primefaces.org/store',
	// 			},
	// 			{
	// 				label: 'Documentation',
	// 				icon: 'pi pi-fw pi-info-circle',
	// 				to: '/documentation',
	// 			},
	// 		],
	// 	},
	// ];

	return <AppSubMenu model={menuItems()} />;
};

export default AppMenu;
