'use client';
import { useEffect, useRef, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { CATEGORY_TYPE } from '@/interfaces/category.type';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import {
	DataTable,
	DataTableExpandedRows,
	DataTableSelectEvent,
	DataTableSelectionSingleChangeEvent,
	DataTableValueArray,
} from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { PickList, PickListChangeEvent } from 'primereact/picklist';

export default function CategoryMaint({
	categories,
}: {
	categories: CATEGORY_TYPE[];
}) {
	const [categoryList, setCategoryList] = useState<CATEGORY_TYPE[]>(categories);
	const toast = useRef<Toast | null>(null);
	const dt = useRef<DataTable<CATEGORY_TYPE[]>>(null);
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [expandedRows, setExpandedRows] = useState<
		DataTableExpandedRows | DataTableValueArray | undefined
	>(undefined);
	const [expandedRows2, setExpandedRows2] = useState<
		DataTableExpandedRows | DataTableValueArray | undefined
	>(undefined);
	const [category, setCategory] = useState<CATEGORY_TYPE | undefined>(
		undefined
	);
	const [showCategoryDlg, setShowCategoryDlg] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [source, setSource] = useState<CATEGORY_TYPE[]>([]);
	const [target, setTarget] = useState<CATEGORY_TYPE[]>([]);

	const exportCSV = () => {
		dt.current?.exportCSV();
	};

	const rightToolbarTemplate = () => {
		return (
			<Button
				label="Export"
				icon="pi pi-download"
				className="p-button-help"
				onClick={exportCSV}
			/>
		);
	};

	const onMenuBodyTemplate = (rowData: CATEGORY_TYPE) => {
		return (
			<InputSwitch checked={rowData.onMenu} />
			// <i
			// 	className={classNames('pi', {
			// 		// 'true-icon pi-check-circle': rowData.onMenu,
			// 		// 'false-icon pi-times-circle': !rowData.onMenu,
			// 	})}></i>
		);
	};

	const childrenItemTemplate = (rowData: CATEGORY_TYPE) => {
		const numChildren = rowData.childCategories
			? rowData.childCategories.length
			: 0;
		return numChildren;
	};

	const expandAll = () => {
		let _expandedRows: DataTableExpandedRows = {};

		categories.map((item: CATEGORY_TYPE) => {
			_expandedRows[item.id] = true;
		});

		setExpandedRows(_expandedRows);
	};

	const collapseAll = () => {
		setExpandedRows(undefined);
	};

	const header = (
		<div className="flex flex-wrap justify-content-end gap-2">
			<h4 className="m-0">Manage Categories</h4>
			<span className="p-input-icon-left">
				<i className="pi pi-search" />
				<InputText
					type="search"
					placeholder="Search..."
					onInput={(e) => {
						const target = e.target as HTMLInputElement;

						setGlobalFilter(target.value);
					}}
				/>
			</span>
			<Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
			<Button
				icon="pi pi-minus"
				label="Collapse All"
				onClick={collapseAll}
				text
			/>
		</div>
	);

	const allowExpansion = (rowData: CATEGORY_TYPE) => {
		if (!rowData.childCategories) {
			return false;
		} else {
			return rowData.childCategories!.length > 0;
		}
	};

	const editCategory = async (cat: CATEGORY_TYPE) => {
		setCategory({ ...cat });
		setShowCategoryDlg(true);
	};

	const saveCategory = async () => {
		const _category = { ...category };
		console.log(`_category ${JSON.stringify(_category, null, 2)}`);
		console.log(`target ${JSON.stringify(target, null, 2)}`);
		_category.childCategories = target;
		const _categoryList = categoryList.map((cat) => {
			if (cat.id === _category.id) {
				cat.childCategories = target;
				cat.menulevel = _category.menulevel ? _category.menulevel : 0;
				cat.onMenu = _category.onMenu ? _category.onMenu : false;
				cat.title = _category.title ? _category.title : '';
			}
			return cat;
		});
		console.log(`_categoryList ${JSON.stringify(_categoryList, null, 2)}`);

		try {
			const url = `/api/admin/category`;
			// const { data } = await axios.put<CATEGORY_TYPE>(url, _category);
			const catResp = await fetch(url, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				cache: 'no-store',
				body: JSON.stringify(_category),
			});
			if (!catResp.ok) {
				toast.current?.show({
					severity: 'error',
					summary: 'Could not update category',
					detail: `Could not update category ${catResp.statusText} `,
					life: 3000,
				});
				return;
			}
			toast.current?.show({
				severity: 'success',
				summary: 'Updated category',
				// detail: `Successfully updated category ${data.title} `,
				life: 3000,
			});
			// mutate('/api/admin/category');
			setCategory(undefined);
			setSubmitted(false);
			setShowCategoryDlg(false);
		} catch (err) {
			let message: string;
			// // if (axios.isAxiosError(err) && err.response) {
			// // 	message = err.response.statusText;
			// } else {
			// 	message = String(err);
			// }
			toast.current?.show({
				severity: 'error',
				summary: 'Could not update category',
				detail: `Category ${err}`,
				life: 3000,
			});
		}
	};

	const rowExpansionTemplate = (data: CATEGORY_TYPE) => {
		return (
			<div className="p-3">
				<h5>Child Categories for {data.title}</h5>
				<DataTable
					value={data.childCategories}
					expandedRows={expandedRows2}
					onRowToggle={(e) => setExpandedRows2(e.data)}
					rowExpansionTemplate={rowExpansionTemplate}
					// onSelectionChange={onSelectionChange}
					onRowSelect={onRowSelect}
					selectionMode="single"
					responsiveLayout="stack">
					<Column expander={allowExpansion} style={{ width: '5rem' }} />
					<Column field="id" header="Id"></Column>
					<Column field="title" header="Title"></Column>
					<Column
						field="onMenu"
						header="In Menu"
						body={onMenuBodyTemplate}
						style={{ width: '8rem' }}></Column>
					<Column
						field="menulevel"
						header="Menu Level"
						dataType="number"
						style={{ width: '8rem' }}
					/>
					<Column
						field="childCategories"
						header="Children"
						body={childrenItemTemplate}
						style={{ width: '8rem' }}></Column>
					{/* <Column
						header="Change"
						body={actionBodyTemplate}
						exportable={false}
						style={{ minWidth: '12rem' }}
					/> */}
				</DataTable>
			</div>
		);
	};

	const hideCatelogDialog = () => {
		setCategory(undefined);
		setSource([]);
		setTarget([]);
		setSubmitted(false);
		setShowCategoryDlg(false);
	};

	const catelogDialogFooter = (
		<>
			<Button
				label="Cancel"
				icon="pi pi-times"
				outlined
				onClick={hideCatelogDialog}
			/>
			<Button
				label="Save"
				type="submit"
				icon="pi pi-check"
				onClick={saveCategory}
			/>
		</>
	);

	const onInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		name: string
	) => {
		const val = (e.target && e.target.value) || '';
		let _category: CATEGORY_TYPE = { ...category! };

		// @ts-ignore
		_category[`${name}`] = val;

		setCategory(_category!);
	};

	const onMenuChange = (e: InputSwitchChangeEvent) => {
		if (category) {
			let _category = { ...category };
			_category.onMenu = e.value;
			setCategory(_category);
		}
	};

	const onRowSelect = (cat: DataTableSelectEvent) => {
		const filtered: CATEGORY_TYPE[] = categories.filter(
			(item: CATEGORY_TYPE) =>
				item.parentCategory === null && item.menulevel !== 1
		);
		if (cat.data) {
			let _category: CATEGORY_TYPE = { ...cat.data };

			if (!_category.childCategories) {
				_category.childCategories = [];
			}
			setSource(filtered);
			setTarget(_category.childCategories);

			setCategory(_category);
		}
		editCategory(cat.data);
	};

	const onMenuLevelChange = (e: InputNumberChangeEvent) => {
		if (category) {
			let _category: CATEGORY_TYPE = { ...category };
			_category.menulevel = e.value ? e.value : 0;
			setCategory(_category);
		}
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

	const itemTemplate = (item: CATEGORY_TYPE) => {
		return (
			<div className="flex flex-wrap p-2 align-items-center gap-3">
				<div className="flex-1 flex flex-column gap-2">
					<span className="font-bold">{item.title} level:</span>
					<span>Menu Level: {item.menulevel}</span>
				</div>
			</div>
		);
	};

	return (
		<div>
			<Toast ref={toast} position="top-center" />
			<div className="card">
				<Toolbar className="mb-4" right={rightToolbarTemplate} />
				<DataTable
					ref={dt}
					value={categoryList}
					expandedRows={expandedRows}
					onRowToggle={(e) => setExpandedRows(e.data)}
					rowExpansionTemplate={rowExpansionTemplate}
					selectionMode="single"
					selection={category!}
					// onSelectionChange={(
					// 	e: DataTableSelectionSingleChangeEvent<CATEGORY_TYPE[]>
					// ) => onSelectionChange(e)}
					dataKey="id"
					onRowSelect={onRowSelect}
					paginator
					stripedRows
					removableSort
					rows={10}
					rowsPerPageOptions={[5, 10, 25]}
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Categories"
					globalFilter={globalFilter}
					header={header}>
					<Column expander={allowExpansion} style={{ width: '5rem' }} />
					<Column field="id" header="ID" style={{ width: '4rem' }} />
					<Column field="title" header="Title" sortable />
					<Column
						field="onMenu"
						header="In menu"
						dataType="boolean"
						body={onMenuBodyTemplate}
						style={{ width: '8rem' }}
					/>
					<Column
						field="menulevel"
						header="Menu Level"
						dataType="number"
						style={{ width: '8rem' }}
						sortable
					/>
					<Column
						field="hasSubmenu"
						header="Children"
						body={childrenItemTemplate}
						style={{ width: '2rem' }}
					/>
					{/* <Column
						header="Change"
						body={actionBodyTemplate}
						exportable={false}
						style={{ minWidth: '12rem' }}
					/> */}
				</DataTable>
			</div>
			<div>
				{/***  edit dialog ***/}
				<Dialog
					visible={showCategoryDlg}
					style={{ width: '50vw' }}
					breakpoints={{ '960px': '75vw', '641px': '90vw' }}
					header="Edit Category Details"
					modal
					className="p-fluid"
					footer={catelogDialogFooter}
					onHide={hideCatelogDialog}>
					{/* Title field */}
					<div className="field">
						<label htmlFor="categoryType" className="font-bold">
							Title
						</label>
						<InputText
							id="title"
							value={category && category.title}
							onChange={(e) => onInputChange(e, 'title')}
							required
							autoFocus
							className={classNames({
								'p-invalid': submitted && !category?.title,
							})}
						/>
						{submitted && !category?.title && (
							<small className="p-error">Title is required.</small>
						)}
					</div>

					{/* onMenu field */}
					<div className="field">
						{/* <label htmlFor="onMenu" className="font-bold">
							On menu
						</label> */}
						<div>
							<InputSwitch
								id="onMenu"
								checked={(category && category.onMenu) || false}
								// checked={(category && category.onMenu) || false}
								// checked={false}
								onChange={(e: InputSwitchChangeEvent) => onMenuChange(e)}
							/>
						</div>
					</div>

					{/* Menu level */}
					<div className="field">
						<label htmlFor="categoryType" className="font-bold">
							Menu Level
						</label>
						<InputNumber
							id="title"
							value={category && category.menulevel}
							onChange={(e: InputNumberChangeEvent) => onMenuLevelChange(e)}
							required
							max={3}
							className={classNames({
								'p-invalid': submitted && !category?.title,
							})}
						/>
						{submitted && !category?.title && (
							<small className="p-error">Title is required.</small>
						)}
					</div>

					{/* Child categories */}
					<div className="field">
						<label htmlFor="childCategories" className="font-bold">
							Subcategories
						</label>
						<div>
							<PickList
								source={source}
								target={target}
								filter
								dataKey="id"
								filterBy="title"
								sourceFilterPlaceholder="Search by title"
								targetFilterPlaceholder="Search by title"
								onChange={onChildrenChange}
								itemTemplate={itemTemplate}
								breakpoint="1400px"
								sourceHeader="Available"
								targetHeader="Selected"
								sourceStyle={{ height: '24rem' }}
								targetStyle={{ height: '24rem' }}
							/>
						</div>
					</div>
				</Dialog>
			</div>
		</div>
	);
}
