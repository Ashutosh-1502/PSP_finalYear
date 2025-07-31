import { PromotionCodes } from "@/module/stripe-payment/components/promotion-codes";

type CouponDetailsPageProps = {
	params: {
		couponId: string;
	};
};

// This page contains `promotion codes` related to a particular coupon.
export default function CouponDetailsPage({ params }: CouponDetailsPageProps) {
	return <PromotionCodes couponId={params.couponId} />;
}
