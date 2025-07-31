import { type ReactNode } from "react";

export enum ACTION {
	ACTIVE = "ACTIVE",
	INACTIVE = "INACTIVE",
	BLOCKED = "BLOCKED",
	UNBLOCKED = "UNBLOCKED",
	DELETED = "DELETED",
}

export type GetAllUserResponseType = {
	success: boolean;
	message: string;
	data: [{ items: UserResponseType[]; total: number; page: number; pageSize: number }];
	error: object;
};

export type GetOneUserResponseType = {
	success: boolean;
	message: string;
	data: UserResponseType;
	errors: object;
};

export type UserResponseType = {
	_id: string;
	name: {
		first: string;
		last: string;
	};
	email: string;
	phone: string;
	subscription: string;
	numberOfKids: number;
	companyRef: string;
	status: string;
	profileImage: string;
	children: [ChildrenType];
};

export type ChildrenType = {
	name: string;
	email: string;
	age: string;
	avatar: string;
	createdAt: string;
	hobbies: string[];
	status: ACTION;
	points: string;
	screenTime: {
		hours: string;
		minutes: string;
	};
};

export interface UserDetailsProps {
	user: UserResponseType;
	onConfirm: (status: ACTION, user: UserResponseType) => void;
}

export interface UserDisableEnableProps {
	userName: string;
	status: ACTION;
	onConfirm: () => void;
	children: ReactNode;
}

export interface UserBlockDeleteProps {
	userName: string;
	status: ACTION;
	onConfirm: () => void;
}
