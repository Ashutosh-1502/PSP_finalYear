"use client";
import type { InvitedUsers, User } from "@/module/teams/types";
import dayjs from "dayjs";
import { INVITED_USER_STATUS } from "@/types";
import type { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
export default function renderInvitedUsersTable(
	data: User[],
	loading: boolean,
	handleDelete: (
		userId: string,
		refetchInvitedUsers: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<InvitedUsers, Error>>,
		refetchInvitedUsersListForSuperAdmin: (
			options?: RefetchOptions | undefined
		) => Promise<QueryObserverResult<InvitedUsers | null, Error>>
	) => void,
	handleResendInvitation: (email: string) => void,
	refetchInvitedUsers: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<InvitedUsers, Error>>,
	refetchInvitedUsersListForSuperAdmin: (
		options?: RefetchOptions | undefined
	) => Promise<QueryObserverResult<InvitedUsers | null, Error>>
) {
	if (loading) return <div>Loading...</div>;
	if (data.length === 0) return <p className="text-sm text-muted-foreground">No Data Found</p>;
	return (
		<div className="text-sm text-muted-foreground">
			<Table >
				<TableHeader>
					<TableRow>
						<TableHead>Email</TableHead>
						<TableHead>Invited</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((user: User) => (
						<TableRow key={user?._id}>
							<TableCell>{user?.invitedEmail}</TableCell>
							<TableCell>{dayjs(user.createdAt).format("MMM DD,YYYY")}</TableCell>
							<TableCell>
								{user?.status === INVITED_USER_STATUS.PENDING
									? user?.expiry < new Date().valueOf()
										? "EXPIRED"
										: "PENDING"
									: user?.status}
							</TableCell>
							<TableCell>
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleResendInvitation(user.invitedEmail)}
								>
									Resend
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleDelete(user._id, refetchInvitedUsers, refetchInvitedUsersListForSuperAdmin)}
								>
									Cancel
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
