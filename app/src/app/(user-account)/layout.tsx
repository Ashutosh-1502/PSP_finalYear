"use client";

import CheckActiveStatus from "@/lib/utils/check-active-user";
import SidebarMenu from "@/module/profile/components/sidebar-menu";
import { COOKIES, type USER_TYPE } from "@/types/index";
import Cookies from "js-cookie";
import { Suspense } from "react";

export default function Layout({ children }: ChildProps) {
	const userType = Cookies.get(COOKIES.USER_TYPE) as USER_TYPE;

	return (
		<>
			<main className="flex min-h-screen flex-grow">
				<CheckActiveStatus />
				<Suspense>
					<SidebarMenu role={userType} className="fixed hidden dark:bg-gray-50 xl:block" />
				</Suspense>
				<div className="flex w-full flex-col xl:ms-[270px] xl:w-[calc(100%-270px)] 2xl:ms-72 2xl:w-[calc(100%-288px)]">
					<div className="flex flex-grow flex-col px-4 pb-6 pt-2 @container md:px-5 lg:px-6 lg:pb-8 3xl:px-8 3xl:pt-4 4xl:px-10 4xl:pb-9">
						{children}
					</div>
				</div>
			</main>
		</>
	);
}
