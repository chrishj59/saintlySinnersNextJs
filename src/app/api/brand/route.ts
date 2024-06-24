import { Brand } from '@/interfaces/brand.interface';
import { RESPONSE_MESSAGE_TYPE } from '@/interfaces/responseMessage.interface';
import { MessageStatusEnum } from '@/utils/Message-status.enum';
import axios from 'axios';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		console.log(req.nextUrl.searchParams.get('foo'));
		return NextResponse.json({ message: 'Hello World' });
	} catch (e) {
		return NextResponse.json(
			{ error: JSON.stringify(e, null, 2) },
			{ status: 500 }
		);
	}
}
export async function POST(req: NextRequest) {
	console.log(`Post brand hander`);
	const body = await req.json();
	console.log(`body received ${JSON.stringify(body, null, 2)} `);
	try {
		const { data } = await axios.put<Brand[]>(
			process.env.EDC_API_BASEURL + '/brand',
			body
		);
		return NextResponse.json(data);
	} catch (err) {
		let message: RESPONSE_MESSAGE_TYPE = {
			status: MessageStatusEnum.ERROR,
			message: '',
		};
		if (axios.isAxiosError(err) && err.response) {
			console.error(err.status);
			console.error(err.response);

			message.message = err.response.statusText;
		} else {
			console.error(err);
			message.message = String(err);
		}
		return NextResponse.json({ message, status: 500 });
	}
}
