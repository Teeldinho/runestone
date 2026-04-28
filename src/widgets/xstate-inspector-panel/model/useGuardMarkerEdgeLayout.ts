import { useResponsiveLayout } from "@/shared/lib";

import {
	createGuardMarkerEdgeLayoutViewModel,
	type GuardMarkerEdgeLayoutInput,
	type GuardMarkerEdgeLayoutViewModel,
} from "../lib";

export function useGuardMarkerEdgeLayout({
	...layoutInput
}: GuardMarkerEdgeLayoutInput): GuardMarkerEdgeLayoutViewModel {
	const { isDesktopLayout, isLandscape } = useResponsiveLayout();

	return createGuardMarkerEdgeLayoutViewModel({
		...layoutInput,
		isDesktopLayout,
		isLandscape,
	});
}

export type { GuardMarkerEdgeLayoutInput, GuardMarkerEdgeLayoutViewModel };
