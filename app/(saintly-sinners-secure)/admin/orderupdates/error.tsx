'use client';

export default function Error({ error }: { error: Error }) {
	return <h2>orders status update error {error.message}</h2>;
}
