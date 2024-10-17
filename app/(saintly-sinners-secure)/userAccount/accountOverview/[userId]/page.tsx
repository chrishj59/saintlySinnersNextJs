import ProfileOverviewUI from '@/components/ui/secure/user/profileOverview';
import { USER_TYPE } from '@/interfaces/user.type';

export async function generateStaticParams() {
	const url = `${process.env.EDC_API_BASEURL}/user`;
	const users = (await fetch(url).then((res) => res.json())) as USER_TYPE[];

	return users.map((user) => ({
		userId: user.id,
	}));
}
export default async function UserAccountOverView({
	params,
}: {
	params: { userId: string };
}) {
	const userId = params.userId;

	const url = `${process.env.EDC_API_BASEURL}/userOrders/${userId}`;
	const userResp = await fetch(url);

	if (!userResp.ok) {
		new Error('Could not find user');
	}
	const user = (await userResp.json()) as USER_TYPE;

	const orders = user.orders;

	return <ProfileOverviewUI userAccount={user} orders={orders} />;
}
