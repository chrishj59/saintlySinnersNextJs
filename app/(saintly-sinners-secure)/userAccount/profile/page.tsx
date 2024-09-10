import { auth } from '@/auth';
import NewUserProfile from '@/components/ui/secure/user/personalDetails';
import ProfileOverviewUI from '@/components/ui/secure/user/profileOverview';
import { UnauthorizedException } from 'next-api-decorators';
import { redirect } from 'next/navigation';

export default async function UserProfile() {
	const session = await auth();
	if (!session) {
		redirect('/');
	}

	return (
		<>
			<ProfileOverviewUI />
		</>
	);
}
