import type { HomeTeachingFeatureViewModel } from "../lib";

import { HomeTeachingItem } from "./HomeTeachingItem";

type HomeTeachingSectionProps = {
	features: readonly HomeTeachingFeatureViewModel[];
	heading: string;
};

export function HomeTeachingSection({
	features,
	heading,
}: HomeTeachingSectionProps) {
	return (
		<section aria-labelledby="teaching-heading" className="space-y-6">
			<div className="flex items-center gap-4">
				<div className="h-px flex-1 bg-border/70" />
				<h2
					id="teaching-heading"
					className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
				>
					{heading}
				</h2>
				<div className="h-px flex-1 bg-border/70" />
			</div>

			<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{features.map((feature) => (
					<li key={feature.id} className="h-full">
						<HomeTeachingItem feature={feature} />
					</li>
				))}
			</ul>
		</section>
	);
}
