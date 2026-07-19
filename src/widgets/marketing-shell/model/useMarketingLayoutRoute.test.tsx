// @vitest-environment happy-dom

import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AUTH_STATUS } from "@/features/auth";

const mockUseAuthContext = vi.hoisted(() => vi.fn());
const mockUseLocation = vi.hoisted(() => vi.fn());

vi.mock("@/features/auth", async () => {
	const actual =
		await vi.importActual<typeof import("@/features/auth")>("@/features/auth");

	return {
		...actual,
		useAuthContext: mockUseAuthContext,
	};
});

vi.mock("@tanstack/react-router", () => ({
	useLocation: mockUseLocation,
}));

import { MARKETING_NAVIGATION_ITEM_IDS, MARKETING_ROUTES } from "../config";

import { useMarketingLayoutRoute } from "./useMarketingLayoutRoute";

const createAuthContext = () => ({
	errorMessage: null,
	handleSessionBootstrapRetry: vi.fn(),
	handleUsernameEntryDismiss: vi.fn(),
	handleUsernameEntryRequest: vi.fn(),
	handleUsernameFormSubmit: vi.fn(),
	isAuthenticated: false,
	isCheckingSession: false,
	isUsernameModalOpen: true,
	isUsernameSubmitting: false,
	readyStatusLabel: null,
	suggestedUsername: "Rune_AshBearAAAA",
	authStatus: AUTH_STATUS.REQUIRES_USERNAME,
});

afterEach(() => {
	cleanup();
	document.body.replaceChildren();
});

describe("useMarketingLayoutRoute", () => {
	it("resolves the active navigation item and keeps the modal flow routed through the hook", () => {
		const authContext = createAuthContext();

		mockUseAuthContext.mockReturnValue(authContext);
		mockUseLocation.mockReturnValue({ pathname: MARKETING_ROUTES.CONCEPTS });

		const { result } = renderHook(() => useMarketingLayoutRoute());

		expect(result.current.shellProps.activeNavigationItemId).toBe(
			MARKETING_NAVIGATION_ITEM_IDS.FIELD_GUIDE,
		);
		expect(result.current.shellProps.isAuthenticated).toBe(false);
		expect(result.current.shellProps.onEntryRequest).toBe(
			authContext.handleUsernameEntryRequest,
		);
		expect(result.current.usernameModalProps.isOpen).toBe(true);
		expect(result.current.usernameModalProps.isSubmitting).toBe(false);
		expect(result.current.usernameModalProps.suggestedUsername).toBe(
			authContext.suggestedUsername,
		);
		expect(result.current.usernameModalProps.onSubmit).toBe(
			authContext.handleUsernameFormSubmit,
		);

		const hiddenEntryTrigger = document.createElement("button");
		hiddenEntryTrigger.dataset.entryTrigger = "true";
		hiddenEntryTrigger.getClientRects = () => [] as unknown as DOMRectList;
		const visibleEntryTrigger = document.createElement("button");
		visibleEntryTrigger.dataset.entryTrigger = "true";
		visibleEntryTrigger.getClientRects = () => [{}] as unknown as DOMRectList;
		document.body.append(hiddenEntryTrigger, visibleEntryTrigger);
		const closeEvent = new Event("close", { cancelable: true });

		result.current.usernameModalProps.onCloseAutoFocus(closeEvent);

		expect(closeEvent.defaultPrevented).toBe(true);
		expect(document.activeElement).toBe(visibleEntryTrigger);

		result.current.shellProps.onEntryRequest();
		result.current.usernameModalProps.onKeepReading();

		expect(authContext.handleUsernameEntryRequest).toHaveBeenCalledOnce();
		expect(authContext.handleUsernameEntryDismiss).toHaveBeenCalledOnce();
	});
});
