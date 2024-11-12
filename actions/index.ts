'use server';

import * as auth from '@/auth';
import { redirect } from 'next/navigation';

export async function signIn() {
	// return await auth.signIn(undefined, { redirectTo: '/user/profile' });
	return await auth.signIn();
}

export async function signOut() {
	await auth.signOut({ redirectTo: '/', redirect: true });
}
