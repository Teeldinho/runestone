// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RoomId } from "@/entities/dungeon";
import { DOOR_SIDES, FLOOR_IDS, ROOM_IDS } from "@/entities/dungeon";
import { PLAYER_STATES, type PlayerHealthState } from "@/entities/player";

const mockOnRoomEnter = vi.fn();
const mockOnTransition = vi.fn();
const mockOnFloorComplete = vi.fn();
const mockOnPlayerDeath = vi.fn();
const mockOnGuardFail = vi.fn();
const mockMutate = vi.fn();
const mockSetPlayerTeleportTarget = vi.fn();

const { mockSnapshotGetter, mockProfileGetter, mockPlayerSnapshotGetter } =
	vi.hoisted(() => ({
		mockSnapshotGetter: vi.fn(),
		mockProfileGetter: vi.fn(),
		mockPlayerSnapshotGetter: vi.fn(),
	}));

vi.mock("@/shared/lib/playerPositionStore", () => ({
	setPlayerTeleportTarget: (...args: unknown[]) =>
		mockSetPlayerTeleportTarget(...args),
}));

vi.mock("@/entities/dungeon", async (importOriginal) => {
	const original = await importOriginal<typeof import("@/entities/dungeon")>();
	return { ...original };
});

vi.mock("@/entities/room", async (importOriginal) => {
	const original = await importOriginal<typeof import("@/entities/room")>();
	return {
		...original,
		createDungeonFloorLayout: () => ({
			rooms: [
				{
					roomId: "entrance",
					label: "Entrance",
					position: [0, 0, 0] as [number, number, number],
					isInitial: true,
					isFinal: false,
				},
				{
					roomId: "library",
					label: "Library",
					position: [0, 0, 20] as [number, number, number],
					isInitial: false,
					isFinal: false,
				},
				{
					roomId: "guard_room",
					label: "Guard Room",
					position: [0, 0, 40] as [number, number, number],
					isInitial: false,
					isFinal: false,
				},
			],
			transitions: [],
			corridors: [],
		}),
	};
});

vi.mock("@/features/dungeon-navigation", async (importOriginal) => {
	const original =
		await importOriginal<typeof import("@/features/dungeon-navigation")>();

	return {
		...original,
		useGameMachineSelector: (selector: (snapshot: unknown) => unknown) =>
			selector(mockSnapshotGetter()),
	};
});

vi.mock("@/features/haptics-feedback", () => ({
	useHaptics: () => ({
		onRoomEnter: mockOnRoomEnter,
		onTransition: mockOnTransition,
		onFloorComplete: mockOnFloorComplete,
		onPlayerDeath: mockOnPlayerDeath,
		onGuardFail: mockOnGuardFail,
	}),
}));

vi.mock("@/entities/score", () => ({
	useSubmitDungeonScore: () => ({ mutate: mockMutate }),
}));

vi.mock("@/features/auth", () => ({
	useAuthContext: () => ({ authenticatedProfile: mockProfileGetter() }),
}));

vi.mock("@/entities/player", () => ({
	usePlayerMachineRuntime: () => ({
		snapshot: mockPlayerSnapshotGetter(),
		sendPlayerMachineEvent: vi.fn(),
	}),
	PLAYER_STATES: {
		REGIONS: { HEALTH: "health", MOVEMENT: "movement" },
		HEALTH: { ALIVE: "alive", DAMAGED: "damaged", DEAD: "dead" },
		MOVEMENT: { IDLE: "idle", WALKING: "walking" },
	},
	PLAYER_ENTITY_CONFIG: {
		TRANSFORM: { SPAWN_HEIGHT_OFFSET: 0.45 },
	},
}));

const createMockSnapshot = (
	roomId: RoomId = ROOM_IDS.ENTRANCE,
	status: "active" | "done" = "active",
	discoveredRooms: RoomId[] = [ROOM_IDS.ENTRANCE],
	lastDoorwayFeedback:
		| "LOCKED_DOOR_ATTEMPT"
		| "LOCKED_EXIT_ATTEMPT"
		| null = null,
	lastTransition: {
		fromRoom: RoomId;
		toRoom: RoomId;
		doorSide: (typeof DOOR_SIDES)[keyof typeof DOOR_SIDES];
	} | null = null,
) => ({
	value: roomId,
	context: {
		currentRoomId: roomId,
		currentFloorId: FLOOR_IDS.FLOOR_ONE,
		discoveredRooms,
		hasTreasureKey: false,
		enemiesRemaining: 1,
		lastDoorwayFeedback,
		lastTransition,
	},
	status,
});

const createMockPlayerSnapshot = (
	healthState: PlayerHealthState = PLAYER_STATES.HEALTH.ALIVE,
) => ({
	value: {
		[PLAYER_STATES.REGIONS.HEALTH]: healthState,
		[PLAYER_STATES.REGIONS.MOVEMENT]: PLAYER_STATES.MOVEMENT.IDLE,
	},
	context: {
		isSprinting: false,
		position: [0, 0, 0] as [number, number, number],
		velocity: [0, 0, 0] as [number, number, number],
		stats: { hp: 100, maxHp: 100, score: 0, keyCount: 0, chainMultiplier: 1 },
	},
});

