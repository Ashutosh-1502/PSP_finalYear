"use client";
import { useTeamAPI } from "@/module/teams/hooks/useTeam";
import { useProfileAPI } from "@/module/profile/hooks/useProfile";
import { PiPlusBold } from "react-icons/pi";
import { usePathname } from "next/navigation";
import { ROLES } from "@/types";
import Cookies from "js-cookie";
import { useHandlers } from "@/module/teams/utils/handlers";
import RenderUsersTable from "@/module/teams/components/render-users-table";
import renderInvitedUsersTable from "@/module/teams/components/render-invited-users-table";
import { COOKIES } from "@/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TeamSettingsView() {
	// const { isOpen, openModal, modalProps } = useModal();
	const { useGetUserData } = useProfileAPI();
	const { data: userData } = useGetUserData();
	const userId = userData?._id;
	const pathname = usePathname();
	const userType = Cookies.get(COOKIES.USER_TYPE);

	const companyRef =
		userType === ROLES.SUPER_ADMIN && pathname.split("/").includes("super-admin")
			? ""
			: Cookies.get(COOKIES.COMPANY_REF);
	const { useGetInvitedUsers, useGetUserListQuery, useGetInvitedUsersForSuperAdminQuery } = useTeamAPI();
	const {
		data: invitedUsers,
		isLoading: invitedUsersLoading,
		refetch: refetchInvitedUsers,
	} = useGetInvitedUsers(companyRef as string);
	const {
		data: usersList,
		isLoading: usersListLoading,
		refetch: refetchUsersList,
	} = useGetUserListQuery(companyRef as string);
	const {
		data: invitedUsersListForSuperAdmin,
		isLoading: invitedUsersListForSuperAdminLoading,
		refetch: refetchInvitedUsersListForSuperAdmin,
	} = useGetInvitedUsersForSuperAdminQuery(userId as string, userData?.roles);

	const { handleDelete, handleResendInvitation, handleChangeRole, handleUpdateStatus } = useHandlers();

	return (
		<>
			<div>
				<div className="col-span-2 flex justify-end gap-4">
					<Button
						type="button"
						color="white"
						className="hover:#413839 bg-black dark:bg-gray-100 dark:text-white"
						onClick={() => {
							console.log("im here");
						}}
					>
						<PiPlusBold className="me-1.5 h-4 w-4" />
						Add Member
					</Button>
				</div>
			</div>
			{/* {isOpen && modalProps.view && <AddTeamMemberModalView />} */}
			{userData?.roles === ROLES.ADMIN || pathname.split("/").includes("admin") ? (
				<Tabs defaultValue="users" className="mt-10 w-full">
					<TabsList>
						<TabsTrigger value="users">Users ({usersList?.data ? usersList?.data?.length : 0})</TabsTrigger>
						<TabsTrigger value="invited-users">
							Invited users ({invitedUsers?.data ? invitedUsers?.data?.length : 0})
						</TabsTrigger>
					</TabsList>
					<TabsContent value="users">
						{RenderUsersTable(
							usersList?.data || [],
							usersListLoading,
							handleChangeRole,
							handleUpdateStatus,
							refetchUsersList
						)}
					</TabsContent>
					<TabsContent value="invited-users">
						{renderInvitedUsersTable(
							invitedUsers?.data || [],
							invitedUsersLoading,
							handleDelete,
							handleResendInvitation,
							refetchInvitedUsers,
							refetchInvitedUsersListForSuperAdmin
						)}
					</TabsContent>
				</Tabs>
			) : (
				<>
					<h2 className="mb-4 ml-4 text-xl font-bold">
						Invited Users ({invitedUsersListForSuperAdmin?.data ? invitedUsersListForSuperAdmin.data.length : 0})
					</h2>

					{renderInvitedUsersTable(
						invitedUsersListForSuperAdmin?.data || [],
						invitedUsersListForSuperAdminLoading,
						handleDelete,
						handleResendInvitation,
						refetchInvitedUsers,
						refetchInvitedUsersListForSuperAdmin
					)}
				</>
			)}
		</>
	);
}
