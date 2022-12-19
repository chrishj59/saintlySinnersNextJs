import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

type BrandValues = {
	title: string;
	description: string;
	catLevel: number | null;
	catType: string;
};

// type catTypeTY = {
// 	name: string;
// 	code: string;
//};

// type FieldError = {
// 	type: string;
// 	ref?: Ref;
// 	types?: MultipleFieldErrors;
// 	message?: Message;
// };

// type FieldErrors<TFieldValues extends FieldValues = FieldValues> = DeepMap<
// 	TFieldValues,
// 	FieldError
//>;

//type FieldValues = Record<string, any>;

export default function NewBrand() {
	const {
		control,
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<BrandValues>();

	const onSubmit = (data: any) => {
		console.log('onSubmit');
		console.log(data);
	};
	const getFormErrorMessage = (name: string) => {
		console.log('errors');
		return (
			errors[name as keyof BrandValues] && (
				<small className="p-error">
					{errors[name as keyof BrandValues]?.message}
				</small>
			)
		);
	};

	const catTypes = [
		{ label: 'Brand', value: 'B' },
		{ label: 'Category', value: 'C' },
		{ label: 'Title', value: 'T' },
	];

	return (
		<div className="flex justify-content-center">
			<div className="card">
				<h5 className="text-center">New Brand</h5>
				<form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
					<>
						<div className="field">
							<span className="p-float-label">
								<Controller
									name="title"
									control={control}
									rules={{ required: 'Tile is required.' }}
									render={({ field, fieldState }) => (
										<InputText
											id={field.name}
											{...field}
											autoFocus
											className={classNames({
												'p-invalid': fieldState.error,
											})}
										/>
									)}
								/>
								<label
									htmlFor="title"
									className={classNames({ 'p-error': errors.title })}>
									Title
								</label>
							</span>
							{getFormErrorMessage('title')}
						</div>
						<div className="field">
							<span className="p-float-label">
								<Controller
									name="catType"
									control={control}
									rules={{
										//required: 'Tile is required.',
										pattern: {
											value: /^[BCT]/,
											message: 'Only category type B C T are allowed',
										},
										maxLength: {
											value: 1,
											message: 'Only 1 character allopwed',
										},
									}}
									render={({ field, fieldState }) => (
										<Dropdown
											id={field.name}
											{...field}
											autoFocus
											options={catTypes}
											// options={[
											// 	{ label: 'Brand', value: 'B' },
											// 	{ label: 'Category', value: 'C' },
											// 	{ label: 'Title', value: 'T' },
											// ]}
											className={classNames({
												'p-invalid': fieldState.error,
											})}
										/>
									)}
								/>

								<label
									htmlFor="catType"
									className={classNames({ 'p-error': errors.catLevel })}>
									Brand Type
								</label>
							</span>
							{getFormErrorMessage('catType')}
						</div>

						<div className="field">
							<span className="p-float-label">
								<Controller
									name="catLevel"
									control={control}
									//rules={{ required: 'Tile is required.' }}
									render={({ field, fieldState }) => (
										<InputNumber
											id={field.name}
											ref={field.ref}
											value={field.value}
											onBlur={field.onBlur}
											onValueChange={(e) => field.onChange(e)}
											mode="decimal"
											maxFractionDigits={0}
											autoFocus
											className={classNames({
												'p-invalid': fieldState.error,
											})}
										/>
									)}
								/>
								<label
									htmlFor="catLevel"
									className={classNames({ 'p-error': errors.catLevel })}>
									Category Level
								</label>
							</span>
							{getFormErrorMessage('catLevel')}
						</div>

						<div className="field">
							<span className="p-float-label">
								<Controller
									name="description"
									control={control}
									rules={{
										//required: 'this is a required',
										maxLength: {
											value: 400,
											message: 'Max length is 400',
										},
									}}
									render={({ field, fieldState }) => (
										<InputTextarea
											id={field.name}
											{...field}
											autoFocus
											className={classNames({
												'p-invalid': fieldState.error,
											})}
										/>
									)}
								/>
								<label
									htmlFor="description"
									className={classNames({ 'p-error': errors.description })}>
									Description
								</label>
							</span>
							{getFormErrorMessage('description')}
						</div>

						{/* <label htmlFor="firstName">First Name</label>
						<input
							placeholder="Bill"
							{...register('firstName', {
								required: 'this is a required',
								maxLength: {
									value: 2,
									message: 'Max length is 2',
								},
							})}
						/>
						<br />
						{errors.firstName && errors.firstName.message}
						<br />

						<label htmlFor="lastName">Last Name</label>
						<input
							placeholder="Luo"
							{...register('lastName', {
								required: 'this is required',
								minLength: {
									value: 2,
									message: 'Min length is 2',
								},
							})}
						/>
						<br />
						{errors.lastName && errors.lastName.message}
						<br />

						<label htmlFor="email">Email</label>
						<input
							placeholder="bluebill1049@hotmail.com"
							type="text"
							{...register('email', {
								required: 'this is required',
								pattern: {
									value:
										/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
									message: 'Invalid email address',
								},
							})}
						/>
						<br />
						{errors.email && errors.email.message}
						<br /> */}
						<Button type="submit">Save Brand</Button>
					</>
				</form>
			</div>
		</div>
	);
}
