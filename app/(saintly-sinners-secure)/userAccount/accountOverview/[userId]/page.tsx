import { USER_TYPE } from '@/interfaces/user.type';

export async function generateStaticParams() {
	const url = `${process.env.EDC_API_BASEURL}/user`;
	const users = (await fetch(url).then((res) => res.json())) as USER_TYPE[];

	return users.map((user) => ({
		userId: user.id,
	}));
}
export default async function UserAccountOverView({
	params,
}: {
	params: { userId: string };
}) {
	return <div> Account Overview called with userID {params.userId}</div>;
}
