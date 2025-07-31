"use client";

import { useState } from "react";
import { ConnectAccountOnboarding, ConnectComponentsProvider } from "@stripe/react-connect-js";
import type { VendorOnboardingType } from "@/module/stripe-connect/types";
import { useStripeConnectInstance } from "@/module/stripe-connect/hooks/useStripeConnectInstance";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { Button } from "@/components/ui/button";

export default function VendorOnboarding({ accountId }: VendorOnboardingType) {
	const router = useRouter();
	const [onboardingStarted, setOnboardingStarted] = useState(false);
	const [onboardingExited, setOnboardingExited] = useState(false);
	const [connectedAccountId] = useState(accountId);
	const stripeConnectInstance = useStripeConnectInstance(connectedAccountId);

	return (
		<div>
			<Button
				variant="outline"
				onClick={() => router.push(routes.admin.stripeConnect.main)}
				className="flex items-center gap-2"
			>
				<IoMdArrowRoundBack className="h-4 w-4" />
				<span>Back</span>
			</Button>

			<div className="flex flex-col items-center justify-center gap-5">
				<h1>Vendor Onboarding</h1>
				{!onboardingStarted && (
					<Button className="rounded-md border border-white p-2" onClick={() => setOnboardingStarted(true)}>
						Start
					</Button>
				)}
				{onboardingStarted && stripeConnectInstance && (
					<ConnectComponentsProvider connectInstance={stripeConnectInstance}>
						<ConnectAccountOnboarding onExit={() => setOnboardingExited(true)} />
					</ConnectComponentsProvider>
				)}
				{(connectedAccountId || onboardingExited) && (
					<div className="dev-callout">
						{connectedAccountId && (
							<p>
								Your connected account ID is: <code className="bold">{connectedAccountId}</code>
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
