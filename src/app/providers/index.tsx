import type { ReactNode } from "react";

import { AuthProvider } from "@/features/auth";
import { TooltipProvider } from "@/shared/ui";

import { ConvexProvider } from "./ConvexProvider";

type AppProvidersProps = {
	children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
	return (
		<ConvexProvider>
			<AuthProvider>
				<TooltipProvider>{children}</TooltipProvider>
			</AuthProvider>
		</ConvexProvider>
	);
}