const MOCK_PROFILE = {
	id: "user-convex-id",
	username: "hero",
	discriminator: "0001",
};

import { useGameSideEffects } from "./useGameSideEffects";

describe("useGameSideEffects — haptics", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockSnapshotGetter.mockReturnValue(createMockSnapshot());
		mockProfileGetter.mockReturnValue(MOCK_PROFILE);
		mockPlayerSnapshotGetter.mockReturnValue(createMockPlayerSnapshot());
	});

	it("calls onTransition on initial render", () => {
		renderHook(() => useGameSideEffects());

		expect(mockOnTransition).toHaveBeenCalledTimes(1);
	});

	it("calls onRoomEnter on the first render (prev room is null)", () => {
		renderHook(() => useGameSideEffects());

		expect(mockOnRoomEnter).toHaveBeenCalledTimes(1);
	});

	it("calls onRoomEnter again when room changes", () => {
		const { rerender } = renderHook(() => useGameSideEffects());
		vi.clearAllMocks();

		act(() => {
			mockSnapshotGetter.mockReturnValue(
				createMockSnapshot(
					ROOM_IDS.LIBRARY,
					"active",
					[ROOM_IDS.ENTRANCE, ROOM_IDS.LIBRARY],
					null,
					{
						fromRoom: ROOM_IDS.ENTRANCE,
						toRoom: ROOM_IDS.LIBRARY,
						doorSide: DOOR_SIDES.NORTH,
					},
				),
			);
		});
		rerender();

		expect(mockOnRoomEnter).toHaveBeenCalledTimes(1);
	});

	it("does NOT call onRoomEnter when room is unchanged between renders", () => {
		const snapshot = createMockSnapshot(ROOM_IDS.LIBRARY);
		mockSnapshotGetter.mockReturnValue(snapshot);
		const { rerender } = renderHook(() => useGameSideEffects());
		vi.clearAllMocks();

		rerender();

		expect(mockOnRoomEnter).not.toHaveBeenCalled();
	});

	it("teleports player to the room world position on room change", () => {
		const { rerender } = renderHook(() => useGameSideEffects());
		vi.clearAllMocks();

		act(() => {
			mockSnapshotGetter.mockReturnValue(
				createMockSnapshot(
					ROOM_IDS.LIBRARY,
					"active",
					[ROOM_IDS.ENTRANCE, ROOM_IDS.LIBRARY],
					null,
					{
						fromRoom: ROOM_IDS.ENTRANCE,
						toRoom: ROOM_IDS.LIBRARY,
						doorSide: DOOR_SIDES.NORTH,
					},
				),
			);
		});
		rerender();

		expect(mockSetPlayerTeleportTarget).toHaveBeenCalledWith(
			0,
			expect.any(Number),
			14.8,
		);
	});

	it("waits for transition metadata before applying non-initial doorway arrival", () => {
		const { rerender } = renderHook(() => useGameSideEffects());
		vi.clearAllMocks();

		act(() => {
			mockSnapshotGetter.mockReturnValue(
				createMockSnapshot(ROOM_IDS.LIBRARY, "active", [
					ROOM_IDS.ENTRANCE,
					ROOM_IDS.LIBRARY,
				]),
			);
		});
		rerender();

		expect(mockSetPlayerTeleportTarget).not.toHaveBeenCalled();

		act(() => {
			mockSnapshotGetter.mockReturnValue(
				createMockSnapshot(
					ROOM_IDS.LIBRARY,
					"active",
					[ROOM_IDS.ENTRANCE, ROOM_IDS.LIBRARY],
					null,
					{
						fromRoom: ROOM_IDS.ENTRANCE,
						toRoom: ROOM_IDS.LIBRARY,
						doorSide: DOOR_SIDES.NORTH,
					},
				),
			);
		});
		rerender();

		expect(mockSetPlayerTeleportTarget).toHaveBeenCalledWith(
			0,
			expect.any(Number),
			14.8,
		);
	});

	it("teleports player on initial render (first room entry)", () => {
		renderHook(() => useGameSideEffects());

		expect(mockSetPlayerTeleportTarget).toHaveBeenCalledWith(
			0,
			expect.any(Number),
			0,
		);
	});

	it("calls onTransition when the room changes", () => {
		const { rerender } = renderHook(() => useGameSideEffects());

		act(() => {
			mockSnapshotGetter.mockReturnValue(
				createMockSnapshot(ROOM_IDS.LIBRARY, "active", [
					ROOM_IDS.ENTRANCE,
					ROOM_IDS.LIBRARY,
				]),
			);
		});
		rerender();

		expect(mockOnTransition).toHaveBeenCalledTimes(2);
	});

	it("does not call onTransition when non-room state changes", () => {
		const { rerender } = renderHook(() => useGameSideEffects());
		vi.clearAllMocks();

		act(() => {
			mockSnapshotGetter.mockReturnValue(
				createMockSnapshot(
					ROOM_IDS.ENTRANCE,
					"active",
					[ROOM_IDS.ENTRANCE],
					"LOCKED_DOOR_ATTEMPT",
				),
			);
		});
		rerender();

		expect(mockOnTransition).not.toHaveBeenCalled();
	});

	it("plays locked-door feedback when doorway feedback changes", () => {
		const { rerender } = renderHook(() => useGameSideEffects());
		vi.clearAllMocks();

		act(() => {
			mockSnapshotGetter.mockReturnValue(
				createMockSnapshot(
					ROOM_IDS.GUARD_ROOM,
					"active",
					[ROOM_IDS.ENTRANCE, ROOM_IDS.LIBRARY, ROOM_IDS.GUARD_ROOM],
					"LOCKED_DOOR_ATTEMPT",
				),
			);
		});
		rerender();

		expect(mockOnGuardFail).toHaveBeenCalledTimes(1);
	});
});

