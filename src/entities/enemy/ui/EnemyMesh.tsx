import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { RapierRigidBody } from "@react-three/rapier";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import type { RefObject } from "react";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { clone as skeletonClone } from "three/examples/jsm/utils/SkeletonUtils.js";
import {
	removeEnemyPosition,
	setEnemyPosition,
} from "@/shared/lib/enemyPositionStore";
import { getPlayerPosition } from "@/shared/lib/playerPositionStore";
import { getQuaternionFromXZ } from "@/shared/lib/vec3";
import type { Vector3Tuple } from "@/shared/lib";

import {
	ENEMY_ANIMATION_PATHS,
	ENEMY_ENTITY_CONFIG,
	ENEMY_EVENTS,
	ENEMY_GLTF_CONFIG,
} from "../config";
import { shouldSyncEnemyPlayerPosition } from "../lib";
import { useEnemyMeshViewModel } from "../model/useEnemyMeshViewModel";
import { useEnemyMovement } from "../model/useEnemyMovement";

useGLTF.preload(ENEMY_GLTF_CONFIG.CHARACTER.PATH);
useGLTF.preload(ENEMY_ANIMATION_PATHS.MOVEMENT_BASIC);
useGLTF.preload(ENEMY_ANIMATION_PATHS.GENERAL);
useGLTF.preload(ENEMY_ANIMATION_PATHS.COMBAT_MELEE);

type EnemyMeshProps = {
	id: string;
	roomId: string;
	position: Vector3Tuple;
	patrolCenter: Vector3Tuple;
	onDead: () => void;
	onAttack: () => void;
};

export function EnemyMesh({
	id,
	roomId,
	position,
	patrolCenter,
	onDead,
	onAttack,
}: EnemyMeshProps) {
	const rigidBodyRef = useRef<RapierRigidBody>(null);
	const groupRef = useRef<THREE.Group>(null);
	const targetRotationRef = useRef(new THREE.Quaternion());
	const currentRotationRef = useRef(new THREE.Quaternion());

	const { glowSettings, animationName, behaviorState, send } =
		useEnemyMeshViewModel({
			id,
			roomId,
			position,
			onDead,
			onAttack,
		});

	const { getNextPosition } = useEnemyMovement({
		behaviorState,
		getPlayerPosition,
		patrolCenter,
	});
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
		const currentLinvel = body.linvel();
		const vx = (nextPos[0] - current.x) / delta;
		const vz = (nextPos[2] - current.z) / delta;
		body.setLinvel(
			{
				x: vx,
				y: currentLinvel.y,
				z: vz,
			},
			true,
		);

		// Rotate toward movement direction
		const isMoving = Math.abs(vx) > 0.01 || Math.abs(vz) > 0.01;
		if (isMoving) {
			targetRotationRef.current.copy(getQuaternionFromXZ(vx, vz));
			currentRotationRef.current.copy(body.rotation() as THREE.Quaternion);
			currentRotationRef.current.slerp(
				targetRotationRef.current,
				ENEMY_ENTITY_CONFIG.PHYSICS.ROTATION_SPEED * delta,
			);
			body.setRotation(currentRotationRef.current, true);
		}
	});

	const { scene: rawScene } = useGLTF(ENEMY_GLTF_CONFIG.CHARACTER.PATH);
	const { animations: moveAnims } = useGLTF(
		ENEMY_ANIMATION_PATHS.MOVEMENT_BASIC,
	);
	const { animations: generalAnims } = useGLTF(ENEMY_ANIMATION_PATHS.GENERAL);
	const { animations: meleeAnims } = useGLTF(
		ENEMY_ANIMATION_PATHS.COMBAT_MELEE,
	);

	const clonedScene = useMemo(() => skeletonClone(rawScene), [rawScene]);
	const allAnims = useMemo(
		() => [...moveAnims, ...generalAnims, ...meleeAnims],
		[moveAnims, generalAnims, meleeAnims],
	);

	const { actions } = useAnimations(allAnims, groupRef);

	useEffect(() => {
		setEnemyPosition(id, position[0], position[1], position[2]);

		return () => {
			removeEnemyPosition(id);
		};
	}, [id, position]);

	useEffect(() => {
		const action = actions[animationName];
		if (!action) return;
		action.reset().fadeIn(0.2).play();
		return () => {
			action.fadeOut(0.2);
		};
	}, [actions, animationName]);

	return (
		<RigidBody
			ref={rigidBodyRef as RefObject<RapierRigidBody>}
			colliders={false}
			linearDamping={ENEMY_ENTITY_CONFIG.PHYSICS.LINEAR_DAMPING}
			lockRotations
			position={position}
			type="dynamic"
		>
			<CapsuleCollider
				args={[
					ENEMY_ENTITY_CONFIG.COLLIDER.HALF_HEIGHT,
					ENEMY_ENTITY_CONFIG.COLLIDER.RADIUS,
				]}
			/>
			<group ref={groupRef}>
				<primitive
					frustumCulled={false}
					object={clonedScene}
					position={[0, ENEMY_GLTF_CONFIG.CHARACTER.POSITION_Y, 0]}
					scale={ENEMY_GLTF_CONFIG.CHARACTER.SCALE}
				/>
				<mesh
					position={[0, ENEMY_ENTITY_CONFIG.GLOW.OFFSET_Y, 0]}
					rotation={[ENEMY_ENTITY_CONFIG.GLOW.ROTATION_X_RAD, 0, 0]}
				>
					<torusGeometry
						args={[
							ENEMY_ENTITY_CONFIG.GLOW.RADIUS,
							ENEMY_ENTITY_CONFIG.GLOW.TUBE_RADIUS,
							ENEMY_ENTITY_CONFIG.GLOW.RADIAL_SEGMENTS,
							ENEMY_ENTITY_CONFIG.GLOW.TUBULAR_SEGMENTS,
						]}
					/>
					<meshStandardMaterial
						color={glowSettings.color}
						emissive={glowSettings.color}
						emissiveIntensity={glowSettings.emissiveIntensity}
						opacity={ENEMY_ENTITY_CONFIG.GLOW.MATERIAL_OPACITY}
						transparent
					/>
				</mesh>
			</group>
		</RigidBody>
	);
}
