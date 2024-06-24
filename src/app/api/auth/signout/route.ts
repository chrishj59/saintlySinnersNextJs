import * as auth from '@/auth';

export async function POST() {
	await auth.signOut();
}
