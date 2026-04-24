// @vitest-environment happy-dom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useAuthContext } from "@/features/auth";

import { AuthProvider } from "./AuthProvider";

const mockUseAuth = vi.hoisted(() => vi.fn());

vi.mock("../model/useAuth", () => ({
	useAuth: mockUseAuth,
}));

function AuthContextProbe() {
	const authContext = useAuthContext();

	return <div>{authContext.authStatus}</div>;
}

describe("AuthProvider", () => {
	it("provides auth context to consumers", () => {
		mockUseAuth.mockReturnValue({
			authStatus: "authenticated",
			authenticatedProfile: null,
			errorMessage: null,
			handleUsernameFormSubmit: vi.fn(),
			isAuthenticated: true,
			isCheckingSession: false,
			isUsernameModalOpen: false,
			isUsernameSubmitting: false,
			readyStatusLabel: "Signed in",
		});

		render(
			<AuthProvider>
				<AuthContextProbe />
			</AuthProvider>,
		);

		expect(screen.getByText("authenticated").textContent).toBe("authenticated");
	});
});
