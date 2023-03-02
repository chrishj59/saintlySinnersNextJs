import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function myApiRoute(req, res) {
	console.log('api/v1/protected called');
	const session = await getSession(req, res);
	if (session) {
		const { user } = session;
		res.json({ protected: 'My Secret', id: user.sub });
	}
});
