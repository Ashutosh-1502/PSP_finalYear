"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NOT_APPLICABLE, TRANSACTION_TYPE, type TransferredTransactionsTableType } from "@/module/stripe-connect/types";

export default function TransferredTransactionsTable({
	isSuccess,
	transactions,
	size,
}: TransferredTransactionsTableType) {
	// convert cents to dollar
	const formatCurrency = (amount: number) => `$${(amount / 100).toFixed(2)}`;

	const formatDate = (timestamp: number | undefined): string => {
		if (!timestamp) return NOT_APPLICABLE.N_A;
		const date = new Date(timestamp * 1000);
		return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
	};

	return (
		<Table className={`text-${size}`}>
			<TableHeader>
				<TableRow>
					<TableHead>Date</TableHead>
					<TableHead>Type</TableHead>
					<TableHead>Net</TableHead>
					<TableHead>Amount</TableHead>
					<TableHead>Currency</TableHead>
					<TableHead>Description</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{isSuccess && transactions?.data.length ? (
					transactions.data.map((transaction) => (
						<TableRow key={String(transaction.id)}>
							<TableCell>{formatDate(transaction.created)}</TableCell>
							<TableCell>{transaction.type}</TableCell>
							<TableCell>
								<span
									className={
										[TRANSACTION_TYPE.PAYOUT].includes(transaction.type as TRANSACTION_TYPE)
											? "text-red-light"
											: "text-green-light"
									}
								>
									{formatCurrency(
										[TRANSACTION_TYPE.PAYOUT].includes(transaction.type as TRANSACTION_TYPE)
											? -transaction.net
											: transaction.net
									)}
								</span>
							</TableCell>
							<TableCell>
								<span
									className={
										[TRANSACTION_TYPE.PAYOUT].includes(transaction.type as TRANSACTION_TYPE)
											? "text-red-light"
											: "text-green-light"
									}
								>
									{formatCurrency(
										[TRANSACTION_TYPE.PAYOUT].includes(transaction.type as TRANSACTION_TYPE)
											? -transaction.amount
											: transaction.amount
									)}
								</span>
							</TableCell>
							<TableCell>{transaction.currency.toUpperCase()}</TableCell>
							<TableCell>{transaction.description || transaction.source}</TableCell>
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell colSpan={6}>
							<div className="mt-3 text-center">No Data !!</div>
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
