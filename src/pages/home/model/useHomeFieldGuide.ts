import { useEffect, useState } from "react";

import { HOME_FIELD_GUIDE_VALUES, type HomeFieldGuideValue } from "../config";

type HomeFieldGuideViewModel = {
	activeValue: HomeFieldGuideValue;
	handleValueChange: (value: string) => void;
};

export const useHomeFieldGuide = (): HomeFieldGuideViewModel => {
	const [activeValue, setActiveValue] = useState<HomeFieldGuideValue>(
		HOME_FIELD_GUIDE_VALUES.MACHINE,
	);

	useEffect(() => {
		const syncValueFromHash = () => {
			setActiveValue(
				window.location.hash === `#${HOME_FIELD_GUIDE_VALUES.CONTROLS}`
					? HOME_FIELD_GUIDE_VALUES.CONTROLS
					: HOME_FIELD_GUIDE_VALUES.MACHINE,
			);
		};

		syncValueFromHash();
		window.addEventListener("hashchange", syncValueFromHash);

		return () => window.removeEventListener("hashchange", syncValueFromHash);
	}, []);

	return {
		activeValue,
		handleValueChange: (value) => {
			if (
				value !== HOME_FIELD_GUIDE_VALUES.MACHINE &&
				value !== HOME_FIELD_GUIDE_VALUES.CONTROLS
			) {
				return;
			}

			setActiveValue(value);
			window.history.replaceState(null, "", `#${value}`);
		},
	};
};
