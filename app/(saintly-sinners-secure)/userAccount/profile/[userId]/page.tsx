import { auth } from '@/auth';
import NewUserProfile from '@/components/ui/secure/user/personalDetails';
import ProfileOverviewUI from '@/components/ui/secure/user/profileOverview';
import { USER_TYPE } from '@/interfaces/user.type';
import { UnauthorizedException } from 'next-api-decorators';
import { redirect } from 'next/navigation';

export async function generateStaticParams() {
	const url = `${process.env.EDC_API_BASEURL}/user`;
	const users = (await fetch(url).then((res) => res.json())) as USER_TYPE[];

	return users.map((user) => ({
		userId: user.id,
	}));
}

export default async function UserProfile({
	params,
}: {
	params: { userId: string };
}) {
	const session = await auth();
	if (!session) {
		redirect('/');
	}

	const userId = params.userId;
	return (
		<>
			<ProfileOverviewUI />
		</>
	);
}
