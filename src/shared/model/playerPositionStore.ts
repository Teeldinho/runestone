import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";

import {
	checkVector3TupleEqual,
	createVector3Tuple,
	type Vector3Tuple,
} from "@/shared/lib/vec3";

type PlayerPositionStoreState = {
	initialized: boolean;
	position: Vector3Tuple;
	positionSnapshot: Vector3Tuple;
	teleportTarget: Vector3Tuple | null;
	consumeTeleportTarget: () => Vector3Tuple | null;
	setPosition: (x: number, y: number, z: number) => void;
	setTeleportTarget: (x: number, y: number, z: number) => void;
};

const DEFAULT_PLAYER_POSITION = createVector3Tuple(0, 0, 0);

const createPlayerPositionStore = () =>
	createStore<PlayerPositionStoreState>()((set, get) => ({
		initialized: false,
		position: DEFAULT_PLAYER_POSITION,
		positionSnapshot: DEFAULT_PLAYER_POSITION,
		teleportTarget: null,
		consumeTeleportTarget: () => {
			const target = get().teleportTarget;

			if (target === null) {
				return null;
			}

			set({ teleportTarget: null });
			return target;
		},
		setPosition: (x, y, z) => {
			const nextPosition = createVector3Tuple(x, y, z);

			set((state) => {
				if (checkVector3TupleEqual(state.position, nextPosition)) {
					return state;
				}

				return {
					initialized: true,
					position: nextPosition,
					positionSnapshot: nextPosition,
				};
			});
		},
		setTeleportTarget: (x, y, z) => {
			set({
				teleportTarget: createVector3Tuple(x, y, z),
			});
		},
	}));

const playerPositionStore = createPlayerPositionStore();

const selectPlayerPositionSnapshot = (state: PlayerPositionStoreState) =>
	state.positionSnapshot;

export const usePlayerPositionSnapshotValue = (): Vector3Tuple =>
	useStore(playerPositionStore, selectPlayerPositionSnapshot);

export const getPlayerPosition = (): Vector3Tuple =>
	playerPositionStore.getState().position;

export const getPlayerPositionSnapshot = (): Vector3Tuple =>
	playerPositionStore.getState().positionSnapshot;

export const hasPlayerPosition = (): boolean =>
	playerPositionStore.getState().initialized;

export const setPlayerPosition = (x: number, y: number, z: number): void => {
	playerPositionStore.getState().setPosition(x, y, z);
};

export const subscribeToPlayerPosition = (listener: () => void): (() => void) =>
	playerPositionStore.subscribe((state, previousState) => {
		if (state.positionSnapshot !== previousState.positionSnapshot) {
			listener();
		}
	});

export const setPlayerTeleportTarget = (
	x: number,
	y: number,
	z: number,
): void => {
	playerPositionStore.getState().setTeleportTarget(x, y, z);
};

export const consumePlayerTeleportTarget = (): Vector3Tuple | null =>
	playerPositionStore.getState().consumeTeleportTarget();

export type { PlayerPositionStoreState };
