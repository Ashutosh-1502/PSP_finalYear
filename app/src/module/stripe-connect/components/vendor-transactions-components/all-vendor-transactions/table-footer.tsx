"use client";

import { type AllTransactionsTableFooterType } from "@/module/stripe-connect/types";

export default function AllTransactionsTableFooter({
	page,
	pageSize,
	handlePageChange,
	handlePageSizeChange,
	transactions,
	totalPages,
}: AllTransactionsTableFooterType) {
	return (
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
							onClick={() => handlePageChange(page - 1)}
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
							onClick={() => handlePageChange(page + 1)}
							className={`ms-0 flex h-8 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
								transactions && page >= totalPages
									? "pagination-btn disabled cursor-not-allowed opacity-50"
									: "pagination-btn"
							}`}
						>
							Next
						</button>
					</li>
				</ul>
			</div>
		</div>
	);
}
