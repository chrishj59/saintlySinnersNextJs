import { NextPage } from 'next';
import { category } from '../../../../interfaces/product.type';
import CategoryProduct from '../../../product/categoryLevel1/[id]';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';

import type {
	InferGetStaticPropsType,
	GetStaticProps,
	GetStaticPaths,
} from 'next';
import { CATEGORY_TYPE } from 'interfaces/category.type';
import axios from 'axios';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { ScrollPanel } from 'primereact/scrollpanel';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { PickList, PickListChangeEvent } from 'primereact/picklist';
import Categories from '../category';

export const getStaticPaths = (async () => {
	const { data } = await axios.get<CATEGORY_TYPE[]>(
		process.env.EDC_API_BASEURL + `/category`
	);

	return {
		paths: data.map((b) => {
			return {
				params: {
					id: `${b.id}`,
					title: `${b.title}`,
				},
			};
		}),
		fallback: 'blocking',
	};
}) satisfies GetStaticPaths;

export const getStaticProps = (async (context) => {
	let resp = await axios.get<CATEGORY_TYPE>(
		process.env.EDC_API_BASEURL + `/category?id=${context.params?.id}`
	);
	const category = resp.data;

	const { data } = await axios.get<CATEGORY_TYPE[]>(
		process.env.EDC_API_BASEURL + `/category`
	);
	const categories = data;
	return { props: { category, categories } };
}) satisfies GetStaticProps<{
	category: CATEGORY_TYPE;
}>;

export default function UpdateCategory({
	category,
	categories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
	const toast = useRef(null);
	const [cat, setCat] = useState<CATEGORY_TYPE>(category);
	const [cats, setCats] = useState<CATEGORY_TYPE[]>(categories);
	const [source, setSource] = useState<CATEGORY_TYPE[]>([]);
	const [target, setTarget] = useState<CATEGORY_TYPE[]>([]);
	const defaultValues: CATEGORY_TYPE = {
		id: cat.id,
		title: cat.title,
		onMenu: cat.onMenu,
		menulevel: cat.menulevel,
		childCategories: cat.childCategories,
	};

	useEffect(() => {
		console.log(`categories ${JSON.stringify(categories, null, 2)}`);
		const _cats = categories;
		if (_cats) {
			const filtered: CATEGORY_TYPE[] = _cats.filter(
				(item: CATEGORY_TYPE) =>
					item.parentCategory === null && item.menulevel !== 1
			);
			setSource(filtered);
		} else {
			setSource(_cats);
		}
		setCats(_cats);
		if (cat.childCategories) {
			//setTarget(cat.childCategories);
		}
	}, []);

	const show = () => {
		// @ts-ignore
		toast.current?.show({
			severity: 'success',
			summary: 'Form Submitted',
			detail: getValues('title'),
		});
	};
	const getFormErrorMessage = (name: any) => {
		errors[name as keyof CATEGORY_TYPE] && (
			<small className="p-error">
				{errors[name as keyof CATEGORY_TYPE]?.message}
			</small>
		);
	};

	const {
		control,
		formState: { errors },
		handleSubmit,
		getValues,
		reset,
	} = useForm({ defaultValues });

	const onCategoryTypeSubmit = async (data: CATEGORY_TYPE) => {
		data.title && show();
		alert(`Cat is ${JSON.stringify(cat, null, 2)}`);

		reset();
	};
	const onChildrenChange = (event: PickListChangeEvent) => {
		const _target = event.target.map((item: CATEGORY_TYPE) => {
			item.menulevel = category!.menulevel + 1;
			item.onMenu = category!.onMenu;
			return item;
		});
		setSource(event.source);
		setTarget(_target);
	};

	const cardHeader = (
		<div className="flex justify-content-center">
			<h5 className="m-0">Update Category</h5>
		</div>
	);

	const itemTemplate = (item: CATEGORY_TYPE) => {
		const _item = item;
		if (!_item.menulevel) {
			_item.menulevel = 0;
		}
		return (
			<div className="flex flex-wrap p-2 align-items-center gap-3">
				<div className="flex-1 flex flex-column gap-2">
					<span className="font-medium">{_item.title} </span>
					<span>Menu Level: {_item.menulevel}</span>
				</div>
			</div>
		);
	};
	const onMenuChange = (e: InputSwitchChangeEvent) => {
		if (category) {
			let _category = { ...category };
			_category.onMenu = e.value;
			setCat(_category);
		}
	};
	return (
		<div className="flex justify-content-center">
			<Card header={cardHeader} style={{ width: '75%' }}>
				<form
					onSubmit={handleSubmit(onCategoryTypeSubmit)}
					// className="flex flex-column gap-2"
				>
					<Toast ref={toast} />
					<div className="flex flex-column gap-2">
						<Controller
							name="title"
							control={control}
							rules={{ required: 'Name - Surname is required.' }}
							render={({ field, fieldState }) => (
								<>
									<label
										htmlFor={field.name}
										className={classNames({ 'p-error': errors.title })}></label>
									<span className="p-float-label">
										<InputText
											id={field.name}
											value={field.value}
											className={classNames({ 'p-invalid': fieldState.error })}
											onChange={(e) => field.onChange(e.target.value)}
										/>
										<label htmlFor={field.name}>Title</label>
									</span>
									{getFormErrorMessage(field.name)}
								</>
							)}
						/>
						<Controller
							name="menulevel"
							control={control}
							rules={{
								required: 'Enter a valid menu level.',
								validate: (value) =>
									(value >= 1 && value <= 3) || 'Enter a valid menu level.',
							}}
							render={({ field, fieldState }) => (
								<>
									<label htmlFor={field.name}>
										Enter a menu level between 1 and 3.
									</label>
									<InputNumber
										id={field.name}
										inputRef={field.ref}
										value={field.value}
										onBlur={field.onBlur}
										onValueChange={(e) => field.onChange(e)}
										useGrouping={false}
										inputClassName={classNames({
											'p-invalid': fieldState.error,
										})}
									/>
									{getFormErrorMessage(field.name)}
								</>
							)}
						/>
					</div>
					<span> Child menu items</span>
					<div className="col-12 xl:col-8">
						<PickList
							source={source}
							target={target}
							filter
							filterBy="title"
							sourceFilterPlaceholder="Search by title"
							targetFilterPlaceholder="Search by title"
							onChange={onChildrenChange}
							itemTemplate={itemTemplate}
							sourceHeader="Available"
							targetHeader="Selected"
							// sourceStyle={{ width: '25%' }}
							// targetStyle={{ width: '25%' }}
						/>
					</div>

					<Button label="Submit" type="submit" icon="pi pi-check" />
				</form>
			</Card>
		</div>
		// <div>Update categories returned {JSON.stringify(category, null, 2)}</div>
	);
}
