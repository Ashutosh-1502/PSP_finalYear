import { ACTION, type UserBlockDeleteProps } from "@/module/manage-users/types/index";
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

export default function BlockDeleteUser({ userName, status, onConfirm }: UserBlockDeleteProps) {
	const actionText = status === ACTION.BLOCKED ? "Block" : status === ACTION.UNBLOCKED ? "Unblock" : "Delete";
	return (
		<Dialog>
			<DialogTrigger asChild>
				<p className="flex justify-center py-2 hover:bg-gray-100">{actionText} User</p>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{actionText}</DialogTitle>
					<DialogDescription>
						Are you sure you want to {actionText} <span className="font-bold">“{userName}”</span> ?
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
