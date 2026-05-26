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
		handleUsernameEntryRequest: vi.fn(),
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

		expect(screen.getByText("Manual")).not.toBeNull();
		expect(screen.getByRole("tab", { name: "Controls" })).not.toBeNull();
		expect(screen.getByRole("tab", { name: "First Run" })).not.toBeNull();
		expect(screen.queryByRole("tab", { name: "Concepts" })).toBeNull();
	});

	it("renders accurate desktop controls", () => {
		render(<TutorialPage />);

		expect(
			screen.getByText(
				"Master the tactile interface to navigate the architecture.",
			),
		).not.toBeNull();
		expect(screen.getByText("Movement")).not.toBeNull();
		expect(screen.getByText("Actions")).not.toBeNull();
		expect(screen.getByText("Camera modes")).not.toBeNull();
		expect(screen.getByText("3rd Person")).not.toBeNull();
		expect(screen.getByText("Top Down")).not.toBeNull();
		expect(screen.getByText("1st Person")).not.toBeNull();
		expect(screen.getByText("Free Orbital")).not.toBeNull();
		expect(screen.getByText("W", { selector: "kbd" })).not.toBeNull();
		expect(screen.getByText("Shift", { selector: "kbd" })).not.toBeNull();
		expect(screen.getByText("Space", { selector: "kbd" })).not.toBeNull();
		expect(screen.getByText("E", { selector: "kbd" })).not.toBeNull();
		expect(screen.getByText("F", { selector: "kbd" })).not.toBeNull();
		expect(screen.getByText("Left joystick")).not.toBeNull();
		expect(screen.getByText("Footprints button")).not.toBeNull();
		expect(screen.getByText("Chevrons-up button")).not.toBeNull();
	});

	it("renders first run content without developer setup copy", async () => {
		render(<TutorialPage />);

		activateTab("First Run");

		await waitFor(() =>
			expect(screen.getByText("First run path")).not.toBeNull(),
		);
		expect(screen.getByText("Enter the initial state")).not.toBeNull();
		expect(screen.getByText("Dispatch movement events")).not.toBeNull();
		expect(screen.getByText("Satisfy guards")).not.toBeNull();
		expect(screen.getByText("Resolve combat and context")).not.toBeNull();
		expect(screen.getByText("Reach the final state")).not.toBeNull();
		expect(
			screen.getByText(
				"Mount the run at Entrance, hydrate the active room, and publish the initial state snapshot.",
			),
		).not.toBeNull();
		expect(
			screen.getByText(
				"Emit a movement event; the corridor transition resolves before the next room becomes active.",
			),
		).not.toBeNull();
		expect(
			screen.getByText(
				"Evaluate the guard against keys and blockers; the path stays sealed until the predicate passes.",
			),
		).not.toBeNull();
		expect(
			screen.getByText(
				"Mutate combat state and inventory, then recalculate which transitions remain valid.",
			),
		).not.toBeNull();
		expect(
			screen.getByText(
				"Write the terminal floor state and close the run once the final room resolves.",
			),
		).not.toBeNull();
		expect(screen.getByText("ENTRANCE")).not.toBeNull();
		expect(screen.getByText("CORRIDORS")).not.toBeNull();
		expect(screen.getByText("KEYS / BLOCKERS")).not.toBeNull();
		expect(screen.getByText("ENEMY STATE")).not.toBeNull();
		expect(screen.getByText("INVENTORY")).not.toBeNull();
		expect(screen.getByText("COMPLETE FLOOR")).not.toBeNull();
		expect(screen.queryByText(/git clone/i)).toBeNull();
		expect(screen.queryByText(/pnpm/i)).toBeNull();
		expect(screen.queryByText(/deployment/i)).toBeNull();
	});

	it("requests username entry when unauthenticated", () => {
		const handleUsernameEntryRequest = vi.fn();

		mockUseAuthContext.mockReturnValue({
			handleUsernameEntryRequest,
			isAuthenticated: false,
		});

		render(<TutorialPage />);

		const hero = screen
			.getByRole("heading", { name: "Manual" })
			.closest("header");

		expect(hero).not.toBeNull();
		const entryButton = within(hero as HTMLElement).getByRole("button", {
			name: "Enter Dungeon",
		});

		fireEvent.click(entryButton);

		expect(handleUsernameEntryRequest).toHaveBeenCalledOnce();
	});
});
