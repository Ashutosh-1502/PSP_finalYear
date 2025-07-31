import { NOT_APPLICABLE } from "@/module/stripe-connect/types";

const formatDate = (timestamp: string | number | undefined): string => {
	if (!timestamp) return NOT_APPLICABLE.N_A;
	const date = typeof timestamp === "string" ? new Date(timestamp) : new Date(timestamp * 1000);
	return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
};

export { formatDate };
