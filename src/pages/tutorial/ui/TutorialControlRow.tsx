import { ChevronsUp, Footprints, Gamepad2 } from "lucide-react";

import { cn } from "@/shared/lib";

const TUTORIAL_MOBILE_SHORTCUT_ICONS = {
	ChevronsUp,
	Footprints,
	Gamepad2,
} as const;

type TutorialControlRowData = {
	label: string;
	mobileIcon?: keyof typeof TUTORIAL_MOBILE_SHORTCUT_ICONS;
	mobileLabel?: string;
	shortcuts: readonly string[];
};

type TutorialControlRowProps = {
	row: TutorialControlRowData;
};

export function TutorialControlRow({ row }: TutorialControlRowProps) {
	const mobileIcon = row.mobileIcon;
	const hasMobileIcon = mobileIcon != null;
	const MobileShortcutIcon = mobileIcon
		? TUTORIAL_MOBILE_SHORTCUT_ICONS[mobileIcon]
		: null;

	return (
		<li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3">
			<span className="text-sm text-foreground">{row.label}</span>
			<div className="flex items-center gap-1">
				{hasMobileIcon && MobileShortcutIcon ? (
					<div className="flex items-center gap-2 sm:hidden">
						<div
							className={cn(
								"flex size-9 items-center justify-center rounded-md border bg-background/50",
								"border-dungeon-gold/30 text-dungeon-gold",
							)}
						>
							<MobileShortcutIcon aria-hidden="true" className="size-4" />
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
}

export type { TutorialControlRowData };
