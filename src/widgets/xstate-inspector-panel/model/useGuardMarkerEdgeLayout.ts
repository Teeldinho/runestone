import { useResponsiveLayout } from "@/shared/lib";

import {
	computeGuardMarkerEdgeLayout,
	type GuardMarkerDirectionIndicatorMode,
	type GuardMarkerEdgeLayoutInput,
	type GuardMarkerEdgeLayoutResult,
} from "../lib";

export type { GuardMarkerDirectionIndicatorMode };

export function useGuardMarkerEdgeLayout(
	input: GuardMarkerEdgeLayoutInput,
): GuardMarkerEdgeLayoutResult {
	const { isDesktopLayout, isLandscape } = useResponsiveLayout();

	return computeGuardMarkerEdgeLayout(input, { isDesktopLayout, isLandscape });
}
