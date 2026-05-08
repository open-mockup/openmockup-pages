import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import postcssPresetMantine from "postcss-preset-mantine";

// @openmockup/flow 0.1.6 re-exports a Node.js-only resolver module from its
// public index. Intercept it in the load hook (after path resolution) so the
// browser bundle never sees node:fs/promises or node:path.
const flowResolveStub = {
  name: "stub-flow-resolver",
  enforce: "pre" as const,
  load(id: string) {
    if (id.includes("@openmockup") && id.includes("flow") && /\/dist\/resolve\.[jt]s$/.test(id)) {
      return "export const resolveFlow = undefined; export const RegistryResolver = undefined; export const FileSystemResolver = undefined; export const CompositeResolver = undefined;";
    }
  },
};

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/openmockup-pages/" : "/",
  plugins: [flowResolveStub, react()],
  optimizeDeps: {
    // Exclude from esbuild pre-bundling so our Rollup plugin can intercept
    // the Node.js-only resolve.js before it reaches the browser bundle.
    exclude: ["@openmockup/flow"],
  },
  css: {
    postcss: {
      plugins: [
        postcssPresetMantine(),
      ],
    },
  },
});
