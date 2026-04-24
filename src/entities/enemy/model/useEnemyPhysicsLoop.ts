import { useFrame } from "@react-three/fiber";
import type { RapierRigidBody } from "@react-three/rapier";
import type { RefObject } from "react";
import { useEffect, useRef } from "react";
import type { Quaternion } from "three";

import type { Vector3Tuple } from "@/shared/lib";
import {
	getPlayerPosition,
	removeEnemyPosition,
	setEnemyPosition,
} from "@/shared/lib";

import { ENEMY_ENTITY_CONFIG, ENEMY_EVENTS } from "../config";
import {
	computeEnemyFrameLinearVelocity,
	createSmoothedEnemyRotation,
	shouldRotateEnemy,
	shouldSyncEnemyPlayerPosition,
} from "../lib";
import type { EnemyUpdatePlayerPositionEvent } from "./types";

type UseEnemyPhysicsLoopInput = {
	rigidBodyRef: RefObject<RapierRigidBody | null>;
	id: string;
	position: Vector3Tuple;
	send: (event: EnemyUpdatePlayerPositionEvent) => void;
	getNextPosition: (
		delta: number,
		currentPosition: Vector3Tuple,
	) => Vector3Tuple;
};

export const useEnemyPhysicsLoop = ({
	rigidBodyRef,
	id,
	position,
	send,
	getNextPosition,
}: UseEnemyPhysicsLoopInput): void => {
	const lastPlayerPositionRef = useRef<Vector3Tuple>([
		getPlayerPosition()[0],
		getPlayerPosition()[1],
		getPlayerPosition()[2],
	]);
	const elapsedSincePlayerSyncMsRef = useRef(0);

	useFrame((_, delta) => {
		if (delta <= Number.EPSILON) {
			return;
		}

		elapsedSincePlayerSyncMsRef.current += delta * 1000;
		const playerPosition = getPlayerPosition();
		if (
			shouldSyncEnemyPlayerPosition({
				elapsedMs: elapsedSincePlayerSyncMsRef.current,
				lastSentPosition: lastPlayerPositionRef.current,
				nextPosition: playerPosition,
				positionThreshold:
					ENEMY_ENTITY_CONFIG.PLAYER_TRACKING.POSITION_THRESHOLD,
				updateIntervalMs:
					ENEMY_ENTITY_CONFIG.PLAYER_TRACKING.UPDATE_INTERVAL_MS,
			})
		) {
			send({
				type: ENEMY_EVENTS.UPDATE_PLAYER_POSITION,
				position: playerPosition,
			});
			lastPlayerPositionRef.current = [
				playerPosition[0],
				playerPosition[1],
				playerPosition[2],
			];
			elapsedSincePlayerSyncMsRef.current = 0;
		}

		const body = rigidBodyRef.current;
		if (!body) return;
		const current = body.translation();
		setEnemyPosition(id, current.x, current.y, current.z);
		const nextPos = getNextPosition(delta, [current.x, current.y, current.z]);
		const frameLinearVelocity = computeEnemyFrameLinearVelocity({
			currentPosition: [current.x, current.y, current.z],
			currentVerticalVelocity: body.linvel().y,
			delta,
			nextPosition: nextPos,
		});
		body.setLinvel(frameLinearVelocity, true);

		if (
			shouldRotateEnemy({
				movementThreshold: ENEMY_ENTITY_CONFIG.PHYSICS.MOVEMENT_THRESHOLD,
				velocityX: frameLinearVelocity.x,
				velocityZ: frameLinearVelocity.z,
			})
		) {
			body.setRotation(
				createSmoothedEnemyRotation({
					currentRotation: body.rotation() as Quaternion,
					delta,
					rotationSpeed: ENEMY_ENTITY_CONFIG.PHYSICS.ROTATION_SPEED,
					velocityX: frameLinearVelocity.x,
					velocityZ: frameLinearVelocity.z,
				}),
				true,
			);
		}
	});

	useEffect(() => {
		setEnemyPosition(id, position[0], position[1], position[2]);

		return () => {
			removeEnemyPosition(id);
		};
	}, [id, position]);
};
