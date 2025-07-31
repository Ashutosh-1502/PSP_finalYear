import {
	type UserLoginDataType,
	type LoginResponseType,
	type ForgetPassowrdDataType,
	type PasswordResponseType,
	type UserRegisterDataType,
	type ResetPasswordResponseType,
	type ResetPasswordDataType,
} from "@/module/auth/types";
import { apiClient } from "@/lib/api";
import type { NSignUpApiResponseType, OAuthUserInterface, SignUpApiResponseType } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AcceptInviteData, EmailResponseType, LogoutResponseType } from "@/module/auth/types";

const API_AUTH_URL = "/auth";

export const useAuthAPI = () => {
	const useLoginMutation = useMutation({
		mutationFn: async (userData: UserLoginDataType) => {
			const response = await apiClient.post<LoginResponseType>(`${API_AUTH_URL}/login`, userData);
			return response.data.data;
		},
	});

	const useRegisterMutation = useMutation({
		mutationFn: async (userData: UserRegisterDataType) => {
			const response = await apiClient.post<NSignUpApiResponseType>(`${API_AUTH_URL}/register`, userData);
			return response.data.data;
		},
	});

	const useSocialRegisterMutation = useMutation({
		mutationFn: async (user: OAuthUserInterface) => {
			const response: SignUpApiResponseType = await apiClient.post(`${API_AUTH_URL}/social-signup`, { user });

			const roles = response.data?.data?.user?.roles;
			const companyRef = response.data?.data?.user?.companyRef;
			return { user: { roles, companyRef } };
		},
	});

	const useLogoutMutation = useMutation({
		mutationFn: async () => {
			const response = await apiClient.post<LogoutResponseType>(`${API_AUTH_URL}/logout`);
			return response.data.data;
		},
	});

	const useForgetPasswordMutation = useMutation({
		mutationFn: async (userData: ForgetPassowrdDataType) => {
			const response = await apiClient.post<PasswordResponseType>(`${API_AUTH_URL}/reset-password`, userData);
			return response.data;
		},
	});

	const useUpdatePasswordMutation = useMutation({
		mutationFn: async ({ userData, token }: { userData: ResetPasswordDataType; token: string }) => {
			const response = await apiClient.post<ResetPasswordResponseType>(`${API_AUTH_URL}/update-password`, {
				...userData,
				token,
			});
			return response.data;
		},
	});

	const useFetchTokenQuery = (token: string) => {
		return useQuery({
			queryKey: ["fetchToken"],
			queryFn: async () => {
				const response = await apiClient.get<ResetPasswordResponseType>(`${API_AUTH_URL}/reset-password/${token}`);
				return response.data;
			},
		});
	};

	const useAcceptInvite = useMutation({
		mutationFn: async (data: AcceptInviteData) => {
			const response = await apiClient.post<NSignUpApiResponseType>(`/accept-invite/${data.inviteToken}`, data);
			return response.data.data;
		},
	});

	const useGetEmailsFromTokenMutation = useMutation({
		mutationFn: async (data: AcceptInviteData) => {
			const response = await apiClient.post<EmailResponseType>(`/accept-invite/email/${data.inviteToken}`, data);
			return response.data;
		},
	});

	return {
		useLoginMutation,
		useRegisterMutation,
		useLogoutMutation,
		useForgetPasswordMutation,
		useFetchTokenQuery,
		useUpdatePasswordMutation,
		useSocialRegisterMutation,
		useAcceptInvite,
		useGetEmailsFromTokenMutation,
	};
};
