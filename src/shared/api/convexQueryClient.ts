import { QueryClient } from "@tanstack/react-query";

const QUERY_RETRY_COUNT = 1;

export const convexQueryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Number.POSITIVE_INFINITY,
			retry: QUERY_RETRY_COUNT,
			refetchOnWindowFocus: false,
		},
		mutations: {
			retry: QUERY_RETRY_COUNT,
		},
	},
});
