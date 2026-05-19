import { createStore } from "zustand/vanilla";

import {
	checkVector3TupleEqual,
	createVector3Tuple,
	type Vector3Tuple,
} from "@/shared/lib/vec3";

type PlayerCameraFollowPositionStoreState = {
	initialized: boolean;
	position: Vector3Tuple;
	positionSnapshot: Vector3Tuple;
	setPosition: (x: number, y: number, z: number) => void;
};

const DEFAULT_PLAYER_CAMERA_FOLLOW_POSITION = createVector3Tuple(0, 0, 0);

const createPlayerCameraFollowPositionStore = () =>
	createStore<PlayerCameraFollowPositionStoreState>()((set) => ({
		initialized: false,
		position: DEFAULT_PLAYER_CAMERA_FOLLOW_POSITION,
		positionSnapshot: DEFAULT_PLAYER_CAMERA_FOLLOW_POSITION,
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
	}));

const playerCameraFollowPositionStore = createPlayerCameraFollowPositionStore();

export const getPlayerCameraFollowPosition = (): Vector3Tuple =>
	playerCameraFollowPositionStore.getState().position;

export const getPlayerCameraFollowPositionSnapshot = (): Vector3Tuple =>
	playerCameraFollowPositionStore.getState().positionSnapshot;

export const hasPlayerCameraFollowPosition = (): boolean =>
	playerCameraFollowPositionStore.getState().initialized;

export const setPlayerCameraFollowPosition = (
	x: number,
	y: number,
	z: number,
): void => {
	playerCameraFollowPositionStore.getState().setPosition(x, y, z);
};

export const subscribeToPlayerCameraFollowPosition = (
	listener: () => void,
): (() => void) =>
	playerCameraFollowPositionStore.subscribe((state, previousState) => {
		if (state.positionSnapshot !== previousState.positionSnapshot) {
			listener();
		}
	});

export type { PlayerCameraFollowPositionStoreState };
