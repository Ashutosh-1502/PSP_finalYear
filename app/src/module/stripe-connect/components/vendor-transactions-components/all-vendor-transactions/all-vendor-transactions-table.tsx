"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RECOVERY_STATUS, REFUND_STATUS, TIER, type AllTransactionsTableType } from "@/module/stripe-connect/types";
import { formatDate } from "@/module/stripe-connect/utils/helpers";

export default function AllTransactionsTable({ isSuccess, transactions, size, vendorTier }: AllTransactionsTableType) {
	const recoveryStatusInfo = (recoveryStatus: RECOVERY_STATUS) => {
		switch (recoveryStatus) {
			case RECOVERY_STATUS.NOT_APPLICABLE: {
				return `Not used for recovery.`;
			}
			case RECOVERY_STATUS.RECOVERED: {
				return `Entire amount used to recover dues.`;
			}
			case RECOVERY_STATUS.PARTIALLY_RECOVERED: {
				return `Partial amount used to recover dues.`;
			}
		}
	};

	return (
		<Table className={`text-${size}`}>
			<TableHeader>
				<TableRow>
					<TableHead>Date</TableHead>
					<TableHead>Amount</TableHead>
					<TableHead>Payment Status</TableHead>
					<TableHead>Refunded</TableHead>
					<TableHead>Transfer Status</TableHead>
					{vendorTier === TIER.TIER1 && <TableHead>Amount Recovery Status</TableHead>}
				</TableRow>
			</TableHeader>
			<TableBody>
				{isSuccess && transactions?.length ? (
					transactions.map((transaction) => (
						<TableRow key={String(transaction._id)}>
							<TableCell>{formatDate(transaction.orderPlacedAt)}</TableCell>
							<TableCell>${transaction.amountPaid}</TableCell>
							<TableCell>{transaction.paymentStatus}</TableCell>
							<TableCell>{transaction.refunded === true ? REFUND_STATUS.YES : REFUND_STATUS.NO}</TableCell>
							<TableCell>{transaction.transferStatus}</TableCell>
							{vendorTier === TIER.TIER1 && (
								<TableCell>{recoveryStatusInfo(transaction.amountRecoveryStatus)}</TableCell>
							)}
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell colSpan={vendorTier === TIER.TIER1 ? 6 : 5}>
							<div className="mt-3 text-center">No Data !!</div>
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
