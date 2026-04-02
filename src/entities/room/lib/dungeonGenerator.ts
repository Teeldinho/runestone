import { DUNGEON_GENERATOR_CONFIG } from "@/entities/room/config";
import { MACHINE_STATE_TYPES } from "@/shared/config";
import { getGraphLayout } from "@/shared/lib";
import type { Vector3Tuple } from "@/shared/types";

type RoomId = string;

type MachineTransitionConfig = {
	target?: string | readonly string[];
	guard?: unknown;
};

type MachineStateConfig = {
	type?: unknown;
	on?: Record<string, unknown>;
};

type MachineDefinition = {
	config: {
		initial?: unknown;
		states?: Record<string, MachineStateConfig>;
	};
};

type DungeonRoomLayout = {
	roomId: RoomId;
	label: string;
	position: Vector3Tuple;
	isFinal: boolean;
	isInitial: boolean;
};

type DungeonRoomTransition = {
	id: string;
	sourceRoomId: RoomId;
	targetRoomId: RoomId;
	eventType: string;
	isGuarded: boolean;
};

type DungeonCorridorLayout = {
	id: string;
	sourceRoomId: RoomId;
	targetRoomId: RoomId;
	position: Vector3Tuple;
	rotationYRad: number;
};

type DungeonFloorLayout = {
	rooms: DungeonRoomLayout[];
	transitions: DungeonRoomTransition[];
	corridors: DungeonCorridorLayout[];
};

const getRoomIds = (machineDefinition: MachineDefinition): RoomId[] => {
	return Object.keys(machineDefinition.config.states ?? {}) as RoomId[];
};

const toTransitionConfigs = (
	transitionConfig: unknown,
): readonly MachineTransitionConfig[] => {
	if (!transitionConfig) {
		return [];
	}

	if (typeof transitionConfig === "string") {
		return [
			{
				target: transitionConfig,
			},
		];
	}

	if (Array.isArray(transitionConfig)) {
		return transitionConfig.flatMap((transition) =>
			toTransitionConfigs(transition),
		);
	}

	if (typeof transitionConfig !== "object") {
		return [];
	}

	const transition = transitionConfig as {
		target?: unknown;
		guard?: unknown;
	};
	const target =
		typeof transition.target === "string"
			? transition.target
			: Array.isArray(transition.target)
				? transition.target.filter(
						(item): item is string => typeof item === "string",
					)
				: undefined;

	return [
		{
			target,
			guard: transition.guard,
		},
	];
};

const normalizeTargetRoomId = (
	target: string | readonly string[] | undefined,
): RoomId | null => {
	if (!target) {
		return null;
	}

	if (typeof target !== "string") {
		return normalizeTargetRoomId(target[0]);
	}

	if (target.startsWith(".")) {
		return target.slice(1) as RoomId;
	}

	return target as RoomId;
};

const getInitialRoomId = (
	machineDefinition: MachineDefinition,
): RoomId | null => {
	if (!machineDefinition.config.initial) {
		return null;
	}

	if (typeof machineDefinition.config.initial === "string") {
		return machineDefinition.config.initial;
	}

	if (
		typeof machineDefinition.config.initial !== "object" ||
		machineDefinition.config.initial === null ||
		!("target" in machineDefinition.config.initial)
	) {
		return null;
	}

	return normalizeTargetRoomId(
		machineDefinition.config.initial.target as string | readonly string[],
	);
};

const createTransitionId = (
	sourceRoomId: RoomId,
	targetRoomId: RoomId,
	eventType: string,
): string => {
	return `${sourceRoomId}:${targetRoomId}:${eventType}`;
};

const extractMachineTransitions = (
	machineDefinition: MachineDefinition,
): DungeonRoomTransition[] => {
	const machineStates = machineDefinition.config.states ?? {};

	return Object.entries(machineStates).flatMap(
		([sourceRoomId, stateConfig]) => {
			const transitionEntries = Object.entries(stateConfig.on ?? {});

			return transitionEntries.flatMap(([eventType, transitionConfig]) => {
				return toTransitionConfigs(transitionConfig).flatMap((transition) => {
					const targetRoomId = normalizeTargetRoomId(transition.target);

					if (!targetRoomId) {
						return [];
					}

					return {
						id: createTransitionId(
							sourceRoomId as RoomId,
							targetRoomId,
							eventType,
						),
						sourceRoomId: sourceRoomId as RoomId,
						targetRoomId,
						eventType,
						isGuarded: Boolean(transition.guard),
					};
				});
			});
		},
	);
};

const toWorldAxisValue = (axisValue: number): number => {
	const scaledValue = axisValue * DUNGEON_GENERATOR_CONFIG.WORLD_SCALE_FACTOR;

	return (
		Math.round(scaledValue / DUNGEON_GENERATOR_CONFIG.ROOM_SPACING) *
		DUNGEON_GENERATOR_CONFIG.ROOM_SPACING
	);
};

