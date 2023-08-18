import axios from 'axios';
import { useEffect, useState } from 'react';
import type { MenuModel } from '../types/types';
import AppSubMenu from './AppSubMenu';
import { useUser } from '@auth0/nextjs-auth0/client';
import getAccessToken from '@auth0/nextjs-auth0';

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
				console.error(err);
			}
		})();
	}, []);

	const model: MenuModel[] = [
		{
			visible: true,
			label: 'Brands',
			items: [
				{
					label: 'Our brands',
					icon: 'pi pi-fw pi-list',
					to: '/brand/allbrands',
				},
			],
		},
		{
			label: 'Products',

			items: [
				{
					label: 'By brand',
					icon: 'pi pi-fw pi-comment',
					items: [
						{
							label: 'Own Brands',
							icon: 'pi pi-fw pi-image',
							items: [
								{
									label: 'Gauvine',
									icon: 'pi pi-fw pi-list',
									to: '/product/brandProduct/1993',
								},
								{
									label: 'You2Toys',
									icon: 'pi pi-fw pi-list',
									to: '/product/brandProduct/23',
								},
								{
									label: 'Obsessive',
									icon: 'pi pi-fw pi-list',
									to: '/product/brandProduct/959',
								},
							],
						},
					],
				},
			],
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
					to: '/faq',
				},
			],
		},
		{
			visible: user?.name === 'Admn' ? true : false,
			label: 'Admin',
			icon: 'pi pi-fw pi-video',
			items: [
				{
					label: 'stock',
					icon: 'pi pi-fw pi-question',
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
						{ label: 'Categories' },
						{ label: 'promote' },
					],
				},
			],
		},
	];

	return <AppSubMenu model={model} />;
};

export default AppMenu;
