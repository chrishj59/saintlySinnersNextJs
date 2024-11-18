import NextAuth from 'next-auth';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Twitter from 'next-auth/providers/twitter';
import Nodemailer from 'next-auth/providers/nodemailer';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { Provider } from 'next-auth/providers';
import { db } from '@/prisma-db';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const EMAIL_SERVER_HOST = process.env.EMAIL_SERVER_HOST;
const EMAIL_SERVER_PORT = process.env.EMAIL_SERVER_PORT;
const EMAIL_SERVER_USER = process.env.EMAIL_SERVER_USER;
const EMAIL_SERVER_PASSWORD = process.env.EMAIL_SERVER_PASSWORD;
const EMAIL_FROM = process.env.EMAIL_FROM;
const TWITTER_CLIENT_ID = process.env.WITTER_CLIENT_ID;
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
	throw new Error('Missing github oauth credentials');
}

const providers: Provider[] = [
	// Google({
	// 	clientId: GOOGLE_CLIENT_ID,
	// 	clientSecret: GOOGLE_CLIENT_SECRET,
	// }),
	// Twitter({clientId: TWITTER_CLIENT_ID,
	//   clientSecret: TWITTER_CLIENT_SECRET,
	// }),
	Nodemailer({
		server: {
			host: EMAIL_SERVER_HOST,
			port: EMAIL_SERVER_PORT,
			auth: {
				user: EMAIL_SERVER_USER,
				pass: EMAIL_SERVER_PASSWORD,
			},
		},
		from: EMAIL_FROM,
	}),
];

export const providerMap = providers.map((provider) => {
	if (typeof provider === 'function') {
		const providerData = provider();
		return { id: providerData.id, name: providerData.name };
	} else {
		if (provider.name === 'Nodemailer') {
			provider.name = 'one-time email link ';
		}
		return { id: provider.id, name: provider.name };
	}
});
export const {
	handlers: { GET, POST },
	auth,
	signOut,
	signIn,
} = NextAuth({
	adapter: PrismaAdapter(db),
	providers,

	callbacks: {
		// Usually not needed, here we are fixing a bug in nextauth
		async session({ session, user }: any) {
			if (session && user) {
				session.user.id = user.id;
			}

			return session;
		},
	},
	// pages: {
	// 	signIn: '/signin',
	// },
});
