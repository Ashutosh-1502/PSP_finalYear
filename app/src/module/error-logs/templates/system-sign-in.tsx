"use client";

import { routes } from "@/config/routes";
import { PiArrowRightBold } from "react-icons/pi";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { UserLoginDataType } from "@/module/error-logs/types";
import { useErrorLogsAPI } from "@/module/error-logs/hooks/useErrorLogs";
import { clearCookies, setCookies } from "@/module/auth/utils/helpers";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SystemSignIn() {
	const [userData, setUserData] = useState<UserLoginDataType>({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);

	const handlePasswordVisibility = () => setShowPassword(!showPassword);
	const router = useRouter();
	const { usePostLoginMutation } = useErrorLogsAPI();
	const isButtonDisabled = !Object.values(userData).every(Boolean);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		usePostLoginMutation.mutate(userData, {
			onSuccess: (data) => {
				const {
					user: { roles },
				} = data;
				clearCookies();
				setCookies({ user: { roles } });
				toast.success(<p>Log In Successful!</p>, {
					duration: 2000,
				});
				router.push(routes.system.genericErrorLogs);
			},
			onError: () => {
				toast.error(<p>Something went wrong!</p>, {
					duration: 2000,
				});
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
		<main>
			<div className="m-auto flex min-h-screen w-[30%] flex-col items-center justify-center">
				<h1 className="mb-5">System</h1>
				<form onSubmit={(e) => handleSubmit(e)} className="w-full">
					<div className="space-y-5">
						<div>
							<Label htmlFor="email">Email</Label>
							<Input
								type="email"
								placeholder="Enter your email"
								name="email"
								value={userData.email}
								onChange={handleInputChange}
							/>
						</div>

						<Label htmlFor="password">Password</Label>
						<div className="relative">
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
								className="absolute end-1 top-1/2 -translate-y-1/2"
								aria-label={showPassword ? "Hide password" : "Show password"}
								onClick={handlePasswordVisibility}
								variant="ghost"
							>
								{showPassword ? <IoMdEyeOff /> : <IoMdEye />}
							</Button>
						</div>
						<Button className="w-full" type="submit" size="lg" disabled={isButtonDisabled}>
							<span>Sign in</span> <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
						</Button>
					</div>
				</form>
			</div>
		</main>
	);
}
