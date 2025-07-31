"use client";

import { Pagination } from "@/components/common/pagination/pagination";
import SearchBox from "@/components/common/search-box/search-box";
import { routes } from "@/config/routes";
import { accessCheck } from "@/lib/utils/access-check";
import { COOKIES, ROLES } from "@/types";
import Cookies from "js-cookie";
import debounce from "lodash/debounce";
import Link from "next/link";
import { useState } from "react";
import { PiPlusBold } from "react-icons/pi";
import { useProductAPI } from "@/module/product/hooks/useProducts";
import toast from "react-hot-toast";
import { type CreateProductInput } from "@/module/product/types";
import { DeleteProductAlert } from "@/module/product/components/delete-product-alert";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";

export default function Products() {
	const userType = Cookies.get(COOKIES.USER_TYPE) as string;
	const isAdmin = accessCheck(userType);
	const [value, setValue] = useState<string>("");
	const [searchValue, setSearchValue] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const { useDeleteProductMutation, useGetAllProductsQuery } = useProductAPI();
	const [sortBy] = useState<boolean>(false);
	const companyRef = Cookies.get(COOKIES.COMPANY_REF) as string;

	const onDeleteItem = (id: string) => {
		useDeleteProductMutation.mutate(
			{ id, companyRef },
			{
				onSuccess: () => {
					void refetchProducts();
					toast.success(<p>Product deleted successfully!</p>, {
						duration: 2000,
					});
				},
				onError: () => {
					toast.error(<p>Product deletion failed!</p>, {
						duration: 2000,
					});
				},
			}
		);
	};

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

	const {
		data: productsData,
		isSuccess,
		refetch: refetchProducts,
	} = useGetAllProductsQuery({ searchValue, page, pageSize, sortBy, companyRef }, onDeleteItem);

	const totalPages = Math.ceil(((productsData && productsData[0]?.total) || 0) / pageSize);

	return (
		<>
			<div className="items-centre mb-6 flex justify-between">
				<h1 className="text-3xl font-semibold">Products</h1>
				<div className="items-centre mt-4 flex gap-3 @lg:mt-0">
					{isAdmin && (
						<Link href={routes.admin.createProduct} className="w-full @lg:w-auto">
							<Button className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100">
								<PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
								Add Products
							</Button>
						</Link>
					)}
				</div>
			</div>

			<div style={{ marginBottom: "1.5rem" }}>
				<SearchBox variant="outline" value={value} onChange={handleInputChange} placeholder="Search products here" />
			</div>

			<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
				<Table>
					<TableHeader className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
						<TableRow>
							<TableHead>Product Name</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isSuccess && productsData && productsData[0]?.items?.length ? (
							productsData[0].items.map((item: CreateProductInput) => (
								<TableRow key={String(item._id)}>
									<TableCell>{item.title}</TableCell>
									<TableCell>
										{item.description !== undefined && <div dangerouslySetInnerHTML={{ __html: item.description }} />}
									</TableCell>
									<TableCell>${item.price}</TableCell>
									<TableCell>
										<div className="flex items-center justify-start gap-3">
											{userType !== ROLES.USER && (
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger asChild>
															<Link href={routes.admin.editProduct(String(item._id))}>
																<Image src="/assets/svg/edit.svg" alt="edit" width={20} height={20} />
															</Link>
														</TooltipTrigger>
														<TooltipContent>Edit Product</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											)}

											{userType !== ROLES.USER && (
												<DeleteProductAlert onDeleteProduct={() => onDeleteItem(String(item._id))} />
											)}
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<Link
															href={
																userType !== ROLES.USER
																	? routes.admin.productDetails(String(item._id))
																	: routes.user.productDetails(String(item._id))
															}
														>
															<Image src="/assets/svg/eye.svg" alt="view"width={20} height={20} />
														</Link>
													</TooltipTrigger>
												</Tooltip>
											</TooltipProvider>
										</div>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={4} className="py-5 text-center">
									<p className="mt-3">No Data</p>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				<Pagination
					page={page}
					pageSize={pageSize}
					handlePageChange={handlePageChange}
					handlePageSizeChange={handlePageSizeChange}
					totalPages={totalPages}
				/>
			</div>
		</>
	);
}
