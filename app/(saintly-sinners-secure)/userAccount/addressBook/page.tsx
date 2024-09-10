import { auth } from '@/auth';
import AddressBookUI from '@/components/ui/secure/user/addressBook';
import { redirect } from 'next/navigation';

export default async function UserAddressesPage() {
	const session = await auth();

	if (!session?.user) {
		redirect('/');
	}
	const user = session.user;
	const url = `${process.env.EDC_API_BASEURL}/userAddress/${user.id}`;
	const userAdddressResp = await fetch(url, { cache: 'no-cache' });

	const addresslist = await userAdddressResp.json();
	console.log(
		`userAdddressResp ok ${userAdddressResp.ok} status ${userAdddressResp.status}`
	);
	return (
		<AddressBookUI addresses={addresslist} userId={user.id ? user.id : ''} />
	);
}
