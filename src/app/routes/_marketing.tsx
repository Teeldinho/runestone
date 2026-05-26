import { createFileRoute, Outlet } from "@tanstack/react-router";

import { UsernameModal } from "@/features/auth";
import {
	MarketingPageFrame,
	MarketingShell,
	useMarketingLayoutRoute,
} from "@/widgets/marketing-shell";

export const Route = createFileRoute("/_marketing")({
	component: MarketingLayoutRoute,
});

function MarketingLayoutRoute() {
	const { shellProps, usernameModalProps } = useMarketingLayoutRoute();

	return (
		<MarketingShell {...shellProps}>
			<MarketingPageFrame>
				<Outlet />
			</MarketingPageFrame>
			<UsernameModal {...usernameModalProps} />
		</MarketingShell>
	);
}
