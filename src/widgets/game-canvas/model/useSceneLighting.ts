import { useMemo } from "react";

import { createTorchSettings } from "../lib";
import type { CanvasLightingSettings } from "./canvasSettingsTypes";

type SceneLightingViewModel = {
	torchSettings: ReturnType<typeof createTorchSettings>;
};

export const useSceneLighting = (
	lighting: CanvasLightingSettings,
): SceneLightingViewModel => {
	return useMemo(
		() => ({
			torchSettings: createTorchSettings(lighting),
		}),
		[lighting],
	);
};

export type { SceneLightingViewModel };
