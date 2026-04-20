import { ROOM_ENTITY_CONFIG } from "../config";

type RoomTreasureKeyProps = {
	visible: boolean;
};

const KEY = ROOM_ENTITY_CONFIG.TREASURE_KEY;

export function RoomTreasureKey({ visible }: RoomTreasureKeyProps) {
	if (!visible) return null;

	return (
		<group position={[0, KEY.HEIGHT, 0]}>
			<mesh
				rotation={[Math.PI / 2, 0, 0]}
				position={[-KEY.SHAFT_LENGTH / 2, 0, 0]}
			>
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
			<mesh rotation={[0, 0, Math.PI / 2]}>
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
			<mesh
				position={[
					KEY.SHAFT_LENGTH / 2,
					-KEY.TOOTH_HEIGHT / 2,
					0,
				]}
			>
				<boxGeometry
					args={[
						KEY.TOOTH_WIDTH,
						KEY.TOOTH_HEIGHT,
						KEY.TOOTH_DEPTH,
					]}
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
