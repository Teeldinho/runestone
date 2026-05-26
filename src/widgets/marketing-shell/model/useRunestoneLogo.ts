import type { RunestoneLogoVariant } from "../config";
import { createRunestoneLogoViewModel } from "../lib";

export const useRunestoneLogo = (variant: RunestoneLogoVariant) => {
	return createRunestoneLogoViewModel({ variant });
};
