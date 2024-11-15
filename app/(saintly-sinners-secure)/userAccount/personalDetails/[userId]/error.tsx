'use client'; // Error components must be Client Components

import { Button } from 'primereact/button';
import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const router = useRouter();
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);
	console.warn(`Eror is ${JSON.stringify(error, null, 2)}`);
	return (
		<div>
			<h2>Could not get personal details. {error.message} </h2>
			<Button
				onClick={
					// Attempt to recover by trying to re-render the segment
					//() => reset()
					() => router.push('/')
				}>
				Home
			</Button>
		</div>
	);
}
