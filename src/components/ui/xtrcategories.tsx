'use client';

import { xtraderCategorySelectType } from '@/interfaces/xtraderCategory.type';
import {
	DataView,
	DataViewLayoutOptions,
	DataViewLayoutOptionsPassThroughType,
} from 'primereact/dataview';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import { category } from '@/interfaces/product.type';
import { Card } from 'primereact/card';
import Image from 'next/image';
import Link from 'next/link';

type DataViewLayoutType = 'list' | 'grid' | (string & Record<string, unknown>);
type DataViewSortOrderType = 1 | 0 | -1 | undefined | null;

export function XtraderCategories({
	categories,
	title,
}: {
	categories: xtraderCategorySelectType[];
	title: string;
}) {
	const toast = useRef<Toast>(null);
	const [layout, setLayout] = useState<DataViewLayoutType>('grid');

	const renderListItem = (data: xtraderCategorySelectType) => {
		return (
			<div className="col-12">
				<Link href={`/xtrader/category/${data.id}`}>
					<div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
						<Image
							src={`data:image/jpeg;base64,${data.imageData}`}
							alt={data.catName}
							width={110}
							height={110}
						/>
						<div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
							<div className="flex flex-column align-items-center sm:align-items-start gap-3">
								<div className="text-2xl font-bold text-900">
									{data.catName}
								</div>
							</div>
						</div>
					</div>
				</Link>
			</div>
		);
	};

	const renderGridItem = (data: xtraderCategorySelectType) => {
		return (
			<div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
				<Link href={`/xtrader/category/${data.id}`}>
					<div className="p-4 border-1 surface-border surface-card border-round">
						<div className="flex flex-wrap align-items-center justify-content-between gap-2">
							<div className="flex align-items-center gap-2">
								<span className="ml-3 product-category font-semibold text-xl">
									{data.catName}
								</span>
							</div>
						</div>
						<div className="flex flex-column align-items-center gap-3 py-5">
							<Image
								src={`data:image/jpeg;base64,${data.imageData}`}
								alt={data.catName}
								width={110}
								height={110}
							/>
						</div>
					</div>
				</Link>
			</div>
		);
	};
	const itemTemplate = (
		category: xtraderCategorySelectType,
		layout: DataViewLayoutType
	) => {
		if (!category) {
			return;
		}

		if (layout === 'list') return renderListItem(category);
		else if (layout === 'grid') return renderGridItem(category);
	};
	const header = () => {
		return (
			<>
				<div className="flex justify-content-center">
					<div className="text-2xl font-bold text-900">{title}</div>
				</div>
				<div className="flex justify-content-end">
					<DataViewLayoutOptions
						layout={layout}
						onChange={(e) => setLayout(e.value)}
					/>
				</div>
			</>
		);
	};

	return (
		<>
			<Toast ref={toast} position="top-center" />
			<DataView
				// className="dataview-width"
				value={categories}
				layout={layout}
				header={header()}
				itemTemplate={itemTemplate}
				paginator
				rows={9}
			/>
		</>
	);
}
