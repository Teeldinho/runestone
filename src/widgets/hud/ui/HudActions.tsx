import { HUD_COPY } from "@/widgets/hud/config";
import type { HudActionButton } from "@/widgets/hud/model/types";

type HudActionsProps = {
	actionButtons: HudActionButton[];
	handleDungeonRunReset: () => void;
};

export function HudActions({
	actionButtons,
	handleDungeonRunReset,
}: HudActionsProps) {
	return (
		<section className="mt-4 space-y-3">
			<h3 className="rune-text border-b border-panel-border pb-1">
				{HUD_COPY.ACTIONS.TITLE}
			</h3>

			<div className="flex flex-col gap-2">
				{actionButtons.map((actionButton) => (
					<button
						key={actionButton.eventType}
						type="button"
						onClick={actionButton.handleDungeonActionTrigger}
						disabled={actionButton.isDisabled}
						className="dungeon-btn"
					>
						{actionButton.label}
					</button>
				))}
			</div>

			<div className="pt-4">
				<button
					type="button"
					onClick={handleDungeonRunReset}
					className="dungeon-btn dungeon-btn-danger uppercase tracking-widest text-[10px]"
				>
					{HUD_COPY.ACTIONS.RESET_BUTTON}
				</button>
			</div>
		</section>
	);
}
