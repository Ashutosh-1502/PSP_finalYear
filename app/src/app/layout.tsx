import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import cn from "@/lib/utils/class-names";
import Provider from "@/components/providers/query-client-provider";
import localFont from "next/font/local";

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
		<html lang="en" className={cn(avenirNext.variable)}>
			<body>
				<Provider>
					{children}
					<Toaster />
				</Provider>
			</body>
		</html>
	);
}
