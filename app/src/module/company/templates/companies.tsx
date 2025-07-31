"use client";

import { routes } from "@/config/routes";
import PageHeader from "@common/page-header";
import { useState } from "react";
import debounce from "lodash/debounce";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useCompanyAPI } from "@/module/company/hooks/useCompany";
import type { CompanyType } from "@/module/company/types";
import { FiEye } from "react-icons/fi";
import { RiExchangeFundsLine } from "react-icons/ri";
import { COOKIES, STATUS } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useProfileAPI } from "@/module/profile/hooks/useProfile";
import AddCompanyButton from "@/module/company/components/add-company-button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const pageHeader = {
	title: "Companies",
	breadcrumb: [
		{
			href: routes.profile.dashboard,
			name: "Profile",
		},
		{
			name: "List",
		},
	],
};

export default function Companies() {
	const [value, setValue] = useState<string>("");
	const [searchValue, setSearchValue] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const { useGetAllCompanyData, useUpdateCompanyData } = useCompanyAPI();
	const { data: companyData, isSuccess } = useGetAllCompanyData({ searchValue, page, pageSize });
	const totalPages = Math.ceil(((companyData && companyData[0]?.total) || 0) / pageSize);
	const [companyStatus, setCompanyStatus] = useState<string | null | undefined>(null);
	const [companyId, setCompanyId] = useState<string | null | undefined>(null);
	const queryClient = useQueryClient();
	const router = useRouter();
	const { useGetUserData } = useProfileAPI();
	const { data: superAdminDetails } = useGetUserData();

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

	const openDialog = (item: CompanyType) => {
		setCompanyId(item._id);
		setCompanyStatus(item.companyStatus);
	};

	const closeDialog = () => {
		setCompanyId(null);
		setCompanyStatus(null);
	};

	const handleRedirectToAdminPage = (companyRef: string) => {
		Cookies.set(COOKIES.COMPANY_REF, companyRef, { expires: 1 });
		Cookies.set(COOKIES.IS_ADMIN_PATH, "true", { expires: 1 });
		router.push(routes.admin.adminDetails(companyRef));
	};

	const handleStatusChange = (companyRef: string) => {
		const companyNewStatus = companyStatus === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE;
		useUpdateCompanyData.mutate(
			{ id: companyRef, data: { companyStatus: companyNewStatus } },
			{
				onSuccess: () => {
					void queryClient.invalidateQueries({
						predicate: (query) => query.queryKey.includes("companies"),
					});
					toast.success(<p>Status updated successfully!</p>, {
						duration: 2000,
					});
				},
				onError: () => {
					toast.error(<p>Status updation failed!</p>, {
						duration: 2000,
					});
				},
			}
		);
	};

	return (
		<>
			<PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
				<AddCompanyButton />
			</PageHeader>

			<div className="mb-6">
				<Input placeholder="Search anything here..." value={value} onChange={handleInputChange} />
			</div>

			<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
				<Table>
					<TableHeader>
						<TableRow>
							<TableCell>Company Name</TableCell>
							<TableCell>Company Status</TableCell>
							<TableCell>Action</TableCell>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isSuccess && companyData[0]?.items?.length ? (
							companyData[0].items.map((item: CompanyType) => (
								<TableRow key={String(item._id)}>
									<TableCell>{item.name}</TableCell>
									<TableCell>
										<Badge
											variant="outline"
											className={`ml-1 ${item.companyStatus === STATUS.INACTIVE ? "text-red-800 bg-red-lighter" : "text-green-800 bg-green-lighter"}`}
										>
											{item.companyStatus}
										</Badge>
									</TableCell>
									{superAdminDetails && superAdminDetails?.email !== item.name && (
										<TableCell className="px-6 py-4">
											<div className="flex items-start justify-start gap-3">
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger asChild>
															<span onClick={() => handleRedirectToAdminPage(item._id as string)}>
																<FiEye />
															</span>
														</TooltipTrigger>
														<TooltipContent>
															<p>View Company</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>

												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger asChild>
															<span onClick={() => openDialog(item)}>
																<RiExchangeFundsLine />
															</span>
														</TooltipTrigger>
														<TooltipContent>
															<p>Toggle Company Status</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</div>
										</TableCell>
									)}
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
										companyData && page >= totalPages
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

			<AlertDialog open={!!companyId} onOpenChange={closeDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Change Company Status</AlertDialogTitle>

						<AlertDialogDescription>
							<p>
								Are you sure you want to change the company status to
								<Badge
									variant="outline"
									className={`ml-1 ${companyStatus === STATUS.ACTIVE ? "text-red-800 bg-red-lighter" : "text-green-800 bg-green-lighter"}`}
								>
									{companyStatus === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE}
								</Badge>
								?
							</p>
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								handleStatusChange(companyId as string);
								closeDialog();
							}}
						>
							Confirm
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
