import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { RewardDialogProps } from "@/module/rewards/types/index";

export default function RewardDialog({ id, isSuccessOpen, children, setIsSuccessOpen }: RewardDialogProps) {
	const actionText = id ? "Edited" : "Created";

	return (
		<>
			{children}
			<Dialog open={isSuccessOpen}>
				<DialogContent className="max-w-md rounded-2xl text-center">
					<DialogHeader>
						<DialogTitle className="text-xl font-semibold">{`Reward ${actionText} Successfully`}</DialogTitle>
						<DialogDescription className="pt-2 text-base text-gray-600">
							We have successfully {actionText} reward and this will now be reflected on the user side.
						</DialogDescription>
					</DialogHeader>

					<DialogFooter>
						<DialogClose asChild>
							<Button
								variant="outline"
								className="w-full rounded-full text-base font-medium"
								onClick={() => setIsSuccessOpen(false)}
							>
								Close
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
