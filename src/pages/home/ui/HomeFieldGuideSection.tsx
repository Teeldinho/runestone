import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui";

import {
	HOME_CAMERA_MODES,
	HOME_CONCEPT_MAPPINGS,
	HOME_CONTROL_GROUPS,
	HOME_COPY,
	HOME_FIELD_GUIDE_VALUES,
	HOME_SECTION_IDS,
	HOME_TOUCH_CAMERA_MODES,
	HOME_TOUCH_CONTROL_GROUPS,
} from "../config";
import { useHomeFieldGuide } from "../model";

export function HomeFieldGuideSection() {
	const { activeValue, handleValueChange } = useHomeFieldGuide();

	return (
		<section
			id="field-guide"
			aria-labelledby="field-guide-heading"
			className="space-y-10 rounded-3xl border border-panel-border bg-card/45 p-5 shadow-2xl backdrop-blur-sm sm:p-8 lg:p-10"
		>
			<div className="max-w-2xl space-y-4">
				<h2
					id="field-guide-heading"
					className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl"
				>
					{HOME_COPY.FIELD_GUIDE_HEADING}
				</h2>
				<p className="text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
					{HOME_COPY.FIELD_GUIDE_SUBTITLE}
				</p>
			</div>

			<Tabs value={activeValue} onValueChange={handleValueChange}>
				<span id={HOME_SECTION_IDS.MACHINE} className="block" />
				<span id={HOME_SECTION_IDS.CONTROLS} className="block" />
				<TabsList className="mb-6 grid min-h-14 w-full grid-cols-2 rounded-2xl border border-panel-border bg-background/70 p-1 sm:max-w-md">
					<TabsTrigger
						value={HOME_FIELD_GUIDE_VALUES.MACHINE}
						className="min-h-11 rounded-xl data-[state=active]:bg-dungeon-rune/15 data-[state=active]:text-dungeon-rune"
					>
						The machine
					</TabsTrigger>
					<TabsTrigger
						value={HOME_FIELD_GUIDE_VALUES.CONTROLS}
						className="min-h-11 rounded-xl data-[state=active]:bg-dungeon-rune/15 data-[state=active]:text-dungeon-rune"
					>
						Controls
					</TabsTrigger>
				</TabsList>

				<TabsContent
					forceMount
					value={HOME_FIELD_GUIDE_VALUES.MACHINE}
					className="data-[state=inactive]:hidden"
				>
					<article className="rounded-3xl border border-panel-border bg-background/55 p-5 shadow-xl sm:p-7">
						<header className="mb-6 flex items-end justify-between gap-4 border-panel-border border-b pb-4">
							<div>
								<p className="font-mono text-xs text-dungeon-gold">
									01 / machine
								</p>
								<h3 className="mt-2 text-2xl font-semibold">Dungeon grammar</h3>
							</div>
							<span className="font-mono text-xs text-muted-foreground">
								world → logic
							</span>
						</header>

						<dl className="divide-y divide-border">
							{HOME_CONCEPT_MAPPINGS.map((mapping) => (
								<div
									key={mapping.construct}
									className="grid gap-2 py-4 sm:grid-cols-[6.5rem_9rem_1fr] sm:gap-4"
								>
									<dt className="font-mono text-xs text-muted-foreground">
										{mapping.construct}
									</dt>
									<dd className="font-semibold">{mapping.manifestation}</dd>
									<dd className="text-sm leading-6 text-muted-foreground">
										{mapping.description}
									</dd>
								</div>
							))}
						</dl>
					</article>
				</TabsContent>

				<TabsContent
					forceMount
					value={HOME_FIELD_GUIDE_VALUES.CONTROLS}
					className="data-[state=inactive]:hidden"
				>
					<article className="rounded-3xl border border-panel-border bg-background/70 p-5 text-foreground shadow-xl sm:p-7">
						<header className="mb-6 flex items-end justify-between gap-4 border-panel-border border-b pb-4">
							<div>
								<p className="font-mono text-xs text-dungeon-rune">
									02 / controls
								</p>
								<h3 className="mt-2 text-2xl font-semibold">How to move</h3>
							</div>
							<span className="font-mono text-xs text-muted-foreground">
								<span className="lg:hidden">touch layout</span>
								<span className="hidden lg:inline">keyboard layout</span>
							</span>
						</header>

						<dl className="divide-y divide-panel-border lg:hidden">
							{HOME_TOUCH_CONTROL_GROUPS.map((control) => (
								<div
									key={control.label}
									className="grid min-h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3"
								>
									<dt>{control.label}</dt>
									<dd className="justify-self-end text-right">
										<span className="inline-flex whitespace-nowrap rounded-lg border border-panel-border bg-card px-2 py-1 font-mono text-xs text-dungeon-rune">
											{control.control}
										</span>
									</dd>
								</div>
							))}
						</dl>

						<dl className="hidden divide-y divide-panel-border lg:block">
							{HOME_CONTROL_GROUPS.map((control) => (
								<div
									key={control.label}
									className="flex min-h-14 items-center justify-between gap-4 py-3"
								>
									<dt>{control.label}</dt>
									<dd>
										<kbd className="rounded-lg border border-panel-border bg-card px-2 py-1 font-mono text-xs text-dungeon-rune">
											{control.keys}
										</kbd>
									</dd>
								</div>
							))}
						</dl>

						<div className="mt-6 border-panel-border border-t pt-5 lg:hidden">
							<h4 className="font-semibold">Camera selector</h4>
							<ul className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs text-muted-foreground">
								{HOME_TOUCH_CAMERA_MODES.map((mode) => (
									<li
										key={mode.abbreviation}
										className="flex items-baseline gap-1.5"
									>
										<strong className="font-bold text-dungeon-rune">
											{mode.abbreviation}
										</strong>
										<span>{mode.label}</span>
									</li>
								))}
							</ul>
							<p className="mt-5 text-sm leading-6 text-muted-foreground">
								Use the top-left selector to switch views. Interact and attack
								buttons appear only when their actions are available. Landscape
								is required for the run workspace.
							</p>
						</div>

						<div className="mt-6 hidden border-panel-border border-t pt-5 lg:block">
							<h4 className="font-semibold">Camera modes</h4>
							<ul className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs text-muted-foreground">
								{HOME_CAMERA_MODES.map((mode) => (
									<li key={mode}>{mode}</li>
								))}
							</ul>
							<p className="mt-5 text-sm leading-6 text-muted-foreground">
								Use the numbered shortcuts to switch the active dungeon camera.
							</p>
						</div>
					</article>
				</TabsContent>
			</Tabs>
		</section>
	);
}
