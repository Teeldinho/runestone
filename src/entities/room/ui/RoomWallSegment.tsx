import { CuboidCollider, RigidBody } from "@react-three/rapier";
import type { Object3D } from "three";

import type { RoomWallSide } from "../config";
import { ROOM_ENTITY_CONFIG, ROOM_GEOMETRY } from "../config";
import type { RoomDoorConfig } from "../model";
import { useRoomWallSegment } from "../model/useRoomWallSegment";

type RoomWallSegmentProps = {
	side: RoomWallSide;
	wallScene: Object3D;
	doorwayScene: Object3D;
	torchScene: Object3D;
	doorConfig: RoomDoorConfig;
};

const DOOR_GATE = ROOM_ENTITY_CONFIG.DOORWAY_GATE;

export function RoomWallSegment({
	side,
	wallScene,
	doorwayScene,
	torchScene,
	doorConfig,
}: RoomWallSegmentProps) {
	const vm = useRoomWallSegment({ side, doorConfig });

	return (
		<>
			{ROOM_GEOMETRY.WALL_TILE_POSITIONS.map((tilePos) => {
				if (vm.door.hasDoor && tilePos === 0) {
					return (
						<group key={`doorway-${side}`}>
							<primitive
								object={doorwayScene.clone()}
								position={vm.doorGeometry.doorwayPosition}
								rotation={[0, vm.layout.rotationY, 0]}
								scale={vm.doorGeometry.doorwayScale}
							/>
							{vm.door.renderCollider && (
								<RigidBody type="fixed" colliders={false}>
									<CuboidCollider
										args={vm.doorGeometry.colliderHalfArgs}
										position={vm.doorGeometry.colliderPosition}
									/>
									{vm.door.locked && (
										<mesh
											castShadow
											receiveShadow
											position={vm.doorGeometry.colliderPosition}
										>
											<boxGeometry args={vm.doorGeometry.doorMeshArgs} />
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

				return (
					<RigidBody key={`${side}-${tilePos}`} type="fixed" colliders="cuboid">
						<primitive
							object={wallScene.clone()}
							position={vm.wallGeometry.getWallPosition(tilePos)}
							rotation={[0, vm.layout.rotationY, 0]}
							scale={vm.wallGeometry.wallScale}
						/>
						<mesh
							visible={false}
							position={vm.wallGeometry.getWallMeshPos(tilePos)}
						>
							<boxGeometry args={vm.wallGeometry.wallBoxArgs} />
						</mesh>
					</RigidBody>
				);
			})}

			{ROOM_GEOMETRY.WALL_TILE_POSITIONS.map((tilePos) => {
				if (vm.door.hasDoor && tilePos === 0) return null;

				return (
					<primitive
						key={`torch-${side}-${tilePos}`}
						object={torchScene.clone()}
						position={vm.torchGeometry.getTorchPos(tilePos)}
						rotation={[0, vm.layout.rotationY, 0]}
						scale={vm.torchGeometry.torchScale}
					/>
				);
			})}
		</>
	);
}
