import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function AppDevtools() {
	if (!import.meta.env.DEV || typeof window === "undefined") {
		return null;
	}

	return <ReactQueryDevtools initialIsOpen />;
}
