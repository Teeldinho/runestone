import { useAuthContext } from "@/features/auth";

import { ConceptsCtaSection } from "./ConceptsCtaSection";
import { ConceptsHero } from "./ConceptsHero";
import { ConceptsMappingSection } from "./ConceptsMappingSection";

export function ConceptsPage() {
	const { handleUsernameEntryRequest, isAuthenticated } = useAuthContext();

	return (
		<>
			<ConceptsHero />

			<ConceptsMappingSection />

			<ConceptsCtaSection
				isAuthenticated={isAuthenticated}
				onEntryRequest={handleUsernameEntryRequest}
			/>
		</>
	);
}
