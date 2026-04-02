// @vitest-environment happy-dom

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ROOM_IDS } from "@/entities/dungeon";

import { WorldInteractionRuntime } from "./WorldInteractionRuntime";

const mockUseInteractionCandidates = vi.fn();
const mockUseInteractionInput = vi.fn();
const mockUseSendDungeonMachineEvent = vi.fn();
const mockWorldInteractionPrompt = vi.fn((_props: unknown) => null);

vi.mock("@/entities/dungeon", async (importOriginal) => {
	const original = await importOriginal<typeof import("@/entities/dungeon")>();

	return {
		...original,
		createFloorOneMachine: vi.fn(() => ({ config: { states: {} } })),
	};
});

vi.mock("@/entities/room", () => ({
	createDungeonFloorLayout: () => ({
		rooms: [
			{ roomId: ROOM_IDS.GUARD_ROOM, position: [0, 0, 20] },
			{ roomId: ROOM_IDS.TREASURY, position: [0, 0, 40] },
		],
	}),
}));

vi.mock("@/features/dungeon-navigation", () => ({
	useInteractionCandidates: () => mockUseInteractionCandidates(),
	useInteractionInput: (input: unknown) => mockUseInteractionInput(input),
	useSendDungeonMachineEvent: () => mockUseSendDungeonMachineEvent(),
}));

vi.mock("./WorldInteractionPrompt", () => ({
	WorldInteractionPrompt: (props: unknown) => mockWorldInteractionPrompt(props),
}));

describe("WorldInteractionRuntime", () => {
	it("owns interaction hooks and passes candidates plus static room positions to the prompt", () => {
		const candidates = {
			interactPrompt: "Locked",
			interactEvent: "LOCKED_DOOR_ATTEMPT",
			interactTargetId: `${ROOM_IDS.GUARD_ROOM}:south`,
			attackPrompt: null,
			attackPosition: null,
			hasInteract: true,
			hasAttack: false,
		};
		const sendDungeonMachineEvent = vi.fn();

		mockUseInteractionCandidates.mockReturnValue(candidates);
		mockUseSendDungeonMachineEvent.mockReturnValue(sendDungeonMachineEvent);

		render(<WorldInteractionRuntime />);

		expect(mockUseInteractionCandidates).toHaveBeenCalledTimes(1);
		expect(mockUseInteractionInput).toHaveBeenCalledWith({
			candidates,
			sendDungeonMachineEvent,
		});
		expect(mockWorldInteractionPrompt).toHaveBeenCalledWith(
			expect.objectContaining({
				interactionCandidates: candidates,
				roomPositionsById: expect.objectContaining({
					[ROOM_IDS.GUARD_ROOM]: [0, 0, 20],
				}),
			}),
		);
	});
});
