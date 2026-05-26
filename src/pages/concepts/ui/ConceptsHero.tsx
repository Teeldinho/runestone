import { CONCEPTS_COPY } from "../config";

export function ConceptsHero() {
	return (
		<header className="max-w-3xl space-y-4">
			<h1 className="text-4xl font-bold tracking-tight text-panel-title sm:text-5xl">
				{CONCEPTS_COPY.HEADING}
			</h1>
			<p className="text-base leading-7 text-panel-body sm:text-lg">
				{CONCEPTS_COPY.HERO_SUBTITLE}
			</p>
		</header>
	);
}
