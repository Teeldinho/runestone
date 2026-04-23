import { createTorchSettings } from "../lib";
import type { CanvasLightingSettings } from "./canvasSettingsTypes";

type SceneLightingViewModel = {
	torchSettings: ReturnType<typeof createTorchSettings>;
};

export const useSceneLighting = (
	lighting: CanvasLightingSettings,
): SceneLightingViewModel => {
	return {
		torchSettings: createTorchSettings(lighting),
	};
};

export type { SceneLightingViewModel };
