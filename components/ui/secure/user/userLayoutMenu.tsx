'use client';
import { PanelMenu } from 'primereact/panelmenu';
import { MenuItem } from 'primereact/menuitem';
import { useRouter } from 'next/navigation';
import { classNames } from 'primereact/utils';

export default function UserLayoutMenuUI() {
	const router = useRouter();
	const menuItems: MenuItem[] = [
		{
			label: ' My Account Overiew',
			icon: 'pi pi-home',
			command: () => {
				router.push('/userAccount/accountOverview');
			},
		},
		{
			label: 'Order History',
			icon: 'pi pi-list',
			command: () => {
				router.push('/userAccount/accountOverview');
			},
		},
		{
			label: 'Personal Details',
			icon: 'pi pi-user',
			command: () => {
				router.push('/userAccount/personalDetails');
			},
		},
		// {
		// 	label: 'My Emails',
		// 	icon: 'pi pi-envelope',
		// 	command: () => {
		// 		router.push('/userAccount/accountOverview');
		// 	},
		// },
		{
			label: 'Liked items',
			icon: 'pi pi-heart-fill',
			command: () => {
				router.push('/userAccount/liked');
			},
		},
		{
			label: 'Address Book',
			icon: 'pi pi-home',
			command: () => {
				router.push('/userAccount/addressBook');
			},
		},
	];

	return (
		<div className="card flex flex-wrap ">
			<PanelMenu
				pt={{
					header: { className: 'mb-8' },
					headerLabel: { className: 'ml-2 text-xl' },
				}}
				model={menuItems}
				className="w-full"
			/>
		</div>
	);
}
