'use client';

import { CUSTOMER_ORDER } from '@/interfaces/customerOrder.type';
import { formatCurrency } from '@/utils/helpers';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

export default function CustomerOrderView({
	orders,
}: {
	orders: CUSTOMER_ORDER[];
}) {
	const statusTemplate = (rowData: CUSTOMER_ORDER): JSX.Element | undefined => {
		switch (rowData.orderStatus) {
			case 0:
				return <span className=" t ext-500"> Pending</span>;
				break;
			case 1:
				return <span className="text-color"> Customer paid</span>;
				break;
			case 2:
				return <span className="text-color"> Ordered from Xtrader</span>;
				break;
			case 3:
				return <span className="text-color"> Paid Xtrader</span>;
				break;
			case 4:
				return <span className="text-color"> Delivered</span>;
				break;
		}
		if (rowData.orderStatus === 0) {
		} else if (rowData.orderStatus === 1) {
			return <span className="text-color"> Pending</span>;
		}
	};
	const orderTotalTemplate = (rowData: CUSTOMER_ORDER): string => {
		return formatCurrency(rowData.total);
	};

	const vendorPayableTemplate = (rowData: CUSTOMER_ORDER): string => {
		return formatCurrency(rowData.vendTotalPayable);
	};

	const oneTimeTemplate = (rowData: CUSTOMER_ORDER) => {
		if (rowData.oneTimeCustomer) {
			return (
				<i
					className="pi pi-check"
					style={{ fontSize: '1.5rem', color: 'green' }}
				/>
			);
		} else {
			return (
				<i
					className="pi pi-times"
					style={{ fontSize: '1.5rem', color: 'red' }}
				/>
			);
		}
	};
	return (
		<>
			<div>CustomerOrderView has {orders.length} orders </div>
			<DataTable
				value={orders}
				dataKey="id"
				paginator
				rows={10}
				rowsPerPageOptions={[5, 10, 25]}
				paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
				currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Orders"
				sortField="orderNumber">
				<Column
					field="orderNumber"
					header="Number"
					style={{ width: '1rem' }}
					sortable
				/>
				<Column
					field="orderStatus"
					header="Status"
					body={statusTemplate}
					style={{ width: '15rem' }}
					sortable
				/>
				<Column
					field="stripeSession"
					header="Stripe Session"
					style={{ width: '25rem' }}
					sortable
				/>
				<Column
					field="confirmOrder"
					header="Supplier Order"
					style={{ width: '4rem' }}
					sortable
				/>
				<Column
					field="oneTimeCustomer"
					body={oneTimeTemplate}
					header="One time"
					style={{ width: '10px' }}
					sortable
				/>
				<Column
					field="total"
					header="Order Amount"
					body={orderTotalTemplate}
					style={{ width: '10px' }}
					sortable
				/>
				<Column
					field="vendTotalPayable"
					header="vendor payable"
					body={vendorPayableTemplate}
					style={{ width: '10px' }}
					sortable
				/>
				<Column field="trackingRef" header="Tracking ref" />

				<Column field="xtraderStatus" header="Xtrader status" />
				<Column field="xtraderError" header="Xtrader error" sortable />
			</DataTable>
		</>
	);
}
