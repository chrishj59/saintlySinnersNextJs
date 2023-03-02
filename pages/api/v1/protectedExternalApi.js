// pages/api/v1/protectedExternalApi.js
import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function products(req, res) {
	// If your access token is expired and you have a refresh token
	// `getAccessToken` will fetch you a new one using the `refresh_token` grant
	console.log('api/v1/protectedExternalApi');
	const { accessToken } = await getAccessToken(req, res);
	console.log(`accessToken ${accessToken}`);
	const response = await fetch(
		'http://localhost:8000/api/v1/messages/protected',
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	);
	console.log('response on nestJs');
	console.log(response);
	const products = await response.json();
	console.log(products);
	res.status(200).json(products);
});
