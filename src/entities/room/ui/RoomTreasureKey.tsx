import { ROOM_ENTITY_CONFIG } from "../config";
import { getKeyRingPosition, getKeyToothPosition } from "../lib";

type RoomTreasureKeyProps = {
	visible: boolean;
};

const KEY = ROOM_ENTITY_CONFIG.TREASURE_KEY;

export function RoomTreasureKey({ visible }: RoomTreasureKeyProps) {
	if (!visible) return null;

	const ringPosition = getKeyRingPosition(KEY.SHAFT_LENGTH);
	const toothPosition = getKeyToothPosition(KEY.SHAFT_LENGTH, KEY.TOOTH_HEIGHT);

	return (
		<group position={[0, KEY.HEIGHT, 0]}>
			<mesh rotation={KEY.RING_ROTATION} position={ringPosition}>
				<torusGeometry
					args={[
						KEY.RING_RADIUS,
						KEY.RING_TUBE_RADIUS,
						KEY.RING_RADIAL_SEGMENTS,
						KEY.RING_TUBULAR_SEGMENTS,
					]}
				/>
				<meshStandardMaterial
					color={KEY.COLOR}
					emissive={KEY.COLOR}
					emissiveIntensity={KEY.EMISSIVE_INTENSITY}
					metalness={KEY.RING_METALNESS}
					roughness={KEY.RING_ROUGHNESS}
				/>
			</mesh>
			<mesh rotation={KEY.SHAFT_ROTATION}>
				<cylinderGeometry
					args={[
						KEY.SHAFT_RADIUS,
						KEY.SHAFT_RADIUS,
						KEY.SHAFT_LENGTH,
						KEY.SHAFT_RADIAL_SEGMENTS,
					]}
				/>
				<meshStandardMaterial
					color={KEY.COLOR}
					emissive={KEY.COLOR}
					emissiveIntensity={KEY.EMISSIVE_INTENSITY}
					metalness={KEY.SHAFT_METALNESS}
					roughness={KEY.SHAFT_ROUGHNESS}
				/>
			</mesh>
			<mesh position={toothPosition}>
				<boxGeometry
					args={[KEY.TOOTH_WIDTH, KEY.TOOTH_HEIGHT, KEY.TOOTH_DEPTH]}
				/>
				<meshStandardMaterial
					color={KEY.COLOR}
					emissive={KEY.COLOR}
					emissiveIntensity={KEY.EMISSIVE_INTENSITY}
					metalness={KEY.TOOTH_METALNESS}
					roughness={KEY.TOOTH_ROUGHNESS}
				/>
			</mesh>
		</group>
	);
}
