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
import { ACTION, type UserDisableEnableProps } from "@/module/manage-users/types/index";

export default function EnableDisableUser({ userName, status, onConfirm, children }: UserDisableEnableProps) {
	const actionText = status === ACTION.ACTIVE ? "Enable" : "Disable";
	return (
		<Dialog>
			<DialogTrigger>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{actionText} User</DialogTitle>
					<DialogDescription>
						Are you sure you want to {actionText} <span className="font-bold">“{userName}”</span>?
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
