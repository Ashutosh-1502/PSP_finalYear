import { useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { PiCheckCircleFill, PiFire } from "react-icons/pi";

import { useSubscriptionAPI } from "@/module/subscription/hooks/useSubscription";
import { useProfileAPI } from "@/module/profile/hooks/useProfile";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CurrentPlans() {
	const queryClient = useQueryClient();
	const { useGetUserData } = useProfileAPI();
	const { data: user } = useGetUserData();
	const router = useRouter();
	const userId = user?._id;
	const { useGetSubscriptionPlans, useNewSubscription } = useSubscriptionAPI();
	const { data: plansOptions, isError, isLoading } = useGetSubscriptionPlans(userId as string);

	const [currentPlan, setCurrentPlan] = useState("");
	const stripe = useStripe();
	const [isSubscribing, setIsSubscribing] = useState(false); // State to track subscription process

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubscribing(true);
		const selectedPlan = plansOptions?.find((plan) => plan?.plans[0]?.nickname === currentPlan);

		if (!selectedPlan) {
			toast.error(<p>Selected plan not found!</p>, {
				duration: 2000,
			});
			setIsSubscribing(false);
			return;
		}
		if (!stripe) {
			toast.error(<p>Stripe has not loaded!</p>, {
				duration: 2000,
			});
			setIsSubscribing(false);
			return;
		}

		useNewSubscription.mutate(String(selectedPlan.plans[0]?.id), {
			onSuccess: (data) => {
				// client-secret is stored in reach-query's cache.
				queryClient.setQueryData(["stripeSubscriptionClientSecret"], data.data.clientSecret);
				router.push(`/checkout`);
				setIsSubscribing(false);
			},
			onError: () => {
				toast.error(<p>You have already subscribed to this plan!</p>, {
					duration: 2000,
				});
				setIsSubscribing(false);
			},
		});
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error occurred while fetching subscription plans</div>;
	}

	return (
		<div>
			<RadioGroup value={currentPlan} onValueChange={setCurrentPlan} className="flex flex-col gap-5">
				{plansOptions?.map((plan, index) => (
					<div
						key={`plan-${index}`}
						className="flex flex-col rounded-xl border border-gray-300 p-4 text-sm hover:cursor-pointer hover:border-gray-900"
					>
						<div className="flex items-center gap-3">
							<RadioGroupItem value={plan?.plans[0]?.nickname ?? ""} id={`plan-${index}`} className="h-5 w-5" />
							<Label htmlFor={`plan-${index}`} className="w-full">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
											<PiFire className="h-4 w-4 text-gray-900" />
										</div>
										<div>
											<p className="text-sm font-semibold text-gray-900">{plan.name}</p>
											<p className="text-xs text-gray-500">{plan.description}</p>
										</div>
									</div>
									<PiCheckCircleFill className="hidden h-6 w-6 text-gray-900" />
								</div>
							</Label>
						</div>
					</div>
				))}
			</RadioGroup>

			<form onSubmit={(e) => void handleSubmit(e)}>
				<Button
					type="submit"
					className="mx-2 my-5 dark:bg-gray-100 dark:text-black"
					disabled={!currentPlan || isSubscribing}
				>
					{isSubscribing ? "Subscribing..." : "Subscribe Now"}
				</Button>
			</form>
		</div>
	);
}