const createRoomPositions = (
	roomIds: readonly RoomId[],
	transitions: readonly DungeonRoomTransition[],
): Record<RoomId, Vector3Tuple> => {
	const graphLayout = getGraphLayout({
		nodes: roomIds.map((roomId) => ({
			id: roomId,
			width: DUNGEON_GENERATOR_CONFIG.DAGRE_NODE_WIDTH,
			height: DUNGEON_GENERATOR_CONFIG.DAGRE_NODE_HEIGHT,
		})),
		edges: transitions.map((transition) => ({
			source: transition.sourceRoomId,
			target: transition.targetRoomId,
		})),
		direction: DUNGEON_GENERATOR_CONFIG.DAGRE_DIRECTION,
	});

	const roomWorldPositions = graphLayout.nodes.map((node) => ({
		roomId: node.id as RoomId,
		position: [
			toWorldAxisValue(node.position.x),
			DUNGEON_GENERATOR_CONFIG.WORLD_POSITION_Y,
			toWorldAxisValue(node.position.y),
		] as Vector3Tuple,
	}));

	const worldXValues = roomWorldPositions.map((room) => room.position[0]);
	const worldZValues = roomWorldPositions.map((room) => room.position[2]);
	const worldXCenter =
		(Math.max(...worldXValues) + Math.min(...worldXValues)) / 2;
	const worldZCenter =
		(Math.max(...worldZValues) + Math.min(...worldZValues)) / 2;

	return roomWorldPositions.reduce<Record<RoomId, Vector3Tuple>>(
		(accumulator, roomWorldPosition) => {
			accumulator[roomWorldPosition.roomId] = [
				roomWorldPosition.position[0] - worldXCenter,
				roomWorldPosition.position[1],
				roomWorldPosition.position[2] - worldZCenter,
			] as Vector3Tuple;

			return accumulator;
		},
		{} as Record<RoomId, Vector3Tuple>,
	);
};

const isAdjacentRoomPair = (
	sourcePosition: Vector3Tuple,
	targetPosition: Vector3Tuple,
): boolean => {
	const xDistance = Math.abs(targetPosition[0] - sourcePosition[0]);
	const zDistance = Math.abs(targetPosition[2] - sourcePosition[2]);

	return (
		(xDistance === DUNGEON_GENERATOR_CONFIG.ROOM_SPACING && zDistance === 0) ||
		(zDistance === DUNGEON_GENERATOR_CONFIG.ROOM_SPACING && xDistance === 0)
	);
};

const createCorridorId = (
	sourceRoomId: RoomId,
	targetRoomId: RoomId,
): string => {
	return `${sourceRoomId}:${targetRoomId}`;
};

const createCorridorPairKey = (
	sourceRoomId: RoomId,
	targetRoomId: RoomId,
): string => {
	return [sourceRoomId, targetRoomId].sort().join(":");
};

const createCorridorLayouts = (
	transitions: readonly DungeonRoomTransition[],
	roomPositionsById: Record<RoomId, Vector3Tuple>,
): DungeonCorridorLayout[] => {
	const corridorPairKeys = new Set<string>();

	return transitions.flatMap((transition) => {
		const sourcePosition = roomPositionsById[transition.sourceRoomId];
		const targetPosition = roomPositionsById[transition.targetRoomId];
		const corridorPairKey = createCorridorPairKey(
			transition.sourceRoomId,
			transition.targetRoomId,
		);

		if (
			corridorPairKeys.has(corridorPairKey) ||
			!isAdjacentRoomPair(sourcePosition, targetPosition)
		) {
			return [];
		}

		corridorPairKeys.add(corridorPairKey);

		const xDistance = Math.abs(targetPosition[0] - sourcePosition[0]);

		return {
			id: createCorridorId(transition.sourceRoomId, transition.targetRoomId),
			sourceRoomId: transition.sourceRoomId,
			targetRoomId: transition.targetRoomId,
			position: [
				(sourcePosition[0] + targetPosition[0]) / 2,
				DUNGEON_GENERATOR_CONFIG.WORLD_POSITION_Y,
				(sourcePosition[2] + targetPosition[2]) / 2,
			] as Vector3Tuple,
			rotationYRad:
				xDistance > 0
					? DUNGEON_GENERATOR_CONFIG.CORRIDOR_HORIZONTAL_ROTATION_Y_RAD
					: DUNGEON_GENERATOR_CONFIG.CORRIDOR_VERTICAL_ROTATION_Y_RAD,
		};
	});
};

export const createDungeonFloorLayout = (
	machineDefinition: MachineDefinition,
): DungeonFloorLayout => {
	const roomIds = getRoomIds(machineDefinition);
	const transitions = extractMachineTransitions(machineDefinition);
	const roomPositionsById = createRoomPositions(roomIds, transitions);
	const initialRoomId = getInitialRoomId(machineDefinition);

	return {
		rooms: roomIds.map((roomId) => ({
			roomId,
			label: roomId,
			position: roomPositionsById[roomId],
			isInitial: initialRoomId === roomId,
			isFinal:
				machineDefinition.config.states?.[roomId]?.type ===
				MACHINE_STATE_TYPES.FINAL,
		})),
		transitions,
		corridors: createCorridorLayouts(transitions, roomPositionsById),
	};
};

export type {
	DungeonCorridorLayout,
	DungeonFloorLayout,
	DungeonRoomLayout,
	DungeonRoomTransition,
	MachineDefinition,
};
