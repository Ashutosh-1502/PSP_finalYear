"use client";

import { useEffect } from "react";
import { exportToCSV } from "@/lib/utils/export-to-csv";
import { type BillingHistory } from "@/module/subscription/types";

export default function BillingHistoryTable({ className, data }: { className?: string; data: BillingHistory[] }) {
	// Download function
	function handleExportData() {
		exportToCSV(data, "Title,Amount,Date,Status,Shared", `billing_history_${data.length}`);
	}

	useEffect(() => {
		console.log(data, "DATA");
	}, [data]);

	return <div className={className}></div>;
}
