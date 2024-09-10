'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function ProfileOverviewUI() {
	const session = useSession();
	const user = session.data?.user;

	if (!user) {
		console.warn(`Not authoried not logged`);
		redirect('/');
		// throw new UnauthorizedException();
	}
	return (
		<div className="card">
			<div className="flex justify-content-center flex-wrap">
				<div className="flex align-items-center justify-content-center ">
					<h5 className="text-gray-600">My Profile Overview</h5>
				</div>
			</div>
		</div>
	);
}
