import { redirect } from "@tanstack/react-router";

import { AUTH_ROUTE_PATHS, hasPersistedAuthSession } from "@/features/auth";

export const requirePersistedAuthSession = (storage: Storage): void => {
	if (hasPersistedAuthSession(storage)) {
		return;
	}

	throw redirect({
		to: AUTH_ROUTE_PATHS.HOME,
	});
};
