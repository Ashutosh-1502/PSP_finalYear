"use client";

import { useStripePaymentAPI } from "@/module/stripe-payment/hooks/useStripePayment";
import { useState } from "react";
import { type PageChangeType, type CursorType, NOT_APPLICABLE, COUPON_VALIDITY } from "@/module/stripe-payment/types";
import toast from "react-hot-toast";
import { DeleteCouponAlert } from "@/module/stripe-payment/components/coupon-components/delete-coupon-alert";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Coupons() {
	const router = useRouter();
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [cursor, setCursor] = useState<CursorType>({
		startingAfter: undefined,
		endingBefore: undefined,
	});
	const { useGetAllCouponsQuery, useDeleteCouponMutation } = useStripePaymentAPI();
	const {
		data: coupons,
		isSuccess,
		isError,
		refetch: refetchCoupons,
	} = useGetAllCouponsQuery({ limit: pageSize, ...cursor, page });

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

	const onDeleteCoupon = (id: string) => {
		useDeleteCouponMutation.mutate(id, {
			onSuccess: () => {
				toast.success(<p>Coupon deleted successfully!</p>, {
					duration: 2000,
				});
				void refetchCoupons();
			},
			onError: () => {
				toast.error(<p>Coupon deletion failed!</p>, {
					duration: 2000,
				});
			},
		});
	};

	return (
		<div>
			<Button onClick={() => router.back()} variant="outline">
				<IoMdArrowRoundBack />
				Back
			</Button>

			<div className="my-3 flex items-center justify-between">
				<h1>Stripe Coupons</h1>
				<Button onClick={() => router.push(routes.admin.stripePayment.createCoupon)}>Create Coupon</Button>
			</div>

			<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
				<Table>
					<TableHeader>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Duration</TableCell>
							<TableCell>Amount Off</TableCell>
							<TableCell>Percent Off</TableCell>
							<TableCell>Duration In Months</TableCell>
							<TableCell>Max Redemptions</TableCell>
							<TableCell>Times Redeemed</TableCell>
							<TableCell>Valid</TableCell>
							<TableCell>Action</TableCell>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isSuccess && coupons.data?.length ? (
							coupons.data.map((coupon) => (
								<TableRow key={String(coupon.id)}>
									<TableCell>{coupon.name}</TableCell>
									<TableCell>{coupon.duration}</TableCell>
									<TableCell>{coupon.amount_off ? `$${coupon.amount_off / 100}` : NOT_APPLICABLE.N_A}</TableCell>
									<TableCell>{coupon.percent_off ?? NOT_APPLICABLE.N_A}</TableCell>
									<TableCell>{coupon.duration_in_months ?? NOT_APPLICABLE.N_A}</TableCell>
									<TableCell>{coupon.max_redemptions ?? NOT_APPLICABLE.N_A}</TableCell>
									<TableCell>{coupon.times_redeemed ?? NOT_APPLICABLE.N_A}</TableCell>
									<TableCell>{coupon.valid ? COUPON_VALIDITY.YES : COUPON_VALIDITY.NO}</TableCell>
									<TableCell className="flex items-center justify-center gap-2">
										<DeleteCouponAlert onDeleteCoupon={onDeleteCoupon} id={coupon.id} />
										<div className="m-2">
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<Link href={routes.admin.stripePayment.promotionCodes(coupon.id)}>
															<FaPlus />
														</Link>
													</TooltipTrigger>
													<TooltipContent>
														<p>Promotion Codes</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</div>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={9}>
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
											endingBefore: coupons?.data[0]?.id,
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
											startingAfter: coupons?.data[pageSize - 1]?.id,
											endingBefore: undefined,
										})
									}
									className={`ms-0 flex h-8 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
										!coupons?.has_more ? "cursor-not-allowed opacity-50" : ""
									}`}
									disabled={!coupons?.has_more}
								>
									Next
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>
			{isError && <p>Error fetching coupons...</p>}
		</div>
	);
}
