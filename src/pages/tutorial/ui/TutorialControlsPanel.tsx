import {
	Camera,
	ChevronsUp,
	Footprints,
	Gamepad2,
	Keyboard,
	Zap,
} from "lucide-react";

import { cn } from "@/shared/lib";
import { Card, CardContent } from "@/shared/ui";

import {
	TUTORIAL_CAMERA_MODES,
	TUTORIAL_CONTROL_GROUPS,
	TUTORIAL_CONTROLS_COPY,
} from "../config";

const TUTORIAL_MOBILE_SHORTCUT_ICONS = {
	ChevronsUp,
	Footprints,
	Gamepad2,
} as const;

export function TutorialControlsPanel() {
	return (
		<section
			aria-labelledby="controls-heading"
			className="grid gap-8 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)]"
		>
			<div className="space-y-3">
				<h2
					id="controls-heading"
					className="text-2xl font-semibold tracking-tight text-panel-title sm:text-3xl"
				>
					{TUTORIAL_CONTROLS_COPY.SECTION_HEADING}
				</h2>
				<p className="max-w-sm text-sm leading-6 text-panel-body sm:text-base">
					{TUTORIAL_CONTROLS_COPY.SECTION_DESCRIPTION}
				</p>
			</div>

			<div className="space-y-4">
				<div className="grid gap-4 lg:grid-cols-2">
					{TUTORIAL_CONTROL_GROUPS.map((group) => (
						<Card
							key={group.heading}
							className="rounded-lg border-border bg-card p-0 shadow-none ring-0 hover:border-dungeon-gold/50"
						>
							<CardContent className="space-y-4 p-5 sm:p-6">
								<div className="flex items-center gap-2">
									<div
										className={cn(
											"flex size-9 items-center justify-center rounded-lg border",
											"border-dungeon-gold/30 bg-dungeon-gold/10 text-dungeon-gold",
										)}
									>
										{group.tone === "accent" ? (
											<Zap className="size-4" />
										) : (
											<Keyboard className="size-4" />
										)}
									</div>
									<h3
										className={cn(
											"text-sm font-semibold uppercase tracking-[0.14em]",
											"text-panel-title",
										)}
									>
										{group.heading}
									</h3>
								</div>

								<ul className="divide-y divide-border/70">
									{group.rows.map((row) => {
										const hasMobileIcon =
											"mobileIcon" in row && row.mobileIcon != null;
										const MobileShortcutIcon = hasMobileIcon
											? TUTORIAL_MOBILE_SHORTCUT_ICONS[row.mobileIcon]
											: null;

										return (
											<li
												key={row.label}
												className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3"
											>
												<span className="text-sm text-foreground">
													{row.label}
												</span>
												<div className="flex items-center gap-1">
													{hasMobileIcon && MobileShortcutIcon ? (
														<div className="flex items-center gap-2 sm:hidden">
															<div
																className={cn(
																	"flex size-9 items-center justify-center rounded-md border bg-background/50",
																	"border-dungeon-gold/30 text-dungeon-gold",
																)}
															>
																<MobileShortcutIcon
																	aria-hidden="true"
																	className="size-4"
																/>
															</div>
															<span className="text-sm font-medium text-panel-body">
																{row.mobileLabel}
															</span>
														</div>
													) : null}

													<div
														className={cn(
															"flex items-center gap-1",
															hasMobileIcon ? "hidden sm:flex" : "",
														)}
													>
														{row.shortcuts.map((shortcut) => (
															<kbd
																key={shortcut}
																className="inline-flex min-w-8 items-center justify-center rounded-sm border border-border bg-background/45 px-2 py-1 text-xs font-semibold text-panel-title"
															>
																{shortcut}
															</kbd>
														))}
													</div>
												</div>
											</li>
										);
									})}
								</ul>
							</CardContent>
						</Card>
					))}
				</div>

				<Card className="rounded-lg border-border bg-card p-0 shadow-none ring-0">
					<CardContent className="space-y-4 p-5 sm:p-6">
						<div className="flex items-center gap-2">
							<div className="flex size-9 items-center justify-center rounded-lg border border-dungeon-gold/30 bg-dungeon-gold/10 text-dungeon-gold">
								<Camera className="size-4" />
							</div>
							<h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-panel-title">
								{TUTORIAL_CONTROLS_COPY.CAMERA_HEADING}
							</h3>
						</div>

						<ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
							{TUTORIAL_CAMERA_MODES.map((mode) => (
								<li
									key={mode.label}
									className="rounded-md border border-border bg-background/35 p-4"
								>
									<div className="flex flex-col gap-2">
										<span className="text-xs uppercase tracking-[0.12em] text-panel-body">
											{mode.label}
										</span>
										<div className="flex items-center justify-between gap-3">
											<span className="text-sm font-semibold text-panel-title">
												{mode.code}
											</span>
											<kbd className="inline-flex size-8 items-center justify-center rounded-sm border border-dungeon-gold/30 bg-card px-2 py-1 text-xs font-semibold text-panel-title">
												{mode.key}
											</kbd>
										</div>
									</div>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
