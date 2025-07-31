import SignInForm from "@/module/auth/templates/sign-in-form";
import AuthWrapper from "@/module/auth/components/auth-wrapper";
import Image from "next/image";
import UnderlineShape from "@/components/shape/underline";

export default function SignIn() {
	return (
		<AuthWrapper
			title={
				<>
					Welcome back! Please{" "}
					<span className="relative inline-block">
						Sign in to
						<UnderlineShape className="absolute -bottom-2 start-0 h-2.5 w-24 text-blue md:w-28 xl:-bottom-1.5 xl:w-36" />
					</span>{" "}
					continue.
				</>
			}
			description="By signing in, you will gain access to Okee rewards and users, where you can manage Kids rewards and users"
			bannerTitle="The simplest way to manage your Okee rewards and user."
			bannerDescription=""
			isSocialLoginActive={true}
			pageImage={
				<div className="relative mx-auto aspect-[4/3.37] w-[500px] xl:w-[620px] 2xl:w-[820px]">
					<Image
						src={"https://s3.amazonaws.com/redqteam.com/isomorphic-furyroad/public/auth/sign-up.webp"}
						alt="Sign Up Thumbnail"
						fill
						priority
						sizes="(max-width: 768px) 100vw"
						className="object-cover"
					/>
				</div>
			}
		>
			<SignInForm />
		</AuthWrapper>
	);
}
