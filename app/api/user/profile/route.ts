import { USER_CONTACT_TYPE } from '@/interfaces/user-details.type';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
	const profileAddress = (await req.json()) as USER_CONTACT_TYPE;
	console.log(
		`/api/user/profile post body receivedn ${JSON.stringify(
			profileAddress,
			null,
			2
		)}`
	);

	const url = `${process.env.EDC_API_BASEURL}/userDetails/${profileAddress.id}`;
	console.log(`url: ${url}`);
	const profileAddrResp = await fetch(url, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(profileAddress),
	});
	console.log(
		`profileAddrResp status:${profileAddrResp.status} statusText:${profileAddrResp.statusText}`
	);
	return NextResponse.json(profileAddress, { status: profileAddrResp.status });
}
