import { useGLTF } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";

import { ROOM_CONFIG } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/types";

import { ROOM_FLOOR_COLLIDER, ROOM_GLTF_CONFIG, ROOM_LIGHT_CONFIG } from "../config";
import { getColumnPlacements, getFloorTilePositions } from "../lib";
import type { RoomSurfaceSettings } from "../model";

type WallOpening = "north" | "south" | "east" | "west";

type RoomMeshProps = {
	position: Vector3Tuple;
	surface: RoomSurfaceSettings;
	wallOpenings?: WallOpening[];
	isTreasury?: boolean;
	showGrid?: boolean;
};

const HALF_WIDTH = ROOM_CONFIG.WIDTH / 2;
const HALF_DEPTH = ROOM_CONFIG.DEPTH / 2;
const WALL_Y = 0;

useGLTF.preload(ROOM_GLTF_CONFIG.FLOOR_TILE.PATH);
useGLTF.preload(ROOM_GLTF_CONFIG.WALL.PATH);
useGLTF.preload(ROOM_GLTF_CONFIG.WALL_DOORWAY.PATH);
useGLTF.preload(ROOM_GLTF_CONFIG.COLUMN.PATH);
useGLTF.preload(ROOM_GLTF_CONFIG.TORCH.PATH);
useGLTF.preload(ROOM_GLTF_CONFIG.CHEST.PATH);

