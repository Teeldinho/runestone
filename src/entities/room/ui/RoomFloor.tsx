import { CuboidCollider, RigidBody } from "@react-three/rapier";
import type { Object3D } from "three";

import type { Vector3Tuple } from "@/shared/lib";

import { ROOM_FLOOR_COLLIDER, ROOM_GEOMETRY, ROOM_GLTF_CONFIG } from "../config";
import type { CuboidColliderSettings } from "../lib";
import type { RoomSurfaceSettings } from "../model";

type RoomFloorScenes = {
	floor: Object3D;
	column: Object3D;
};

type RoomFloorLayout = {
	floorTilePositions: Vector3Tuple[];
	columnPositions: Vector3Tuple[];
	columnColliders: CuboidColliderSettings[];
};

type RoomFloorProps = {
	scenes: RoomFloorScenes;
	layout: RoomFloorLayout;
	surface: RoomSurfaceSettings;
	showGrid: boolean;
};

export function RoomFloor({
	scenes,
	layout,
	surface,
	showGrid,
}: RoomFloorProps) {
	const { rune, grid, pillar } = surface;
	const { floorTilePositions, columnPositions, columnColliders } = layout;

	return (
		<>
			{floorTilePositions.map(([x, , z]) => (
				<primitive
					key={`floor-${x}-${z}`}
					object={scenes.floor.clone()}
					position={[x, 0, z]}
					receiveShadow
					scale={ROOM_GLTF_CONFIG.FLOOR_TILE.SCALE}
				/>
			))}

			<RigidBody type="fixed" colliders={false}>
				<CuboidCollider
					args={[
						ROOM_GEOMETRY.HALF_WIDTH,
						ROOM_FLOOR_COLLIDER.HALF_HEIGHT,
						ROOM_GEOMETRY.HALF_DEPTH,
					]}
					position={[0, ROOM_FLOOR_COLLIDER.POSITION_Y, 0]}
				/>
			</RigidBody>

			{columnPositions.map(([cx, , cz]) => (
				<primitive
					key={`col-${cx}-${cz}`}
					castShadow
					object={scenes.column.clone()}
					position={[cx, 0, cz]}
					scale={ROOM_GLTF_CONFIG.COLUMN.SCALE}
				/>
			))}
			{columnColliders.map((columnCollider) => (
				<RigidBody
					key={`col-collider-${columnCollider.position[0]}-${columnCollider.position[2]}`}
					type="fixed"
					colliders={false}
				>
					<CuboidCollider
						args={columnCollider.args}
						position={columnCollider.position}
					/>
				</RigidBody>
			))}

			{showGrid && (
				<gridHelper
					args={[grid.size, grid.divisions, rune.sealedColor, pillar.color]}
					position={[0, ROOM_FLOOR_COLLIDER.GRID_OFFSET_Y, 0]}
				/>
			)}
		</>
	);
}
