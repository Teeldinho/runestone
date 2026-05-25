import { useAuthContext } from "@/features/auth";

import { HomeHeroSection } from "./HomeHeroSection";
import { HomeManifestSection } from "./HomeManifestSection";
import { HomeTeachingSection } from "./HomeTeachingSection";
import { HomeTranslationRail } from "./HomeTranslationRail";

export function HomePage() {
	const {
		authStatus,
		errorMessage,
		handleSessionBootstrapRetry,
		handleUsernameEntryRequest,
		isAuthenticated,
		readyStatusLabel,
	} = useAuthContext();

	return (
		<>
			<HomeHeroSection
				authStatus={authStatus}
				errorMessage={errorMessage}
				isAuthenticated={isAuthenticated}
				onEntryRequest={handleUsernameEntryRequest}
				onRetry={handleSessionBootstrapRetry}
				readyStatusLabel={readyStatusLabel}
			/>

			<HomeManifestSection />

			<HomeTranslationRail />

			<HomeTeachingSection />
		</>
	);
}
