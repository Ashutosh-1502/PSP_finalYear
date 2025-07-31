"use client";

import { Button } from "@/components/ui/button";
import AllVendorTransactions from "@/module/stripe-connect/components/all-vendor-transactions";
import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";

// This page displays all the transactions related to a particular vendor
// including the transactions that are pending, transferred and failed.
export default function AllVendorTransactionsPage() {
	const router = useRouter();

	return (
		<>
			<Button
				onClick={() => router.back()}
				variant="outline"
				className="mb-3 flex w-auto items-center gap-2 self-start"
			>
				<IoMdArrowRoundBack /> Back
			</Button>
			<AllVendorTransactions />
		</>
	);
}
