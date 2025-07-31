import { type SortConfigType } from "@/types";

export interface CardData {
	id?: string;
	title: string;
	value: string;
	description: string;
}

export interface BillingHistory {
	id: string;
	planId: string;
	status: string;
	currentPeriodEnds: number;
	currentPeriodStarts: number;
	planName: string;
	price: number;
}

export type Columns = {
	data: BillingHistory[];
	sortConfig?: SortConfigType;
	handleSelectAll: () => void;
	checkedItems: string[];
	onHeaderCellClick: (value: string) => void;
	onChecked?: (id: string) => void;
};

export interface SubscriptionType {
	_id: string;
	planId: string;
	planName: string;
	status: string;
	currentPeriodEnds: number;
	currentPeriodStarts: number;
	price: number;
	stripeSubscriptionId: string;
	subscriptionCancellationRequested: boolean;
	subscriptionPlanRef: {
		currency?: string;
		description?: string;
		price?: number;
		priceId?: string;
		type?: string;
		title?: string;
	};
}

export interface SubscriptionPlanType {
	name?: string;
	description?: string;
	image?: string;
	productId?: string;
	plans: {
		id?: string;
		nickname?: string;
	}[];
}
[];

export interface SubscribeApiResponse {
	success?: boolean;
	message?: string;
	data: {
		stripeCustomerId: string;
		subscriptionId: string;
		clientSecret: string;
	};
}

export type CancelSubscriptionAlertProps = {
	onCancelSubscription: () => void;
};

export interface HasActivePlanResult {
	activePlan: SubscriptionType | null;
	activePlanStatus: boolean;
}
