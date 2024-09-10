import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
	interface User {
		id?: string;
		name?: string | null;
		email?: string | null;
		image?: string | null;
		county: string | null;
		displayName: string | null;
		firstName: string | null;
		lastName: string | null;
		mobPhone: string | null;
		postCode: string | null;
		street: string | null;
		street2: string | null;
		title: string | null;
		town: string | null;
		birthDate: Date | null;
		role: string | null;
		likes: number | null;
	}
}
