import axios, { AxiosError, AxiosResponse } from 'axios';
import { basketItemType, useBasket } from 'components/ui/context/BasketContext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTableExpandedRows } from 'primereact/datatable';
import { useLocalStorage } from 'primereact/hooks';
import { Toast } from 'primereact/toast';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactNode from 'react';
import getStripe from 'utils/get-stripejs';
import { fetchPostJSON } from 'utils/stripe-api-helpers';
import xml2js, { parseStringPromise } from 'xml2js';
import CheckoutForm from '.';
import { EDC_ORDER_TYPE } from 'interfaces/edcOrder.type';
import { DELIVERY_CHARGE_TYPE } from 'interfaces/delivery-charge.type';
import { DELIVERY_INFO_TYPE } from 'interfaces/delivery-info.type';

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
type ordermessage = {
	orderNumber: number;
	orderId: string;
};
type orderResponse = {
	status: string;
	orderMessage: ordermessage;
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
	const [orderId, setOrderId] = useLocalStorage('', 'orderKey');
	// Stripe constants

	useEffect(() => {
		const cartLine = {
			id: 1,
			title: 'Cart',
			amount: cart.totalCost,
			items: cart.items,
		};

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
	}, [
		lines,
		cart.deliveryInfo?.deliveryCharge,
		cart.deliveryInfo?.shipper?.amount,
		cart.items,
		cart.payable,
		cart.totalCost,
	]);

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
		const _expandedRows = lines[0].items;
		if (_expandedRows) {
		}

		return (
			<div className="Item-subtable">
				<p>Order id {orderId}</p>
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

		const deliveryInfo: DELIVERY_INFO_TYPE | undefined = cart.deliveryInfo;

		//const edcCountryCode = deliveryInfo?.country?
		const items: basketItemType[] | undefined = lines[0].items;
		if (items) {
			const prodIds = items.map((i: basketItemType) => i.item.artnr);
			/** save order  */
			if (deliveryInfo) {
				const ecdOrder: EDC_ORDER_TYPE = {
					vendorNumber: deliveryInfo?.shipper?.vendor?.id || 0,

					oneTimeCustomer: true,
					goodsValue: total,
					tax: 0,
					total: total,
					currencyCode: 'EUR',
					customer: {
						name: deliveryInfo.name,
						street: deliveryInfo.street,
						city: deliveryInfo.town,
						houseNumber: deliveryInfo.house_number,
						country: deliveryInfo?.shipper?.country?.edcCountryCode || 0,
						postCode: deliveryInfo.postCode,
						telphone: deliveryInfo.phone,
						email: deliveryInfo.email,
					},
					products: prodIds,
				};

				axios
					.post('/api/v1/edc_order/saveCustomerOrder', ecdOrder)
					.then((res: AxiosResponse) => {
						const orderUpdated: orderResponse = res.data;

						setOrderId(orderUpdated.orderMessage.orderId);
					})
					.catch((err: AxiosError) => {
						console.error(`Error calling API ${err.message}`);
					});
			}
		}

		//TODO: change the params for items
		const response = await fetchPostJSON('/api/checkout_sessions', {
			email: cart.deliveryInfo?.email,
			amount: total,
			orderId: orderId,
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
