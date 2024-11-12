import { USER_CONTACT_TYPE } from '@/interfaces/user-details.type';
import { USER_TYPE } from '@/interfaces/user.type';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
	const profile = (await req.json()) as USER_CONTACT_TYPE;

	const url = `${process.env.EDC_API_BASEURL}/userDetails/${profile.id}`;

	const profileResp = await fetch(url, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(profile),
	});

	const _profile = (await profileResp.json()) as USER_TYPE;
	revalidatePath('/userAccount/personalDetails/[userId]', 'page');

	return NextResponse.json(_profile, { status: profileResp.status });
}
