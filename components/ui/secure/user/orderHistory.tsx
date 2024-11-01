'use client';
import { CUSTOMER_ORDER, ORDER_LINE } from '@/interfaces/customerOrder.type';
import ProductList from '@/components/ui/ProductList';
import { DataTable, DataTableExpandedRows } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState } from 'react';
import { dateGB, formatCurrency, orderStatus } from '@/utils/helpers';

export default function OrderHistoryUI({
	orders,
}: {
	orders: CUSTOMER_ORDER[];
}) {
	const [expandedRows, setExpandedRows] = useState<
		any[] | CUSTOMER_ORDER[] | DataTableExpandedRows
	>();

	const totalBodyTemplate = (rowData: CUSTOMER_ORDER) => {
		return formatCurrency(rowData.total);
	};

	const dateBodyTemplate = (rowData: CUSTOMER_ORDER) => {
		if (rowData.createdDate) {
			const date = new Date(rowData.createdDate);
			return dateGB(date);
		}
	};

	const statusBodyTemplate = (rowData: CUSTOMER_ORDER) => {
		const statusCode: number = rowData.orderStatus;

		if (statusCode === 0) {
			return 'Order saved';
		} else if (statusCode === 1) {
			return 'Payment received';
		} else if (statusCode < 4) {
			return 'In processing';
		} else if (statusCode < 5) {
			return 'Dispatched';
		} else {
			return 'deliverd';
		}
	};

	const expansionHeader = (
		<div className="flex flex-wrap align-items-center justify-content-center gap-2">
			<span className="text-gray-600">Order Items</span>
		</div>
	);

	const lineTotalTemplate = (line: ORDER_LINE) => {
		const amount = formatCurrency(line.lineTotal);
		return (
			<div className="flex flex-wrap align-items-end justify-content-end">
				{amount}
			</div>
		);
	};
	const rowExpansionTemplate = (order: CUSTOMER_ORDER) => {
		return (
			<div>
				<DataTable
					value={order.orderLines}
					dataKey="id"
					header={expansionHeader}
					// footer={expansionFooter}
				>
					<Column field="prodRef" header="reference" />
					<Column field="description" header="description" />
					<Column field="quantity" header="Quanity" />
					<Column field="price" header="Price" />
					<Column field="lineTotal" header="Total" body={lineTotalTemplate} />
				</DataTable>
				<div className="flex flex-wrap align-items-end justify-content-end gap-2">
					<div className="text-gray-600">Delivery:</div>
					<span className="mr-3"> {formatCurrency(order.deliveryTotal)}</span>
				</div>
			</div>
		);
	};
	return (
		<div className="card">
			<div className="flex justify-content-center flex-wrap">
				<div className="flex align-items-center justify-content-center ">
					<h5 className="text-gray-600">Order History</h5>
				</div>
			</div>
			<div className="flex justify-content-center flex-wrap">
				<DataTable
					value={orders}
					style={{ width: '50%' }}
					dataKey="id"
					responsiveLayout="stack"
					expandedRows={expandedRows}
					onRowToggle={(e) => setExpandedRows(e.data)}
					rowExpansionTemplate={rowExpansionTemplate}
					rows={10}
					paginator
					rowsPerPageOptions={[5, 10, 25]}
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Orders">
					<Column expander={true} style={{ width: '3em' }} />
					<Column
						field="orderNumber"
						header="Number"
						style={{ width: '3rem' }}
					/>
					<Column
						field="createdDate"
						header="Date"
						body={dateBodyTemplate}
						headerStyle={{ width: '9rem', textAlign: 'center' }}
						bodyStyle={{ textAlign: 'right', overflow: 'visible' }}
					/>
					<Column field="total" header="Total" body={totalBodyTemplate} />
					<Column
						field="orderStatus"
						header="Status"
						body={statusBodyTemplate}
					/>
				</DataTable>
			</div>
		</div>
	);
}
