import { ROOM_ENTITY_CONFIG } from "../config";
import type { RoomTorchSettings } from "../model";

type TorchLightProps = {
	settings: RoomTorchSettings;
};

export function TorchLight({ settings }: TorchLightProps) {
	return (
		<>
			<pointLight
				color={settings.color}
				decay={settings.decay}
				distance={settings.distance}
				intensity={settings.intensity}
				position={settings.position}
			/>

			<mesh position={settings.position}>
				<sphereGeometry
					args={[
						ROOM_ENTITY_CONFIG.TORCH.ORB_RADIUS,
						ROOM_ENTITY_CONFIG.TORCH.ORB_WIDTH_SEGMENTS,
						ROOM_ENTITY_CONFIG.TORCH.ORB_HEIGHT_SEGMENTS,
					]}
				/>
				<meshStandardMaterial
					color={ROOM_ENTITY_CONFIG.TORCH.COLOR}
					emissive={ROOM_ENTITY_CONFIG.TORCH.COLOR}
					emissiveIntensity={ROOM_ENTITY_CONFIG.TORCH.ORB_EMISSIVE_INTENSITY}
				/>
			</mesh>
		</>
	);
}
