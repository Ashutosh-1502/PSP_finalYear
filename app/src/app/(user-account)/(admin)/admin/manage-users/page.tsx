import ManageUsers from "@/module/manage-users/templates/manage-users";
import Header from "@/module/profile/components/header";

export default function ManageUsersPage() {
	return (
		<>
			<Header title="Users" />
			<ManageUsers />
		</>
	);
}
