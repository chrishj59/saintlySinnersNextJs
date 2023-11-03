import axios from 'axios';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import AppSubMenu from './AppSubMenu';
import { useUser } from '@auth0/nextjs-auth0/client';
import getAccessToken from '@auth0/nextjs-auth0';
import { CATEGORY_TYPE } from '../interfaces/category.type';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'interfaces/menuItem.interface';
import { MenuProps } from 'primereact/menu';
import { MenuModel } from '../types/layout';

type modelItemType = {
	label: string;
	icon?: string;
	to?: string;
	items?: modelItemType[];
};
type modelType = {
	modelItems: modelItemType[];
};

type Brand = {
	id: number;
	categoryType: string;
	title: string;
	catDescription: string;
	catLevel: number;
};

const AppMenu = () => {
	const { user } = useUser();

	const [brandMenuData, setBrandMenuData] = useState<Brand[] | null>(null);
	const [categoryMenuData, setCategoryMenuData] = useState<
		CATEGORY_TYPE[] | null
	>(null);

	useEffect(() => {
		(async () => {
			try {
				const { data } = await axios.get<CATEGORY_TYPE[]>(
					`${process.env.NEXT_PUBLIC_EDC_API_BASEURL}/category?menulevel=1`
				);

				setCategoryMenuData(data);
			} catch (err) {
				if (axios.isAxiosError(err)) {
					console.error(err.status);
					console.error(err.response);
				}
				console.error(err);
			}
			try {
				const { data } = await axios.get<Brand[]>(
					`${process.env.NEXT_PUBLIC_EDC_API_BASEURL}/brand?category='B'&catlevel=6`
				);
				const _data = data.sort((a: Brand, b: Brand) => {
					if (a.catLevel > b.catLevel) {
						return 1;
					} else if (a.catLevel < b.catLevel) {
						return -1;
					} else {
						return 0;
					}
				});
				console.log(`sorted brands ${JSON.stringify(_data, null, 2)}`);
				setBrandMenuData(_data);
			} catch (err) {
				if (axios.isAxiosError(err)) {
					console.error(err.status);
					console.error(err.response);
				}
				console.error(err);
			}
		})();
	}, []);

	// // Own Brand = level 1
	// // Exclusive = level 2
	// // More brands = level 3

	const subCat2 = (subCat: CATEGORY_TYPE[]): MenuModel[] => {
		const cat = subCat.map((item: CATEGORY_TYPE) => {
			const subCat = {
				label: item.title,
				to: `/product/categoryProduct/${item.id}`,
			};
			return subCat;
		});
		return cat;
	};

	const subCat = (title: string, subCat: CATEGORY_TYPE[]): MenuModel[] => {
		const cat = subCat.map((item: CATEGORY_TYPE) => {
			if (item.childCategories && item.childCategories.length > 0) {
				const _subCat = {
					label: item.title,
					to: `/product/categoryProduct/${item.id}`,
					items: subCat2(item.childCategories),
				};
				const allItem = {
					label: `All ${item.title}`,
					to: `/product/categoryProduct/${item.id}`,
				};
				_subCat.items?.push(allItem);
				return _subCat;
			} else {
				const subCat = { label: item.title };
				return subCat;
			}
		});

		return cat; //[{ label: subCat[0].title }];
	};
	const catItems = (): MenuModel[] => {
		if (!categoryMenuData) {
			return [
				{
					label: '',
				},
			];
		}
		if (!brandMenuData) {
			return [
				{
					label: '',
				},
			];
		}

		const brandItems: MenuModel[] = brandMenuData!.map((item: Brand) => {
			const menuItem: MenuModel = {
				label: item.title,
				to: `/product/brandProduct/${item.id}`,
			};

			return menuItem;
		});
		const items = categoryMenuData!.map((cat: CATEGORY_TYPE) => {
			if (cat.childCategories) {
				// let iconName;
				// if (cat.title === 'Sex Toys') {
				// 	iconName = 'pi pi-fw pi-question';
				// } else if (cat.title === 'Sexy Lingerie & Clothing') {
				// 	iconName = 'pi pi-fw pi-list';
				// }
				const item: MenuModel = {
					label: cat.title,
					// icon: iconName,
					items: subCat(cat.title, cat.childCategories), //[{ label: cat.childCategories[0].title }],
				};
				const allItem = {
					label: `All ${cat.title}`,
					to: `/product/categoryProduct/${cat.id}`,
				};
				item.items?.push(allItem);

				return item;
			} else {
				const item: MenuModel = { label: cat.title };
				return item;
			}
		});

		const menu = [
			{
				label: 'Categories',
				items: items,
			},
			{
				label: 'Brands',
				items: brandItems,
			},
			{
				label: 'Information',
				items: [
					{
						label: 'Frequentlty asked questions',
						icon: 'pi pi-fw pi-question',
						to: '/faq',
					},
					{
						label: 'Customer Services',
						icon: 'pi pi-fw pi-exclamation-circle',
						to: '/faq',
					},
					{
						label: 'T&C',
						icon: 'pi pi-fw pi-exclamation-circle',
						to: '/termsandconditions',
					},
				],
			},
			{
				visible: user?.name === 'Admn' ? true : false,
				label: 'Admin',
				icon: 'pi pi-fw pi-desktop',
				items: [
					{
						label: 'stock',
						icon: 'pi pi-fw pi-truck',
						items: [
							{
								label: 'Upload EDC',

								to: '/secure/admin/upload-edc',
							},
							{ label: 'Upload Other' },
						],
					},
					{
						label: 'Master data',
						items: [
							{
								label: 'Brands',

								to: '/secure/admin/brand',
							},
							{ label: 'Categories', to: '/secure/admin/category' },
							{ label: 'promote' },
						],
					},
				],
			},
		];
		return menu;
	};

	// const items = () => {
	// 	let items: MenuModel[] = [
	// 		{
	// 			label: 'Information',
	// 			items: [
	// 				{
	// 					label: 'Frequentlty asked questions',
	// 					icon: 'pi pi-fw pi-question',
	// 					to: '/faq',
	// 				},
	// 				{
	// 					label: 'Customer Services',
	// 					icon: 'pi pi-fw pi-exclamation-circle',
	// 					to: '/faq',
	// 				},
	// 				{
	// 					label: 'T&C',
	// 					icon: 'pi pi-fw pi-exclamation-circle',
	// 					to: '/termsandconditions',
	// 				},
	// 			],
	// 		},
	// 	];
	// 	return items;
	// };

	// const baseItems: MenuModel[] = [
	// 	{
	// 		label: 'Information',
	// 		items: [
	// 			{
	// 				label: 'Frequentlty asked questions',
	// 				icon: 'pi pi-fw pi-question',
	// 				to: '/faq',
	// 			},
	// 			{
	// 				label: 'Customer Services',
	// 				icon: 'pi pi-fw pi-exclamation-circle',
	// 				to: '/faq',
	// 			},
	// 			{
	// 				label: 'T&C',
	// 				icon: 'pi pi-fw pi-exclamation-circle',
	// 				to: '/termsandconditions',
	// 			},
	// 		],
	// 	},
	// 	{
	// 		visible: user?.name === 'Admn' ? true : false,
	// 		label: 'Admin',
	// 		icon: 'pi pi-fw pi-desktop',
	// 		items: [
	// 			{
	// 				label: 'stock',
	// 				icon: 'pi pi-fw pi-truck',
	// 				items: [
	// 					{
	// 						label: 'Upload EDC',

	// 						to: '/secure/admin/upload-edc',
	// 					},
	// 					{ label: 'Upload Other' },
	// 				],
	// 			},
	// 			{
	// 				label: 'Master data',
	// 				items: [
	// 					{
	// 						label: 'Brands',

	// 						to: '/secure/admin/brand',
	// 					},
	// 					{ label: 'Categories' },
	// 					{ label: 'promote' },
	// 				],
	// 			},
	// 		],
	// 	},
	// ];
	{
	}

	return <AppSubMenu model={catItems()} />;
};

export default AppMenu;
