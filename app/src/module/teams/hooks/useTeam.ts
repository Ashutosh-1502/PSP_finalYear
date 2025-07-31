import { apiClient } from "@/lib/api";
import { type EmailResponseType } from "@/module/auth/types";
import type { ApiResponse, InviteApiResponse, InviteUserData, InvitedUsers, UsersList } from "@/module/teams/types";
import { ROLES } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useTeamAPI = () => {
	const useInviteUser = useMutation({
		mutationFn: async (data: InviteUserData) => {
			const response = await apiClient.post<InviteApiResponse>("/admin/invite-users/", data);
			return response.data;
		},
	});

	const useDeleteUser = useMutation({
		mutationFn: async (body: { userId: string; companyRef?: string }) => {
			const response = await apiClient.delete<ApiResponse>(`/admin/invite-users/${body.userId}`, {
				params: { companyRef: body?.companyRef },
			});
			return response.data;
		},
	});

	const useResendInvitationMutation = useMutation({
		mutationFn: async (body: { email: string; companyRef?: string }) => {
			const response = await apiClient.post<ApiResponse>(`/admin/invite-users/resend-invite`, {
				email: body?.email,
				companyRef: body?.companyRef,
			});
			return response.data;
		},
	});

	const useUpdateStatusMutation = useMutation({
		mutationFn: async (update: { userId: string; status: string; companyRef?: string }) => {
			const response = await apiClient.put<EmailResponseType>(`/admin/user/status/${update.userId}`, update);
			return response.data;
		},
	});

	const useUpdateRoleMutation = useMutation({
		mutationFn: async (update: { userId: string; role: string; companyId: string }) => {
			const response = await apiClient.put<EmailResponseType>(`/admin/user/user-role/${update.companyId}`, update);
			return response.data;
		},
	});

	const useGetInvitedUsers = (companyRef: string) => {
		return useQuery<InvitedUsers>({
			queryKey: ["invitedUsers", companyRef],
			queryFn: async () => {
				const response = await apiClient.get<InvitedUsers>(`/admin/invite-users/`, {
					params: { companyRef },
				});
				return response.data;
			},
			enabled: !!companyRef,
		});
	};

	// get invited users list based on the user Id for superadmin
	const useGetInvitedUsersForSuperAdminQuery = (userId: string, userType: string | undefined) => {
		return useQuery({
			queryKey: ["invitedUsers", userId],
			queryFn: async () => {
				if (userId && userType === ROLES.SUPER_ADMIN) {
					const response = await apiClient.get<InvitedUsers>(`/super-admin/invite-users/`);
					return response.data;
				} else {
					return null;
				}
			},
			enabled: !!userId,
		});
	};

	const useGetUserListQuery = (companyRef: string) => {
		return useQuery({
			queryKey: ["UserList", companyRef],
			queryFn: async () => {
				const response = await apiClient.get<UsersList>(`/admin/invite-users/users/`, {
					params: { companyRef },
				});
				return response.data;
			},
			enabled: !!companyRef,
		});
	};

	return {
		useInviteUser,
		useDeleteUser,
		useGetInvitedUsers,
		useResendInvitationMutation,
		useUpdateStatusMutation,
		useGetUserListQuery,
		useUpdateRoleMutation,
		useGetInvitedUsersForSuperAdminQuery,
	};
};
