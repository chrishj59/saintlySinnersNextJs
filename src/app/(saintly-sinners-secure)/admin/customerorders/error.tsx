'use client';

export default function Error({ error }: { error: Error }) {
	return <h2>orders {error.message}</h2>;
}
