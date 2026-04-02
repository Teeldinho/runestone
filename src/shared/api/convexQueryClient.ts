import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient } from "@tanstack/react-query";

import { QUERY_CLIENT_DEFAULTS } from "@/shared/config";

import { convexClient } from "./convexClient";

const convexRealtimeQueryClient = new ConvexQueryClient(convexClient);

export const convexQueryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryKeyHashFn: convexRealtimeQueryClient.hashFn(),
			queryFn: convexRealtimeQueryClient.queryFn(),
			gcTime: QUERY_CLIENT_DEFAULTS.GC_TIME_MS,
			staleTime: Number.POSITIVE_INFINITY,
			retry: QUERY_CLIENT_DEFAULTS.RETRY_COUNT,
			refetchOnWindowFocus: false,
		},
		mutations: {
			retry: QUERY_CLIENT_DEFAULTS.RETRY_COUNT,
		},
	},
});

convexRealtimeQueryClient.connect(convexQueryClient);
