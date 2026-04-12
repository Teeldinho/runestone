import { useGLTF } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";

import { ROOM_CONFIG } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/types";

import {
	ROOM_ENTITY_CONFIG,
	ROOM_FLOOR_COLLIDER,
	ROOM_GLTF_CONFIG,
	ROOM_LIGHT_CONFIG,
} from "../config";
import {
	getColumnPlacements,
	getFloorTilePositions,
	getRoomColumnColliderSettings,
	getTreasuryChestCollider,
	getTreasuryChestPosition,
} from "../lib";
import type { RoomSurfaceSettings, RoomWallOpening } from "../model";

type RoomMeshProps = {
	position: Vector3Tuple;
	surface: RoomSurfaceSettings;
	wallOpenings?: RoomWallOpening[];
	lockedDoorSides?: RoomWallOpening[];
	openedDoorSides?: RoomWallOpening[];
	isTreasury?: boolean;
	showTreasureKey?: boolean;
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
	lockedDoorSides = [],
	openedDoorSides = [],
	isTreasury = false,
	showTreasureKey = false,
	showGrid = false,
}: RoomMeshProps) {
	const { rune, grid, pillar } = surface;
	const hasOpening = (side: RoomWallOpening) => wallOpenings.includes(side);
	const isDoorLocked = (side: RoomWallOpening) =>
		lockedDoorSides.includes(side);
	const isDoorOpened = (side: RoomWallOpening) =>
		openedDoorSides.includes(side);
	const shouldRenderCollider = (side: RoomWallOpening) =>
		hasOpening(side) && !isDoorOpened(side);

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

	const columnColliders = useMemo(
		() => getRoomColumnColliderSettings(ROOM_CONFIG.WIDTH, ROOM_CONFIG.DEPTH),
		[],
	);

	const treasuryChestPosition = useMemo(
		() => getTreasuryChestPosition(ROOM_CONFIG.DEPTH),
		[],
	);

	const treasuryChestCollider = useMemo(
		() => getTreasuryChestCollider(ROOM_CONFIG.DEPTH),
		[],
	);

	return (
		<group position={position}>
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
				<>
					<primitive
						castShadow
						object={chestScene.clone()}
						position={treasuryChestPosition}
						scale={ROOM_GLTF_CONFIG.CHEST.SCALE}
					/>
					<RigidBody type="fixed" colliders={false}>
						<CuboidCollider
							args={treasuryChestCollider.args}
							position={treasuryChestCollider.position}
						/>
					</RigidBody>
				</>
			)}

			{showTreasureKey && (
				<group position={[0, ROOM_ENTITY_CONFIG.TREASURE_KEY.HEIGHT, 0]}>
					<mesh
						rotation={[Math.PI / 2, 0, 0]}
						position={[-ROOM_ENTITY_CONFIG.TREASURE_KEY.SHAFT_LENGTH / 2, 0, 0]}
					>
						<torusGeometry
							args={[
								ROOM_ENTITY_CONFIG.TREASURE_KEY.RING_RADIUS,
								ROOM_ENTITY_CONFIG.TREASURE_KEY.RING_TUBE_RADIUS,
								ROOM_ENTITY_CONFIG.TREASURE_KEY.RING_RADIAL_SEGMENTS,
								ROOM_ENTITY_CONFIG.TREASURE_KEY.RING_TUBULAR_SEGMENTS,
							]}
						/>
						<meshStandardMaterial
							color={ROOM_ENTITY_CONFIG.TREASURE_KEY.COLOR}
							emissive={ROOM_ENTITY_CONFIG.TREASURE_KEY.COLOR}
							emissiveIntensity={
								ROOM_ENTITY_CONFIG.TREASURE_KEY.EMISSIVE_INTENSITY
							}
							metalness={0.8}
							roughness={0.25}
						/>
					</mesh>
					<mesh rotation={[0, 0, Math.PI / 2]}>
						<cylinderGeometry
							args={[
								ROOM_ENTITY_CONFIG.TREASURE_KEY.SHAFT_RADIUS,
								ROOM_ENTITY_CONFIG.TREASURE_KEY.SHAFT_RADIUS,
								ROOM_ENTITY_CONFIG.TREASURE_KEY.SHAFT_LENGTH,
								12,
							]}
						/>
						<meshStandardMaterial
							color={ROOM_ENTITY_CONFIG.TREASURE_KEY.COLOR}
							emissive={ROOM_ENTITY_CONFIG.TREASURE_KEY.COLOR}
							emissiveIntensity={
								ROOM_ENTITY_CONFIG.TREASURE_KEY.EMISSIVE_INTENSITY
							}
							metalness={0.85}
							roughness={0.2}
						/>
					</mesh>
					<mesh
						position={[
							ROOM_ENTITY_CONFIG.TREASURE_KEY.SHAFT_LENGTH / 2,
							-ROOM_ENTITY_CONFIG.TREASURE_KEY.TOOTH_HEIGHT / 2,
							0,
						]}
					>
						<boxGeometry
							args={[
								ROOM_ENTITY_CONFIG.TREASURE_KEY.TOOTH_WIDTH,
								ROOM_ENTITY_CONFIG.TREASURE_KEY.TOOTH_HEIGHT,
								ROOM_ENTITY_CONFIG.TREASURE_KEY.TOOTH_DEPTH,
							]}
						/>
						<meshStandardMaterial
							color={ROOM_ENTITY_CONFIG.TREASURE_KEY.COLOR}
							emissive={ROOM_ENTITY_CONFIG.TREASURE_KEY.COLOR}
							emissiveIntensity={
								ROOM_ENTITY_CONFIG.TREASURE_KEY.EMISSIVE_INTENSITY
							}
							metalness={0.8}
							roughness={0.25}
						/>
					</mesh>
				</group>
			)}

			{/* North wall — tiled segments */}
			{[-4, 0, 4].map((x) => {
				if (hasOpening("north") && x === 0) {
					return (
						<group key="doorway-north">
							<primitive
								object={doorwayScene.clone()}
								position={[0, WALL_Y, -HALF_DEPTH]}
								rotation={[0, 0, 0]}
								scale={ROOM_GLTF_CONFIG.WALL_DOORWAY.SCALE}
							/>
							{shouldRenderCollider("north") && (
								<RigidBody type="fixed" colliders={false}>
									<CuboidCollider
										args={[
											ROOM_ENTITY_CONFIG.DOORWAY_GATE.WIDTH / 2,
											ROOM_ENTITY_CONFIG.DOORWAY_GATE.HEIGHT / 2,
											ROOM_ENTITY_CONFIG.DOORWAY_GATE.THICKNESS / 2,
										]}
										position={[
											0,
											ROOM_ENTITY_CONFIG.DOORWAY_GATE.POSITION_Y,
											-HALF_DEPTH,
										]}
									/>
									{isDoorLocked("north") && (
										<mesh
											castShadow
											receiveShadow
											position={[
												0,
												ROOM_ENTITY_CONFIG.DOORWAY_GATE.POSITION_Y,
												-HALF_DEPTH,
											]}
										>
											<boxGeometry
												args={[
													ROOM_ENTITY_CONFIG.DOORWAY_GATE.WIDTH,
													ROOM_ENTITY_CONFIG.DOORWAY_GATE.HEIGHT,
													ROOM_ENTITY_CONFIG.DOORWAY_GATE.THICKNESS,
												]}
											/>
											<meshStandardMaterial
												color={ROOM_ENTITY_CONFIG.DOORWAY_GATE.COLOR}
												emissive={ROOM_ENTITY_CONFIG.DOORWAY_GATE.EMISSIVE}
												emissiveIntensity={
													ROOM_ENTITY_CONFIG.DOORWAY_GATE.EMISSIVE_INTENSITY
												}
												roughness={0.45}
												metalness={0.55}
											/>
										</mesh>
									)}
								</RigidBody>
							)}
						</group>
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
						<group key="doorway-south">
							<primitive
								object={doorwayScene.clone()}
								position={[0, WALL_Y, HALF_DEPTH]}
								rotation={[0, Math.PI, 0]}
								scale={ROOM_GLTF_CONFIG.WALL_DOORWAY.SCALE}
							/>
							{shouldRenderCollider("south") && (
								<RigidBody type="fixed" colliders={false}>
									<CuboidCollider
										args={[
											ROOM_ENTITY_CONFIG.DOORWAY_GATE.WIDTH / 2,
											ROOM_ENTITY_CONFIG.DOORWAY_GATE.HEIGHT / 2,
											ROOM_ENTITY_CONFIG.DOORWAY_GATE.THICKNESS / 2,
										]}
										position={[
											0,
											ROOM_ENTITY_CONFIG.DOORWAY_GATE.POSITION_Y,
											HALF_DEPTH,
										]}
									/>
									{isDoorLocked("south") && (
										<mesh
											castShadow
											receiveShadow
											position={[
												0,
												ROOM_ENTITY_CONFIG.DOORWAY_GATE.POSITION_Y,
												HALF_DEPTH,
											]}
										>
											<boxGeometry
												args={[
													ROOM_ENTITY_CONFIG.DOORWAY_GATE.WIDTH,
													ROOM_ENTITY_CONFIG.DOORWAY_GATE.HEIGHT,
													ROOM_ENTITY_CONFIG.DOORWAY_GATE.THICKNESS,
												]}
											/>
											<meshStandardMaterial
												color={ROOM_ENTITY_CONFIG.DOORWAY_GATE.COLOR}
												emissive={ROOM_ENTITY_CONFIG.DOORWAY_GATE.EMISSIVE}
												emissiveIntensity={
													ROOM_ENTITY_CONFIG.DOORWAY_GATE.EMISSIVE_INTENSITY
												}
												roughness={0.45}
												metalness={0.55}
											/>
										</mesh>
									)}
								</RigidBody>
							)}
						</group>
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
						<group key="doorway-east">
							<primitive
								object={doorwayScene.clone()}
								position={[HALF_WIDTH, WALL_Y, 0]}
								rotation={[0, -Math.PI / 2, 0]}
								scale={ROOM_GLTF_CONFIG.WALL_DOORWAY.SCALE}
							/>
							{shouldRenderCollider("east") && (
								<RigidBody type="fixed" colliders={false}>
									<CuboidCollider
										args={[
											ROOM_ENTITY_CONFIG.DOORWAY_GATE.THICKNESS / 2,
											ROOM_ENTITY_CONFIG.DOORWAY_GATE.HEIGHT / 2,
											ROOM_ENTITY_CONFIG.DOORWAY_GATE.WIDTH / 2,
										]}
										position={[
											HALF_WIDTH,
											ROOM_ENTITY_CONFIG.DOORWAY_GATE.POSITION_Y,
											0,
										]}
									/>
									{isDoorLocked("east") && (
										<mesh
											castShadow
											receiveShadow
											position={[
												HALF_WIDTH,
												ROOM_ENTITY_CONFIG.DOORWAY_GATE.POSITION_Y,
												0,
											]}
										>
											<boxGeometry
												args={[
													ROOM_ENTITY_CONFIG.DOORWAY_GATE.THICKNESS,
													ROOM_ENTITY_CONFIG.DOORWAY_GATE.HEIGHT,
													ROOM_ENTITY_CONFIG.DOORWAY_GATE.WIDTH,
												]}
											/>
											<meshStandardMaterial
												color={ROOM_ENTITY_CONFIG.DOORWAY_GATE.COLOR}
												emissive={ROOM_ENTITY_CONFIG.DOORWAY_GATE.EMISSIVE}
												emissiveIntensity={
													ROOM_ENTITY_CONFIG.DOORWAY_GATE.EMISSIVE_INTENSITY
												}
												roughness={0.45}
												metalness={0.55}
											/>
										</mesh>
									)}
								</RigidBody>
							)}
						</group>
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
						<group key="doorway-west">
							<primitive
								object={doorwayScene.clone()}
								position={[-HALF_WIDTH, WALL_Y, 0]}
								rotation={[0, Math.PI / 2, 0]}
								scale={ROOM_GLTF_CONFIG.WALL_DOORWAY.SCALE}
							/>
							{shouldRenderCollider("west") && (
								<RigidBody type="fixed" colliders={false}>
									<CuboidCollider
										args={[
											ROOM_ENTITY_CONFIG.DOORWAY_GATE.THICKNESS / 2,
											ROOM_ENTITY_CONFIG.DOORWAY_GATE.HEIGHT / 2,
											ROOM_ENTITY_CONFIG.DOORWAY_GATE.WIDTH / 2,
										]}
										position={[
											-HALF_WIDTH,
											ROOM_ENTITY_CONFIG.DOORWAY_GATE.POSITION_Y,
											0,
										]}
									/>
									{isDoorLocked("west") && (
										<mesh
											castShadow
											receiveShadow
											position={[
												-HALF_WIDTH,
												ROOM_ENTITY_CONFIG.DOORWAY_GATE.POSITION_Y,
												0,
											]}
										>
											<boxGeometry
												args={[
													ROOM_ENTITY_CONFIG.DOORWAY_GATE.THICKNESS,
													ROOM_ENTITY_CONFIG.DOORWAY_GATE.HEIGHT,
													ROOM_ENTITY_CONFIG.DOORWAY_GATE.WIDTH,
												]}
											/>
											<meshStandardMaterial
												color={ROOM_ENTITY_CONFIG.DOORWAY_GATE.COLOR}
												emissive={ROOM_ENTITY_CONFIG.DOORWAY_GATE.EMISSIVE}
												emissiveIntensity={
													ROOM_ENTITY_CONFIG.DOORWAY_GATE.EMISSIVE_INTENSITY
												}
												roughness={0.45}
												metalness={0.55}
											/>
										</mesh>
									)}
								</RigidBody>
							)}
						</group>
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
