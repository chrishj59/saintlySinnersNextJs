'use client';
export default function Error({ error }: { error: Error }) {
	return <h2>Upload product error {error.message}</h2>;
}
