import { INSPECTOR_FLOW_EDGE_LAYOUT } from "../config";

const getUniqueGuardKeys = (guardKeys: string[]): string[] => {
	return Array.from(new Set(guardKeys));
};

export const createGuardColorByKey = (
	guardKeys: string[],
): Record<string, string> => {
	const uniqueGuardKeys = getUniqueGuardKeys(guardKeys);

	return uniqueGuardKeys.reduce<Record<string, string>>(
		(colorByKey, guardKey, index) => {
			colorByKey[guardKey] =
				INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_COLORS[
					index % INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_COLORS.length
				];

			return colorByKey;
		},
		{},
	);
};
