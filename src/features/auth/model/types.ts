import type { UserProfile } from "@/entities/user";

import type { AUTH_EVENTS, AUTH_STATUS } from "../config";

export type AuthStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS];

export type AuthMachineContext = {
	uuid: string;
	profile: UserProfile | null;
	pendingUsername: string | null;
	errorMessage: string | null;
};

export type AuthMachineEvent =
	| {
			type: (typeof AUTH_EVENTS)["SESSION_BOOTSTRAPPED"];
			uuid: string;
			profile: UserProfile | null;
	  }
	| {
			type: (typeof AUTH_EVENTS)["SESSION_BOOTSTRAP_FAILED"];
			uuid: string;
			errorMessage: string;
	  }
	| {
			type: (typeof AUTH_EVENTS)["USERNAME_SUBMIT_REQUESTED"];
			username: string;
	  }
	| {
			type: (typeof AUTH_EVENTS)["USERNAME_SUBMIT_SUCCEEDED"];
			profile: UserProfile;
	  }
	| {
			type: (typeof AUTH_EVENTS)["USERNAME_SUBMIT_FAILED"];
			errorMessage: string;
	  }
	| {
			type: (typeof AUTH_EVENTS)["SIGN_OUT_REQUESTED"];
	  };

export type UsernameFormInput = {
	username: string;
};

export type AuthContextValue = {
	authStatus: AuthStatus;
	authenticatedProfile: UserProfile | null;
	errorMessage: string | null;
	isCheckingSession: boolean;
	isAuthenticated: boolean;
	isUsernameModalOpen: boolean;
	isUsernameSubmitting: boolean;
	readyStatusLabel: string | null;
	handleUsernameFormSubmit: (input: UsernameFormInput) => Promise<void>;
};
