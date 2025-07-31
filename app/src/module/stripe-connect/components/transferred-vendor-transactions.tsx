"use client";

import { useState } from "react";
import { useStripeConnectAPI } from "@/module/stripe-connect/hooks/useStripeConnect";
import { type CursorType, type PageChangeType } from "@/module/stripe-connect/types";
import TransferredTransactionsTableFooter from "@/module/stripe-connect/components/vendor-transactions-components/transferred-transactions/table-footer";
import TransferredTransactionsTable from "@/module/stripe-connect/components/vendor-transactions-components/transferred-transactions/transferred-transactions-table";

export default function TransferredVendorTransactions() {
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [cursor, setCursor] = useState<CursorType>({
		startingAfter: undefined,
		endingBefore: undefined,
	});
	const { useGetAllTransferredTransactionsQuery } = useStripeConnectAPI();
	const {
		data: transactions,
		isSuccess,
		isError,
	} = useGetAllTransferredTransactionsQuery({ limit: pageSize, ...cursor, page: page });

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

	return (
		<div>
			<h1 className="mb-3">
				Vendor Transactions <span className="text-sm italic text-gray-400">(Transferred)</span>
			</h1>
			<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
				<TransferredTransactionsTable transactions={transactions} isSuccess={isSuccess} size="md" />
				<TransferredTransactionsTableFooter
					page={page}
					pageSize={pageSize}
					handlePageChange={handlePageChange}
					handlePageSizeChange={handlePageSizeChange}
					transactions={transactions}
				/>
			</div>
			{isError && <p>Error fetching transactions...</p>}
		</div>
	);
}
