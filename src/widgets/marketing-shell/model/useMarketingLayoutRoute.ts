import { useLocation, useRouter } from "@tanstack/react-router";

import { type UsernameFormInput, useAuthContext } from "@/features/auth";

import { MARKETING_ROUTES, type MarketingNavigationItemId } from "../config";
import { resolveMarketingNavigationItemId } from "../lib";

type MarketingLayoutRouteViewModel = {
	shellProps: {
		activeNavigationItemId: MarketingNavigationItemId | null;
		isAuthenticated: boolean;
		onEntryRequest: () => void;
	};
	usernameModalProps: {
		errorMessage: string | null;
		isOpen: boolean;
		isSubmitting: boolean;
		suggestedUsername: string;
		onKeepReading: () => void;
		onSubmit: (input: UsernameFormInput) => Promise<void>;
	};
};

export const useMarketingLayoutRoute = (): MarketingLayoutRouteViewModel => {
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
	const activeNavigationItemId = resolveMarketingNavigationItemId(pathname);

	return {
		shellProps: {
			activeNavigationItemId,
			isAuthenticated,
			onEntryRequest: handleUsernameEntryRequest,
		},
		usernameModalProps: {
			errorMessage,
			isOpen: isUsernameModalOpen,
			isSubmitting: isUsernameSubmitting,
			suggestedUsername,
			onKeepReading: () => {
				handleUsernameEntryDismiss();
				void router.navigate({ to: MARKETING_ROUTES.HOME });
			},
			onSubmit: handleUsernameFormSubmit,
		},
	};
};
