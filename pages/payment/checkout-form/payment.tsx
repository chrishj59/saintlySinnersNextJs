import { basketItemType, useBasket } from 'components/ui/context/BasketContext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTableExpandedRows } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactNode from 'react';
import getStripe from 'utils/get-stripejs';
import { fetchPostJSON } from 'utils/stripe-api-helpers';

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
	const [total, setTotal] = useState<number>(0);
	const [loading, setLoading] = useState(false);
	const [expandedRows, setExpandedRows] = useState<
		any[] | basketItemType[] | DataTableExpandedRows
	>();
	const toast = useRef<Toast>(null);
	// Stripe constants

	useEffect(() => {
		const cartLine = {
			id: 1,
			title: 'Cart',
			amount: cart.totalCost,
			items: cart.items,
		};
		console.log(`cart is : ${JSON.stringify(cart, null, 2)}`, null, 2);
		console.log(
			`cart delivery info is : ${JSON.stringify(cart.deliveryInfo, null, 2)}`,
			null,
			2
		);
		console.log(`delivery from shippper ${cart.deliveryInfo?.shipper?.amount}`);
		console.log(`payable: ${cart.payable}`);
		console.log(`deliveryInfo: ${cart.deliveryInfo}`);
		const delivery = {
			id: 2,
			title: 'Delivery',
			amount: cart.deliveryInfo?.shipper?.amount
				? parseFloat(cart.deliveryInfo?.shipper?.amount)
				: 0,
		};
		const total = {
			id: 3,
			title: 'Total',
			amount: cart.payable
				? cart.payable + (cart.deliveryInfo?.deliveryCharge || 0)
				: 0,
		};

		setTotal(total.amount);

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

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		setLoading(true);
		// TODO: change the params for items
		const response = await fetchPostJSON('/api/checkout_sessions', {
			email: cart.deliveryInfo?.email,
			amount: total,

			lines: lines,
		});

		if (response.statusCode === 500) {
			console.error(response.message);
			alert(JSON.stringify(response.message));
		}
		const stripe = await getStripe();
		const { error } = await stripe!.redirectToCheckout({
			// Make the id field from the Checkout Session creation API response
			// available to this file, so you can provide it as parameter here
			// instead of the {{CHECKOUT_SESSION_ID}} placeholder.
			sessionId: response.id,
		});
		// If `redirectToCheckout` fails due to a browser or network
		// error, display the localized error message to your customer
		// using `error.message`.
		console.warn(error.message);
		setLoading(false);
	};
	return (
		<CheckoutForm>
			<form onSubmit={handleSubmit}>
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

						<Button type="submit">Pay now</Button>
					</Card>
				</div>
			</form>
		</CheckoutForm>
	);
};

export default PaymentForm;
