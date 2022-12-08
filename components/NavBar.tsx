import axios from 'axios';
import { useRouter } from 'next/router';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Menubar } from 'primeReact/menubar';
import React, { useState } from 'react';
import { useEffect } from 'react';

import { MenuItem } from '../interfaces/menuItem.interface';

type Brand = {
	id: number;
	categoryType: string;
	title: string;
	catDescription: string;
	catLevel: number;
};
// type MenuItem = {
// 	label: string;
//};
const NavBar = (props: any) => {
	const [brandMenuData, setBrandMenuData] = useState<Brand[] | null>(null);

	useEffect(() => {
		(async () => {
			try {
				const { data } = await axios.get<Brand[]>(
					process.env.NEXT_PUBLIC_EDC_API_BASEURL + `/brand`,
					{
						params: { category: 'B', catLevel: 6 },
					}
				);
				setBrandMenuData(data);
			} catch (err) {
				console.log(err);
			}
		})();
	}, []);

	// const _brands: Brand[] | null =brandMenuData; //props.brands;
	// console.log('_brands');
	// console.log(JSON.stringify(_brands));

	let set1: string;
	let set2: string;
	let set3: string;
	let set4: string;
	let set5: string;
	const grp1: MenuItem[] = [];
	const grp2: MenuItem[] = [];
	const grp3: MenuItem[] = [];
	const grp4: MenuItem[] = [];
	const grp5: MenuItem[] = [];
	let brandMenu: MenuItem = {};

	if (brandMenuData) {
		for (const b of brandMenuData) {
			switch (b.catLevel) {
				case 1:
					//grp1.push(b);
					const _menuItem: MenuItem = {
						label: b.title,
						command: () => {
							router.push(`/product/brandProduct/${b.id}`);
						},
					};
					grp1.push(_menuItem);
					break;
				case 2:
					const _menuItem2: MenuItem = { label: b.title };
					grp2.push(_menuItem2);
					break;
				case 3:
					const _menuItem3: MenuItem = { label: b.title };
					grp3.push(_menuItem3);
					break;
				case 4:
					const _menuItem4: MenuItem = { label: b.title };
					grp4.push(_menuItem4);
					break;
				case 5:
					const _menuItem5: MenuItem = { label: b.title };
					grp5.push(_menuItem5);
					break;
			}
		}
		/** Build Brands menu */
		brandMenu = { label: 'Brands' };
		const brandItems: MenuItem[] = [];
		if (grp1.length > 0) {
			const grp1Item: MenuItem = { label: 'House Brands', items: grp1 };
			brandItems.push(grp1Item);
			brandMenu.items = brandItems;
		}
		if (grp2.length > 0) {
			const grp2Item: MenuItem = { label: 'Exclusive', items: grp2 };
			brandItems.push(grp2Item);
			brandMenu.items = brandItems;
		}
		if (grp3.length > 0) {
			const grp3Item: MenuItem = { label: 'More Brands', items: grp3 };
			brandItems.push(grp3Item);
			brandMenu.items = brandItems;
		}
		if (grp4.length > 0) {
			const grp4Item: MenuItem = { label: 'Group 2', items: grp4 };
			brandItems.push(grp4Item);
			brandMenu.items = brandItems;
		}
		if (grp5.length > 0) {
			const grp5Item: MenuItem = { label: 'Group 2', items: grp5 };
			brandItems.push(grp5Item);
			brandMenu.items = brandItems;
		}
	}

	const router = useRouter();
	// const megaItems: any[] = [
	// 	{
	// 		label: 'Brands',
	// 		items: [
	// 			[
	// 				{
	// 					label: 'group 1',
	// 					items: grp1,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					label: 'group 2',
	// 					items: grp2,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					items: grp3,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					label: 'group 2',
	// 					items: grp4,
	// 				},
	// 			],

	// 			// [
	// 			// 	{
	// 			// 		//label: 'set 2',
	// 			// 		items: grp5,
	// 			// 	},
	// 			// ],
	// 		],
	// 	},
	// 	{
	// 		label: 'Admin',
	// 		icon: 'pi pi-fw pi-video',
	// 		items: [
	// 			[
	// 				{
	// 					label: 'stock',
	// 					items: [
	// 						{
	// 							label: 'Upload EDC',
	// 							command: () => {
	// 								router.push('/secure/admin/upload-edc');
	// 							},
	// 						},
	// 						{ label: 'Upload Other' },
	// 					],
	// 				},
	// 				{
	// 					label: 'Master data',
	// 					items: [
	// 						{
	// 							label: 'Brands',
	// 							command: () => {
	// 								router.push('/secure/admin/brand');
	// 							},
	// 						},
	// 						{ label: 'Categories' },
	// 						{ label: 'promote' },
	// 					],
	// 				},
	// 			],
	// 			// [
	// 			// 	{
	// 			// 		label: 'Video 3',
	// 			// 		items: [{ label: 'Video 3.1' }, { label: 'Video 3.2' }],
	// 			// 	},
	// 			// 	{
	// 			// 		label: 'Video 4',
	// 			// 		items: [{ label: 'Video 4.1' }, { label: 'Video 4.2' }],
	// 			// 	},
	// 			// ],
	// 		],
	// 	},
	// 	{
	// 		label: 'Users',
	// 		icon: 'pi pi-fw pi-users',
	// 		items: [
	// 			[
	// 				{
	// 					label: 'User',
	// 					items: [
	// 						{
	// 							label: 'Login',
	// 							icon: 'text-gray-100 pi pi-fw pi-sign-in',
	// 							command: () => {
	// 								router.push('/api/auth/login');
	// 							},
	// 						},
	// 						{
	// 							label: 'Logout',
	// 							icon: 'text-gray-100 pi pi-fw pi-sign-out',
	// 							command: () => {
	// 								router.push('/api/auth/logout');
	// 							},
	// 						},
	// 						{
	// 							label: 'Profile',
	// 							command: () => {
	// 								router.push('/secure/user/profile');
	// 							},
	// 						},
	// 						,
	// 					],
	// 				},
	// 				// {
	// 				// 	label: 'User 2',
	// 				// 	items: [{ label: 'User 2.1' }, { label: 'User 2.2' }],
	// 				// },
	// 			],
	// 			// [
	// 			// 	{
	// 			// 		label: 'User 3',
	// 			// 		items: [{ label: 'User 3.1' }, { label: 'User 3.2' }],
	// 			// 	},
	// 			// 	{
	// 			// 		label: 'User 4',
	// 			// 		items: [{ label: 'User 4.1' }, { label: 'User 4.2' }],
	// 			// 	},
	// 			// ],
	// 			// [
	// 			// 	{
	// 			// 		label: 'User 5',
	// 			// 		items: [{ label: 'User 5.1' }, { label: 'User 5.2' }],
	// 			// 	},
	// 			// 	{
	// 			// 		label: 'User 6',
	// 			// 		items: [{ label: 'User 6.1' }, { label: 'User 6.2' }],
	// 			// 	},
	// 			// ],
	// 		],
	// 	},
	// 	// {
	// 	// 	label: 'Events',
	// 	// 	icon: 'pi pi-fw pi-calendar',
	// 	// 	items: [
	// 	// 		[
	// 	// 			{
	// 	// 				label: 'Event 1',
	// 	// 				items: [{ label: 'Event 1.1' }, { label: 'Event 1.2' }],
	// 	// 			},
	// 	// 			{
	// 	// 				label: 'Event 2',
	// 	// 				items: [{ label: 'Event 2.1' }, { label: 'Event 2.2' }],
	// 	// 			},
	// 	// 		],
	// 	// 		[
	// 	// 			{
	// 	// 				label: 'Event 3',
	// 	// 				items: [{ label: 'Event 3.1' }, { label: 'Event 3.2' }],
	// 	// 			},
	// 	// 			{
	// 	// 				label: 'Event 4',
	// 	// 				items: [{ label: 'Event 4.1' }, { label: 'Event 4.2' }],
	// 	// 			},
	// 	// 		],
	// 	// 	],
	// 	// },
	// 	// {
	// 	// 	label: 'Settings',
	// 	// 	icon: 'pi pi-fw pi-cog',
	// 	// 	items: [
	// 	// 		[
	// 	// 			{
	// 	// 				label: 'Setting 1',
	// 	// 				items: [{ label: 'Setting 1.1' }, { label: 'Setting 1.2' }],
	// 	// 			},
	// 	// 			{
	// 	// 				label: 'Setting 2',
	// 	// 				items: [{ label: 'Setting 2.1' }, { label: 'Setting 2.2' }],
	// 	// 			},
	// 	// 			{
	// 	// 				label: 'Setting 3',
	// 	// 				items: [{ label: 'Setting 3.1' }, { label: 'Setting 3.2' }],
	// 	// 			},
	// 	// 		],
	// 	// 		[
	// 	// 			{
	// 	// 				label: 'Technology 4',
	// 	// 				items: [{ label: 'Setting 4.1' }, { label: 'Setting 4.2' }],
	// 	// 			},
	// 	// 		],
	// 	// 	],
	// 	// },
	// ];
	const items = [
		brandMenu,

		{
			label: 'Admin',
			icon: 'text-gray-100 pi pi-cog',
			items: [
				{
					label: 'stock',
					icon: 'text-gray-100 pi pi-fw pi-building',
					items: [
						{
							label: 'upload',
							icon: 'text-gray-100 pi pi-fw pi-upload',
							items: [
								{
									label: 'EDC',
									command: () => {
										router.push('/secure/admin/upload-edc');
									},
								},
							],
						},
					],
				},
			],
		},

		{
			label: 'User',
			icon: 'text-gray-100 pi pi-fw pi-user',
			items: [
				{
					label: 'Login',
					icon: 'text-gray-100 pi pi-fw pi-sign-in',
					command: () => {
						router.push('/api/auth/login');
					},
				},
				{
					label: 'Logout',
					icon: 'text-gray-100 pi pi-fw pi-sign-out',
					command: () => {
						router.push('/api/auth/logout');
					},
				},
				{
					label: 'Profile',
					command: () => {
						router.push('/secure/user/profile');
					},
				},
			],
		},
	];

	const end = (
		<div>
			<Button
				type="button"
				label="Basket"
				icon="text-gray-100 pi pi-shopping-cart">
				<Badge value="8" severity="danger"></Badge>
			</Button>
		</div>
	); //<InputText placeholder="Search" type="text" />;
	return (
		<>
			<div className="card">
				<Menubar model={items} end={end} />
				{/* <MegaMenu model={megaItems} orientation="horizontal" /> */}
			</div>
		</>
	);
};

export default NavBar;
