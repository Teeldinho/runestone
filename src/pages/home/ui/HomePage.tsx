import { useHomePage } from "../model";
import { HomeHeroSection } from "./HomeHeroSection";
import { HomeManifestSection } from "./HomeManifestSection";
import { HomeTeachingSection } from "./HomeTeachingSection";
import { HomeTranslationRail } from "./HomeTranslationRail";

export function HomePage() {
	const {
		heroProps,
		manifestSectionProps,
		teachingSectionProps,
		translationRailItems,
	} = useHomePage();

	return (
		<>
			<HomeHeroSection {...heroProps} />

			<HomeManifestSection {...manifestSectionProps} />

			<HomeTranslationRail items={translationRailItems} />

			<HomeTeachingSection {...teachingSectionProps} />
		</>
	);
}
