import { createContext, useContext } from "react";

import { AUTH_ERROR_MESSAGES } from "../config";

import type { AuthContextValue } from "./types";

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuthContext = (): AuthContextValue => {
	const authContext = useContext(AuthContext);

	if (!authContext) {
		throw new Error(AUTH_ERROR_MESSAGES.MISSING_CONTEXT);
	}

	return authContext;
};
