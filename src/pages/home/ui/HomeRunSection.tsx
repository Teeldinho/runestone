import { HOME_COPY, HOME_RUN_STEPS } from "../config";

export function HomeRunSection() {
	return (
		<section
			aria-labelledby="run-heading"
			className="grid gap-10 rounded-3xl border border-panel-border bg-panel/55 p-5 shadow-2xl backdrop-blur-sm sm:p-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16 lg:p-10"
		>
			<div className="space-y-4">
				<h2
					id="run-heading"
					className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl"
				>
					{HOME_COPY.RUN_HEADING}
				</h2>
				<p className="max-w-md text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
					{HOME_COPY.RUN_SUBTITLE}
				</p>
			</div>

			<ol className="relative grid gap-3 before:absolute before:top-8 before:bottom-8 before:left-[2.05rem] before:w-px before:bg-panel-border">
				{HOME_RUN_STEPS.map((step) => (
					<li
						key={step.index}
						className="relative grid gap-3 rounded-2xl border border-panel-border bg-background/50 p-4 shadow-lg sm:grid-cols-[3rem_12rem_1fr] sm:items-center sm:gap-5 sm:p-5"
					>
						<span className="relative z-10 flex size-9 items-center justify-center rounded-xl border border-dungeon-gold/60 bg-dungeon-gold/10 font-mono text-xs text-dungeon-torch">
							{step.index}
						</span>
						<h3 className="font-semibold">{step.title}</h3>
						<p className="text-sm leading-6 text-muted-foreground">
							{step.description}
						</p>
					</li>
				))}
			</ol>
		</section>
	);
}
