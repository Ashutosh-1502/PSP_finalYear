"use client";

import { useEffect } from "react";
import { PiDownloadSimpleBold } from "react-icons/pi";
import BillingHistoryTable from "@/module/subscription/templates/account-settings/billing-history/table";
import { exportToCSV } from "@/lib/utils/export-to-csv";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { MdOutlineCardMembership } from "react-icons/md";
import { useSubscriptionAPI } from "@/module/subscription/hooks/useSubscription";
import { useProfileAPI } from "@/module/profile/hooks/useProfile";
import { CancelSubscriptionAlert } from "@/module/subscription/components/cancel-subscription-alert";
import { ROLES, STATUS } from "@/types";
import { hasActivePlan } from "@/module/subscription/utils/active-plan-checker";
import CurrentPlans from "@/module/subscription/components/current-plans";
import { Button } from "@/components/ui/button";

export default function BillingSettingsView() {
	const { useGetUserData } = useProfileAPI();
	const { data: user, refetch: refetchUserData } = useGetUserData();
	const userId = user?._id;
	const userType = user?.roles;
	const { useGetSubscriptions, useCancelSubscription } = useSubscriptionAPI();
	const {
		data: allSubscriptionPlans,
		isError,
		isLoading,
		refetch: refetchSubscriptionData,
	} = useGetSubscriptions(userId as string);
	const { activePlan, activePlanStatus } = hasActivePlan(allSubscriptionPlans);

	useEffect(() => {
		void refetchSubscriptionData();
	}, [useGetSubscriptions]);

	function handleExportData() {
		if (allSubscriptionPlans) {
			exportToCSV(allSubscriptionPlans, "Title,Amount,Date,Status,Shared", "billing_history");
		}
	}
	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error occurred while fetching subscription plans</div>;
	}

	const handleCancelSubscription = (stripeSubscriptionId: string) => {
		useCancelSubscription.mutate(stripeSubscriptionId, {
			onSuccess: () => {
				toast.success("Subscription cancelled successfully!");
				void refetchUserData();
			},
			onError: () => {
				toast.error("Subscription cancellation failed!");
			},
		});
	};

	return (
		<>
			<div>
				<div>
					<div>
						{activePlan ? (
							<div>
								<p>Plan Name: {activePlan?.planName}</p>
								<p> Plan Price: ${activePlan?.price / 100}</p>
								<p>
									Plan Status: Your plan is {activePlan.status} till the{" "}
									{dayjs.unix(activePlan?.currentPeriodEnds).format("DD MMM YYYY")}.
								</p>
								<br />
								{userType !== ROLES.SUPER_ADMIN &&
									!activePlan.subscriptionCancellationRequested &&
									activePlan.status === STATUS.ACTIVE && (
										<CancelSubscriptionAlert
											onCancelSubscription={() => handleCancelSubscription(activePlan.stripeSubscriptionId)}
										/>
									)}
								{activePlan.subscriptionCancellationRequested && activePlan.status === STATUS.ACTIVE && (
									<div style={{ color: "red" }}>
										You have successfully canceled your plan. Your plan will be canceled once your current subscripiton
										period is over.
									</div>
								)}
							</div>
						) : (
							<div className="rounded-md border border-red-light bg-red-lighter p-4">
								<div className="flex items-center justify-between gap-3">
									<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
										<MdOutlineCardMembership className="h-4 w-4 text-red-light" />
									</div>
									<div className="flex-grow">
										<p className="text-sm font-medium text-red-light">You do not have any active Subscription Plans</p>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			{!activePlanStatus && userType !== ROLES.SUPER_ADMIN && (
				<div>
					<div>
						<CurrentPlans />
					</div>
				</div>
			)}
			{userType !== ROLES.SUPER_ADMIN && (
				<div className="mt-8 xl:mt-10">
					<div className="mb-5 flex items-center justify-between">
						<p className="text-2xl font-semibold">Billing History</p>
						<Button onClick={() => handleExportData()} className="dark:bg-gray-200 dark:text-white">
							<PiDownloadSimpleBold className="me-2 h-4 w-4" />
							Download
						</Button>
					</div>
					<BillingHistoryTable
						data={
							allSubscriptionPlans?.map((plan) => ({
								id: plan._id,
								planId: plan.planId,
								status: plan.status,
								currentPeriodEnds: plan.currentPeriodEnds,
								currentPeriodStarts: plan.currentPeriodStarts,
								planName: plan.planName,
								price: plan.price,
							})) || []
						}
					/>
				</div>
			)}
		</>
	);
}
