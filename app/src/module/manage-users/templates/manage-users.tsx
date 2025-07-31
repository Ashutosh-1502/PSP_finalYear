"use client";

import { Pagination } from "@/components/common/pagination/pagination";
import SearchBox from "@/components/common/search-box/search-box";
import { useManageUserAPI } from "@/module/manage-users/hooks/useManageUser";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import toast from "react-hot-toast";
import { useState } from "react";
import debounce from "lodash/debounce";
import { COOKIES } from "@/types";
import Cookies from "js-cookie";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import EnableDisableUser from "@/module/manage-users/components/disable-enable-user";
import BlockDeleteUser from "@/module/manage-users/components/block-delete-user";
import UserDetails from "@/module/manage-users/components/view-profile";
import { Switch } from "@/components/ui/switch";
import { type UserResponseType } from "@/module/manage-users/types/index";
import { ACTION } from "@/module/manage-users/types/index";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ParentChildrenTable from "@/module/manage-users/components/view-kids";

export default function ManageUsers() {
	const [value, setValue] = useState<string>("");
	const [searchValue, setSearchValue] = useState("");
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const companyRef = Cookies.get(COOKIES.COMPANY_REF) as string;
	const { useGetAllUsersQuery, useBlockUserMutation } = useManageUserAPI();
	const debouncedSetSearchValue = debounce((value: string) => {
		setSearchValue(value);
	}, 300);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value: string = e.target.value;
		setValue(value);
		debouncedSetSearchValue(value);
	};

	const onBlockUser = (id: string, status: ACTION) => {
		useBlockUserMutation.mutate(
			{ id, companyRef, status },
			{
				onSuccess: () => {
					void refetchUser();
					toast.success(`User ${status} Successfully`, {
						duration: 2000,
					});
				},
				onError: () => {
					toast.error(`${status} operation failed`, {
						duration: 2000,
					});
				},
			}
		);
	};

	const handleUserManagement = (status: ACTION, user: UserResponseType) => {
		onBlockUser(user._id, status);
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
		data: userData,
		isSuccess,
		refetch: refetchUser,
	} = useGetAllUsersQuery({ searchValue, page, pageSize, companyRef }, onBlockUser);

	const totalDocs = (userData && userData[0].total) || 0;
	const totalPages = Math.ceil(((userData && userData[0]?.total) || 0) / pageSize);

	return (
		<>
			<div className="flex flex-col gap-y-6"></div>

			<Tabs defaultValue="parents" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="parents">Parents Details</TabsTrigger>
					<TabsTrigger value="kids">Kids Details</TabsTrigger>
				</TabsList>
				<div className="my-3 flex w-full items-center justify-between">
					<SearchBox variant="outline" value={value} onChange={handleInputChange} placeholder="Search for a reward" />
				</div>
				<div className="mx-auto flex w-full max-w-6xl flex-col rounded-2xl border border-gray-200 bg-white shadow-lg md:p-6">
					<TabsContent value="parents">
						{/* list of users */}
						<div className="flex-1">
							<Table>
								<TableHeader className="text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
									<TableRow>
										<TableHead>User name</TableHead>
										<TableHead>Email</TableHead>
										<TableHead>Phone number</TableHead>
										<TableHead>Subscription</TableHead>
										<TableHead>No. of kids</TableHead>
										<TableHead>Action</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{isSuccess && userData && userData[0]?.items?.length ? (
										userData[0].items.map((user) => (
											<TableRow className="h-20 border-none" key={String(user._id)}>
												<TableCell>
													{user.name.first} {user.name?.last}
												</TableCell>
												<TableCell>{user.email}</TableCell>
												<TableCell>{user?.phone || "Not Available"}</TableCell>
												<TableCell>Monthly</TableCell>
												<TableCell>{user.numberOfKids}</TableCell>
												<TableCell>
													<div className="flex items-center">
														{user.status === ACTION.BLOCKED ? (
															<p>Blocked</p>
														) : (
															<EnableDisableUser
																userName={user.name.first}
																status={user.status === ACTION.ACTIVE ? ACTION.INACTIVE : ACTION.ACTIVE}
																onConfirm={() =>
																	handleUserManagement(
																		user.status === ACTION.ACTIVE ? ACTION.INACTIVE : ACTION.ACTIVE,
																		user
																	)
																}
															>
																<Switch id={user._id} checked={user.status === ACTION.ACTIVE} />
															</EnableDisableUser>
														)}

														<Popover>
															<PopoverTrigger asChild>
																<Button variant="ghost" size="icon">
																	<MoreVertical className="h-5 w-5" />
																</Button>
															</PopoverTrigger>

															<PopoverContent className="w-48 p-0">
																<div className="flex flex-col">
																	<button className="px-4 py-2 text-left text-center hover:bg-gray-100">
																		<UserDetails user={user} onConfirm={handleUserManagement} />
																	</button>
																	{[
																		user.status === ACTION.BLOCKED ? ACTION.UNBLOCKED : ACTION.BLOCKED,
																		ACTION.DELETED,
																	].map((status) => (
																		<button key={status} className={`text-left text-center hover:bg-gray-100 																	`}>
																			<BlockDeleteUser
																				userName={`${user.name.first} ${user.name.last}`}
																				status={status}
																				onConfirm={() => {
																					handleUserManagement(status, user);
																				}}
																			/>
																		</button>
																	))}
																</div>
															</PopoverContent>
														</Popover>
													</div>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={6} className="py-5 text-center">
												<p className="mt-3">No User Data Available</p>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</TabsContent>
					<TabsContent value="kids">
						{isSuccess && userData && userData[0]?.items?.length ? (
							<ParentChildrenTable users={userData[0].items} />
						) : (
							<TableRow>
								<TableCell colSpan={6} className="py-5 text-center">
									<p className="mt-3">No User Data Available</p>
								</TableCell>
							</TableRow>
						)}
					</TabsContent>
					{/* pagination */}

					<div className="mt-auto">
						<Pagination
							page={page}
							pageSize={pageSize}
							handlePageChange={handlePageChange}
							handlePageSizeChange={handlePageSizeChange}
							totalPages={totalPages}
							totalDocs={totalDocs}
						/>
					</div>
				</div>
			</Tabs>
		</>
	);
}
