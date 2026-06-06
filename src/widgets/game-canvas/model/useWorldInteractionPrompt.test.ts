// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { InteractionCandidatesViewModel } from "@/features/dungeon-navigation";
import {
	ATTACK_TOUCH_LABEL,
	INTERACTION_KEY_LABEL,
} from "@/features/dungeon-navigation";
import type { ResponsiveGameLayout } from "@/features/responsive-layout";
import { useResponsiveGameLayout } from "@/features/responsive-layout";
import * as worldInteractionPromptPosition from "../lib/getWorldInteractionPromptPosition";
import { useWorldInteractionPrompt } from "./useWorldInteractionPrompt";

vi.mock("@/features/responsive-layout", () => ({
	useResponsiveGameLayout: vi.fn(),
}));

vi.mock("../lib/getWorldInteractionPromptPosition", () => ({
	getWorldInteractionPromptPosition: vi.fn(),
	getWorldAttackPromptPosition: vi.fn(),
}));

describe("useWorldInteractionPrompt", () => {
	const mockRoomPositionsById = {
		entrance: [0, 0, 0] as [number, number, number],
	};

	beforeEach(() => {
		vi.resetAllMocks();
		vi.mocked(useResponsiveGameLayout).mockReturnValue({
			isDesktopLayout: true,
			isMobileLayout: false,
			isTabletLayout: false,
			isLandscape: true,
			isPortrait: false,
		} satisfies ResponsiveGameLayout);
	});

	it("returns hidden state when no interactions are available", () => {
		const interactionCandidates: InteractionCandidatesViewModel = {
			hasInteract: false,
			interactPrompt: null,
			interactTargetId: null,
			interactEvent: null,
			hasAttack: false,
			attackPrompt: null,
			attackPosition: null,
		};

		const { result } = renderHook(() =>
			useWorldInteractionPrompt({
				interactionCandidates,
				roomPositionsById: mockRoomPositionsById,
			}),
		);

		expect(result.current.interact.isVisible).toBe(false);
		expect(result.current.attack.isVisible).toBe(false);
	});

	it("returns desktop interaction configurations when available", () => {
		const mockInteractPos: [number, number, number] = [1, 2, 3];
		vi.mocked(
			worldInteractionPromptPosition.getWorldInteractionPromptPosition,
		).mockReturnValue(mockInteractPos);

		const interactionCandidates: InteractionCandidatesViewModel = {
			hasInteract: true,
			interactPrompt: "Open Box",
			interactTargetId: "library:north",
			interactEvent: "PICK_UP_KEY",
			hasAttack: false,
			attackPrompt: null,
			attackPosition: null,
		};

		const { result } = renderHook(() =>
			useWorldInteractionPrompt({
				interactionCandidates,
				roomPositionsById: mockRoomPositionsById,
			}),
		);

		expect(result.current.interact.isVisible).toBe(true);
		expect(result.current.interact.position).toEqual(mockInteractPos);
		expect(result.current.interact.label).toBe(INTERACTION_KEY_LABEL);
		expect(result.current.interact.text).toBe("Open Box");

		// Attack remains hidden
		expect(result.current.attack.isVisible).toBe(false);
	});

	it("returns touch attack configurations when desktop is false", () => {
		vi.mocked(useResponsiveGameLayout).mockReturnValue({
			isDesktopLayout: false,
			isMobileLayout: true,
			isTabletLayout: false,
			isLandscape: true,
			isPortrait: false,
		} satisfies ResponsiveGameLayout);

		const mockAttackPos: [number, number, number] = [4, 5, 6];
		vi.mocked(
			worldInteractionPromptPosition.getWorldAttackPromptPosition,
		).mockReturnValue(mockAttackPos);

		const interactionCandidates: InteractionCandidatesViewModel = {
			hasInteract: false,
			interactPrompt: null,
			interactTargetId: null,
			interactEvent: null,
			hasAttack: true,
			attackPrompt: "Slash",
			attackPosition: [10, 0, 10],
		};

		const { result } = renderHook(() =>
			useWorldInteractionPrompt({
				interactionCandidates,
				roomPositionsById: mockRoomPositionsById,
			}),
		);

		expect(result.current.attack.isVisible).toBe(true);
		expect(result.current.attack.position).toEqual(mockAttackPos);
		expect(result.current.attack.label).toBe(ATTACK_TOUCH_LABEL);
		expect(result.current.attack.text).toBe("Slash");
	});

	it("returns a fresh prompt model on rerender", () => {
		const interactionCandidates: InteractionCandidatesViewModel = {
			hasInteract: true,
			interactPrompt: "Open Box",
			interactTargetId: "library:north",
			interactEvent: "PICK_UP_KEY",
			hasAttack: true,
			attackPrompt: "Slash",
			attackPosition: [10, 0, 10],
		};

		vi.mocked(
			worldInteractionPromptPosition.getWorldInteractionPromptPosition,
		).mockReturnValue([1, 2, 3]);
		vi.mocked(
			worldInteractionPromptPosition.getWorldAttackPromptPosition,
		).mockReturnValue([4, 5, 6]);

		const { result, rerender } = renderHook(() =>
			useWorldInteractionPrompt({
				interactionCandidates,
				roomPositionsById: mockRoomPositionsById,
			}),
		);
		const firstResult = result.current;

		rerender();

		expect(result.current).not.toBe(firstResult);
		expect(result.current.interact.position).toEqual(
			firstResult.interact.position,
		);
		expect(result.current.attack.position).toEqual(firstResult.attack.position);
	});
});
