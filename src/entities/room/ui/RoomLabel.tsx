import { Text } from "@react-three/drei";
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
		<Text
			anchorX="center"
			anchorY="middle"
			color={ROOM_ENTITY_CONFIG.LABEL.COLOR}
			fontSize={ROOM_ENTITY_CONFIG.LABEL.FONT_SIZE}
			maxWidth={ROOM_ENTITY_CONFIG.LABEL.MAX_WIDTH}
			outlineColor={ROOM_ENTITY_CONFIG.LABEL.OUTLINE_COLOR}
			outlineWidth={ROOM_ENTITY_CONFIG.LABEL.OUTLINE_WIDTH}
			position={settings.position}
		>
			{settings.text}
		</Text>
	);
}
