"use client";

import { useState } from "react";
import Image from "next/image";
import { RxHamburgerMenu } from "react-icons/rx";
import MobileMenuDrawer from "@/module/profile/components/mobile-sidebar-menu";
import { Button } from "@/components/ui/button";

function HeaderMenu({ title }: { title: string }) {
	return (
		<div className="flex w-full items-center justify-between">
			<div className="items-centre mb-6 flex justify-between">
				<h1 className="text-3xl font-semibold">{title}</h1>
			</div>
			<div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
				<Image src="/assets/svg/profile-icon.svg" alt="stripe-connect" width={25} height={25} />
			</div>
		</div>
	);
}

export default function Header({ title }: { title: string }) {
	const [drawerState, setDrawerState] = useState(false);

	return (
		<header className="sticky top-0 z-50 flex items-center bg-gray-0/80 py-4 backdrop-blur-xl dark:bg-gray-50/50 2xl:py-5">
			<div className="flex w-full items-center">
				<HeaderMenu title={title} />
				<div className="block px-4 md:hidden">
					<Button
						className="flex h-8 w-[42px] items-center justify-center rounded-md bg-gray-800 text-white"
						onClick={() => setDrawerState(true)}
					>
						<RxHamburgerMenu size={21} color="#fff" />
					</Button>
				</div>
				<div className="px-4">
					<MobileMenuDrawer size="sm" placement="left" isOpen={drawerState} handleClose={() => setDrawerState(false)} />
				</div>
			</div>
		</header>
	);
}
