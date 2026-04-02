import { AnimatePresence, motion } from "motion/react";

import { Badge, Card, CardContent } from "@/shared/ui";

import { ACHIEVEMENT_NOTIFICATION_BADGE_LABEL } from "../config";
import type { Achievement } from "../model";

type AchievementNotificationProps = {
	achievement: Achievement | null;
};

export function AchievementNotification({
	achievement,
}: AchievementNotificationProps) {
	return (
		<div
			aria-atomic="true"
			aria-label="Achievement notifications"
			role="status"
		>
			<AnimatePresence>
				{achievement && (
					<motion.div
						key={achievement.id}
						animate={{ opacity: 1, y: 0 }}
						className="absolute left-1/2 top-4 z-20 w-max -translate-x-1/2"
						exit={{ opacity: 0, y: -40 }}
						initial={{ opacity: 0, y: -40 }}
					>
						<Card className="border-panel-border bg-panel shadow-xl">
							<CardContent className="flex items-center gap-3 px-4 py-3">
								<Badge variant="secondary">
									{ACHIEVEMENT_NOTIFICATION_BADGE_LABEL}
								</Badge>
								<span className="font-semibold text-panel-title">
									{achievement.label}
								</span>
								<span className="text-sm text-panel-body">
									{achievement.description}
								</span>
							</CardContent>
						</Card>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
