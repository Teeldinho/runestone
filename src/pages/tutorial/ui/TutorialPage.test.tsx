// @vitest-environment happy-dom

import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TutorialPage } from "./TutorialPage";

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

const activateTab = (name: string) => {
	const tab = screen.getByRole("tab", { name });

	fireEvent.pointerDown(tab);
	fireEvent.mouseDown(tab);
	fireEvent.click(tab);
};

describe("TutorialPage", () => {
	it("renders the guide with stable tabs", () => {
		render(<TutorialPage />);

		expect(screen.getByText("Play the system.")).not.toBeNull();
		expect(screen.getByRole("tab", { name: "Controls" })).not.toBeNull();
		expect(screen.getByRole("tab", { name: "First Run" })).not.toBeNull();
		expect(screen.getByRole("tab", { name: "Concepts" })).not.toBeNull();
	});

	it("renders accurate desktop controls", () => {
		render(<TutorialPage />);

		expect(screen.getByText("WASD / Arrows — Move")).not.toBeNull();
		expect(screen.getByText("Shift — Run toggle")).not.toBeNull();
		expect(screen.getByText("Space — Jump")).not.toBeNull();
		expect(screen.getByText("E — Interact")).not.toBeNull();
		expect(screen.getByText("F — Attack")).not.toBeNull();
		expect(screen.getByText("4 / FO — Free Orbital")).not.toBeNull();
	});

	it("renders first run content without developer setup copy", async () => {
		render(<TutorialPage />);

		activateTab("First Run");

		await waitFor(() =>
			expect(screen.getByText("First run path")).not.toBeNull(),
		);
		expect(screen.getByText("Enter the initial state")).not.toBeNull();
		expect(screen.queryByText(/git clone/i)).toBeNull();
		expect(screen.queryByText(/pnpm/i)).toBeNull();
		expect(screen.queryByText(/deployment/i)).toBeNull();
	});

	it("renders concept mapping content", async () => {
		render(<TutorialPage />);

		activateTab("Concepts");

		await waitFor(() =>
			expect(screen.getByText("Concepts in play")).not.toBeNull(),
		);
		expect(screen.getByText("State → Room")).not.toBeNull();
		expect(
			screen.getByText("Actor → Camera, player, input, audio"),
		).not.toBeNull();
	});

	it("keeps the entry CTA disabled when unauthenticated", () => {
		mockUseAuthContext.mockReturnValue({
			isAuthenticated: false,
		});

		render(<TutorialPage />);

		const hero = screen
			.getByRole("heading", { name: "Play the system." })
			.closest("header");

		expect(hero).not.toBeNull();
		const entryButton = within(hero as HTMLElement).getByRole("button", {
			name: "Enter Dungeon",
		});

		expect(entryButton).not.toBeNull();
		expect((entryButton as HTMLButtonElement).disabled).toBe(true);
	});
});
