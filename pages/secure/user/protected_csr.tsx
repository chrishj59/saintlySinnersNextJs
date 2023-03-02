import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import React from 'react';

export default withPageAuthRequired(function Profile({ user }) {
	return (
		<>
			<h1>Profile</h1>
			<h4>Profile</h4>
			<pre data-testid="profile">{JSON.stringify(user, null, 2)}</pre>
		</>
	);
});
