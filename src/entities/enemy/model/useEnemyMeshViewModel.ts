import { useMachine } from "@xstate/react";
import { useEffect, useMemo } from "react";

import { XSTATE_ACTOR_STATUS } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/types";

import {
	ENEMY_EVENTS,
	ENEMY_GLOW_COLORS_BY_STATE,
	ENEMY_GLOW_EMISSIVE_INTENSITY_BY_STATE,
} from "../config";
import { createEnemyBehaviorMachine } from "./enemyBehaviorMachine";
import type { EnemyBehaviorState, EnemyGlowSettings } from "./types";

type UseEnemyMeshViewModelInput = {
	id: string;
	roomId: string;
	position: Vector3Tuple;
	playerPosition: Vector3Tuple;
	onDead: () => void;
};

type UseEnemyMeshViewModelResult = {
	behaviorState: EnemyBehaviorState;
	glowSettings: EnemyGlowSettings;
	send: ReturnType<
		typeof useMachine<ReturnType<typeof createEnemyBehaviorMachine>>
	>[1];
};

export const useEnemyMeshViewModel = ({
	id,
	roomId,
	position,
	playerPosition,
	onDead,
}: UseEnemyMeshViewModelInput): UseEnemyMeshViewModelResult => {
	const machine = useMemo(() => createEnemyBehaviorMachine(), []);
	const [snapshot, send] = useMachine(machine, {
		input: { id, roomId, position },
	});

	const behaviorState = snapshot.value as EnemyBehaviorState;

	useEffect(() => {
		send({
			type: ENEMY_EVENTS.UPDATE_PLAYER_POSITION,
			position: playerPosition,
		});
	}, [send, playerPosition]);

	useEffect(() => {
		if (snapshot.status === XSTATE_ACTOR_STATUS.DONE) {
			onDead();
		}
	}, [snapshot.status, onDead]);

	return {
		behaviorState,
		glowSettings: {
			color: ENEMY_GLOW_COLORS_BY_STATE[behaviorState],
			emissiveIntensity: ENEMY_GLOW_EMISSIVE_INTENSITY_BY_STATE[behaviorState],
		},
		send,
	};
};

export type { UseEnemyMeshViewModelInput, UseEnemyMeshViewModelResult };
