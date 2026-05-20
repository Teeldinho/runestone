import {
	GRAPH_DIRECTION,
	STATE_VISUALIZER_COMPACT_DESKTOP_ORIENTATION_SECTION_IDS,
} from "../config";
import type { StateVisualizerSectionId } from "../model/types";

type ResolveStateVisualizerGraphDirectionInput = {
	readonly sectionId: StateVisualizerSectionId;
	readonly isDesktopLayout: boolean;
};

export const resolveStateVisualizerGraphDirection = ({
	sectionId,
	isDesktopLayout,
}: ResolveStateVisualizerGraphDirectionInput) => {
	const shouldUseDesktopOrientation =
		isDesktopLayout ||
		STATE_VISUALIZER_COMPACT_DESKTOP_ORIENTATION_SECTION_IDS.some(
			(compactDesktopOrientationSectionId) =>
				compactDesktopOrientationSectionId === sectionId,
		);

	return shouldUseDesktopOrientation
		? GRAPH_DIRECTION.VERTICAL
		: GRAPH_DIRECTION.HORIZONTAL;
};

export type { ResolveStateVisualizerGraphDirectionInput };
