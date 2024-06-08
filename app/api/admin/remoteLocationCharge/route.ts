import { REMOTE_LOCATION_TYPE } from '@/interfaces/delivery-charge.type';
import { UUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

type RemoteLocationType = {
	deliveryId: UUID;
	postCodePart: string;
	remoteCharge: number;
	days?: number;
	surcharge?: boolean;
};

type RemoteLocationUpdateType = {
	id: number;
	postCodePart: string;
	remoteCharge: number;
	days?: number;
	surcharge?: boolean;
};

type RemoteLocationMessageType = {
	postCode: string;
	remoteCharge: number;
	days?: number;
	// deliveryCharge?: UUID;
	deliveryId: UUID;
	surcharge?: boolean;
};

type RemoteLocationUpdateMessageType = {
	id: number;
	postCode: string;
	remoteCharge: number;
	days?: number;
	surcharge?: boolean;
};

export async function PUT(req: NextRequest) {
	console.log('remote delivery charge put called');
	const payload = (await req.json()) as RemoteLocationUpdateMessageType;
	const remoteLocationUpdate: RemoteLocationUpdateType = {
		id: payload.id,
		postCodePart: payload.postCode,
		remoteCharge: payload.remoteCharge,
		days: payload.days,
		surcharge: payload.surcharge,
	};
	console.log(`payload ${JSON.stringify(payload, null, 2)}`);
	const url = `${process.env.EDC_API_BASEURL}/deliveryRemoteLocation`;
	const remoteLocationResp = await fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(remoteLocationUpdate),
	});
	if (remoteLocationResp.ok) {
		const remoteLocation =
			(await remoteLocationResp.json()) as REMOTE_LOCATION_TYPE;

		return NextResponse.json(remoteLocation);
	} else {
		const message = await remoteLocationResp.json();
		console.error(
			`In route handler Could not save RemoteLocation post code ${
				payload.postCode
			} status ${remoteLocationResp.status} reason ${
				remoteLocationResp.statusText
			} message: ${JSON.stringify(message, null, 2)}`
		);
		return NextResponse.json(
			{
				message: `Remote Location post code: ${payload.postCode} save failed with reason ${remoteLocationResp.statusText}`,
			},
			{ status: remoteLocationResp.status }
		);
	}
}

export async function POST(req: NextRequest) {
	const payload = (await req.json()) as RemoteLocationMessageType;
	const remoteLocation: RemoteLocationType = {
		deliveryId: payload.deliveryId,
		postCodePart: payload.postCode,
		remoteCharge: payload.remoteCharge,
		days: payload.days,
		surcharge: payload.surcharge,
	};

	const url = `${process.env.EDC_API_BASEURL}/deliveryRemoteLocation`;
	const remoteLocationResp = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(remoteLocation),
	});

	if (remoteLocationResp.ok) {
		const remoteLocation =
			(await remoteLocationResp.json()) as REMOTE_LOCATION_TYPE;

		return NextResponse.json(remoteLocation);
	} else {
		const message = await remoteLocationResp.json();
		console.error(
			`In route handler Could not save RemoteLocation post code ${
				payload.postCode
			} status ${remoteLocationResp.status} reason ${
				remoteLocationResp.statusText
			} message: ${JSON.stringify(message, null, 2)}`
		);
		return NextResponse.json(
			{
				message: `Remote Location post code: ${payload.postCode} save failed with reason ${remoteLocationResp.statusText}`,
			},
			{ status: remoteLocationResp.status }
		);
	}
}

export async function DELETE(req: NextRequest) {
	const id = req.nextUrl.searchParams.get('id');
	const url = `${process.env.EDC_API_BASEURL}/deliveryRemoteLocation/${id}`;
	const deleteResp = await fetch(url, { method: 'DELETE' });
	if (deleteResp.ok) {
		const remoteDelete = await deleteResp.json();
		return NextResponse.json(remoteDelete, { status: deleteResp.status });
	} else {
		return NextResponse.json(deleteResp.statusText, {
			status: deleteResp.status,
		});
	}
}
