import { MOBILE_RUN_CONFIG } from "../config";

type ResolveMobileRunIntentInput = {
	readonly magnitude: number;
};

export const resolveMobileRunIntent = ({
	magnitude,
}: ResolveMobileRunIntentInput): boolean =>
	magnitude >= MOBILE_RUN_CONFIG.RUN_MAGNITUDE_MIN;
