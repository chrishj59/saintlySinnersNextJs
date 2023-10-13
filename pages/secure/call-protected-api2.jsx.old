import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import useSWR from 'swr';

const fetcher = async (uri) => {
	const response = await fetch(uri);
	return response.json();
};

export default withPageAuthRequired(function Products() {
	const { data, error } = useSWR('/api/v1/protectedExternalApi', fetcher);
	if (error) return <div>oops... {error.message}</div>;
	if (data === undefined) return <div>Loading...</div>;
	return <div>{data.text}</div>;
});
