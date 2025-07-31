"use client";

import Link from "next/link";
import logoImg from "@public/assets/svg/logo.svg";
import Image from "next/image";
import { PiAppleLogo } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";
import OrSeparation from "@/module/auth/components/or-separation";
import toast from "react-hot-toast";
import type { OAuthUserInterface, SignUpApiResponseType } from "@/types";
import { useRouter } from "next/navigation";
import { useAuthAPI } from "@/module/auth/hooks/useAuth";
import { createPopupWindow, getPopupConfig, redirectUser, setCookies } from "@/module/auth/utils/helpers";
import { type AxiosError } from "axios";
import { supabase } from "@/lib/services/supabase-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { type Session } from "@supabase/supabase-js";
import { OAUTH_PROVIDER, type OauthProviders } from "@/module/auth/types";
import { Button } from "@/components/ui/button";

export default function AuthWrapperOne({
	children,
	title,
	bannerTitle,
	bannerDescription,
	description,
	pageImage,
	isSocialLoginActive = false,
}: {
	children: React.ReactNode;
	title: React.ReactNode;
	description?: string;
	bannerTitle?: string;
	bannerDescription?: string;
	pageImage?: React.ReactNode;
	isSocialLoginActive?: boolean;
}) {
	const router = useRouter();
	const { useSocialRegisterMutation } = useAuthAPI();
	const [session, setSession] = useState<Session | null>(null);
	const authPopupRef = useRef<Window | null>(null);
	const intervalRef = useRef<NodeJS.Timeout>();

	const socialSignIn = async (provider: OauthProviders) => {
		if (authPopupRef.current?.closed === false) {
			authPopupRef.current.close();
			clearInterval(intervalRef.current);
		}

		try {
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider,
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
					skipBrowserRedirect: true,
					queryParams: {
						prompt: "select_account",
					},
				},
			});

			if (error) throw error;

			if (data.url) {
				const popupConfig = getPopupConfig();
				const popup = createPopupWindow(data.url, popupConfig);
				if (!popup) {
					toast.error("Popup blocked! Please enable popups for this site.");
					return;
				}

				authPopupRef.current = popup;

				intervalRef.current = setInterval(() => {
					if (!authPopupRef.current || authPopupRef.current.closed) {
						clearInterval(intervalRef.current);
						authPopupRef.current = null;
					}
				}, 500);
			}
		} catch (error) {
			toast.error("Sign up failed!", {
				duration: 2000,
			});
		}
	};

	const saveUserInfo = useCallback(
		(session: Session) => {
			const oauthUser: OAuthUserInterface = {
				accessToken: session?.access_token,
			};

			useSocialRegisterMutation.mutate(oauthUser, {
				onSuccess: (data) => {
					setCookies(data);
					toast.success("Signed up successfully.");
					const redirectRoute = redirectUser(data.user.roles);
					router.push(redirectRoute);
				},
				onError: (error) => {
					const axiosError = error as AxiosError<SignUpApiResponseType>;
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
		},
		[router, useSocialRegisterMutation]
	);

	useEffect(() => {
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
			if (authPopupRef.current?.closed === false) {
				authPopupRef.current.close();
			}
			authPopupRef.current = null;
		};
	}, []);

	useEffect(() => {
		let isMounted = true;
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_IN" && isMounted) setSession(session);
		});

		return () => {
			isMounted = false;
			subscription?.unsubscribe();
		};
	}, []);

	useEffect(() => {
		if (session && authPopupRef.current) {
			authPopupRef.current.close();
			authPopupRef.current = null;
			saveUserInfo(session);
		}
	}, [session, saveUserInfo]);

	return (
		<>
			<div className="min-h-screen justify-between gap-x-8 px-4 py-8 pt-10 md:pt-12 lg:flex lg:p-6 xl:gap-x-10 xl:p-7 2xl:p-10 2xl:pt-10 [&>div]:min-h-[calc(100vh-80px)]">
				<div className="relative flex w-full items-center justify-center lg:w-5/12 2xl:justify-end 2xl:pe-24">
					<div className=" w-full max-w-sm md:max-w-md lg:py-7 lg:ps-3 lg:pt-[3rem] 2xl:w-[630px] 2xl:max-w-none 2xl:ps-20 2xl:pt-7">
						<div className="mb-7 px-6 pt-3 text-center md:pt-0 lg:px-0 lg:text-start xl:mb-8 2xl:mb-10">
							<Link href={"/"} className="mb-6 inline-flex max-w-[168px] xl:mb-8">
								<h1 className="text-6xl font-bold">Okee</h1>
							</Link>
							<h2 className="mb-5 text-[26px] leading-snug md:text-3xl md:!leading-normal lg:mb-7 lg:pe-16 lg:text-[28px] xl:text-3xl 2xl:pe-8 2xl:text-4xl">
								{title}
							</h2>
							<p className=" leading-[1.85] text-gray-700 md:leading-loose lg:pe-8 2xl:pe-14">{description}</p>
						</div>

						{children}
					</div>
				</div>
				<div className="hidden w-7/12 items-center justify-center rounded-[20px] bg-gray-50 px-6 dark:bg-gray-100/40 lg:flex xl:justify-start 2xl:px-16">
					<div className="pb-8 pt-10 text-center xl:pt-16 2xl:block 2xl:w-[1063px]">
						<div className="mx-auto mb-10 max-w-sm pt-2 2xl:max-w-lg">
							<h2 className="mb-5 font-semibold !leading-normal lg:text-[26px] 2xl:px-10 2xl:text-[32px]">
								{bannerTitle}
							</h2>
							<p className="leading-[1.85] text-gray-700 md:leading-loose 2xl:px-6">{bannerDescription}</p>
						</div>
						{pageImage}
					</div>
				</div>
			</div>
		</>
	);
}
