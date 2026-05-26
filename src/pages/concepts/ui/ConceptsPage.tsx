import { useConceptsPage } from "../model";
import { ConceptsCtaSection } from "./ConceptsCtaSection";
import { ConceptsHero } from "./ConceptsHero";
import { ConceptsMappingSection } from "./ConceptsMappingSection";

export function ConceptsPage() {
	const { ctaProps, mappingSectionProps } = useConceptsPage();

	return (
		<>
			<ConceptsHero />

			<ConceptsMappingSection {...mappingSectionProps} />

			<ConceptsCtaSection {...ctaProps} />
		</>
	);
}
