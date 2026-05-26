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
		handleUsernameEntryRequest: vi.fn(),
		isAuthenticated: true,
	});
});

describe("ConceptsPage", () => {
	it("renders the standalone concepts page without tabs", () => {
		render(<ConceptsPage />);

		expect(screen.getByText("System concepts.")).not.toBeNull();
		expect(screen.getByText("Room")).not.toBeNull();
		expect(screen.getByText("Corridor")).not.toBeNull();
		expect(screen.getByText("Input or prompt")).not.toBeNull();
		expect(screen.getByText("Locked door")).not.toBeNull();
		expect(screen.getByText("Inventory, HP, current room")).not.toBeNull();
		expect(screen.getByText("Independent loop")).not.toBeNull();
		expect(screen.getByText("Ready to inspect the dungeon?")).not.toBeNull();
		expect(
			screen.getByText(
				"Use the guide as a map, then inspect the concepts in motion.",
			),
		).not.toBeNull();
		expect(
			screen.getByText(
				"Runestone maps statechart ideas to dungeon objects so software behavior can be explored spatially.",
			),
		).not.toBeNull();
		expect(screen.queryByRole("tab", { name: "Controls" })).toBeNull();
		expect(screen.queryByRole("tab", { name: "First Run" })).toBeNull();
		expect(screen.queryByRole("tab", { name: "Concepts" })).toBeNull();
	});

	it("includes the guide link from the concepts CTA", () => {
		render(<ConceptsPage />);

		expect(screen.getByRole("link", { name: "Read the Guide" })).not.toBeNull();
	});
});
