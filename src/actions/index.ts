'use server';

import * as auth from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signIn() {
	return await auth.signIn('github');
}

export async function signOut() {
	console.log('called actions signOut');
	await auth.signOut();
}
