import { useAuthContext } from "@/features/auth";

import { createHomePageViewModel } from "../lib";

export const useHomePage = () => {
	const {
		authStatus,
		errorMessage,
		handleSessionBootstrapRetry,
		handleUsernameEntryRequest,
		isAuthenticated,
		readyStatusLabel,
	} = useAuthContext();

	return createHomePageViewModel({
		authStatus,
		errorMessage,
		handleSessionBootstrapRetry,
		handleUsernameEntryRequest,
		isAuthenticated,
		readyStatusLabel,
	});
};
