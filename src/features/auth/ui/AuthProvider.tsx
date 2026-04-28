import type { ReactNode } from "react";

import { AuthContext } from "../model/authContext";
import { useAuth } from "../model/useAuth";

type AuthProviderProps = {
	children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
	const authValue = useAuth();

	return (
		<AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
	);
}
