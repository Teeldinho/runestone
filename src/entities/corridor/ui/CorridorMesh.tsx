import { useGLTF } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";

import { CORRIDOR_CONFIG } from "@/shared/config";

import {
	CORRIDOR_ENTITY_CONFIG,
	CORRIDOR_FLOOR_COLLIDER,
	CORRIDOR_GLTF_CONFIG,
	CORRIDOR_LIGHT_CONFIG,
} from "../config";
import { getCorridorFloorTilePositions } from "../lib";
import type { CorridorMeshSettings } from "../model";

type CorridorMeshProps = {
	settings: CorridorMeshSettings;
};

const HALF_WIDTH = CORRIDOR_CONFIG.WIDTH / 2;
const WALL_Y = 0;

useGLTF.preload(CORRIDOR_GLTF_CONFIG.WALL.PATH);
useGLTF.preload(CORRIDOR_GLTF_CONFIG.WALL_CRACKED.PATH);
useGLTF.preload(CORRIDOR_GLTF_CONFIG.WALL_SHELVES.PATH);
useGLTF.preload(CORRIDOR_GLTF_CONFIG.FLOOR_TILE.PATH);
useGLTF.preload(CORRIDOR_GLTF_CONFIG.TORCH.PATH);

export function CorridorMesh({ settings }: CorridorMeshProps) {
	const wallScene = useGLTF(CORRIDOR_GLTF_CONFIG.WALL.PATH).scene;
	const wallCrackedScene = useGLTF(
		CORRIDOR_GLTF_CONFIG.WALL_CRACKED.PATH,
	).scene;
	const wallShelvesScene = useGLTF(
		CORRIDOR_GLTF_CONFIG.WALL_SHELVES.PATH,
	).scene;
	const floorScene = useGLTF(CORRIDOR_GLTF_CONFIG.FLOOR_TILE.PATH).scene;
	const torchScene = useGLTF(CORRIDOR_GLTF_CONFIG.TORCH.PATH).scene;

	const floorTilePositions = useMemo(
		() =>
			getCorridorFloorTilePositions(
				CORRIDOR_CONFIG.WIDTH,
				CORRIDOR_CONFIG.DEPTH,
				CORRIDOR_GLTF_CONFIG.FLOOR_TILE.TILE_SIZE,
			),
		[],
	);

	const isCrackedWall = settings.id.endsWith("-wall-cracked");
	const wallVariationScene = isCrackedWall
		? wallCrackedScene
		: wallShelvesScene;

	return (
		<group
			position={settings.position}
			rotation={[0, settings.rotationYRad, 0]}
		>
			<pointLight
				color={CORRIDOR_LIGHT_CONFIG.COLOR}
				decay={CORRIDOR_LIGHT_CONFIG.DECAY}
				intensity={CORRIDOR_LIGHT_CONFIG.INTENSITY}
				position={[0, CORRIDOR_LIGHT_CONFIG.HEIGHT, 0]}
			/>

			{/* Floor tiles — GLTF */}
			{floorTilePositions.map(([x, , z]) => (
				<primitive
					key={`floor-${x}-${z}`}
					object={floorScene.clone()}
					position={[x, 0, z]}
					receiveShadow
					scale={CORRIDOR_GLTF_CONFIG.FLOOR_TILE.SCALE}
				/>
			))}

			{/* Floor — physics collider */}
			<RigidBody type="fixed" colliders={false}>
				<CuboidCollider
					args={[
						CORRIDOR_CONFIG.WIDTH / 2,
						CORRIDOR_FLOOR_COLLIDER.HALF_HEIGHT,
						CORRIDOR_CONFIG.DEPTH / 2,
					]}
					position={[0, CORRIDOR_FLOOR_COLLIDER.POSITION_Y, 0]}
				/>
			</RigidBody>

			{/* Left wall — GLTF with variation */}
			<RigidBody type="fixed" colliders={false}>
				<primitive
					object={wallVariationScene.clone()}
					position={[-HALF_WIDTH, WALL_Y, 0]}
					rotation={[0, -Math.PI / 2, 0]}
					castShadow
					receiveShadow
				/>
				<mesh
					visible={false}
					position={[
						-HALF_WIDTH,
						CORRIDOR_ENTITY_CONFIG.DIMENSIONS.WALL_HEIGHT / 2,
						0,
					]}
				>
					<boxGeometry
						args={[
							0.2,
							CORRIDOR_ENTITY_CONFIG.DIMENSIONS.WALL_HEIGHT,
							CORRIDOR_CONFIG.DEPTH,
						]}
					/>
				</mesh>
			</RigidBody>

			{/* Right wall — GLTF */}
			<RigidBody type="fixed" colliders={false}>
				<primitive
					object={wallScene.clone()}
					position={[HALF_WIDTH, WALL_Y, 0]}
					rotation={[0, Math.PI / 2, 0]}
					castShadow
					receiveShadow
				/>
				<mesh
					visible={false}
					position={[
						HALF_WIDTH,
						CORRIDOR_ENTITY_CONFIG.DIMENSIONS.WALL_HEIGHT / 2,
						0,
					]}
				>
					<boxGeometry
						args={[
							0.2,
							CORRIDOR_ENTITY_CONFIG.DIMENSIONS.WALL_HEIGHT,
							CORRIDOR_CONFIG.DEPTH,
						]}
					/>
				</mesh>
			</RigidBody>

			{/* Torch — left wall midpoint */}
			<primitive
				object={torchScene.clone()}
				position={[-HALF_WIDTH + 0.15, CORRIDOR_LIGHT_CONFIG.HEIGHT, 0]}
				rotation={[0, -Math.PI / 2, 0]}
				scale={CORRIDOR_GLTF_CONFIG.TORCH.SCALE}
			/>
		</group>
	);
}
