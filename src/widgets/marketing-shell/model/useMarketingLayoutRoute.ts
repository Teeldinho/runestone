import { useLocation } from "@tanstack/react-router";

import { type UsernameFormInput, useAuthContext } from "@/features/auth";

import type { MarketingNavigationItemId } from "../config";
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
		onCloseAutoFocus: (event: Event) => void;
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
			onCloseAutoFocus: (event) => {
				event.preventDefault();
				const entryTriggers = document.querySelectorAll<HTMLElement>(
					"[data-entry-trigger]",
				);
				const visibleEntryTrigger = Array.from(entryTriggers).find(
					(entryTrigger) => entryTrigger.getClientRects().length > 0,
				);

				(visibleEntryTrigger ?? entryTriggers.item(0))?.focus();
			},
			onKeepReading: () => {
				handleUsernameEntryDismiss();
			},
			onSubmit: handleUsernameFormSubmit,
		},
	};
};
