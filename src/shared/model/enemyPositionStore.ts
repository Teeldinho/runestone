import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";

import {
	checkVector3TupleEqual,
	createVector3Tuple,
	type Vector3Tuple,
} from "@/shared/lib/vec3";

type EnemyPositionStoreState = {
	enemyPositionsById: ReadonlyMap<string, Vector3Tuple>;
	enemyPositionsSnapshot: readonly Vector3Tuple[];
	clearEnemyPositions: () => void;
	removeEnemyPosition: (id: string) => void;
	setEnemyPosition: (id: string, x: number, y: number, z: number) => void;
};

const createEnemyPositionStore = () =>
	createStore<EnemyPositionStoreState>()((set) => ({
		enemyPositionsById: new Map<string, Vector3Tuple>(),
		enemyPositionsSnapshot: [],
		clearEnemyPositions: () => {
			set((state) => {
				if (state.enemyPositionsById.size === 0) {
					return state;
				}

				return {
					enemyPositionsById: new Map<string, Vector3Tuple>(),
					enemyPositionsSnapshot: [],
				};
			});
		},
		removeEnemyPosition: (id) => {
			set((state) => {
				if (!state.enemyPositionsById.has(id)) {
					return state;
				}

				const nextEnemyPositionsById = new Map(state.enemyPositionsById);
				nextEnemyPositionsById.delete(id);

				return {
					enemyPositionsById: nextEnemyPositionsById,
					enemyPositionsSnapshot: Array.from(nextEnemyPositionsById.values()),
				};
			});
		},
		setEnemyPosition: (id, x, y, z) => {
			const nextPosition = createVector3Tuple(x, y, z);

			set((state) => {
				const previousPosition = state.enemyPositionsById.get(id);

				if (
					previousPosition &&
					checkVector3TupleEqual(previousPosition, nextPosition)
				) {
					return state;
				}

				const nextEnemyPositionsById = new Map(state.enemyPositionsById);
				nextEnemyPositionsById.set(id, nextPosition);

				return {
					enemyPositionsById: nextEnemyPositionsById,
					enemyPositionsSnapshot: Array.from(nextEnemyPositionsById.values()),
				};
			});
		},
	}));

const enemyPositionStore = createEnemyPositionStore();

const selectEnemyPositionsSnapshot = (state: EnemyPositionStoreState) =>
	state.enemyPositionsSnapshot;

export const useEnemyPositionsValue = (): readonly Vector3Tuple[] =>
	useStore(enemyPositionStore, selectEnemyPositionsSnapshot);

export const getEnemyPositions = (): readonly Vector3Tuple[] =>
	enemyPositionStore.getState().enemyPositionsSnapshot;

export const setEnemyPosition = (
	id: string,
	x: number,
	y: number,
	z: number,
): void => {
	enemyPositionStore.getState().setEnemyPosition(id, x, y, z);
};

export const removeEnemyPosition = (id: string): void => {
	enemyPositionStore.getState().removeEnemyPosition(id);
};

export const subscribeToEnemyPositions = (listener: () => void): (() => void) =>
	enemyPositionStore.subscribe((state, previousState) => {
		if (state.enemyPositionsSnapshot !== previousState.enemyPositionsSnapshot) {
			listener();
		}
	});

export const clearEnemyPositions = (): void => {
	enemyPositionStore.getState().clearEnemyPositions();
};

export type { EnemyPositionStoreState };
