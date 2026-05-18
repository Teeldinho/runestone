import { describe, expect, it, vi } from "vitest";

import { preventGameplayContextMenu } from "./preventGameplayContextMenu";

describe("preventGameplayContextMenu", () => {
	it("prevents the context menu event", () => {
		const preventDefault = vi.fn();

		preventGameplayContextMenu({ preventDefault } as never);

		expect(preventDefault).toHaveBeenCalledTimes(1);
	});
});
