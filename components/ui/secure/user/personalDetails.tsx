'use client';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { subYears, formatDate } from 'date-fns';
import { useSession } from 'next-auth/react';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { USER_CONTACT_TYPE } from '@/interfaces/user-details.type';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { redirect } from 'next/navigation';
import { useRef } from 'react';
import { USER_TYPE } from '@/interfaces/user.type';
import { FormEvent, Nullable } from 'primereact/ts-helpers';
import { revalidatePath } from 'next/cache';

export default function PersonalDetailsUI({
	userAccount,
}: {
	userAccount: USER_TYPE;
}) {
	const session = useSession();
	const user = session.data?.user;

	const address = userAccount.addresses[0] ? userAccount.addresses[0] : null;
	const toast = useRef<Toast>(null);
	const dobDate = new Date(userAccount.birthDate);
	const maxDate = subYears(new Date(), 18);
	const [title, setTitle] = useState<string>(userAccount.title);
	const [displayName, setDisplayName] = useState<string>(
		userAccount.displayName
	);
	const [firstName, setFirstName] = useState<string>(userAccount.firstName);
	const [lastName, setLastName] = useState<string>(userAccount.lastName);
	const [email, setEmail] = useState<string>(userAccount.email);
	const [mobPhone, setMobPhone] = useState<string>(userAccount.mobPhone);
	const [street, setStreet] = useState<string>(address?.street || '');
	const [street2, setStreet2] = useState<string>(address?.street2 || '');
	const [town, setTown] = useState<string>(address?.town || '');
	const [county, setCounty] = useState<string>(address?.county || '');
	const [postCode, setPostCode] = useState<string>(address?.postCode || '');
	const [birthDate, setBirthDate] = useState<Date>(dobDate || maxDate);

	if (!user) {
		console.warn(`Not authoried`);
		redirect('/');
		// throw new UnauthorizedException();
	}

	const defaultValues: USER_CONTACT_TYPE = {
		id: userAccount.id,
		title: userAccount.title,
		displayName: userAccount.displayName,
		firstName: userAccount.firstName,
		lastName: userAccount.lastName,
		addressId: address?.id || '',
		email: userAccount.email,
		mobPhone: userAccount.mobPhone,
		street: address?.street || '',
		street2: address?.street2 || '',
		town: address?.town || '',
		county: address?.county || '',
		postCode: address?.postCode || '',
		birthDate: userAccount.birthDate,
	};

	const {
		control,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm<USER_CONTACT_TYPE>({ defaultValues });

	const onUpdateSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();

		const _user: USER_CONTACT_TYPE = {
			id: userAccount.id,
			title,
			displayName,
			firstName,
			lastName,
			addressId: address?.id ? address.id : '',
			street,
			street2,
			town,
			county,
			postCode,
			email,
			mobPhone,
			birthDate: birthDate ? birthDate : maxDate,
		};

		const url = '/api/user/profile';
		const profileResp = await fetch(url, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(_user),
		});

		if (profileResp.ok) {
			toast.current?.show({
				severity: 'success',
				summary: 'Details',
				detail: 'Your details have been saved',
				life: 3000,
			});
		} else {
			toast.current?.show({
				severity: 'warn',
				summary: 'Detail not saved',
				detail: 'Your details have not been saved. Please email support',
				life: 3000,
			});
		}
	};
	return (
		<>
			<Toast ref={toast} position="top-center" />
			<div className="card">
				<div className="flex justify-content-center flex-wrap">
					<div className="flex align-items-center justify-content-center ">
						<h5 className="text-gray-600">Personal Information</h5>
					</div>
				</div>
				<form onSubmit={onUpdateSubmit}>
					<div className="formgrid grid">
						<div className="field col-12 w-full">
							<FloatLabel>
								<InputText
									id="title"
									value={title}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setTitle(e.target.value)
									}
								/>
								<label htmlFor="title">Title</label>
							</FloatLabel>
						</div>
						<div className="field col-12 w-full mt-3">
							<FloatLabel>
								<InputText
									id="displayName"
									value={displayName}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setDisplayName(e.target.value)
									}
								/>
								<label htmlFor="displayName">Display Name</label>
							</FloatLabel>
						</div>
						<div className="field col-12 md:col-6 mt-3">
							<FloatLabel>
								<InputText
									id="firstName"
									value={firstName}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setFirstName(e.target.value)
									}
								/>
								<label htmlFor="firstName">First Name</label>
							</FloatLabel>
						</div>
						<div className="field col-12 md:col-6 mt-3">
							<FloatLabel>
								<InputText
									id="lastName"
									value={lastName}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setLastName(e.target.value)
									}
								/>
								<label htmlFor="lastName">Last Name</label>
							</FloatLabel>
						</div>
						<div className="field col-12 md:col-6 mt-3">
							<FloatLabel>
								<InputText
									id="street"
									value={street}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setStreet(e.target.value)
									}
								/>
								<label htmlFor="street">Street</label>
							</FloatLabel>
						</div>
						<div className="field col-12 md:col-6 mt-3">
							<FloatLabel>
								<InputText
									id="street2"
									value={street2}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setStreet2(e.target.value)
									}
								/>
								<label htmlFor="street2">Street 2</label>
							</FloatLabel>
						</div>
						<div className="field col-12 md:col-6 mt-3">
							<FloatLabel>
								<InputText
									id="town"
									value={town}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setTown(e.target.value)
									}
								/>
								<label htmlFor="town">Town</label>
							</FloatLabel>
						</div>
						<div className="field col-12 md:col-6 mt-3">
							<FloatLabel>
								<InputText
									id="county"
									value={county}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setCounty(e.target.value)
									}
								/>
								<label htmlFor="county">County</label>
							</FloatLabel>
						</div>
						<div className="field col-12  mt-3">
							<FloatLabel>
								<InputText
									id="postCode"
									value={postCode}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setPostCode(e.target.value)
									}
								/>
								<label htmlFor="postCode">Post Code</label>
							</FloatLabel>
						</div>
						<div className="field col-12 md:col-6 mt-3">
							<FloatLabel>
								<InputText
									id="email"
									value={email}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setTitle(e.target.value)
									}
								/>
								<label htmlFor="email">Email</label>
							</FloatLabel>
						</div>
						<div className="field col-12 md:col-6 mt-3">
							<FloatLabel>
								<InputText
									id="mob"
									value={mobPhone}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setTitle(e.target.value)
									}
								/>
								<label htmlFor="mob">Mobile Phone</label>
							</FloatLabel>
						</div>
						<div className="field col-12 mt-3">
							<FloatLabel>
								<Calendar
									id="birthDate"
									maxDate={maxDate}
									dateFormat="dd/M/yy"
									value={birthDate}
									icon
									onChange={(
										e: FormEvent<Date, React.SyntheticEvent<Element, Event>>
									) => setBirthDate(e.value ? e.value : maxDate)}
									// className={classNames({
									// 	'p-invalid': fieldState.error,
									// })}
									// onChange={(e) => field.onChange(e.target.value)}
								/>
								<label htmlFor="birthDate">Date of birth</label>
							</FloatLabel>
						</div>
					</div>
					<div>
						<div className="flex justify-content-center flex-wrap">
							<div className="flex align-items-center justify-content-center">
								<Button type="submit">Save</Button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}
