import { type FieldValues } from "react-hook-form";
import z from "zod";

export interface TagsInputFormProps {
	name: string;
	setInputValue: React.Dispatch<React.SetStateAction<string>>;
}

export interface MemberFormProps {
	inputValue: string;
	setInputValue: React.Dispatch<React.SetStateAction<string>>;
}

export type WatchFunction<T extends keyof FieldValues> = (
	name: T,
	defaultValue?: FieldValues[T] | undefined
) => FieldValues[T];

export interface InviteApiResponse {
	status: number;
	message: string;
	data: {
		message: string;
		emails: string[];
	};
}

export interface InviteUserData {
	email: string;
	companyRef?: string;
}

export interface AcceptInviteData {
	inviteToken: string;
}

export interface AcceptInviteResponse {
	status: number;
}

export interface ApiResponse {
	message: string;
}

export interface User {
	invitedEmail: string;
	_id: string;
	status: string;
	role?: string;
	expiry: number;
	createdAt: string;
}

export interface InvitedUsers {
	data: User[];
}
export interface UsersList {
	data: UserDataType[];
}

export interface UserDataType {
	data: UserDataType;
	_id: string;
	email: string;
	fullName: string;
	name: {
		first: string;
		last: string;
	};
	profileImage?: string;
	roles?: string;
	status: string;
	oauth?: string;
	subscriptionCancellationRequested?: boolean;
	companyRef: {
		_id: string;
	};
	lastActivity: number;
}

// form Zod validation schema
const personalInfoFormSchema = z.object({
	emails: z.array(z.string().email({ message: "Invalid email address" })),
});

// generate form types from zod validation schema
export type PersonalInfoFormTypes = z.infer<typeof personalInfoFormSchema>;
