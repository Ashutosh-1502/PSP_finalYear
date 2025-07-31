"use client";

import { useStripeConnectAPI } from "@/module/stripe-connect/hooks/useStripeConnect";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { useState } from "react";
import CreateProductModal from "@/module/stripe-connect/components/create-product-modal";
import TransferredTransactionsTable from "@/module/stripe-connect/components/vendor-transactions-components/transferred-transactions/transferred-transactions-table";
import Link from "next/link";
import AllTransactionsTable from "@/module/stripe-connect/components/vendor-transactions-components/all-vendor-transactions/all-vendor-transactions-table";
import {
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
	Area,
	AreaChart,
} from "recharts";
import { TIER, type InfoIconType } from "@/module/stripe-connect/types";
import { EarlyTransferAlert } from "@/module/stripe-connect/components/early-transfer-alert";
import { Button } from "@/components/ui/button";
import { Info, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function VendorStripeConnect() {
	const router = useRouter();
	const [onboardingRedirect, setOnboardingRedirect] = useState(false);
	const [dashboardRedirect, setDashboardRedirect] = useState(false);
	const [transferInProgress, setTransferInProgress] = useState(false);
	const {
		usePostAccountMutation,
		usePostDashboardLinkMutation,
		usePostEarlyTransferMutation,
		useGetVendorQuery,
		useGetAllTransactionsQuery,
		useGetAllTransferredTransactionsQuery,
		useGetEarningDetailsQuery,
		useGetMonthlyEarningsQuery,
	} = useStripeConnectAPI();
	const { data: vendorData, isSuccess: vendorDataSuccess, refetch: refetchVendorData } = useGetVendorQuery();
	const {
		data: transferredTransactions,
		isSuccess: transferredTransactionsSuccess,
		refetch: refetchTransferredTransactions,
	} = useGetAllTransferredTransactionsQuery({
		limit: 3,
		startingAfter: undefined,
		endingBefore: undefined,
		page: 1,
	});
	const {
		data: allTransactions,
		isSuccess: allTransactionsSuccess,
		refetch: refetchAllTransactions,
	} = useGetAllTransactionsQuery({
		page: 1,
		pageSize: 3,
	});
	const { data: earningDetails, refetch: refetchEarningDetails } = useGetEarningDetailsQuery();
	const { data: monthlyEarningDetails, refetch: refetchMonthlyEarningDetails } = useGetMonthlyEarningsQuery();

	const handleCreate = () => {
		setOnboardingRedirect(true);
		usePostAccountMutation.mutate(undefined, {
			onSuccess: (data) => {
				toast.success(<p>Vendor Id created successfully!</p>, {
					duration: 2000,
				});
				const accountId = data.data.accountId;
				setOnboardingRedirect(false);
				router.push(routes.admin.stripeConnect.accountSession(accountId));
			},
			onError: () => {
				toast.error(<p>Something went wrong!</p>, {
					duration: 2000,
				});
				setOnboardingRedirect(false);
			},
		});
	};

	const handleRedirect = () => {
		setDashboardRedirect(true);
		usePostDashboardLinkMutation.mutate(undefined, {
			onSuccess: (data) => {
				const dashboardUrl = data.url;
				setDashboardRedirect(false);
				window.open(dashboardUrl, "_blank");
			},
			onError: () => {
				toast.error(<p>Complete the onbaording process to visit dashboard!</p>, {
					duration: 2000,
				});
				setDashboardRedirect(false);
			},
		});
	};

	const handleEarlyTransfer = () => {
		setTransferInProgress(true);
		usePostEarlyTransferMutation.mutate(undefined, {
			onSuccess: () => {
				void refetchVendorData();
				void refetchAllTransactions();
				void refetchTransferredTransactions();
				void refetchEarningDetails();
				void refetchMonthlyEarningDetails();
				setTransferInProgress(false);
			},
			onError: () => {
				toast.error(<p>Error processing the transfers !</p>, {
					duration: 2000,
				});
				setTransferInProgress(false);
			},
		});
	};

	const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const formattedData =
		monthlyEarningDetails &&
		monthlyEarningDetails.map((monthlyEarningDetail) => ({
			name: `${monthNames[monthlyEarningDetail.month - 1] as string} ${monthlyEarningDetail.year}`,
			totalEarnings: monthlyEarningDetail.totalEarnings,
		}));

	return (
		<>
			{/* Title and buttons */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="mb-1">Stripe Connect</h1>
					<p className="text-md font-bold text-gray-400">Platform to connect Sellers and Buyers</p>
				</div>
				<div className="flex gap-3">
					<Button disabled={!vendorData?.stripeAccountId} onClick={handleRedirect}>
						{dashboardRedirect ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								<span>Express Dashboard</span>
							</>
						) : (
							"Express Dashboard"
						)}
					</Button>

					<Button onClick={handleCreate}>
						{onboardingRedirect ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								<span>Vendor Onboarding</span>
							</>
						) : (
							"Vendor Onboarding"
						)}
					</Button>
					<CreateProductModal stripeAccountId={vendorData?.stripeAccountId} />
				</div>
			</div>

			<div className="mt-3">
				{vendorData?.stripeAccountId === undefined ? (
					<h3 className="mt-5 text-gray-400">Complete the onboarding process to see the dashboard!</h3>
				) : (
					<div>
						{/* Area Chart */}
						<div className="mt-5 flex gap-3">
							<div className="w-[70%]">
								{formattedData && formattedData.length > 0 ? (
									<ResponsiveContainer width="100%" height={300}>
										<AreaChart data={formattedData} margin={{ right: 30, left: 0 }}>
											<defs>
												<linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
													<stop offset="5%" stopColor="gray" stopOpacity={0.8} />
													<stop offset="95%" stopColor="gray" stopOpacity={0.1} />
												</linearGradient>
											</defs>
											<XAxis dataKey="name" />
											<YAxis />
											<CartesianGrid strokeDasharray="3 3" />
											<RechartsTooltip />
											<Area
												type="monotone"
												dataKey="totalEarnings"
												stroke="gray"
												fillOpacity={1}
												strokeWidth={1}
												fill="url(#colorGradient)"
											/>
										</AreaChart>
									</ResponsiveContainer>
								) : (
									<div className="flex h-full w-full items-center justify-center border border-dashed">
										No transactions done yet !
									</div>
								)}
							</div>

							{/* Earnings details card and Early transfer card*/}
							<div className="flex w-[30%] flex-col gap-5">
								{/* Earnings details card */}
								<div className="flex flex-col gap-1 rounded-md border border-dashed p-2">
									<h3>Earning Details</h3>
									<div className="flex justify-between">
										<div className="flex items-center justify-center gap-1">
											<p>Total Earnings</p>
											<InfoIcon label="Total amount earned since the creation of account." />
										</div>
										<p>${earningDetails?.totalEarning} USD</p>
									</div>
									<div className="flex justify-between">
										<div className="flex items-center justify-center gap-1">
											<p>Pending transfer</p> <InfoIcon label="Amount that will be transferred after lock-in period." />
										</div>
										<p>${earningDetails?.totalPending} USD</p>
									</div>
									<div className="flex justify-between">
										<div className="flex items-center justify-center gap-1">
											<p>Transferred </p> <InfoIcon label="Amount that is transferred to the vendor stripe account." />
										</div>
										<p>${earningDetails?.totalTransferred} USD</p>
									</div>
								</div>

								{/* Early transfer card */}
								{vendorDataSuccess && vendorData.tier === TIER.TIER1 && (
									<div className="flex flex-col gap-1 rounded-md border border-dashed p-2">
										<h3>Early Transfer</h3>
										<div className="flex justify-between">
											<div className="flex items-center justify-center gap-1">
												<p>Amount Owed</p>
												<InfoIcon label="Total amount owed to the platform." />
											</div>
											<p>${vendorData.amountOwedToPlatform} USD</p>
										</div>
										<EarlyTransferAlert
											vendorData={vendorData}
											handleEarlyTransfer={handleEarlyTransfer}
											transferInProgress={transferInProgress}
											earningDetails={earningDetails}
										/>
									</div>
								)}
							</div>
						</div>

						{/* Vendor transactions (all) */}
						<div className="mt-5 w-[70%]">
							<div>
								<div className="flex items-center justify-between">
									<h3 className="mb-3 flex items-center justify-center gap-1">
										Vendor Transactions <span className="text-sm italic text-gray-400">(all) </span>
										<InfoIcon label="Platform transactions associated with a particular vendor." />
									</h3>
									<Link href={routes.admin.stripeConnect.allVendorTransactions}>
										<p className="text-sm text-gray-400">See All</p>
									</Link>
								</div>
								<AllTransactionsTable
									isSuccess={allTransactionsSuccess}
									transactions={allTransactions && allTransactions[0]?.items}
									size="sm"
									vendorTier={vendorData.tier}
								/>
							</div>

							{/* Vendor transactions (transferred) */}
							<div className="mt-7">
								<div className="flex items-center justify-between">
									<h3 className="mb-3 flex items-center justify-center gap-1">
										Vendor Transactions <span className="text-sm italic text-gray-400">(Transferred)</span>
										<InfoIcon label="Transactions from the vendor's stripe account." />
									</h3>
									<Link href={routes.admin.stripeConnect.transferredVendorTransactions}>
										<p className="text-sm text-gray-400">See All</p>
									</Link>
								</div>
								<TransferredTransactionsTable
									isSuccess={transferredTransactionsSuccess}
									transactions={transferredTransactions}
									size="sm"
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}

function InfoIcon({ label }: InfoIconType) {
	return (
		<TooltipProvider delayDuration={100}>
			<Tooltip>
				<TooltipTrigger asChild>
					<span className="inline-flex items-center justify-center">
						<Info className="h-4 w-4 text-gray-300" />
					</span>
				</TooltipTrigger>
				<TooltipContent side="top">
					<p>{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
