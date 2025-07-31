"use client";

import type { PromotionCodesType } from "@/module/stripe-payment/types";
import { useRouter } from "next/navigation";
import { useStripePaymentAPI } from "@/module/stripe-payment/hooks/useStripePayment";
import { useState } from "react";
import { type PageChangeType, type CursorType, NOT_APPLICABLE } from "@/module/stripe-payment/types";
import { routes } from "@/config/routes";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";

export function PromotionCodes({ couponId }: PromotionCodesType) {
	const router = useRouter();
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [cursor, setCursor] = useState<CursorType>({
		startingAfter: undefined,
		endingBefore: undefined,
	});
	const { useGetAllPromotionCodesQuery } = useStripePaymentAPI();
	const {
		data: promotionCodes,
		isSuccess,
		isError,
	} = useGetAllPromotionCodesQuery({ couponId, limit: pageSize, ...cursor, page });

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

	const formatExpirationDate = (timestamp: number | undefined): string => {
		if (!timestamp) return NOT_APPLICABLE.N_A;
		const date = new Date(timestamp * 1000);
		return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
	};

	return (
		<div>
			<Button onClick={() => router.back()} variant="outline">
				<IoMdArrowRoundBack /> Back
			</Button>

			<div className="my-3 flex items-center justify-between">
				<h1>Stripe Promotion Codes</h1>
				<Button onClick={() => router.push(routes.admin.stripePayment.createPromotionCode(couponId))}>
					Create Promotion Code
				</Button>
			</div>

			<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
				<Table>
					<TableHeader>
						<TableRow>
							<TableCell>Code</TableCell>
							<TableCell>Max Redemptions</TableCell>
							<TableCell>Expires At</TableCell>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isSuccess && promotionCodes?.data?.length ? (
							promotionCodes.data.map((promotionCode) => (
								<TableRow key={String(promotionCode.id)}>
									<TableCell>{promotionCode.code}</TableCell>
									<TableCell>{promotionCode.max_redemptions ?? NOT_APPLICABLE.N_A}</TableCell>
									<TableCell>{formatExpirationDate(promotionCode.expires_at)}</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={3}>
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
											endingBefore: promotionCodes?.data[0]?.id,
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
											startingAfter: promotionCodes?.data[pageSize - 1]?.id,
											endingBefore: undefined,
										})
									}
									className={`ms-0 flex h-8 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
										!promotionCodes?.has_more ? "cursor-not-allowed opacity-50" : ""
									}`}
									disabled={!promotionCodes?.has_more}
								>
									Next
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>
			{isError && <p>Error fetching promotion codes...</p>}
		</div>
	);
}
