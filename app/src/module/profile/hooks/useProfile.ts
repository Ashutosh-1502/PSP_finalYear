import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type {
	ChangePasswordApiResponseType,
	ChangePasswordDataType,
	NotificationApiResponseType,
	NotificationItemType,
	GetUserDataResponseType,
	UpdateApiResponseType,
	UpdatedProfileDataType,
	ChangePasswordByIdType,
	ChangePasswordByIdApiResponseType,
	UpdateProfileByIdApiResponseType,
	UpdateProfileByIdType,
} from "@/module/profile/types";

export const useProfileAPI = () => {
	const useChangePassword = useMutation({
		mutationFn: async (data: ChangePasswordDataType) => {
			const response = await apiClient.post<ChangePasswordApiResponseType>("/user/change-password", data);
			return response.data;
		},
	});

	const useGetUserData = () => {
		return useQuery({
			queryKey: ["userData"],
			queryFn: async () => {
				const response = await apiClient.get<GetUserDataResponseType>(`/user/me`);
				return response.data.data;
			},
			enabled: true,
			refetchOnWindowFocus: false,
		});
	};

	const useNotifications = (userId: string) => {
		return useQuery<NotificationItemType[]>({
			queryKey: ["notifications", userId],
			queryFn: async () => {
				const response = await apiClient.get<NotificationApiResponseType>(`/notification/${userId}`);
				return response.data.data;
			},
			enabled: !!userId,
			refetchOnWindowFocus: false,
		});
	};

	const useUpdateProfile = useMutation({
		mutationFn: async (update: UpdatedProfileDataType) => {
			const response = await apiClient.put<UpdateApiResponseType>("/user/profile", update, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return response.data;
		},
	});

	const useUpdateProfileById = useMutation({
		mutationFn: async (args: UpdateProfileByIdType) => {
			const { id, update, companyRef } = args;
			const response = await apiClient.put<UpdateProfileByIdApiResponseType>(`/super-admin/user/user-profile/${id}`, {
				update,
				companyRef,
			});
			return response;
		},
	});

	const useChangePasswordById = useMutation({
		mutationFn: async (args: ChangePasswordByIdType) => {
			const { id, data } = args;
			const response = await apiClient.post<ChangePasswordByIdApiResponseType>(
				`/super-admin/user/change-password/${id}`,
				data
			);
			return response;
		},
	});

	return {
		useChangePassword,
		useGetUserData,
		useNotifications,
		useUpdateProfile,
		useUpdateProfileById,
		useChangePasswordById,
	};
};
