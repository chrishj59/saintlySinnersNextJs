'use client';
import { NextPage } from 'next';
import React, { useState } from 'react';
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

export default function PersonalDetailsUI() {
	const session = useSession();
	const user = session.data?.user;
	const toast = useRef<Toast>(null);

	if (!user) {
		console.warn(`Not authoried not logged`);
		redirect('/');
		// throw new UnauthorizedException();
	}
	const maxDate = subYears(new Date(), 18);

	const defaultValues: USER_CONTACT_TYPE = {
		id: user.id,
		title: user.title ? user.title : '',
		displayName: user.displayName ? user.displayName : '',
		firstName: user.firstName ? user.firstName : '',
		lastName: user.lastName ? user.lastName : '',
		email: user.email ? user.email : '',
		mobPhone: user.mobPhone ? user.mobPhone : '',
		street: user.street ? user.street : '',
		street2: user.street2 ? user.street2 : '',
		town: user.town ? user.town : '',
		county: user.county ? user.county : '',
		postCode: user.postCode ? user.postCode : '',
		birthDate: user.birthDate ? user.birthDate : maxDate,
	};

	const {
		control,
		register,
		formState: { errors },
		handleSubmit,
		reset,
		setValue,
		getValues,
	} = useForm<USER_CONTACT_TYPE>({ defaultValues });

	const getFormErrorMessage = (name: string) => {
		return (
			errors[name as keyof USER_CONTACT_TYPE] && (
				<small className="p-error">
					{errors[name as keyof USER_CONTACT_TYPE]?.message}
				</small>
			)
		);
	};

	const onSubmitUpdate = async (user: USER_CONTACT_TYPE) => {
		const url = '/api/user/profile';

		const profileResp = await fetch(url, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(user),
		});

		if (profileResp.ok) {
			toast.current?.show({
				severity: 'success',
				summary: 'Details',
				detail: 'Your details have been saved',
				life: 3000,
			});
			reset(defaultValues);
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
			<div className="card">
				<div className="flex justify-content-center flex-wrap">
					<div className="flex align-items-center justify-content-center ">
						<h5 className="text-gray-600">Personal Information</h5>
					</div>
				</div>
				<form onSubmit={handleSubmit(onSubmitUpdate)}>
					<div className="formgrid grid">
						<div className="field col-12 w-full">
							<Controller
								name="title"
								control={control}
								// rules={{
								// 	required: 'Name is required.',
								// }}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.title,
											})}></label>
										<span className="p-float-label">
											<InputText
												id={field.name}
												autoFocus={true}
												width={'100%'}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e) => field.onChange(e.target.value)}
											/>
											<label htmlFor={field.name}>Title</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>
						<div className="field col-12">
							<Controller
								name="displayName"
								control={control}
								rules={{
									required: 'Display name is required.',
								}}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.displayName,
											})}></label>
										<span className="p-float-label">
											<InputText
												id={field.name}
												autoFocus={false}
												width={'100%'}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e) => field.onChange(e.target.value)}
											/>
											<label htmlFor={field.name}>Display Name</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>
						<div className="field col-12 md:col-6">
							<Controller
								name="firstName"
								control={control}
								// rules={{
								// 	required: 'Name is required.',
								// }}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.firstName,
											})}></label>
										<span className="p-float-label">
											<InputText
												id={field.name}
												autoFocus={false}
												width={'100%'}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e) => field.onChange(e.target.value)}
											/>
											<label htmlFor={field.name}>First Name</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>
						<div className="field col-12 md:col-6">
							<Controller
								name="lastName"
								control={control}
								// rules={{
								// 	required: 'Last Name is required.',
								// }}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.lastName,
											})}></label>
										<span className="p-float-label">
											<InputText
												id={field.name}
												autoFocus={false}
												width={'100%'}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e) => field.onChange(e.target.value)}
											/>
											<label htmlFor={field.name}>Last Name</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>

						{/* Street row */}
						<div className="field col-12 md:col-6">
							<Controller
								name="street"
								control={control}
								// rules={{
								// 	required: 'LName is required.',
								// }}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.street,
											})}></label>
										<span className="p-float-label">
											<InputText
												id={field.name}
												autoFocus={false}
												width={'100%'}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e) => field.onChange(e.target.value)}
											/>
											<label htmlFor={field.name}>Street</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>
						<div className="field col-12 md:col-6">
							<Controller
								name="street2"
								control={control}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.street2,
											})}></label>
										<span className="p-float-label">
											<InputText
												id={field.name}
												autoFocus={false}
												width={'100%'}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e) => field.onChange(e.target.value)}
											/>
											<label htmlFor={field.name}>Street additional</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>

						{/* Town and County row */}
						<div className="field col-12 md:col-6">
							<Controller
								name="town"
								control={control}
								// rules={{
								// 	required: 'LName is required.',
								// }}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.town,
											})}></label>
										<span className="p-float-label">
											<InputText
												id={field.name}
												autoFocus={false}
												width={'100%'}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e) => field.onChange(e.target.value)}
											/>
											<label htmlFor={field.name}>Town</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>
						<div className="field col-12 md:col-6">
							<Controller
								name="county"
								control={control}
								// rules={{
								// 	required: 'LName is required.',
								// }}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.county,
											})}></label>
										<span className="p-float-label">
											<InputText
												id={field.name}
												autoFocus={false}
												width={'100%'}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e) => field.onChange(e.target.value)}
											/>
											<label htmlFor={field.name}>County</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>

						{/* Post Code field */}
						<div className="field col-12 ">
							<Controller
								name="postCode"
								control={control}
								// rules={{
								// 	required: 'LName is required.',
								// }}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.postCode,
											})}></label>
										<span className="p-float-label">
											<InputText
												id={field.name}
												autoFocus={false}
												width={'100%'}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e) => field.onChange(e.target.value)}
											/>
											<label htmlFor={field.name}>Post Code</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>

						<div className="field col-12 ">
							<Controller
								name="mobPhone"
								control={control}
								// rules={{
								// 	required: 'LName is required.',
								// }}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.mobPhone,
											})}></label>
										<span className="p-float-label">
											<InputText
												id={field.name}
												autoFocus={false}
												width={'100%'}
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e) => field.onChange(e.target.value)}
											/>
											<label htmlFor={field.name}>Mobile</label>
										</span>
										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
						</div>

						<div className="field col-12 ">
							<Controller
								name="birthDate"
								control={control}
								rules={{
									required: 'Birthday is required.',
								}}
								render={({ field, fieldState }) => (
									<>
										<label
											htmlFor={field.name}
											className={classNames({
												'p-error': errors.birthDate,
											})}></label>

										<span className="p-float-label">
											<Calendar
												id={field.name}
												maxDate={maxDate}
												dateFormat="dd/M/yy"
												value={field.value}
												icon
												className={classNames({
													'p-invalid': fieldState.error,
												})}
												onChange={(e) => field.onChange(e.target.value)}
											/>
											<label htmlFor={field.name}>Date of Birth</label>
										</span>
										<div className="text-sm text-gray-500">
											Must be prior to {formatDate(maxDate, 'dd/MMM/yyyy')}
										</div>

										{getFormErrorMessage(field.name)}
									</>
								)}
							/>
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
