import { useMemo } from "react";

import { createCanvasSettingsViewModel } from "../lib/createCanvasSettingsViewModel";

import type { CanvasSettingsViewModel } from "./canvasSettingsTypes";

export const useCanvasSettings = (): CanvasSettingsViewModel => {
	return useMemo(() => createCanvasSettingsViewModel(), []);
};
