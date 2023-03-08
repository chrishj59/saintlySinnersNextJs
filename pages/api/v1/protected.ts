import {
	getAccessToken,
	getSession,
	withApiAuthRequired,
} from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function myApiRoute(req, res) {
	console.log('api/v1/protected called');
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
	console.log('response from nestJs');
	const data = await response.json();
	console.log(data);

	// 	const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/blog/post`, {
	// 		method: "GET",
	// 		headers: new Headers({
	// 			"Content-Type": "application/json",
	// 			"Accept": "application/json",
	// 			"authorization": `Bearer ${accessToken.__raw}`
	// 		}),
	// 		body: JSON.stringify(formData)
	// 	});
});
