// pages/api/v1/protectedExternalApi.js
import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function products(req, res) {
	// If your access token is expired and you have a refresh token
	// `getAccessToken` will fetch you a new one using the `refresh_token` grant

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

	res.status(200).json(data);
});
