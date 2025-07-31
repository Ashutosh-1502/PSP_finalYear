import VendorOnboarding from "@/module/stripe-connect/components/vendor-onboarding";

type ParamsType = {
	accountId: string;
};

export default function VendorOnboardingPage({ params }: { params: ParamsType }) {
	return <VendorOnboarding accountId={params.accountId} />;
}
