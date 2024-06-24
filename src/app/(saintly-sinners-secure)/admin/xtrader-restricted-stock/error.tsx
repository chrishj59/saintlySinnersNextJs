'use client';

export default function Error({ error }: { error: Error }) {
	return <h2>Upload Update restricted stock error {error.message}</h2>;
}
