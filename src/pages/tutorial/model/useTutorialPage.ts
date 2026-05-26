import { useAuthContext } from "@/features/auth";

import { createTutorialPageViewModel } from "../lib";

export const useTutorialPage = () => {
	const { handleUsernameEntryRequest, isAuthenticated } = useAuthContext();

	return createTutorialPageViewModel({
		handleUsernameEntryRequest,
		isAuthenticated,
	});
};
