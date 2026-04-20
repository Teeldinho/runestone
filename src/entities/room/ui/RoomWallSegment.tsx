import type { Object3D } from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { ROOM_CONFIG } from "@/shared/config";

import {
	ROOM_ENTITY_CONFIG,
	ROOM_GEOMETRY,
	ROOM_GLTF_CONFIG,
	ROOM_LIGHT_CONFIG,
	ROOM_WALL_LAYOUT,
} from "../config";
import type { RoomWallSide } from "../config";
import {
	hasOpening,
	isDoorLocked,
	shouldRenderCollider,
} from "../lib/roomWallPredicates";
import type { RoomDoorConfig, RoomWallOpening } from "../model";

type RoomWallSegmentProps = {
	side: RoomWallSide;
	wallScene: Object3D;
	doorwayScene: Object3D;
	torchScene: Object3D;
	doorConfig: RoomDoorConfig;
};

const DOOR_GATE = ROOM_ENTITY_CONFIG.DOORWAY_GATE;
const WALL_THICKNESS = ROOM_CONFIG.WALL_THICKNESS;
const ROOM_HEIGHT = ROOM_CONFIG.HEIGHT;

export function RoomWallSegment({
	side,
	wallScene,
	doorwayScene,
	torchScene,
	doorConfig,
}: RoomWallSegmentProps) {
	const layout = ROOM_WALL_LAYOUT[side];
	const { rotationY, isNorthSouth, offsetSign } = layout;

	const wallOffsetValue = isNorthSouth
		? offsetSign * ROOM_GEOMETRY.HALF_DEPTH
		: offsetSign * ROOM_GEOMETRY.HALF_WIDTH;

	const wallOpening = side as RoomWallOpening;
	const hasDoor = hasOpening(wallOpening, doorConfig.wallOpenings);
	const renderCollider = shouldRenderCollider(
		wallOpening,
		doorConfig.wallOpenings,
		doorConfig.openedDoorSides,
	);
	const locked = isDoorLocked(wallOpening, doorConfig.lockedDoorSides);

	const colliderArgs = isNorthSouth
		? ([DOOR_GATE.WIDTH / 2, DOOR_GATE.HEIGHT / 2, DOOR_GATE.THICKNESS / 2] as [number, number, number])
		: ([DOOR_GATE.THICKNESS / 2, DOOR_GATE.HEIGHT / 2, DOOR_GATE.WIDTH / 2] as [number, number, number]);

	const doorMeshArgs = isNorthSouth
		? ([DOOR_GATE.WIDTH, DOOR_GATE.HEIGHT, DOOR_GATE.THICKNESS] as [number, number, number])
		: ([DOOR_GATE.THICKNESS, DOOR_GATE.HEIGHT, DOOR_GATE.WIDTH] as [number, number, number]);

	const wallBoxArgs = isNorthSouth
		? ([4, ROOM_HEIGHT, WALL_THICKNESS] as [number, number, number])
		: ([WALL_THICKNESS, ROOM_HEIGHT, 4] as [number, number, number]);

	const colliderPosition = isNorthSouth
		? ([0, DOOR_GATE.POSITION_Y, wallOffsetValue] as [number, number, number])
		: ([wallOffsetValue, DOOR_GATE.POSITION_Y, 0] as [number, number, number]);

	const doorwayPosition = isNorthSouth
		? ([0, ROOM_GEOMETRY.WALL_Y, wallOffsetValue] as [number, number, number])
		: ([wallOffsetValue, ROOM_GEOMETRY.WALL_Y, 0] as [number, number, number]);

	return (
		<>
			{ROOM_GEOMETRY.WALL_TILE_POSITIONS.map((tilePos) => {
				if (hasDoor && tilePos === 0) {
					return (
						<group key={`doorway-${side}`}>
							<primitive
								object={doorwayScene.clone()}
								position={doorwayPosition}
								rotation={[0, rotationY, 0]}
								scale={ROOM_GLTF_CONFIG.WALL_DOORWAY.SCALE}
							/>
							{renderCollider && (
								<RigidBody type="fixed" colliders={false}>
									<CuboidCollider
										args={colliderArgs}
										position={colliderPosition}
									/>
									{locked && (
										<mesh
											castShadow
											receiveShadow
											position={colliderPosition}
										>
											<boxGeometry args={doorMeshArgs} />
											<meshStandardMaterial
												color={DOOR_GATE.COLOR}
												emissive={DOOR_GATE.EMISSIVE}
												emissiveIntensity={DOOR_GATE.EMISSIVE_INTENSITY}
												roughness={DOOR_GATE.ROUGHNESS}
												metalness={DOOR_GATE.METALNESS}
											/>
										</mesh>
									)}
								</RigidBody>
							)}
						</group>
					);
				}

				const wallPosition = isNorthSouth
					? ([tilePos, ROOM_GEOMETRY.WALL_Y, wallOffsetValue] as [number, number, number])
					: ([wallOffsetValue, ROOM_GEOMETRY.WALL_Y, tilePos] as [number, number, number]);

				const meshPosition = isNorthSouth
					? ([tilePos, 0, wallOffsetValue] as [number, number, number])
					: ([wallOffsetValue, 0, tilePos] as [number, number, number]);

				return (
					<RigidBody
						key={`${side}-${tilePos}`}
						type="fixed"
						colliders="cuboid"
					>
						<primitive
							object={wallScene.clone()}
							position={wallPosition}
							rotation={[0, rotationY, 0]}
							scale={ROOM_GLTF_CONFIG.WALL.SCALE}
						/>
						<mesh visible={false} position={meshPosition}>
							<boxGeometry args={wallBoxArgs} />
						</mesh>
					</RigidBody>
				);
			})}

			{ROOM_GEOMETRY.WALL_TILE_POSITIONS.map((tilePos) => {
				if (hasDoor && tilePos === 0) return null;

				const insetDir = -offsetSign;
				const torchPosition = isNorthSouth
					? ([tilePos, ROOM_LIGHT_CONFIG.HEIGHT, wallOffsetValue + insetDir * ROOM_GEOMETRY.TORCH_INSET] as [number, number, number])
					: ([wallOffsetValue + insetDir * ROOM_GEOMETRY.TORCH_INSET, ROOM_LIGHT_CONFIG.HEIGHT, tilePos] as [number, number, number]);

				return (
					<primitive
						key={`torch-${side}-${tilePos}`}
						object={torchScene.clone()}
						position={torchPosition}
						rotation={[0, rotationY, 0]}
						scale={ROOM_GLTF_CONFIG.TORCH.SCALE}
					/>
				);
			})}
		</>
	);
}
