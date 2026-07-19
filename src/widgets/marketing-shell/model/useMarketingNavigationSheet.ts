import type { MouseEvent } from "react";

type MarketingNavigationSheetViewModel = {
	handleAnchorNavigation: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export const useMarketingNavigationSheet =
	(): MarketingNavigationSheetViewModel => ({
		handleAnchorNavigation: (event) => {
			const targetId = event.currentTarget.hash.slice(1);

			window.setTimeout(() => {
				document.getElementById(targetId)?.scrollIntoView();
			}, 0);
		},
	});
