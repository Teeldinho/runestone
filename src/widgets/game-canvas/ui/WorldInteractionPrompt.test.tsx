// @vitest-environment happy-dom

import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { InteractionCandidatesViewModel } from "@/features/dungeon-navigation";

import { WorldInteractionPrompt } from "./WorldInteractionPrompt";

const mockUseResponsiveGameLayout = vi.fn();

vi.mock("@react-three/drei", async (importOriginal) => {
	const original = await importOriginal<typeof import("@react-three/drei")>();

	return {
		...original,
		Html: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	};
});

vi.mock("@/features/responsive-layout", () => ({
	useResponsiveGameLayout: () => mockUseResponsiveGameLayout(),
}));

vi.mock("../lib", () => ({
	getWorldAttackPromptPosition: () => [0, 0, 0] as const,
	getWorldInteractionPromptPosition: () => [0, 0, 0] as const,
}));

const interactionCandidates = {
	interactPrompt: "Enter Library",
	interactEvent: "ENTER_LIBRARY",
	interactTargetId: "entrance:north",
	attackPrompt: "Attack",
	attackPosition: [0, 0, 0],
	hasInteract: true,
	hasAttack: true,
} as unknown as InteractionCandidatesViewModel;

afterEach(() => {
	cleanup();
});

describe("WorldInteractionPrompt", () => {
	it("renders keyboard key labels on desktop", () => {
		mockUseResponsiveGameLayout.mockReturnValue({
			isDesktopLayout: true,
			isLandscape: true,
			isMobileLayout: false,
			isPortrait: false,
			isTabletLayout: false,
		});

		render(
			<WorldInteractionPrompt
				interactionCandidates={interactionCandidates}
				roomPositionsById={{}}
			/>,
		);

		expect(screen.getByText("F")).not.toBeNull();
		expect(screen.getByText("E")).not.toBeNull();
	});

	it("renders touch labels on mobile and tablet layouts", () => {
		mockUseResponsiveGameLayout.mockReturnValue({
			isDesktopLayout: false,
			isLandscape: true,
			isMobileLayout: true,
			isPortrait: false,
			isTabletLayout: false,
		});

		render(
			<WorldInteractionPrompt
				interactionCandidates={interactionCandidates}
				roomPositionsById={{}}
			/>,
		);

		expect(screen.getAllByText("Tap")).toHaveLength(2);
		expect(screen.queryByText("F")).toBeNull();
		expect(screen.queryByText("E")).toBeNull();
	});
});
