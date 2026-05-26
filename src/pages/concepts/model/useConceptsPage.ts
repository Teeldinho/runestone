import { useAuthContext } from "@/features/auth";

import { createConceptsPageViewModel } from "../lib";

export const useConceptsPage = () => {
	const { handleUsernameEntryRequest, isAuthenticated } = useAuthContext();

	return createConceptsPageViewModel({
		handleUsernameEntryRequest,
		isAuthenticated,
	});
};
