"use client";

import { Button } from "@/components/ui/button";
import cn from "@/lib/utils/class-names";
import React, { useState } from "react";
import OtpInput from "react-otp-input";

export default function OtpForm() {
	const [otp, setOtp] = useState("");
	return (
		<form>
			<div className="space-y-10">
				<OtpInput
					value={otp}
					onChange={setOtp}
					numInputs={4}
					renderSeparator={<span>-</span>}
					renderInput={(props) => <input {...props} />}
					containerStyle={cn("otp-input space-x-4")}
				/>
				<Button className="w-full text-base font-medium" type="submit" size="lg" color="info">
					Verify OTP
				</Button>
				<div className="">
					<Button
						className="-mt-4 w-full p-0 text-base font-medium text-primary underline lg:inline-flex lg:w-auto"
						type="submit"
						variant="default"
					>
						Resend OTP
					</Button>
				</div>
			</div>
		</form>
	);
}
