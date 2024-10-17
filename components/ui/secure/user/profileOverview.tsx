'use client';
import { CUSTOMER_ORDER, ORDER_LINE } from '@/interfaces/customerOrder.type';
import { USER_TYPE } from '@/interfaces/user.type';
import { dateGB, formatCurrency, orderStatus } from '@/utils/helpers';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

export default function ProfileOverviewUI({
	userAccount,
	orders,
}: {
	userAccount: USER_TYPE;
	orders: CUSTOMER_ORDER[];
}) {
	const session = useSession();
	const user = session.data?.user;

	if (!user) {
		console.warn(`Not authoried not logged`);
		redirect('/');
		// throw new UnauthorizedException();
	}

	const lastOrder = orders[0];

	const orderDate = () => {
		if (lastOrder.createdDate) {
			const orderDate = new Date(lastOrder.createdDate);
			return <div>{dateGB(orderDate)}</div>;
		} else {
			return <></>;
		}
	};
	const priceTemplate = (item: ORDER_LINE) => {
		return formatCurrency(item.price);
	};

	const totalTemplate = (item: ORDER_LINE) => {
		return formatCurrency(item.lineTotal);
	};

	const renderLastOrder = () => {
		if (orders.length < 1) {
			return <div>You have not placed any orders</div>;
		}
		return (
			<>
				<div className="grid">
					<div className="col-1 flex flex-row">
						<div className="text-bluegray-300 font-semibold mr-2">Number:</div>
						<div>{lastOrder.orderNumber}</div>
					</div>
					<div className="col-2 flex flex-row">
						<div className="text-bluegray-300 font-semibold mr-2">Date:</div>
						<div>{orderDate()}</div>
					</div>
					<div className="col-2 flex flex-row">
						<div className="text-bluegray-300 font-semibold mr-2">Amount:</div>
						<div>{formatCurrency(lastOrder.total)}</div>
					</div>
					<div className="col-2 flex flex-row">
						<div className="text-bluegray-300 font-semibold mr-2">Status:</div>
						<div>{orderStatus(lastOrder.orderStatus)}</div>
					</div>
				</div>
				<DataTable value={lastOrder.orderLines} stripedRows>
					<Column
						field="prodRef"
						header="Reference"
						style={{ width: '6rem' }}
					/>
					<Column field="description" header="Description" />
					<Column
						field="price"
						header="Price"
						align={'right'}
						body={priceTemplate}
					/>
					<Column field="quantity" header="Quanity" align={'right'} />
					<Column
						field="lineTotal"
						header="Total"
						align={'right'}
						body={totalTemplate}
					/>
				</DataTable>
			</>
		);
	};

	const renderAccountSummary = () => {
		return (
			<div className="grid">
				{/* display name row */}
				<div className="col-2 text-bluegray-300 font-semibold ">
					Display Name
				</div>
				<div className="col-10 text-left">{userAccount.displayName}</div>

				{/* first and last name row */}
				<div className="col-2 text-bluegray-300 font-semibold ">First Name</div>
				<div className="col-2 text-left">{userAccount.firstName}</div>
				<div className="col-1 text-bluegray-300 font-semibold ">Last Name</div>
				<div className="col-7 text-left">{userAccount.lastName}</div>

				{/* Email row */}
				<div className="col-2 text-bluegray-300 font-semibold ">Email</div>
				<div className="col-10 text-left">{userAccount.email}</div>

				{/* MOB row */}
				<div className="col-2 text-bluegray-300 font-semibold ">Mobile</div>
				<div className="col-10 text-left">{userAccount.mobPhone}</div>

				{/* DOB row */}
				<div className="col-2 text-bluegray-300 font-semibold ">
					Date of Birth
				</div>
				<div className="col-2 text-left">
					{dateGB(new Date(userAccount.birthDate))}
				</div>
			</div>
		);
	};
	return (
		<div className="card">
			<div className="flex justify-content-center flex-wrap">
				<div className="flex align-items-center justify-content-center ">
					<h5 className="text-gray-600">My Profile Overview</h5>
				</div>
			</div>
			<div className="flex flex-column ">
				<h5 className="text-gray-600">Most recent order</h5>
				<div className="card">{renderLastOrder()}</div>
			</div>
			<div className="flex flex-column ">
				<h5
					className="text-gray-600 mt-5
				">
					Account Summary
				</h5>
				<div className="card">{renderAccountSummary()}</div>
			</div>
		</div>
	);
}
