import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import cn from "@/lib/utils/class-names";
import Provider from "@/components/providers/query-client-provider";
import localFont from "next/font/local";
import FullScreenLoader from "@/components/common/loader/fullScreenLoader";
import { LoaderProvider } from "@/components/common/loader/loaderContext";
import AnimationWrapper from "@/components/common/animationWrapper/animationWrapper";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const avenirNext = localFont({ src: "../../public/fonts/AvenirNext-Regular.woff2", variable: "--font-avenir-next" });

export const metadata: Metadata = {
	title: "Boilerplate",
	description: "Next Boilerplate app",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({ children }: ChildProps) {
	return (
		<html lang="en" className={montserrat.variable}>
			<body>
				<Provider>
					<LoaderProvider>
						<AnimationWrapper>
						{children}
						</AnimationWrapper>
						<Toaster />
						<FullScreenLoader />
					</LoaderProvider>
				</Provider>
			</body>
		</html>
	);
}
