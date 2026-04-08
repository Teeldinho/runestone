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
			style={{ pointerEvents: "none" }}
		>
			<span
				style={{
					color: ROOM_ENTITY_CONFIG.LABEL.COLOR,
					fontFamily: "Space Grotesk, sans-serif",
					fontSize: "1.3rem",
					fontWeight: 700,
					letterSpacing: "0.02em",
					padding: "0.15rem 0.35rem",
					borderRadius: "0.2rem",
					textShadow: `0 0 6px ${ROOM_ENTITY_CONFIG.LABEL.OUTLINE_COLOR}, 0 0 1px ${ROOM_ENTITY_CONFIG.LABEL.OUTLINE_COLOR}`,
					whiteSpace: "nowrap",
				}}
			>
				{settings.text}
			</span>
		</Html>
	);
}
