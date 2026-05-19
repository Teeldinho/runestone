import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";

import { CORRIDOR_CONFIG, PHYSICS_COLLIDER_NAMES } from "@/shared/config";

import {
	CORRIDOR_ENTITY_CONFIG,
	CORRIDOR_FLOOR_COLLIDER,
	CORRIDOR_GLTF_CONFIG,
	CORRIDOR_HALF_WIDTH,
	CORRIDOR_LIGHT_CONFIG,
	CORRIDOR_WALL_Y,
} from "../config";
import {
	getCorridorFloorTilePositions,
	getCorridorSideWallColliders,
} from "../lib";
import { type CorridorMeshSettings, useCorridorMeshScenes } from "../model";

type CorridorMeshProps = {
	settings: CorridorMeshSettings;
};

export function CorridorMesh({ settings }: CorridorMeshProps) {
	const { floorScene, torchScene, wallScene, wallVariationScene } =
		useCorridorMeshScenes(settings.id);

	const floorTilePositions = useMemo(
		() =>
			getCorridorFloorTilePositions(
				CORRIDOR_CONFIG.WIDTH,
				CORRIDOR_CONFIG.DEPTH,
				CORRIDOR_GLTF_CONFIG.FLOOR_TILE.TILE_SIZE,
			),
		[],
	);

	const [leftWallCollider, rightWallCollider] = useMemo(
		() =>
			getCorridorSideWallColliders({
				depth: CORRIDOR_CONFIG.DEPTH,
				halfWidth: CORRIDOR_HALF_WIDTH,
				wallColliderThickness:
					CORRIDOR_ENTITY_CONFIG.DIMENSIONS.WALL_COLLIDER_THICKNESS,
				wallHeight: CORRIDOR_ENTITY_CONFIG.DIMENSIONS.WALL_HEIGHT,
			}),
		[],
	);

	return (
		<group
			position={settings.position}
			rotation={[0, settings.rotationYRad, 0]}
		>
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
			<RigidBody
				name={PHYSICS_COLLIDER_NAMES.WALKABLE_GROUND}
				type="fixed"
				colliders={false}
			>
				<CuboidCollider
					name={PHYSICS_COLLIDER_NAMES.WALKABLE_GROUND}
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
					position={[-CORRIDOR_HALF_WIDTH, CORRIDOR_WALL_Y, 0]}
					rotation={[0, -Math.PI / 2, 0]}
					castShadow
					receiveShadow
				/>
				<CuboidCollider
					args={leftWallCollider.args}
					position={leftWallCollider.position}
				/>
			</RigidBody>

			{/* Right wall — GLTF */}
			<RigidBody type="fixed" colliders={false}>
				<primitive
					object={wallScene.clone()}
					position={[CORRIDOR_HALF_WIDTH, CORRIDOR_WALL_Y, 0]}
					rotation={[0, Math.PI / 2, 0]}
					castShadow
					receiveShadow
				/>
				<CuboidCollider
					args={rightWallCollider.args}
					position={rightWallCollider.position}
				/>
			</RigidBody>

			{/* Torch — left wall midpoint */}
			<primitive
				object={torchScene.clone()}
				position={[
					-CORRIDOR_HALF_WIDTH + 0.15,
					CORRIDOR_LIGHT_CONFIG.HEIGHT,
					0,
				]}
				rotation={[0, -Math.PI / 2, 0]}
				scale={CORRIDOR_GLTF_CONFIG.TORCH.SCALE}
			/>
		</group>
	);
}
