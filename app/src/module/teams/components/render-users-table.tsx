"use client";
import { useState } from "react";
import { useProfileAPI } from "@/module/profile/hooks/useProfile";
import type { UserDataType, UsersList } from "@/module/teams/types";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { STATUS } from "@/types";
import type { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BsThreeDots } from "react-icons/bs";

export default function RenderUsersTable(
	data: UserDataType[],
	loading: boolean,
	handleChangeRole: (
		userId: string,
		role: string,
		refetchUsersList: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<UsersList, Error>>,
		onClose: () => void
	) => void,
	handleUpdateStatus: (
		userId: string,
		status: string,
		refetchUsersList: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<UsersList, Error>>
	) => void,
	refetchUsersList: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<UsersList, Error>>
) {
	const { useGetUserData } = useProfileAPI();
	const { data: userData } = useGetUserData();
	const userId = userData?._id;
	const router = useRouter();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [role, setRole] = useState<string>("USER");
	const [user, setUser] = useState<UserDataType>();
	const handleRedirectToUserDetailsPage = (userId: string) => {
		router.push(`/admin/user-details/${userId}`);
	};

	const openDialog = (user: UserDataType) => {
		setUser(user);
		setDialogOpen(true);
	};

	if (loading) return <div>Loading...</div>;
	if (data.length === 0) return <div className="text-sm text-muted-foreground">No Data Found</div>;
	return (
		<>
			<div className="w-full overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>User</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Last Activity</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Actions</TableHead>
							<TableHead></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((user: UserDataType) => (
							<TableRow key={user._id}>
								<TableCell>
									<div className="flex items-center gap-2">
										{/* Avatar */}
										<Avatar className="h-8 w-8">
											<AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
										</Avatar>

										{/* User information */}
										<div className="flex flex-col">
											<div className="max-w-[10rem] truncate text-sm font-medium" title={user.fullName}>
												{user.fullName} {userId === user._id ? "(You)" : ""}
											</div>
											<div className="text-xs text-muted-foreground">{user.email}</div>
										</div>
									</div>
								</TableCell>

								<TableCell>
									<Badge variant="secondary">{user.roles}</Badge>
								</TableCell>
								<TableCell className="text-sm">{dayjs(user.lastActivity).format("MMM DD,YYYY hh:mm:ss A")}</TableCell>
								<TableCell>
									<Badge variant="secondary">{user.status}</Badge>
								</TableCell>
								<TableCell>
									{" "}
									<Button
										variant="link"
										className="dark:text-blue-400 text-sm font-semibold text-blue"
										onClick={() => handleRedirectToUserDetailsPage(user._id)}
									>
										Show details
									</Button>
								</TableCell>
								<TableCell>
									{user?._id !== userId && (
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button size="icon" variant={"ghost"}>
													<BsThreeDots />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem onClick={() => openDialog(user)}>Change Role</DropdownMenuItem>
												<DropdownMenuItem onClick={() => handleUpdateStatus(user._id, user.status, refetchUsersList)}>
													{" "}
													{user.status === STATUS.ACTIVE ? "Suspend" : "Enable"} access
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle> Change Role</DialogTitle>
					</DialogHeader>

					<div className="text-sm">Are you sure you want to change the role for {user?.fullName}?</div>

					<Select value={role} onValueChange={(value) => setRole(value)}>
						<SelectTrigger className="mt-4 w-1/2">
							<SelectValue placeholder="Select role" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ADMIN">Admin</SelectItem>
							<SelectItem value="USER">User</SelectItem>
						</SelectContent>
					</Select>

					<DialogFooter>
						<Button variant="outline" onClick={() => setDialogOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={() => {
								handleChangeRole(String(user?._id), role, refetchUsersList, () => setDialogOpen(false));
							}}
						>
							Confirm
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
