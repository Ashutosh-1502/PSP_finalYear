"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { useAuthAPI } from "@/module/auth/hooks/useAuth";
import { routes } from "@/config/routes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordForm() {
	const [userData, setUserData] = useState({
		email: "",
		password: "",
		confirmedPassword: "",
	});

	const searchParams = useSearchParams();
	const router = useRouter();
	const { useUpdatePasswordMutation } = useAuthAPI();
	const token: string = searchParams.get("token") as string;
	const paramsEmail = searchParams.get("email");

	const isButtonDisabled = !Object.values(userData).every(Boolean);
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (userData.password !== userData.confirmedPassword) {
			toast.error(<p>Passwords do not match!</p>, {
				duration: 2000,
			});
			return;
		}
		useUpdatePasswordMutation.mutate(
			{ userData, token },
			{
				onSuccess: () => {
					toast.success(<p>Password Reset Successful!</p>, {
						duration: 2000,
					});
					router.replace(routes.signIn);
				},
				onError: () => {
					toast.error(<p>Oops! Something went wrong.</p>, {
						duration: 2000,
					});
				},
			}
		);
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const { name, value } = e.target;
		setUserData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	useEffect(() => {
		setUserData((prevData) => ({
			...prevData,
			email: paramsEmail || "",
		}));
	}, [paramsEmail]);

	return (
		<div>
			<form onSubmit={(e) => handleSubmit(e)}>
				<p>Email: {paramsEmail}</p>
				<div className="space-y-6">
					<Input
						type="password"
						placeholder="Enter confirm password"
						name="password"
						value={userData.password}
						onChange={(e) => handleChange(e)}
						className="text-sm"
					/>
					<Input
						type="password"
						placeholder="Confirm Your New Password"
						name="confirmedPassword"
						value={userData.confirmedPassword}
						onChange={(e) => handleChange(e)}
						className="[&>label>span]:font-medium, text-sm"
					/>
					<Button className="mt-2 w-full" type="submit" size="lg" color="info" disabled={isButtonDisabled}>
						Reset Password
					</Button>
				</div>
			</form>
		</div>
	);
}
