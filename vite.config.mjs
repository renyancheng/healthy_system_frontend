// Plugins
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Fonts from "unplugin-fonts/vite";
import Layouts from "vite-plugin-vue-layouts";
import Vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		VueRouter({
			routesFolder: [
				{
					src: "src/pages",
					path: "",
					// override globals
					exclude: (excluded) => excluded,
					filePatterns: (filePatterns) => filePatterns,
					extensions: (extensions) => extensions,
				},
			],

			// what files should be considered as a pages
			extensions: [".vue"],

			// what files to include
			filePatterns: ["**/*"],

			// files to exclude from the scan
			exclude: [],

			// where to generate the types
			dts: "./typed-router.d.ts",

			// how to generate the route name
			// getRouteName: (routeNode) => getFileBasedRouteName(routeNode),

			// default language for <route> custom blocks
			routeBlockLang: "yaml",

			// how to import routes. can also be a string
			importMode: "async",

			// where are paths relative to
			root: process.cwd(),

			// options for the path parser
			pathParser: {
				// should `users.[id]` be parsed as `users/:id`?
				dotNesting: true,
			},

			// modify routes individually
			async extendRoute(route) {
				// ...
			},

			// modify routes before writing
			async beforeWriteFiles(rootRoute) {
				// ...
			},
		}),
		Layouts({
			defaultLayout: "default",
		}),
		Vue({
			template: { transformAssetUrls },
		}),
		Vuetify({
			autoImport: true,
			styles: {
				configFile: "src/styles/settings.scss",
			},
		}),
		Components(),
		Fonts({
			google: {
				families: [
					{
						name: "Roboto",
						styles: "wght@100;300;400;500;700;900",
					},
				],
			},
		}),
		AutoImport({
			imports: ["vue", "vue-router"],
			eslintrc: {
				enabled: true,
			},
			vueTemplate: true,
		}),
	],
	define: { "process.env": {} },
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
		extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
	},
	server: {
		// hmr: true,
		port: 3000,
		proxy: {
			"/api": {
				target: "http://dev.com",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
});
