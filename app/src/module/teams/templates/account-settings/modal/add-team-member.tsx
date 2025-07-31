"use client";

import { useState } from "react";
import { type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useForm, FormProvider } from "react-hook-form";
import type { InviteApiResponse, PersonalInfoFormTypes } from "@/module/teams/types";
import { useTeamAPI } from "@/module/teams/hooks/useTeam";
import { useProfileAPI } from "@/module/profile/hooks/useProfile";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { ROLES, COOKIES } from "@/types";
import { type AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddTeamMemberModalView() {
	const methods = useForm<PersonalInfoFormTypes>();
	const { handleSubmit } = methods;
	// const { closeModal } = useModal();
	const pathname = usePathname();
	const { useGetUserData } = useProfileAPI();
	const { data: user } = useGetUserData();
	const userType = Cookies.get(COOKIES.USER_TYPE);
	const companyRef =
		userType === ROLES.SUPER_ADMIN && pathname.split("/").includes("super-admin")
			? ""
			: Cookies.get(COOKIES.COMPANY_REF);
	const [, setLoading] = useState(false);
	const { useGetInvitedUsers, useInviteUser, useGetInvitedUsersForSuperAdminQuery } = useTeamAPI();
	const { refetch } = useGetInvitedUsers(companyRef as string);
	const { refetch: refetchInviteusersForSuperAdmin } = useGetInvitedUsersForSuperAdminQuery(
		user?._id as string,
		user?.roles
	);
	const [email, setEmail] = useState<string>("");
	const onSubmit: SubmitHandler<PersonalInfoFormTypes> = () => {
		setLoading(true);

		useInviteUser.mutate(
			{ email, companyRef },
			{
				onSuccess: (data) => {
					void refetch();
					void refetchInviteusersForSuperAdmin();
					setEmail("");
					toast.success(<span className="font-semibold">{data.data.message}</span>);
					// closeModal();
					setLoading(false);
				},
				onError: (err) => {
					const axiosError = err as AxiosError<InviteApiResponse>;
					toast.error(<span className="font-semibold">{axiosError?.response?.data?.message}</span>);
					setLoading(false);
				},
			}
		);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	return (
		<div className="m-auto w-full p-6">
			<h2 className="mb-6 text-lg">Add New Member</h2>
			<FormProvider {...methods}>
				<form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
					<div className="flex flex-col gap-4 text-gray-700">
						<div className="grid w-full items-center gap-1.5">
							<Label>Email</Label>
							<Input
								type="email"
								className="text-sm"
								name="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => handleInputChange(e)}
							/>
						</div>
					</div>
					<div className="mt-8 flex justify-end gap-3">
						<Button
							className="w-auto"
							variant="outline"
							onClick={() => {
								console.log("im here");
							}}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={!email}>
							Add Member
						</Button>
					</div>
				</form>
			</FormProvider>
		</div>
	);
}
