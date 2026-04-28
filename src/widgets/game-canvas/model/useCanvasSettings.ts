import { createCanvasSettingsViewModel } from "../lib";

import type { CanvasSettingsViewModel } from "./canvasSettingsTypes";

export const useCanvasSettings = (): CanvasSettingsViewModel => {
	return createCanvasSettingsViewModel();
};
