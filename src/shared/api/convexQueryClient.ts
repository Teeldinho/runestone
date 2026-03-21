import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient } from "@tanstack/react-query";

import { convexClient } from "./convexClient";

const QUERY_RETRY_COUNT = 1;
const QUERY_GC_TIME_MS = 10_000;

const convexRealtimeQueryClient = new ConvexQueryClient(convexClient);

export const convexQueryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryKeyHashFn: convexRealtimeQueryClient.hashFn(),
			queryFn: convexRealtimeQueryClient.queryFn(),
			gcTime: QUERY_GC_TIME_MS,
			staleTime: Number.POSITIVE_INFINITY,
			retry: QUERY_RETRY_COUNT,
			refetchOnWindowFocus: false,
		},
		mutations: {
			retry: QUERY_RETRY_COUNT,
		},
	},
});

convexRealtimeQueryClient.connect(convexQueryClient);
