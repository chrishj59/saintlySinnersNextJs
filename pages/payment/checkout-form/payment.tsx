import { basketItemType, useBasket } from 'components/ui/context/BasketContext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTableExpandedRows } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactNode from 'react';

import CheckoutForm from '.';

type Props = {
	children: React.ReactNode;
	props: React.ReactNode;
};

type lineItem = {
	id: number;
	title: string;
	amount: number;
	items?: basketItemType[];
};

const PaymentForm = (props: Props) => {
	const cart = useBasket();
	const [lines, setLines] = useState<lineItem[]>([]);
	const [expandedRows, setExpandedRows] = useState<
		any[] | basketItemType[] | DataTableExpandedRows
	>();
	const toast = useRef<Toast>(null);

	useEffect(() => {
		const cartLine = {
			id: 1,
			title: 'Cart',
			amount: cart.totalCost,
			items: cart.items,
		};
		const delivery = { id: 2, title: 'Delivery', amount: 10 };
		const total = { id: 3, title: 'Total', amount: 110 };

		const _lines: lineItem[] = [];
		_lines.push(cartLine);
		_lines.push(delivery);
		_lines.push(total);
		setLines(_lines);
	}, []);

	const onRowExpand = (event: any) => {
		toast.current?.show({
			severity: 'success',
			summary: 'Successful',
			detail: 'Product Deleted',
			life: 3000,
		});
	};

	const onRowCollapse = (event: any) => {
		toast.current?.show({
			severity: 'success',
			summary: 'Cart Collapsed',
			life: 3000,
		});
	};
	const formatCurrency = (value: number) => {
		return value.toLocaleString('en-GB', {
			style: 'currency',
			currency: 'EUR',
		});
	};
	const balanceBodyTemplate = (rowData: lineItem) => {
		return formatCurrency(rowData.amount);
	};

	const lineAmountBodyTemplate = (rowData: basketItemType) => {
		return formatCurrency(rowData.linePrice);
	};

	const allowExpansion = (rowData: lineItem) => {
		return rowData.title === 'Cart';

		// return rowData.orders.length > 0;
	};
	const rowExpansionTemplate = (data: any) => {
		console.log('expandedRows');
		console.log(expandedRows);
		const _expandedRows = lines[0].items;
		console.log(lines[0]);
		console.log(_expandedRows);
		if (_expandedRows) {
			console.log(_expandedRows[0].item.title);
		}
		return (
			<div className="Item-subtable">
				<h5>Cart line items</h5>
				<DataTable value={_expandedRows}>
					<Column field="item.title" header="Title" />
					<Column
						field="unitPrice"
						header="Unit price"
						headerStyle={{ width: '8rem', textAlign: 'center' }}
						bodyStyle={{ textAlign: 'right', overflow: 'visible' }}
					/>
					<Column
						field="quantity"
						header="Quanity"
						headerStyle={{ width: '4rem', textAlign: 'center' }}
						bodyStyle={{ textAlign: 'right', overflow: 'visible' }}
					/>
					<Column
						field="linePrice"
						header="Line total"
						headerStyle={{ width: '8rem', textAlign: 'center' }}
						bodyStyle={{ textAlign: 'right', overflow: 'visible' }}
						body={lineAmountBodyTemplate}
					/>
				</DataTable>
			</div>
		);
	};

	console.log('expanded rows');
	console.log(expandedRows);
	return (
		<CheckoutForm>
			<div className="flex align-items-center py-5 px-3">
				<Card style={{ width: '80%' }} title="Payment">
					<DataTable
						value={lines}
						expandedRows={expandedRows}
						onRowExpand={onRowExpand}
						onRowCollapse={onRowCollapse}
						onRowToggle={(e) => setExpandedRows(e.data)}
						responsiveLayout="scroll"
						rowExpansionTemplate={rowExpansionTemplate}
						dataKey="id">
						<Column expander={allowExpansion} style={{ width: '3em' }} />
						<Column field="title" header="Item" />
						<Column
							field="amount"
							header="Amount"
							headerStyle={{ width: '4rem', textAlign: 'center' }}
							bodyStyle={{ textAlign: 'right', overflow: 'visible' }}
							body={balanceBodyTemplate}
						/>
					</DataTable>

					<Button>Pay now</Button>
				</Card>
			</div>
		</CheckoutForm>
	);
};

export default PaymentForm;
