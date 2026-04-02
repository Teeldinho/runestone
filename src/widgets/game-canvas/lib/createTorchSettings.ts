import type { RoomTorchSettings } from "@/entities/room";

import type { CanvasLightingSettings } from "../model/useCanvasSettings";

export const createTorchSettings = (
	lighting: CanvasLightingSettings,
): RoomTorchSettings[] => {
	return lighting.torch.positions.map((position) => {
		return {
			color: lighting.torch.color,
			decay: lighting.torch.decay,
			distance: lighting.torch.distance,
			intensity: lighting.torch.intensity,
			position,
		};
	});
};
