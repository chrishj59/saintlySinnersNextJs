import { auth } from '@/auth';
import PersonalDetailsUI from '@/components/ui/secure/user/personalDetails';
import { USER_TYPE } from '@/interfaces/user.type';
import { redirect } from 'next/navigation';

export async function generateStaticParams() {
	const url = `${process.env.EDC_API_BASEURL}/user`;
	const users = (await fetch(url).then((res) => res.json())) as USER_TYPE[];

	return users.map((user) => ({
		userId: user.id,
	}));
}
export default async function UserPersonalDetailsPage({
	params,
}: {
	params: { userId: string };
}) {
	const session = await auth();
	if (!session) {
		redirect('/');
	}

	const userId = params.userId;
	const url = `${process.env.EDC_API_BASEURL}/userDetails/${userId}`;

	const userResp = await fetch(url, { cache: 'no-cache' });

	if (!userResp.ok) {
		new Error('Invalid user id. Please correct');
	}
	const user = (await userResp.json()) as USER_TYPE;

	return (
		<>
			<PersonalDetailsUI userAccount={user} />
		</>
	);
}
