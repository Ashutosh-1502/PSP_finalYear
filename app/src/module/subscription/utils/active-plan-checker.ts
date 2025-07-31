import type { HasActivePlanResult, SubscriptionType } from "@/module/subscription/types";
import { STATUS } from "@/types";

export function hasActivePlan(plans: SubscriptionType[] | undefined): HasActivePlanResult {
	if (!plans) {
		return { activePlan: null, activePlanStatus: false };
	}

	let activePlan = null;
	let activePlanStatus = false;
	for (const value of plans) {
		if (value.status === STATUS.ACTIVE) {
			activePlan = value;
			activePlanStatus = true;
			return { activePlan, activePlanStatus };
		}
	}

	return { activePlan, activePlanStatus };
}
