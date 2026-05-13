import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";

// GitHub Pages base path. Override with PUBLIC_BASE when serving from a custom domain.
const base = process.env.PUBLIC_BASE ?? "/openmockup-pages/";
const site = process.env.PUBLIC_SITE ?? "https://open-mockup.github.io";

export default defineConfig({
  site,
  base,
  trailingSlash: "ignore",
  integrations: [
    react(),
    starlight({
      title: "OpenMockup",
      defaultLocale: "root",
      locales: {
        root: { label: "English", lang: "en" },
        ru: { label: "Русский", lang: "ru" },
      },
      social: {
        github: "https://github.com/open-mockup/openmockup-pages",
      },
      sidebar: [
        {
          label: "Start",
          translations: { ru: "Начало" },
          items: [
            { slug: "guides/introduction" },
            { slug: "guides/quickstart" },
          ],
        },
        {
          label: "Flow",
          items: [
            { slug: "guides/flow-versions-and-diff" },
          ],
        },
        {
          label: "Cookbook",
          items: [
            { slug: "cookbook/dashboard-header" },
          ],
        },
      ],
    }),
  ],
});
