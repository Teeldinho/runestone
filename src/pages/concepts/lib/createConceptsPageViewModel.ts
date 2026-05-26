import type { AuthContextValue } from "@/features/auth";

import {
	CONCEPTS_COPY,
	CONCEPTS_MAPPING_TONE_CLASS_NAMES,
	CONCEPTS_MAPPING_TONES,
	CONCEPTS_SECTIONS,
	CONCEPTS_TITLE_TONE_CLASS_NAMES,
} from "../config";

import { resolveConceptsIcon } from "./resolveConceptsIcon";

type CreateConceptsPageViewModelInput = Pick<
	AuthContextValue,
	"handleUsernameEntryRequest" | "isAuthenticated"
>;

export type ConceptsMappingSectionViewModel = {
	badge: string;
	detail: string;
	icon: ReturnType<typeof resolveConceptsIcon>;
	iconClassName: string;
	id: string;
	isSealed: boolean;
	title: string;
	titleClassName: string;
};

type ConceptsPageViewModel = {
	ctaProps: {
		isAuthenticated: boolean;
		onEntryRequest: () => void;
	};
	mappingSectionProps: {
		heading: string;
		sections: readonly ConceptsMappingSectionViewModel[];
	};
};

export const createConceptsPageViewModel = ({
	handleUsernameEntryRequest,
	isAuthenticated,
}: CreateConceptsPageViewModelInput): ConceptsPageViewModel => {
	return {
		ctaProps: {
			isAuthenticated,
			onEntryRequest: handleUsernameEntryRequest,
		},
		mappingSectionProps: {
			heading: CONCEPTS_COPY.MAPPING_HEADING,
			sections: CONCEPTS_SECTIONS.map((section) => ({
				badge: section.source,
				detail: section.detail,
				icon: resolveConceptsIcon(section.iconKey),
				iconClassName: CONCEPTS_MAPPING_TONE_CLASS_NAMES[section.tone],
				id: section.id,
				isSealed: section.tone === CONCEPTS_MAPPING_TONES.SEALED,
				title: section.target,
				titleClassName: CONCEPTS_TITLE_TONE_CLASS_NAMES[section.tone],
			})),
		},
	};
};

export type { ConceptsPageViewModel, CreateConceptsPageViewModelInput };
