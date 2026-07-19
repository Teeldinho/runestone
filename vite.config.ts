import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
	server: {
		port: 3000,
	},
	optimizeDeps: {
		include: ["tone"],
	},
	ssr: {
		noExternal: ["tone"],
	},
	plugins: [
		nitro({
			compressPublicAssets: {
				brotli: true,
				gzip: true,
			},
			serveStatic: "node",
			rollupConfig: {
				external: [/^@sentry\//],
			},
		}),
		tsconfigPaths({ projects: ["./tsconfig.json"] }),
		tailwindcss(),
		tanstackStart({
			srcDirectory: "src",
			router: {
				routesDirectory: "app/routes",
			},
		}),
		viteReact({
			babel: {
				plugins: [["babel-plugin-react-compiler", { target: "19" }]],
			},
		}),
	],
});

export default config;
