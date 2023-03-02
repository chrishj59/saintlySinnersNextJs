import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';

export default function ProtectedPage({
	user,
	customProp,
}: {
	user: any;
	customProp: any;
}) {
	return <div>Protected content with customProp {customProp}</div>;
}

export const getServerSideProps = withPageAuthRequired({
	// returnTo: '/unauthorized',
	async getServerSideProps(ctx) {
		// access the user session if needed
		const session = await getSession(ctx.req, ctx.res);
		return {
			props: {
				customProp: 'bar',
			},
		};
	},
});