export function RoomMesh({
	position,
	surface,
	wallOpenings = [],
	isTreasury = false,
	showGrid = false,
}: RoomMeshProps) {
	const { rune, grid, pillar } = surface;
	const hasOpening = (side: WallOpening) => wallOpenings.includes(side);

	const floorScene = useGLTF(ROOM_GLTF_CONFIG.FLOOR_TILE.PATH).scene;
	const wallScene = useGLTF(ROOM_GLTF_CONFIG.WALL.PATH).scene;
	const doorwayScene = useGLTF(ROOM_GLTF_CONFIG.WALL_DOORWAY.PATH).scene;
	const columnScene = useGLTF(ROOM_GLTF_CONFIG.COLUMN.PATH).scene;
	const torchScene = useGLTF(ROOM_GLTF_CONFIG.TORCH.PATH).scene;
	const chestScene = useGLTF(ROOM_GLTF_CONFIG.CHEST.PATH).scene;

	const floorTilePositions = useMemo(
		() =>
			getFloorTilePositions(
				ROOM_CONFIG.WIDTH,
				ROOM_CONFIG.DEPTH,
				ROOM_GLTF_CONFIG.FLOOR_TILE.TILE_SIZE,
			),
		[],
	);

	const columnPositions = useMemo(
		() => getColumnPlacements(ROOM_CONFIG.WIDTH, ROOM_CONFIG.DEPTH),
		[],
	);

	return (
		<group position={position}>
			<pointLight
				color={ROOM_LIGHT_CONFIG.COLOR}
				decay={ROOM_LIGHT_CONFIG.DECAY}
				distance={ROOM_LIGHT_CONFIG.DISTANCE}
				intensity={ROOM_LIGHT_CONFIG.INTENSITY}
				position={[0, ROOM_LIGHT_CONFIG.HEIGHT, 0]}
			/>

			{/* Floor tiles — GLTF */}
			{floorTilePositions.map(([x, , z]) => (
				<primitive
					key={`floor-${x}-${z}`}
					object={floorScene.clone()}
					position={[x, 0, z]}
					receiveShadow
					scale={ROOM_GLTF_CONFIG.FLOOR_TILE.SCALE}
				/>
			))}

			{/* Floor - physics collider */}
			<RigidBody type="fixed" colliders={false}>
				<CuboidCollider
					args={[HALF_WIDTH, ROOM_FLOOR_COLLIDER.HALF_HEIGHT, HALF_DEPTH]}
					position={[0, ROOM_FLOOR_COLLIDER.POSITION_Y, 0]}
				/>
			</RigidBody>

			{/* Columns — GLTF (4 inner corners) */}
			{columnPositions.map(([cx, , cz]) => (
				<primitive
					key={`col-${cx}-${cz}`}
					castShadow
					object={columnScene.clone()}
					position={[cx, 0, cz]}
					scale={ROOM_GLTF_CONFIG.COLUMN.SCALE}
				/>
			))}

			{/* Rune orb (keep procedural — it's game state visual) */}
			<mesh castShadow position={[0, rune.orbHeight, 0]}>
				<sphereGeometry
					args={[rune.orbRadius, rune.orbWidthSegments, rune.orbHeightSegments]}
				/>
				<meshStandardMaterial
					color={rune.activeColor}
					emissive={rune.openColor}
					emissiveIntensity={rune.emissiveIntensity}
				/>
			</mesh>

			{showGrid && (
				<gridHelper
					args={[grid.size, grid.divisions, rune.sealedColor, pillar.color]}
					position={[0, 0.04, 0]}
				/>
			)}

			{/* Treasury chest */}
			{isTreasury && (
				<primitive
					castShadow
					object={chestScene.clone()}
					position={[0, 0, -HALF_DEPTH * 0.5]}
					scale={ROOM_GLTF_CONFIG.CHEST.SCALE}
				/>
			)}

			{/* North wall — tiled segments */}
			{[-4, 0, 4].map((x) => {
				if (hasOpening("north") && x === 0) {
					return (
						<primitive
							key="doorway-north"
							object={doorwayScene.clone()}
							position={[0, WALL_Y, -HALF_DEPTH]}
							rotation={[0, 0, 0]}
							scale={ROOM_GLTF_CONFIG.WALL_DOORWAY.SCALE}
						/>
					);
				}
				return (
					<RigidBody key={`north-${x}`} type="fixed" colliders="cuboid">
						<primitive
							object={wallScene.clone()}
							position={[x, WALL_Y, -HALF_DEPTH]}
							rotation={[0, 0, 0]}
							scale={ROOM_GLTF_CONFIG.WALL.SCALE}
						/>
						<mesh visible={false} position={[x, 0, -HALF_DEPTH]}>
							<boxGeometry
								args={[4, ROOM_CONFIG.HEIGHT, ROOM_CONFIG.WALL_THICKNESS]}
							/>
						</mesh>
					</RigidBody>
				);
			})}

			{/* North wall torches */}
			{[-4, 0, 4].map((x) => {
				if (hasOpening("north") && x === 0) return null;
				return (
					<primitive
						key={`torch-north-${x}`}
						object={torchScene.clone()}
						position={[x, ROOM_LIGHT_CONFIG.HEIGHT, -HALF_DEPTH + 0.2]}
						scale={ROOM_GLTF_CONFIG.TORCH.SCALE}
					/>
				);
			})}

			{/* South wall — tiled segments */}
			{[-4, 0, 4].map((x) => {
				if (hasOpening("south") && x === 0) {
					return (
						<primitive
							key="doorway-south"
							object={doorwayScene.clone()}
							position={[0, WALL_Y, HALF_DEPTH]}
							rotation={[0, Math.PI, 0]}
							scale={ROOM_GLTF_CONFIG.WALL_DOORWAY.SCALE}
						/>
					);
				}
				return (
					<RigidBody key={`south-${x}`} type="fixed" colliders="cuboid">
						<primitive
							object={wallScene.clone()}
							position={[x, WALL_Y, HALF_DEPTH]}
							rotation={[0, Math.PI, 0]}
							scale={ROOM_GLTF_CONFIG.WALL.SCALE}
						/>
						<mesh visible={false} position={[x, 0, HALF_DEPTH]}>
							<boxGeometry
								args={[4, ROOM_CONFIG.HEIGHT, ROOM_CONFIG.WALL_THICKNESS]}
							/>
						</mesh>
					</RigidBody>
				);
			})}

			{/* South wall torches */}
			{[-4, 0, 4].map((x) => {
				if (hasOpening("south") && x === 0) return null;
				return (
					<primitive
						key={`torch-south-${x}`}
						object={torchScene.clone()}
						position={[x, ROOM_LIGHT_CONFIG.HEIGHT, HALF_DEPTH - 0.2]}
						rotation={[0, Math.PI, 0]}
						scale={ROOM_GLTF_CONFIG.TORCH.SCALE}
					/>
				);
			})}

			{/* East wall — tiled segments */}
			{[-4, 0, 4].map((z) => {
				if (hasOpening("east") && z === 0) {
					return (
						<primitive
							key="doorway-east"
							object={doorwayScene.clone()}
							position={[HALF_WIDTH, WALL_Y, 0]}
							rotation={[0, -Math.PI / 2, 0]}
							scale={ROOM_GLTF_CONFIG.WALL_DOORWAY.SCALE}
						/>
					);
				}
				return (
					<RigidBody key={`east-${z}`} type="fixed" colliders="cuboid">
						<primitive
							object={wallScene.clone()}
							position={[HALF_WIDTH, WALL_Y, z]}
							rotation={[0, -Math.PI / 2, 0]}
							scale={ROOM_GLTF_CONFIG.WALL.SCALE}
						/>
						<mesh visible={false} position={[HALF_WIDTH, 0, z]}>
							<boxGeometry
								args={[ROOM_CONFIG.WALL_THICKNESS, ROOM_CONFIG.HEIGHT, 4]}
							/>
						</mesh>
					</RigidBody>
				);
			})}

			{/* East wall torches */}
			{[-4, 0, 4].map((z) => {
				if (hasOpening("east") && z === 0) return null;
				return (
					<primitive
						key={`torch-east-${z}`}
						object={torchScene.clone()}
						position={[HALF_WIDTH - 0.2, ROOM_LIGHT_CONFIG.HEIGHT, z]}
						rotation={[0, -Math.PI / 2, 0]}
						scale={ROOM_GLTF_CONFIG.TORCH.SCALE}
					/>
				);
			})}

			{/* West wall — tiled segments */}
			{[-4, 0, 4].map((z) => {
				if (hasOpening("west") && z === 0) {
					return (
						<primitive
							key="doorway-west"
							object={doorwayScene.clone()}
							position={[-HALF_WIDTH, WALL_Y, 0]}
							rotation={[0, Math.PI / 2, 0]}
							scale={ROOM_GLTF_CONFIG.WALL_DOORWAY.SCALE}
						/>
					);
				}
				return (
					<RigidBody key={`west-${z}`} type="fixed" colliders="cuboid">
						<primitive
							object={wallScene.clone()}
							position={[-HALF_WIDTH, WALL_Y, z]}
							rotation={[0, Math.PI / 2, 0]}
							scale={ROOM_GLTF_CONFIG.WALL.SCALE}
						/>
						<mesh visible={false} position={[-HALF_WIDTH, 0, z]}>
							<boxGeometry
								args={[ROOM_CONFIG.WALL_THICKNESS, ROOM_CONFIG.HEIGHT, 4]}
							/>
						</mesh>
					</RigidBody>
				);
			})}

			{/* West wall torches */}
			{[-4, 0, 4].map((z) => {
				if (hasOpening("west") && z === 0) return null;
				return (
					<primitive
						key={`torch-west-${z}`}
						object={torchScene.clone()}
						position={[-HALF_WIDTH + 0.2, ROOM_LIGHT_CONFIG.HEIGHT, z]}
						rotation={[0, Math.PI / 2, 0]}
						scale={ROOM_GLTF_CONFIG.TORCH.SCALE}
					/>
				);
			})}
		</group>
	);
}
