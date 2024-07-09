'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { useEffect } from 'react';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const router = useRouter();
	useEffect(() => {
		// Optionally log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<main className="flex h-full flex-col items-center justify-center">
			<h2 className="text-center">
				There was an issue sending your invoice. Please contact support for a
				copy.
			</h2>
			<Button
				className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
				onClick={() => {
					router.push(`/`);
				}}>
				Continue shopping
			</Button>
		</main>
	);
}
