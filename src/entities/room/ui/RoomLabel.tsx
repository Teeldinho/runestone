import { Html } from "@react-three/drei";
import { ROOM_ENTITY_CONFIG } from "../config";
import type { RoomLabelSettings } from "../model";

type RoomLabelProps = {
	settings: RoomLabelSettings;
};

export function RoomLabel({ settings }: RoomLabelProps) {
	if (!settings.isVisible) {
		return null;
	}

	return (
		<Html
			position={settings.position}
			center
			distanceFactor={ROOM_ENTITY_CONFIG.LABEL.DISTANCE_FACTOR}
			zIndexRange={[...ROOM_ENTITY_CONFIG.LABEL.DOM_Z_INDEX_RANGE]}
			className={ROOM_ENTITY_CONFIG.LABEL.WRAPPER_CLASS_NAME}
		>
			<span className={ROOM_ENTITY_CONFIG.LABEL.TEXT_CLASS_NAME}>
				{settings.text}
			</span>
		</Html>
	);
}
