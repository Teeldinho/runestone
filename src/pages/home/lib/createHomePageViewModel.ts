import type { LucideIcon } from "lucide-react";
import type { AuthContextValue } from "@/features/auth";

import {
	HOME_COPY,
	HOME_MANIFEST_FOCUS_ITEM,
	HOME_MANIFEST_NODES,
	HOME_TEACHING_FEATURES,
	HOME_TEACHING_TONE_CLASS_NAMES,
	HOME_TEACHING_TONES,
	HOME_TRANSLATION_RAIL,
	HOME_TRANSLATION_TONE_CLASS_NAMES,
} from "../config";

import { resolveHomeManifestToneClassName } from "./resolveHomeManifestToneClassName";
import { resolveHomeTeachingIcon } from "./resolveHomeTeachingIcon";

type CreateHomePageViewModelInput = Pick<
	AuthContextValue,
	| "authStatus"
	| "errorMessage"
	| "handleSessionBootstrapRetry"
	| "handleUsernameEntryRequest"
	| "isAuthenticated"
	| "readyStatusLabel"
>;

export type HomeManifestNodeViewModel = {
	description: string;
	id: string;
	indexLabel: string;
	isLast: boolean;
	title: string;
	toneClassName: string;
};

export type HomeTeachingFeatureViewModel = {
	description: string;
	id: string;
	Icon: LucideIcon;
	iconClassName: string;
	isSealed: boolean;
	title: string;
};

export type HomeTranslationItemViewModel = {
	label: string;
	target: string;
	isLast: boolean;
	toneClassName: string;
};

type HomePageViewModel = {
	heroProps: {
		authStatus: AuthContextValue["authStatus"];
		errorMessage: string | null;
		isAuthenticated: boolean;
		onEntryRequest: () => void;
		onRetry: () => void;
		readyStatusLabel: string | null;
	};
	manifestSectionProps: {
		heading: string;
		focusItem: {
			badge: string;
			description: string;
			title: string;
			toneClassName: string;
		};
		nodes: readonly HomeManifestNodeViewModel[];
		subtitle: string;
	};
	teachingSectionProps: {
		features: readonly HomeTeachingFeatureViewModel[];
		heading: string;
	};
	translationRailItems: readonly HomeTranslationItemViewModel[];
};

export const createHomePageViewModel = ({
	authStatus,
	errorMessage,
	handleSessionBootstrapRetry,
	handleUsernameEntryRequest,
	isAuthenticated,
	readyStatusLabel,
}: CreateHomePageViewModelInput): HomePageViewModel => {
	const manifestSectionProps: HomePageViewModel["manifestSectionProps"] = {
		focusItem: {
			...HOME_MANIFEST_FOCUS_ITEM,
			toneClassName: resolveHomeManifestToneClassName(
				HOME_MANIFEST_FOCUS_ITEM.tone,
			),
		},
		heading: HOME_COPY.MANIFEST_PATH_HEADING,
		nodes: HOME_MANIFEST_NODES.map((node, index) => ({
			description: node.description,
			id: node.id,
			indexLabel: String(index + 1),
			isLast: index === HOME_MANIFEST_NODES.length - 1,
			title: node.title,
			toneClassName: resolveHomeManifestToneClassName(node.tone),
		})),
		subtitle: HOME_COPY.MANIFEST_PATH_SUBTITLE,
	};

	const teachingSectionProps: HomePageViewModel["teachingSectionProps"] = {
		features: HOME_TEACHING_FEATURES.map((feature) => {
			const Icon = resolveHomeTeachingIcon(feature.iconKey);
			return {
				description: feature.description,
				id: feature.id,
				Icon,
				iconClassName: HOME_TEACHING_TONE_CLASS_NAMES[feature.tone],
				isSealed: feature.tone === HOME_TEACHING_TONES.SEALED,
				title: feature.title,
			};
		}),
		heading: HOME_COPY.FEATURES_HEADING,
	};

	return {
		heroProps: {
			authStatus,
			errorMessage,
			isAuthenticated,
			onEntryRequest: handleUsernameEntryRequest,
			onRetry: handleSessionBootstrapRetry,
			readyStatusLabel,
		},
		manifestSectionProps,
		teachingSectionProps,
		translationRailItems: HOME_TRANSLATION_RAIL.map((item, index) => ({
			label: item.label,
			isLast: index === HOME_TRANSLATION_RAIL.length - 1,
			target: item.target,
			toneClassName: HOME_TRANSLATION_TONE_CLASS_NAMES[item.tone],
		})),
	};
};

export type { CreateHomePageViewModelInput, HomePageViewModel };
