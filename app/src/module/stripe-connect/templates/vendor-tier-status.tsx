"use client";

import { useState } from "react";
import { useStripeConnectAPI } from "@/module/stripe-connect/hooks/useStripeConnect";
import { debounce } from "lodash";
import { TIER } from "@/module/stripe-connect/types";
import toast from "react-hot-toast";
import { VendorTierChangeAlert } from "@/module/stripe-connect/components/vendor-tier-change-alert";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// This is part of `super-admin` flow.
export default function VendorTierStatus() {
	const [value, setValue] = useState("");
	const [searchValue, setSearchValue] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const { useUpdateVendorMutation, useGetAllVendorsQuery } = useStripeConnectAPI();

	const {
		data: vendorsData,
		isSuccess,
		refetch: refetchVendors,
	} = useGetAllVendorsQuery({ searchValue, page, pageSize });
	const totalPages = Math.ceil(((vendorsData && vendorsData[0]?.total) || 0) / pageSize);

	const debouncedSetSearchValue = debounce((value: string) => {
		setSearchValue(value);
	}, 300);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value: string = e.target.value;
		setValue(value);
		debouncedSetSearchValue(value);
	};

	const handlePageChange = (newPage: number) => {
		if (newPage < 1) return;
		if (newPage > totalPages) return;
		setPage(newPage);
	};

	const handlePageSizeChange = (newPageSize: number) => {
		setPageSize(newPageSize);
		setPage(1);
	};

	const handleUpdate = (stripeAccountId: string, tier: TIER) => {
		useUpdateVendorMutation.mutate(
			{ stripeAccountId, tier },
			{
				onSuccess: () => {
					void refetchVendors();
					toast.success(<p>Vendor status successfully!</p>, {
						duration: 2000,
					});
				},
				onError: () => {
					toast.error(<p>Vendor status updation failed!</p>, {
						duration: 2000,
					});
				},
			}
		);
	};

	return (
		<div>
			<h1 className="mt-3">Vendor Tier Status</h1>
			<div className="my-6">
				<Input placeholder="Search vendor by email" value={value} onChange={handleInputChange} />
			</div>

			<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Vendor Email</TableHead>
							<TableHead>Current Status</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isSuccess && vendorsData[0]?.items?.length ? (
							vendorsData[0].items.map((vendor) => (
								<TableRow key={String(vendor._id)}>
									<TableCell>{vendor.userRef.email}</TableCell>
									<TableCell>
										<Badge variant={(vendor.tier as string) === TIER.TIER2 ? "default" : "destructive"}>
											{vendor.tier}
										</Badge>
									</TableCell>
									<TableCell className="px-6 py-4">
										<div className="flex items-start justify-start gap-3">
											<VendorTierChangeAlert vendor={vendor} handleUpdate={handleUpdate} />
										</div>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={3}>
									<div className="mt-3 text-center">No Data !!</div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
				<div
					className="flex-column flex flex-wrap items-center justify-between px-6 py-4 md:flex-row"
					aria-label="Table navigation"
				>
					{/* -----------------Page Info Section ------------------------*/}
					<div className="mb-4 block w-full text-sm font-normal text-gray-500 dark:text-gray-400 md:mb-0 md:inline md:w-auto">
						Showing{" "}
						<span className="font-semibold text-gray-900 dark:text-white">
							{(page - 1) * pageSize + 1}-{page * pageSize}
						</span>
					</div>

					{/* <!-- Page Size Dropdown --> */}

					<div className="space-x-4">
						<select
							id="pageSize"
							name="pageSize"
							value={pageSize}
							onChange={(e) => handlePageSizeChange(Number(e.target.value))}
							className="page-size-dropdown rounded-md border-gray-300 px-4 py-1 text-center outline-none focus:border-gray-200 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
						>
							<option value={10}>10</option>
							<option value={25}>25</option>
							<option value={50}>50</option>
							<option value={100}>100</option>
						</select>

						{/* <!-- Pagination List --> */}
						<ul className="pagination-list inline-flex h-8 text-sm rtl:space-x-reverse">
							{/* <!-- Previous Button --> */}
							<li>
								<a
									href="#"
									onClick={() => handlePageChange(page - 1)}
									className={`ms-0 flex h-8 items-center justify-center rounded-s-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
										page < 2 ? "pagination-btn disabled cursor-not-allowed opacity-50" : "pagination-btn"
									}`}
								>
									Previous
								</a>
							</li>

							{/* <!-- Next Button --> */}
							<li>
								<a
									href="#"
									onClick={() => handlePageChange(page + 1)}
									className={`ms-0 flex h-8 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
										vendorsData && page >= totalPages
											? "pagination-btn disabled cursor-not-allowed opacity-50"
											: "pagination-btn"
									}`}
								>
									Next
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
