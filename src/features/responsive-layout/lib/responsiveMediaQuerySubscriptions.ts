type ResponsiveMediaQueryEntry = {
	query: string;
	setMatches: (matches: boolean) => void;
};

type ResponsiveMediaQuerySubscription = {
	mediaQuery: MediaQueryList;
	listener: (event: MediaQueryListEvent) => void;
};

export const readResponsiveMediaQueryMatch = (
	query: string,
	fallback: boolean,
): boolean => {
	if (typeof window === "undefined") {
		return fallback;
	}

	return window.matchMedia(query).matches;
};

export const createResponsiveMediaQuerySubscriptions = (
	entries: readonly ResponsiveMediaQueryEntry[],
): ResponsiveMediaQuerySubscription[] => {
	return entries.map(({ query, setMatches }) => {
		const mediaQuery = window.matchMedia(query);
		setMatches(mediaQuery.matches);

		const listener = (event: MediaQueryListEvent) => {
			setMatches(event.matches);
		};

		mediaQuery.addEventListener("change", listener);

		return {
			mediaQuery,
			listener,
		};
	});
};

export const removeResponsiveMediaQuerySubscriptions = (
	subscriptions: readonly ResponsiveMediaQuerySubscription[],
): void => {
	subscriptions.forEach(({ mediaQuery, listener }) => {
		mediaQuery.removeEventListener("change", listener);
	});
};

export type { ResponsiveMediaQueryEntry, ResponsiveMediaQuerySubscription };
