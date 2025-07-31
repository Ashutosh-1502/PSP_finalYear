import { useTeamAPI } from "@/module/teams/hooks/useTeam";
import { ROLES, STATUS } from "@/types";
import type { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import type { InvitedUsers, UsersList } from "@/module/teams/types";
import { COOKIES } from "@/types";

export const useHandlers = () => {
	const { useDeleteUser, useResendInvitationMutation, useUpdateRoleMutation, useUpdateStatusMutation } = useTeamAPI();
	const userType = Cookies.get(COOKIES.USER_TYPE);
	const pathname = usePathname();
	const companyRef =
		userType === ROLES.SUPER_ADMIN && pathname.split("/").includes("super-admin")
			? ""
			: Cookies.get(COOKIES.COMPANY_REF);

	const handleDelete = (
		userId: string,
		refetchInvitedUsers: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<InvitedUsers, Error>>,
		refetchInvitedUsersListForSuperAdmin: (
			options?: RefetchOptions | undefined
		) => Promise<QueryObserverResult<InvitedUsers | null, Error>>
	) => {
		useDeleteUser.mutate(
			{ userId, companyRef },
			{
				onSuccess: () => {
					void refetchInvitedUsers(),
						void refetchInvitedUsersListForSuperAdmin(),
						toast.success("User deleted successfully!", { duration: 2000 });
				},
				onError: () => toast.error("Error deleting user!", { duration: 2000 }),
			}
		);
	};

	const handleResendInvitation = (email: string) => {
		useResendInvitationMutation.mutate(
			{ email, companyRef },
			{
				onSuccess: () => toast.success(`Invite resent successfully with user ${email}!`, { duration: 2000 }),
				onError: () => toast.error("Error while resending the invite!", { duration: 2000 }),
			}
		);
	};

	const handleChangeRole = (
		userId: string,
		role: string,
		refetchUsersList: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<UsersList, Error>>,
		onClose: () => void
	) => {
		useUpdateRoleMutation.mutate(
			{ userId, role, companyId: String(companyRef) },
			{
				onSuccess: () => {
					void refetchUsersList();
					toast.success("Role updated successfully!", { duration: 2000 });
					onClose();
				},
				onError: () => {
					toast.error("Error updating role!", { duration: 2000 });
					onClose();
				},
			}
		);
	};

	const handleUpdateStatus = (
		userId: string,
		status: string,
		refetchUsersList: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<UsersList, Error>>
	) => {
		status = status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE;
		useUpdateStatusMutation.mutate(
			{ userId, status, companyRef },
			{
				onSuccess: () => {
					void refetchUsersList();
					toast.success(`User ${status === STATUS.ACTIVE ? "enabled" : "disabled"} successfully!`, { duration: 2000 });
				},
				onError: () => toast.error("Error while updating status!", { duration: 2000 }),
			}
		);
	};

	return { handleDelete, handleResendInvitation, handleChangeRole, handleUpdateStatus };
};
