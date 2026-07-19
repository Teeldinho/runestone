import type { AuthContextValue } from "@/features/auth";

type CreateHomePageViewModelInput = Pick<
	AuthContextValue,
	| "authStatus"
	| "errorMessage"
	| "handleSessionBootstrapRetry"
	| "handleUsernameEntryRequest"
	| "isAuthenticated"
	| "readyStatusLabel"
>;

type HomePageViewModel = {
	entryProps: {
		authStatus: AuthContextValue["authStatus"];
		errorMessage: string | null;
		isAuthenticated: boolean;
		onEntryRequest: () => void;
		onRetry: () => void;
		readyStatusLabel: string | null;
	};
};

export const createHomePageViewModel = ({
	authStatus,
	errorMessage,
	handleSessionBootstrapRetry,
	handleUsernameEntryRequest,
	isAuthenticated,
	readyStatusLabel,
}: CreateHomePageViewModelInput): HomePageViewModel => {
	return {
		entryProps: {
			authStatus,
			errorMessage,
			isAuthenticated,
			onEntryRequest: handleUsernameEntryRequest,
			onRetry: handleSessionBootstrapRetry,
			readyStatusLabel,
		},
	};
};

export type { CreateHomePageViewModelInput, HomePageViewModel };
