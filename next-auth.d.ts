import { DefaultSession, DefaultUser } from 'next-auth';
import { AdaptUser as DefaultAdaptUser } from 'next-auth/adapters';

declare module '@/auth/core/adapters' {
	interface AdaptUser extends BaseAdaptUser {
		displayName: string;
		role: string;
		mobPhone: string;
	}
}
declare module 'next-auth' {
	interface User extends DefaultUser {
		// id?: string;
		// name?: string | null;
		// email?: string | null;
		// image?: string | null;
		// county: string | null;
		displayName?: string;
		// firstName: string | null;
		// lastName: string | null;
		mobPhone: string;
		// postCode: string | null;
		// street: string | null;
		// street2: string | null;
		// title: string | null;
		// town: string | null;
		// birthDate: Date | null;
		role?: string;
		// likes: number | null;
	}

	export interface Session {
		user: User;
	}
}
