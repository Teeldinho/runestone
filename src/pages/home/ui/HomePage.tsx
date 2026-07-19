import { useHomePage } from "../model";
import { HomeFieldGuideSection } from "./HomeFieldGuideSection";
import { HomeFinalSection } from "./HomeFinalSection";
import { HomeHeroSection } from "./HomeHeroSection";
import { HomeProofSection } from "./HomeProofSection";
import { HomeRunSection } from "./HomeRunSection";

export function HomePage() {
	const { entryProps } = useHomePage();

	return (
		<>
			<HomeHeroSection entryProps={entryProps} />
			<HomeProofSection />
			<HomeRunSection />
			<HomeFieldGuideSection />
			<HomeFinalSection entryProps={entryProps} />
		</>
	);
}
