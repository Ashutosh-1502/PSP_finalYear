"use client";

import { useEffect, useState, type RefObject } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useProfileAPI } from "@/module/profile/hooks/useProfile";
import Cookies from "js-cookie";
import { useCompanyAPI } from "@/module/company/hooks/useCompany";
import { COOKIES } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

dayjs.extend(relativeTime);

function NotificationsList() {
	const { useGetUserData, useNotifications } = useProfileAPI();
	const { data: user } = useGetUserData();
	const userId = user?._id;
	let { data: notifications } = useNotifications(userId as string);

	// below values are used to load content dynamically when super-admin visits admin route
	const isAdminPath = Boolean(Cookies.get(COOKIES.IS_ADMIN_PATH));
	const companyRef = Cookies.get(COOKIES.COMPANY_REF) || null;
	const { useGetOneCompanyData } = useCompanyAPI();
	const { data: companyData } = useGetOneCompanyData(companyRef, user?.roles);
	const { data: adminNotifications } = useNotifications(companyData?.userRef._id as string);

	if (isAdminPath) {
		notifications = adminNotifications;
	}

	return (
		<>
			<div className="w-[320px] text-left sm:w-[360px] 2xl:w-[420px] rtl:text-right">
				<div className="mb-3 flex items-center justify-between ps-6">
					<h5>Notifications</h5>
					<div className="flex items-center space-x-2">
						<Checkbox id="mark-read" />
						<label
							htmlFor="mark-read"
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Mark All As Read
						</label>
					</div>
				</div>
				<div className="grid cursor-pointer grid-cols-1 gap-1 ps-4">
					{notifications && notifications.length > 0 ? (
						<div className="grid cursor-pointer grid-cols-1 gap-1 ps-4">
							{notifications.map((item) => (
								<div
									key={item._id}
									className="group grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-md px-2 py-2 pe-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-50"
								>
									<p>{item.message}</p>
								</div>
							))}
						</div>
					) : (
						<p className="text-center">No notifications available!</p>
					)}
				</div>
				<Link href={"#"} className="-me-6 block px-6 pb-0.5 pt-3 text-center hover:underline">
					View All Activity
				</Link>
			</div>
		</>
	);
}

export default function NotificationDropdown({ children }: { children: JSX.Element & { ref?: RefObject<string> } }) {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(max-width: 480px)");
		const handler = (event: MediaQueryListEvent) => setIsMobile(event.matches);

		setIsMobile(mediaQuery.matches);
		mediaQuery.addEventListener("change", handler);
		return () => mediaQuery.removeEventListener("change", handler);
	}, []);

	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent side="bottom" align={isMobile ? "center" : "end"}>
				<NotificationsList />
			</PopoverContent>
		</Popover>
	);
}
