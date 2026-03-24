import { RigidBody } from "@react-three/rapier";
import { DoubleSide } from "three";

import { ROOM_CONFIG } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/types";
import { ROOM_LIGHT_CONFIG } from "../config";
import type { RoomSurfaceSettings } from "../model";

type WallOpening = "north" | "south" | "east" | "west";

type RoomMeshProps = {
	position: Vector3Tuple;
	surface: RoomSurfaceSettings;
	wallOpenings?: WallOpening[];
};

const HALF_WIDTH = ROOM_CONFIG.WIDTH / 2;
const HALF_DEPTH = ROOM_CONFIG.DEPTH / 2;
const WALL_HALF_HEIGHT = ROOM_CONFIG.HEIGHT / 2;

export function RoomMesh({
	position,
	surface,
	wallOpenings = [],
}: RoomMeshProps) {
	const { floor, grid, pillar, rune, wall } = surface;
	const hasOpening = (side: WallOpening) => wallOpenings.includes(side);

	return (
		<group position={position}>
			<pointLight
				color={ROOM_LIGHT_CONFIG.COLOR}
				decay={ROOM_LIGHT_CONFIG.DECAY}
				distance={ROOM_LIGHT_CONFIG.DISTANCE}
				intensity={ROOM_LIGHT_CONFIG.INTENSITY}
				position={[0, ROOM_LIGHT_CONFIG.HEIGHT, 0]}
			/>

			{/* Floor - visual */}
			<mesh
				position={[0, floor.offsetY, 0]}
				receiveShadow
				rotation={[floor.rotationXRad, 0, 0]}
			>
				<planeGeometry args={floor.size} />
				<meshStandardMaterial
					color={floor.color}
					metalness={floor.metalness}
					roughness={floor.roughness}
					side={DoubleSide}
				/>
			</mesh>

			{/* Floor - physics collider */}
			<RigidBody type="fixed" colliders="cuboid">
				<mesh position={[0, floor.offsetY - 0.15, 0]} visible={false}>
					<boxGeometry args={[ROOM_CONFIG.WIDTH, 0.3, ROOM_CONFIG.DEPTH]} />
					<meshStandardMaterial color={floor.color} />
				</mesh>
			</RigidBody>

			{/* Pillar */}
			<mesh castShadow position={[0, pillar.positionY, 0]} receiveShadow>
				<cylinderGeometry
					args={[
						pillar.radius,
						pillar.radius,
						pillar.height,
						pillar.radialSegments,
					]}
				/>
				<meshStandardMaterial
					color={pillar.color}
					metalness={pillar.metalness}
					roughness={pillar.roughness}
				/>
			</mesh>

			{/* Rune orb */}
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

			{/* Grid */}
			<gridHelper
				args={[grid.size, grid.divisions, rune.sealedColor, pillar.color]}
				position={[0, floor.offsetY + grid.offsetY, 0]}
			/>

			{/* North wall */}
			{!hasOpening("north") && (
				<RigidBody type="fixed" colliders="cuboid">
					<mesh
						castShadow
						position={[0, WALL_HALF_HEIGHT, -HALF_DEPTH]}
						receiveShadow
					>
						<boxGeometry
							args={[
								ROOM_CONFIG.WIDTH,
								ROOM_CONFIG.HEIGHT,
								ROOM_CONFIG.WALL_THICKNESS,
							]}
						/>
						<meshStandardMaterial
							color={wall.color}
							metalness={wall.metalness}
							roughness={wall.roughness}
						/>
					</mesh>
				</RigidBody>
			)}

			{/* South wall */}
			{!hasOpening("south") && (
				<RigidBody type="fixed" colliders="cuboid">
					<mesh
						castShadow
						position={[0, WALL_HALF_HEIGHT, HALF_DEPTH]}
						receiveShadow
					>
						<boxGeometry
							args={[
								ROOM_CONFIG.WIDTH,
								ROOM_CONFIG.HEIGHT,
								ROOM_CONFIG.WALL_THICKNESS,
							]}
						/>
						<meshStandardMaterial
							color={wall.color}
							metalness={wall.metalness}
							roughness={wall.roughness}
						/>
					</mesh>
				</RigidBody>
			)}

			{/* East wall */}
			{!hasOpening("east") && (
				<RigidBody type="fixed" colliders="cuboid">
					<mesh
						castShadow
						position={[HALF_WIDTH, WALL_HALF_HEIGHT, 0]}
						receiveShadow
					>
						<boxGeometry
							args={[
								ROOM_CONFIG.WALL_THICKNESS,
								ROOM_CONFIG.HEIGHT,
								ROOM_CONFIG.DEPTH,
							]}
						/>
						<meshStandardMaterial
							color={wall.color}
							metalness={wall.metalness}
							roughness={wall.roughness}
						/>
					</mesh>
				</RigidBody>
			)}

			{/* West wall */}
			{!hasOpening("west") && (
				<RigidBody type="fixed" colliders="cuboid">
					<mesh
						castShadow
						position={[-HALF_WIDTH, WALL_HALF_HEIGHT, 0]}
						receiveShadow
					>
						<boxGeometry
							args={[
								ROOM_CONFIG.WALL_THICKNESS,
								ROOM_CONFIG.HEIGHT,
								ROOM_CONFIG.DEPTH,
							]}
						/>
						<meshStandardMaterial
							color={wall.color}
							metalness={wall.metalness}
							roughness={wall.roughness}
						/>
					</mesh>
				</RigidBody>
			)}
		</group>
	);
}
