import type { AuthContextValue } from "@/features/auth";

import {
	TUTORIAL_CAMERA_MODES,
	TUTORIAL_CONTROL_GROUPS,
	TUTORIAL_CONTROLS_COPY,
	TUTORIAL_FIRST_RUN_COPY,
	TUTORIAL_FIRST_RUN_STEPS,
	type TutorialControlTone,
} from "../config";

import { resolveTutorialIcon } from "./resolveTutorialIcon";

type CreateTutorialPageViewModelInput = Pick<
	AuthContextValue,
	"handleUsernameEntryRequest" | "isAuthenticated"
>;

export type TutorialControlRowViewModel = {
	label: string;
	mobileIcon: ReturnType<typeof resolveTutorialIcon> | null;
	mobileLabel?: string;
	shortcuts: readonly string[];
};

export type TutorialControlGroupViewModel = {
	heading: string;
	rows: readonly TutorialControlRowViewModel[];
	tone: TutorialControlTone;
};

type TutorialPageViewModel = {
	controlsSectionProps: {
		description: string;
		cameraModes: typeof TUTORIAL_CAMERA_MODES;
		controlGroups: readonly TutorialControlGroupViewModel[];
		heading: string;
		cameraHeading: string;
	};
	firstRunSectionProps: {
		heading: string;
		steps: typeof TUTORIAL_FIRST_RUN_STEPS;
	};
	heroProps: {
		isAuthenticated: boolean;
		onEntryRequest: () => void;
	};
};

export const createTutorialPageViewModel = ({
	handleUsernameEntryRequest,
	isAuthenticated,
}: CreateTutorialPageViewModelInput): TutorialPageViewModel => {
	const controlGroups = TUTORIAL_CONTROL_GROUPS.map((group) => ({
		heading: group.heading,
		rows: group.rows.map((row) => ({
			label: row.label,
			mobileIcon:
				"mobileIconKey" in row ? resolveTutorialIcon(row.mobileIconKey) : null,
			mobileLabel: "mobileLabel" in row ? row.mobileLabel : undefined,
			shortcuts: row.shortcuts,
		})),
		tone: group.tone,
	}));

	return {
		controlsSectionProps: {
			cameraModes: TUTORIAL_CAMERA_MODES,
			cameraHeading: TUTORIAL_CONTROLS_COPY.CAMERA_HEADING,
			controlGroups,
			description: TUTORIAL_CONTROLS_COPY.SECTION_DESCRIPTION,
			heading: TUTORIAL_CONTROLS_COPY.SECTION_HEADING,
		},
		firstRunSectionProps: {
			heading: TUTORIAL_FIRST_RUN_COPY.SECTION_HEADING,
			steps: TUTORIAL_FIRST_RUN_STEPS,
		},
		heroProps: {
			isAuthenticated,
			onEntryRequest: handleUsernameEntryRequest,
		},
	};
};

export type { CreateTutorialPageViewModelInput, TutorialPageViewModel };
