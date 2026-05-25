import {
	createFileRoute,
	Outlet,
	useLocation,
	useRouter,
} from "@tanstack/react-router";

import { UsernameModal, useAuthContext } from "@/features/auth";
import {
	MARKETING_NAVIGATION_ITEM_IDS,
	MARKETING_ROUTES,
	MarketingPageFrame,
	MarketingShell,
} from "@/widgets/marketing-shell";

export const Route = createFileRoute("/_marketing")({
	component: MarketingLayoutRoute,
});

function MarketingLayoutRoute() {
	const {
		errorMessage,
		handleUsernameEntryDismiss,
		handleUsernameEntryRequest,
		handleUsernameFormSubmit,
		isAuthenticated,
		isUsernameModalOpen,
		isUsernameSubmitting,
		suggestedUsername,
	} = useAuthContext();
	const { pathname } = useLocation();
	const router = useRouter();

	const activeNavigationItemId =
		pathname === MARKETING_ROUTES.GUIDE
			? MARKETING_NAVIGATION_ITEM_IDS.GUIDE
			: pathname === MARKETING_ROUTES.CONCEPTS
				? MARKETING_NAVIGATION_ITEM_IDS.CONCEPTS
				: null;

	return (
		<MarketingShell
			activeNavigationItemId={activeNavigationItemId}
			isAuthenticated={isAuthenticated}
			onEntryRequest={handleUsernameEntryRequest}
		>
			<MarketingPageFrame>
				<Outlet />
			</MarketingPageFrame>
			<UsernameModal
				errorMessage={errorMessage}
				isOpen={isUsernameModalOpen}
				isSubmitting={isUsernameSubmitting}
				suggestedUsername={suggestedUsername}
				onKeepReading={() => {
					handleUsernameEntryDismiss();
					void router.navigate({ to: MARKETING_ROUTES.HOME });
				}}
				onSubmit={handleUsernameFormSubmit}
			/>
		</MarketingShell>
	);
}
