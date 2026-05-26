import { cn } from "@/shared/lib";
import { MARKETING_LAYOUT_CLASS_NAMES } from "@/widgets/marketing-shell";

import { HOME_COPY, HOME_RUNTIME_PANELS } from "../config";

export function HomeRuntimeReadingSection() {
	return (
		<section
			aria-labelledby="runtime-heading"
			className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"
		>
			<div className="space-y-3">
				<h2
					id="runtime-heading"
					className="text-2xl font-semibold tracking-tight text-panel-title"
				>
					{HOME_COPY.RUNTIME_HEADING}
				</h2>
				<p className="max-w-xl text-sm leading-6 text-panel-body sm:text-base">
					{HOME_COPY.RUNTIME_SUBTITLE}
				</p>
			</div>

			<ul className="grid gap-3 sm:grid-cols-3">
				{HOME_RUNTIME_PANELS.map((panel) => (
					<li key={panel.title}>
						<div
							className={cn(
								MARKETING_LAYOUT_CLASS_NAMES.SUBTLE_PANEL,
								"flex h-full flex-col gap-3 p-4",
							)}
						>
							<div className="h-px w-10 rounded-full bg-dungeon-gold/40" />
							<div className="space-y-1">
								<h3 className="text-sm font-semibold text-panel-title">
									{panel.title}
								</h3>
								<p className="text-sm leading-6 text-panel-body">
									{panel.description}
								</p>
							</div>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}
