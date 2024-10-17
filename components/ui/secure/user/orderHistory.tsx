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
		return orderStatus(rowData.orderStatus);
	};

	const rowExpansionTemplate = (data: ORDER_LINE) => {};
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
					expandedRows={expandedRows}
					onRowToggle={(e) => setExpandedRows(e.data)}
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
