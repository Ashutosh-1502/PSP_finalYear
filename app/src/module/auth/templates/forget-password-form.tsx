"use client";

import { routes } from "@/config/routes";
import Link from "next/link";
import { useState } from "react";
import type { ChangeEvent } from "react";
import toast from "react-hot-toast";
import { useAuthAPI } from "@/module/auth/hooks/useAuth";
import { type AxiosError } from "axios";
import { type PasswordResponseType } from "@/module/auth/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
interface UserData {
	email: string;
}

export default function ForgetPasswordForm() {
	const [userData, setUserData] = useState<UserData>({
		email: "",
	});
	const { useForgetPasswordMutation } = useAuthAPI();

	const isButtonDisabled = !Object.values(userData).every(Boolean);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		useForgetPasswordMutation.mutate(userData, {
			onSuccess: () => {
				toast.success(<p>Email sent successfully! Please check your email for further instructions.</p>, {
					duration: 2000,
				});
				setUserData({
					email: "",
				});
			},
			onError: (error) => {
				const axiosError = error as AxiosError<PasswordResponseType>;
				if (axiosError.response && axiosError.response?.data && axiosError.response.data.message) {
					toast.error(<p>{axiosError.response.data.message}</p>, {
						duration: 2000,
					});
				} else {
					toast.error(<p>Something went wrong!</p>, {
						duration: 2000,
					});
				}
			},
		});
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUserData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	return (
		<>
			<form onSubmit={(e) => handleSubmit(e)}>
				<div className="space-y-6">
					<Label>Email</Label>
					<Input
						type="email"
						id="email"
						name="email"
						value={userData.email}
						onChange={handleChange}
						placeholder="Enter your email"
					/>
					<Button className="mt-2 w-full" type="submit" size="lg" color="info" disabled={isButtonDisabled}>
						Reset Password
					</Button>
				</div>
			</form>
			<p className="mt-6 text-center text-[15px] leading-loose text-gray-500 lg:mt-8 lg:text-start xl:text-base">
				Don’t want to reset your password?{" "}
				<Link href={routes.signIn} className="font-bold text-gray-700 transition-colors hover:text-blue">
					Sign In
				</Link>
			</p>
		</>
	);
}
