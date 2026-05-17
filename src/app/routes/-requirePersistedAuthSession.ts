import { redirect } from "@tanstack/react-router";

import {
	AUTH_ROUTE_PATHS,
	getAuthClientStorage,
	hasPersistedAuthSession,
} from "@/features/auth";

export const requirePersistedAuthSession = (): void => {
	const storage = getAuthClientStorage();

	if (!storage || hasPersistedAuthSession(storage)) {
		return;
	}

	throw redirect({
		to: AUTH_ROUTE_PATHS.HOME,
	});
};
