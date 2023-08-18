import {
	getAccessToken,
	getSession,
	withApiAuthRequired,
} from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function myApiRoute(req, res) {
	const session = await getSession(req, res);
	if (session) {
		const { user } = session;
		res.json({ protected: 'My Secret', id: user.sub });
	}
	const { accessToken } = await getAccessToken(req, res);
	const response = await fetch(
		`http://localhost:8000/api/v1/messages/protected`,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	);

	const data = await response.json();
});
