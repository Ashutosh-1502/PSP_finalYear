import { routes } from "@/config/routes";
import { PiPlusBold } from "react-icons/pi";
import Link from "next/link";
import { accessCheck } from "@/lib/utils/access-check";
import Cookies from "js-cookie";
import { COOKIES } from "@/types";
import { Button } from "@/components/ui/button";

export default function AddCompanyButton() {
	const userType = Cookies.get(COOKIES.USER_TYPE) as string;
	const isAdmin = accessCheck(userType);
	return (
		<div className="mt-4 flex items-center gap-3 @lg:mt-0">
			{isAdmin && (
				<Link href={routes.superAdmin.dashboard} className="w-full @lg:w-auto">
					<Button className="bg-gray-900 text-white hover:bg-gray-900 hover:text-white">
						<PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
						Add Company
					</Button>
				</Link>
			)}
		</div>
	);
}
