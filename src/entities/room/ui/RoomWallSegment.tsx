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
				if (vm.hasDoor && tilePos === 0) {
					return (
						<group key={`doorway-${side}`}>
							<primitive
								object={doorwayScene.clone()}
								position={vm.doorwayPosition}
								rotation={[0, vm.rotationY, 0]}
								scale={vm.doorwayScale}
							/>
							{vm.renderCollider && (
								<RigidBody type="fixed" colliders={false}>
									<CuboidCollider
										args={vm.colliderHalfArgs}
										position={vm.colliderPosition}
									/>
									{vm.locked && (
										<mesh
											castShadow
											receiveShadow
											position={vm.colliderPosition}
										>
											<boxGeometry args={vm.doorMeshArgs} />
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
							position={vm.getWallPosition(tilePos)}
							rotation={[0, vm.rotationY, 0]}
							scale={vm.wallScale}
						/>
						<mesh visible={false} position={vm.getWallMeshPos(tilePos)}>
							<boxGeometry args={vm.wallBoxArgs} />
						</mesh>
					</RigidBody>
				);
			})}

			{ROOM_GEOMETRY.WALL_TILE_POSITIONS.map((tilePos) => {
				if (vm.hasDoor && tilePos === 0) return null;

				return (
					<primitive
						key={`torch-${side}-${tilePos}`}
						object={torchScene.clone()}
						position={vm.getTorchPos(tilePos)}
						rotation={[0, vm.rotationY, 0]}
						scale={vm.torchScale}
					/>
				);
			})}
		</>
	);
}
