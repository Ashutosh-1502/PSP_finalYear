"use client";
import cn from "@/lib/utils/class-names";
import { ROLES, type USER_TYPE } from "@/types";
import okee_logo from "@public/assets/svg/okee-logo.svg";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsBoxSeam } from "react-icons/bs";
import { RxDashboard } from "react-icons/rx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { LinksProps, MenuItem, SidebarMenuProps } from "@/module/profile/types";
import { routes } from "@/config/routes";
import { COOKIES } from "@/types";
import { clearCookies } from "@/module/auth/utils/helpers";
import LogoutFooter from "@/components/common/logout-footer/logout-footer";

export const MenuItems: Record<USER_TYPE, MenuItem[]> = {
	USER: [
		{
			href: routes.user.dashboard,
			name: "Dashboard",
			Icon: <RxDashboard />,
		},
		{
			href: "",
			name: "Section 2",
			Icon: <BsBoxSeam />,
		},
		{
			href: "",
			name: "Section 3",
			Icon: <Image src="/assets/svg/connect.svg" alt="stripe-connect" width={15} height={15} />,
		},
		{
			href: "",
			name: "Section 4",
			Icon: <Image src="/assets/svg/payment.svg" alt="stripe-payment" width={15} height={15} />,
		},
	],
	ADMIN: [
		{
			href: routes.admin.dashboard,
			name: "Dashboard",
			Icon: <RxDashboard />,
		},
		{
			href: "",
			name: "Users",
			Icon: <Image src="/assets/svg/user-icon.svg" alt="stripe-payment" width={15} height={15} />,
		},
		{
			href: "",
			name: "Section 3",
			Icon: <Image src="/assets/svg/okee-rewards.svg" alt="okee-rewards" width={15} height={15} />,
		},
	]
};

const Navbar: React.FC<ChildProps> = ({ children }) => {
	return <nav className="flex flex-col gap-5">{children}</nav>;
};

const MenuLink: React.FC<LinksProps> = ({ className, menuItem, ...rest }) => {
	const router = useRouter();
	const path = usePathname(); // current path

	const isActive = path === menuItem.href;

	const handleLogOut = () => {
		if (menuItem.name === "Log out") {
			clearCookies();
			router.push(routes.signIn);
		} else {
			router.push(menuItem.href);
		}
	};
	return (
		<Link
			href={menuItem.href}
			className={cn(
				"flex items-center gap-3 px-2 py-1 text-sm transition-colors",
				isActive ? "font-semibold text-black" : "text-gray-600 hover:text-black",
				className
			)}
			onClick={handleLogOut}
			{...rest}
		>
			<div
				className={cn(
					"flex h-7 w-7 items-center justify-center rounded-md",
					isActive ? "bg-white text-white" : "text-inherit bg-transparent"
				)}
			>
				{menuItem.Icon}
			</div>
			<span>{menuItem.name}</span>
		</Link>
	);
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({ role, className }) => {
	// Menu Items based on user role
	const searchParams = useSearchParams();
	const companyRefInQuery = searchParams.get("companyRef");
	const userType = Cookies.get(COOKIES.USER_TYPE);
	const menuItems = MenuItems[role];
	const redirectURL = menuItems && menuItems[0]?.href;

	if (companyRefInQuery) {
		Cookies.set(COOKIES.COMPANY_REF, companyRefInQuery, { expires: 1 });
		Cookies.set(COOKIES.IS_ADMIN_PATH, "true", { expires: 1 });
	}

	return (
		<aside
			className={cn(
				"fixed bottom-0 start-0 z-50 h-full w-[250px] border-e-2 border-gray-100 bg-white dark:bg-gray-100/50 2xl:w-72",
				className
			)}
		>
			<div className="sticky top-0 z-40 bg-gray-0/10 px-6 pb-5 pt-5 dark:bg-gray-100/5 2xl:px-8 2xl:pt-6">
				<Link href={(redirectURL as string) || ""}>
					<h1 className="text-3xl font-bold">PSP</h1>
				</Link>
			</div>
			<hr />
			<div className="section-p6 sticky top-[80px] flex h-[calc(100vh-80px)] flex-col justify-between pb-5 pl-5 xl:w-[250px]">
				<Navbar>{menuItems && menuItems.map((item) => <MenuLink menuItem={item} key={item.name} />)}</Navbar>
				{userType !== ROLES.SYSTEM && (
					<Navbar>
						<div className="-ml-5">
							<hr />
						</div>
						<LogoutFooter />
					</Navbar>
				)}
			</div>
		</aside>
	);
};

export default SidebarMenu;
