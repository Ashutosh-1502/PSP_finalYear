"use client";

import { routes } from "@/config/routes";
import Link from "next/link";
import { PiArrowRightBold } from "react-icons/pi";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthAPI } from "@/module/auth/hooks/useAuth";
import type { LoginResponseType, UserLoginDataType } from "@/module/auth/types";
import { redirectUser, setCookies } from "@/module/auth/utils/helpers";
import { type AxiosError } from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

export default function SignInForm() {
	const [userData, setUserData] = useState<UserLoginDataType>({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);

	const handlePasswordVisibility = () => setShowPassword(!showPassword);
	const router = useRouter();
	const { useLoginMutation } = useAuthAPI();
	const isButtonDisabled = !Object.values(userData).every(Boolean);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		useLoginMutation.mutate(userData, {
			onSuccess: (data) => {
				const {
					user: { roles, companyRef },
				} = data;
				setCookies({ user: { roles, companyRef } });
				toast.success(<p>Log In Success!</p>, {
					duration: 2000,
				});
				const redirectRoute = redirectUser(data.user.roles);
				router.replace(redirectRoute);
			},
			onError: (error) => {
				const axiosError = error as AxiosError<LoginResponseType>;
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

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUserData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	return (
		<>
			<form onSubmit={(e) => handleSubmit(e)}>
				<div className="space-y-5">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							type="email"
							placeholder="Enter your email"
							name="email"
							value={userData.email}
							onChange={handleInputChange}
						/>
					</div>

					<div className="relative space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							type={showPassword ? "text" : "password"}
							id="password"
							placeholder="Enter your password"
							name="password"
							value={userData.password}
							onChange={handleInputChange}
						/>
						<Button
							type="button"
							aria-label={showPassword ? "Hide password" : "Show password"}
							onClick={handlePasswordVisibility}
							variant="ghost"
							className="bg-gray absolute right-0.5 top-5 text-muted-foreground hover:text-foreground"
						>
							{showPassword ? <IoMdEyeOff /> : <IoMdEye />}
						</Button>
					</div>
					<div className="flex items-center justify-between pb-2">
						<div className="flex items-center gap-1">
							<Checkbox />
							<span className="text-sm">Remember Me</span>
						</div>
						<Link
							href={routes.forgotPassword}
							className="h-auto p-0 text-sm font-semibold text-blue underline transition-colors hover:text-gray-900 hover:no-underline"
						>
							Forget Password?
						</Link>
					</div>

					<Button className="w-full" type="submit" size="lg" disabled={isButtonDisabled}>
						<span>Sign in</span> <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
					</Button>
				</div>
			</form>
			<p className="mt-6 text-center leading-loose text-gray-500 lg:mt-8 lg:text-start">
				Don’t have an account?{" "}
				<Link href={routes.signUp} className="font-semibold text-gray-700 transition-colors hover:text-blue">
					Sign Up
				</Link>
			</p>
		</>
	);
}
