import { auth } from '@/auth';
import PersonalDetailsUI from '@/components/ui/secure/user/personalDetails';
import { redirect } from 'next/navigation';

export default async function UserPersonalDetailsPage() {
	const session = await auth();
	if (!session) {
		redirect('/');
	}
	return (
		<>
			<PersonalDetailsUI />
		</>
	);
}
