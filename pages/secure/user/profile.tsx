import { useUser } from '@auth0/nextjs-auth0/client';
import React from 'react';

export default function Profile() {
	const { user, error, isLoading } = useUser();

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>{error.message}</div>;

	return (
		user && (
			<div>
				{/* <img src={user.picture} alt={user.name} /> */}
				<h2>{user && user!.name}</h2>
				<p>{user && user!.email}</p>
			</div>
		)
	);
}
