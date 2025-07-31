import type { RewardsDeleteProps } from "@/module/rewards/types/index";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
	DialogClose,
} from "@/components/ui/dialog";

export default function DeleteReward({ title, onConfirm }: RewardsDeleteProps) {
	const actionText = "Delete";
	return (
		<Dialog>
			<DialogTrigger asChild>
				<p className="flex justify-center hover:bg-gray-100">{actionText} Reward</p>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{actionText}</DialogTitle>
					<DialogDescription>
						Are you sure you want to {actionText} <span className="font-bold">“{title}”</span> ?
					</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<DialogClose>
						<Button variant="destructive" onClick={onConfirm}>
							Confirm
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
