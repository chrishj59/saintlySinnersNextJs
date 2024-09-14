import { auth } from '@/auth';
import AddressBookUI from '@/components/ui/secure/user/addressBook';
import { USER_TYPE } from '@/interfaces/user.type';
import { redirect } from 'next/navigation';

export async function generateStaticParams() {
	const url = `${process.env.EDC_API_BASEURL}/user`;
	const users = (await fetch(url).then((res) => res.json())) as USER_TYPE[];

	return users.map((user) => ({
		userId: user.id,
	}));
}
export default async function UserAddressesPage({
	params,
}: {
	params: { userId: string };
}) {
	const session = await auth();

	if (!session?.user) {
		redirect('/');
	}
	const userId = params.userId;
	const url = `${process.env.EDC_API_BASEURL}/userAddress/${userId}`;
	const userAdddressResp = await fetch(url, { cache: 'no-cache' });

	const addresslist = await userAdddressResp.json();
	console.log(
		`userAdddressResp ok ${userAdddressResp.ok} status ${userAdddressResp.status}`
	);
	return <AddressBookUI addresses={addresslist} userId={userId} />;
}
