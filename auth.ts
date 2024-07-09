import NextAuth from 'next-auth';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { db } from '@/prisma-db';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
	throw new Error('Missing github Oauth credentials');
}

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
	throw new Error('Missing google Oauth credentials');
}

export const {
	handlers: { GET, POST },
	auth,
	signOut,
	signIn,
} = NextAuth({
	trustHost: true,
	adapter: PrismaAdapter(db),
	providers: [
		Github({
			clientId: GITHUB_CLIENT_ID,
			clientSecret: GITHUB_CLIENT_SECRET,
		}),
	],
	callbacks: {
		//usually not needed bug in nextAuth
		async session({ session, user }: any) {
			if (session && user) {
				session.user.id = user.id;
			}
			return session;
		},
	},
});
