import CreatePromotionCode from "@/module/stripe-payment/components/promotion-code-components/create-promotion-code";

type PromotionCodePageProps = {
	params: {
		couponId: string;
	};
};

export default function CreatePromotionCodePage({ params }: PromotionCodePageProps) {
	return <CreatePromotionCode couponId={params.couponId} />;
}
