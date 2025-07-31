"use client";

import { useState } from "react";
import { useStripeConnectAPI } from "@/module/stripe-connect/hooks/useStripeConnect";
import AllTransactionsTable from "@/module/stripe-connect/components/vendor-transactions-components/all-vendor-transactions/all-vendor-transactions-table";
import AllTransactionsTableFooter from "@/module/stripe-connect/components/vendor-transactions-components/all-vendor-transactions/table-footer";

export default function AllVendorTransactions() {
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);

	const { useGetAllTransactionsQuery, useGetVendorQuery } = useStripeConnectAPI();
	const { data: vendorData } = useGetVendorQuery();
	const { data: transactions, isSuccess, isError } = useGetAllTransactionsQuery({ page, pageSize });
	const totalPages = Math.ceil(((transactions && transactions[0]?.total) || 0) / pageSize);

	const handlePageChange = (newPage: number) => {
		if (newPage < 1) return;
		if (newPage > totalPages) return;
		setPage(newPage);
	};

	const handlePageSizeChange = (newPageSize: number) => {
		setPageSize(newPageSize);
		setPage(1);
	};

	return (
		<div>
			<h1 className="mb-3">
				Vendor Transactions <span className="text-sm italic text-gray-400">(all)</span>
			</h1>
			<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
				<AllTransactionsTable
					transactions={transactions && transactions[0]?.items}
					isSuccess={isSuccess}
					size="md"
					vendorTier={vendorData?.tier}
				/>
				<AllTransactionsTableFooter
					page={page}
					pageSize={pageSize}
					handlePageChange={handlePageChange}
					handlePageSizeChange={handlePageSizeChange}
					transactions={transactions && transactions[0]?.items}
					totalPages={totalPages}
				/>
			</div>
			{isError && <p>Error fetching transactions...</p>}
		</div>
	);
}
