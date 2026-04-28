import { Separator } from "@/shared/ui";

import { INSPECTOR_COPY } from "../config";
import type { InspectorGuardIndicator } from "../lib";

type XStateInspectorPanelGuardsProps = {
	guardIndicators: InspectorGuardIndicator[];
};

export function XStateInspectorPanelGuards({
	guardIndicators,
}: XStateInspectorPanelGuardsProps) {
	if (guardIndicators.length === 0) {
		return null;
	}

	return (
		<>
			<Separator className="my-2" />
			<div className="grid grid-cols-1 gap-2 max-xl:landscape:grid-cols-2">
				<p className="col-span-full text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
					{INSPECTOR_COPY.GUARDS_HEADING}
				</p>
				<p className="col-span-full -mt-1 text-[10px] text-muted-foreground/80">
					{INSPECTOR_COPY.GUARDS_DIRECTION_HINT}
				</p>
				{guardIndicators.map((guardIndicator) => (
					<div
						key={guardIndicator.id}
						className="flex items-start gap-2 rounded-md bg-background px-2.5 py-1.5"
					>
						<span
							className="mt-0.5 inline-block rounded-full"
							style={guardIndicator.legendDotStyles}
						/>
						<span className="min-w-0 flex-1 text-[11px] leading-snug text-panel-title">
							{guardIndicator.label}
						</span>
						<span className="ml-auto inline-flex shrink-0 items-center rounded bg-panel px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-muted-foreground">
							{guardIndicator.transitionCount}{" "}
							{guardIndicator.transitionCountLabel}
						</span>
					</div>
				))}
			</div>
		</>
	);
}

export type { XStateInspectorPanelGuardsProps };