describe("useGameSideEffects — score submission on floor completion", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockSnapshotGetter.mockReturnValue(createMockSnapshot());
		mockProfileGetter.mockReturnValue(MOCK_PROFILE);
		mockPlayerSnapshotGetter.mockReturnValue(createMockPlayerSnapshot());
	});

	it("calls onFloorComplete when status becomes done", () => {
		const { rerender } = renderHook(() => useGameSideEffects());
		vi.clearAllMocks();

		act(() => {
			mockSnapshotGetter.mockReturnValue(
				createMockSnapshot(
					ROOM_IDS.EXIT,
					"done",
					Object.values(ROOM_IDS) as RoomId[],
				),
			);
		});
		rerender();

		expect(mockOnFloorComplete).toHaveBeenCalledTimes(1);
	});

	it("submits score with correct shape when floor is complete and user is authenticated", () => {
		const allRooms = Object.values(ROOM_IDS) as RoomId[];
		const { rerender } = renderHook(() => useGameSideEffects());

		act(() => {
			mockSnapshotGetter.mockReturnValue(
				createMockSnapshot(ROOM_IDS.EXIT, "done", allRooms),
			);
		});
		rerender();

		expect(mockMutate).toHaveBeenCalledOnce();
		const args = mockMutate.mock.calls[0][0] as Record<string, unknown>;
		expect(args.userId).toBe(MOCK_PROFILE.id);
		expect(args.dungeonId).toBe(FLOOR_IDS.FLOOR_ONE);
		expect(typeof args.score).toBe("number");
		expect(typeof args.timeMs).toBe("number");
		expect(args.roomsDiscovered).toBe(allRooms.length);
	});

	it("does NOT submit score when user is not authenticated", () => {
		mockProfileGetter.mockReturnValue(null);
		const { rerender } = renderHook(() => useGameSideEffects());

		act(() => {
			mockSnapshotGetter.mockReturnValue(
				createMockSnapshot(ROOM_IDS.EXIT, "done"),
			);
		});
		rerender();

		expect(mockMutate).not.toHaveBeenCalled();
	});

	it("submits score only once even when re-rendered in done state", () => {
		const doneSnapshot = createMockSnapshot(
			ROOM_IDS.EXIT,
			"done",
			Object.values(ROOM_IDS) as RoomId[],
		);
		mockSnapshotGetter.mockReturnValue(doneSnapshot);
		const { rerender } = renderHook(() => useGameSideEffects());

		rerender();
		rerender();

		expect(mockMutate).toHaveBeenCalledOnce();
	});
});

describe("useGameSideEffects — player death haptic", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockSnapshotGetter.mockReturnValue(createMockSnapshot());
		mockProfileGetter.mockReturnValue(MOCK_PROFILE);
		mockPlayerSnapshotGetter.mockReturnValue(createMockPlayerSnapshot());
	});

	it("calls onPlayerDeath when player health becomes dead", () => {
		const { rerender } = renderHook(() => useGameSideEffects());
		vi.clearAllMocks();

		act(() => {
			mockPlayerSnapshotGetter.mockReturnValue(
				createMockPlayerSnapshot(PLAYER_STATES.HEALTH.DEAD),
			);
		});
		rerender();

		expect(mockOnPlayerDeath).toHaveBeenCalledTimes(1);
	});

	it("does NOT call onPlayerDeath when player is alive", () => {
		renderHook(() => useGameSideEffects());

		expect(mockOnPlayerDeath).not.toHaveBeenCalled();
	});

	it("calls onPlayerDeath only once even when re-rendered in dead state", () => {
		mockPlayerSnapshotGetter.mockReturnValue(
			createMockPlayerSnapshot(PLAYER_STATES.HEALTH.DEAD),
		);
		const { rerender } = renderHook(() => useGameSideEffects());

		rerender();
		rerender();

		expect(mockOnPlayerDeath).toHaveBeenCalledTimes(1);
	});
});
