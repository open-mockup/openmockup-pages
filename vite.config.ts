import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import postcssPresetMantine from "postcss-preset-mantine";
import { resolve } from "node:path";

const flowResolveStubPath = resolve("src/stubs/flow-resolve-stub.ts");

// @openmockup/flow 0.1.6 re-exports a Node.js-only resolver module from its
// public index. Intercept it in the load hook (after path resolution) so the
// browser bundle never sees node:fs/promises or node:path.
const flowResolveStub = {
  name: "stub-flow-resolver",
  enforce: "pre" as const,
  resolveId(source: string, importer?: string) {
    if (
      source.includes("@openmockup")
      && source.includes("flow")
      && /\/dist\/resolve\.[jt]s(?:\?|$)/.test(source)
    ) {
      return flowResolveStubPath;
    }
    if (
      source === "./resolve.js"
      && importer?.includes("@openmockup")
      && importer.includes("flow")
      && /\/dist\/index\.[jt]s(?:\?|$)/.test(importer)
    ) {
      return flowResolveStubPath;
    }
  },
  load(id: string) {
    if (
      id === flowResolveStubPath
      || (id.includes("@openmockup") && id.includes("flow") && /\/dist\/resolve\.[jt]s(?:\?|$)/.test(id))
    ) {
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
