// @vitest-environment happy-dom

import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ConceptsPage } from "./ConceptsPage";

const mockUseAuthContext = vi.hoisted(() => vi.fn());

vi.mock("@/features/auth", async () => {
	const actual =
		await vi.importActual<typeof import("@/features/auth")>("@/features/auth");

	return {
		...actual,
		useAuthContext: mockUseAuthContext,
	};
});

vi.mock("@tanstack/react-router", () => ({
	Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
		<a href={to} {...props}>
			{children}
		</a>
	),
}));

afterEach(cleanup);

beforeEach(() => {
	mockUseAuthContext.mockReturnValue({
		isAuthenticated: true,
	});
});

describe("ConceptsPage", () => {
	it("renders the standalone concepts page without tabs", () => {
		render(<ConceptsPage />);

		expect(screen.getByText("System concepts.")).not.toBeNull();
		expect(screen.getByText("State → Room")).not.toBeNull();
		expect(screen.getByText("Actor → Independent loop")).not.toBeNull();
		expect(screen.queryByRole("tab", { name: "Controls" })).toBeNull();
		expect(screen.queryByRole("tab", { name: "First Run" })).toBeNull();
		expect(screen.queryByRole("tab", { name: "Concepts" })).toBeNull();
	});

	it("includes the GitHub footer link from the shared marketing shell", () => {
		render(<ConceptsPage />);

		expect(
			screen.getByRole("link", {
				name: "GitHub",
			}),
		).not.toBeNull();
	});
});
