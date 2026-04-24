import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { useSettingsForm } from "./useSettingsForm";

const SettingsFormServerProbe = () => {
	const settings = useSettingsForm();

	return <output>{settings.masterVolume}</output>;
};

describe("useSettingsForm SSR", () => {
	it("renders without browser storage", () => {
		expect(() => renderToString(<SettingsFormServerProbe />)).not.toThrow();
	});
});
