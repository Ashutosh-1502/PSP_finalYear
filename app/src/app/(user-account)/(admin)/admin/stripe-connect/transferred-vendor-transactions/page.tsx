"use client";

import { Button } from "@/components/ui/button";
import TransferredVendorTransactions from "@/module/stripe-connect/components/transferred-vendor-transactions";
import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";

// This page displays all the transactions that have been transferred to the vendor's stripe account
export default function TransferredVendorTransactionsPage() {
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
			<TransferredVendorTransactions />
		</>
	);
}
