"use client";

import { useStripeAPI } from "@/module/stripe-transaction/hooks/useStripe";
import { useState } from "react";
import { TRANSACTION_TYPE, type CursorType, type PageChangeType } from "@/module/stripe-transaction/types";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";

export default function StripeTransactions() {
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [cursor, setCursor] = useState<CursorType>({
		startingAfter: undefined,
		endingBefore: undefined,
	});
	const { useGetAllTransactionsQuery } = useStripeAPI();
	const { data: transactions, isSuccess, isError } = useGetAllTransactionsQuery({ limit: pageSize, ...cursor, page });

	const handlePageChange = ({ newPage, startingAfter, endingBefore }: PageChangeType) => {
		if (newPage < 1) return;

		if (newPage === 1) {
			setCursor({ startingAfter: undefined, endingBefore: undefined });
		} else if (startingAfter) {
			setCursor({ startingAfter, endingBefore: undefined });
		} else if (endingBefore) {
			setCursor({ startingAfter: undefined, endingBefore });
		}

		setPage(newPage);
	};

	const handlePageSizeChange = (newPageSize: number) => {
		setPageSize(newPageSize);
		setPage(1);
		setCursor({ startingAfter: undefined, endingBefore: undefined });
	};

	// convert cents to dollar
	const formatCurrency = (amount: number) => `$${(amount / 100).toFixed(2)}`;

	return (
		<div>
			<h1 className="mb-3">Stripe Transactions</h1>
			<div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
				<Table>
					<TableHeader>
						<TableRow>
							<TableCell>Type</TableCell>
							<TableCell>Net</TableCell>
							<TableCell>Amount</TableCell>
							<TableCell>Fee</TableCell>
							<TableCell>Currency</TableCell>
							<TableCell>Description</TableCell>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isSuccess && transactions.data?.length ? (
							transactions.data.map((transaction) => (
								<TableRow key={String(transaction.id)}>
									<TableCell>{transaction.type}</TableCell>
									<TableCell>
										<span
											className={
												[TRANSACTION_TYPE.REFUND, TRANSACTION_TYPE.TRANSFER].includes(
													transaction.type as TRANSACTION_TYPE
												)
													? "text-red-light"
													: "text-green-light"
											}
										>
											{formatCurrency(
												[TRANSACTION_TYPE.REFUND, TRANSACTION_TYPE.TRANSFER].includes(
													transaction.type as TRANSACTION_TYPE
												)
													? -transaction.net
													: transaction.net
											)}
										</span>
									</TableCell>
									<TableCell>
										<span
											className={
												[TRANSACTION_TYPE.REFUND, TRANSACTION_TYPE.TRANSFER].includes(
													transaction.type as TRANSACTION_TYPE
												)
													? "text-red-light"
													: "text-green-light"
											}
										>
											{formatCurrency(
												[TRANSACTION_TYPE.REFUND, TRANSACTION_TYPE.TRANSFER].includes(
													transaction.type as TRANSACTION_TYPE
												)
													? -transaction.amount
													: transaction.amount
											)}
										</span>
									</TableCell>
									<TableCell>{formatCurrency(transaction.fee)}</TableCell>
									<TableCell>{transaction.currency.toUpperCase()}</TableCell>
									<TableCell>{transaction.description || transaction.source}</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={6}>
									<div className="text-center">
										<p className="mt-3">No Data !!</p>
									</div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				{/* Table Footer */}
				<div
					className="flex-column flex flex-wrap items-center justify-between px-6 py-4 md:flex-row"
					aria-label="Table navigation"
				>
					<div className="mb-4 block w-full text-sm font-normal text-gray-500 dark:text-gray-400 md:mb-0 md:inline md:w-auto">
						Showing{" "}
						<span className="font-semibold text-gray-900 dark:text-white">
							{(page - 1) * pageSize + 1}-{page * pageSize}
						</span>
					</div>
					<div className="space-x-4">
						<select
							id="pageSize"
							name="pageSize"
							value={pageSize}
							onChange={(e) => handlePageSizeChange(Number(e.target.value))}
							className="page-size-dropdown rounded-md border-gray-300 px-4 py-1 text-center outline-none focus:border-gray-200 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
						>
							{[10, 25, 50, 100].map((size) => (
								<option key={size} value={size}>
									{size}
								</option>
							))}
						</select>
						<ul className="pagination-list inline-flex h-8 text-sm rtl:space-x-reverse">
							<li>
								<button
									onClick={() =>
										handlePageChange({
											newPage: page - 1,
											startingAfter: undefined,
											endingBefore: transactions?.data[0]?.id,
										})
									}
									className={`ms-0 flex h-8 items-center justify-center rounded-s-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
										page < 2 ? "cursor-not-allowed opacity-50" : ""
									}`}
									disabled={page === 1}
								>
									Previous
								</button>
							</li>
							<li>
								<button
									onClick={() =>
										handlePageChange({
											newPage: page + 1,
											startingAfter: transactions?.data[pageSize - 1]?.id,
											endingBefore: undefined,
										})
									}
									className={`ms-0 flex h-8 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
										!transactions?.has_more ? "cursor-not-allowed opacity-50" : ""
									}`}
									disabled={!transactions?.has_more}
								>
									Next
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>
			{isError && <p>Error fetching transactions...</p>}
		</div>
	);
}
