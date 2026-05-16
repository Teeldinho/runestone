import { QueryClientProvider } from "@tanstack/react-query";
import { ConvexProvider as ConvexReactProvider } from "convex/react";
import type { ReactNode } from "react";

import { convexClient, convexQueryClient } from "@/shared/api";

import { AppDevtools } from "./AppDevtools";

type ConvexProviderProps = {
	children: ReactNode;
};

export function ConvexProvider({ children }: ConvexProviderProps) {
	return (
		<ConvexReactProvider client={convexClient}>
			<QueryClientProvider client={convexQueryClient}>
				{children}
				<AppDevtools />
			</QueryClientProvider>
		</ConvexReactProvider>
	);
}
