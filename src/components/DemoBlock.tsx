import React from "react";
import { Box, Paper, Tabs, Text, useComputedColorScheme } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { MockupDoc } from "@openmockup/dsl";
import { mantineRenderer } from "@openmockup/renderer-mantine";
import { render } from "@openmockup/renderer-core";
import { jsxRenderer } from "@openmockup/renderer-jsx";

interface DemoBlockProps {
  title?: string;
  doc: MockupDoc;
  /** TypeScript builder code shown in the Code tab. */
  code: string;
}

export function DemoBlock({ title, doc, code }: DemoBlockProps) {
  const openmockupSrc = render(doc, jsxRenderer);
  const isDark = useComputedColorScheme("light") === "dark";

  return (
    <Box mb="xl">
      {title !== undefined && (
        <Text fw={600} mb="xs" size="sm" c="dimmed" tt="uppercase">
          {title}
        </Text>
      )}

      <Paper withBorder radius="md" style={{ overflow: "hidden" }}>
        <Tabs defaultValue="preview">
          {/* Tab labels */}
          <Box
            px="md"
            style={{
              borderBottom: `1px solid ${
                isDark ? "var(--mantine-color-dark-4)" : "var(--mantine-color-gray-3)"
              }`,
              backgroundColor: isDark
                ? "var(--mantine-color-dark-6)"
                : "var(--mantine-color-gray-0)",
            }}
          >
            <Tabs.List style={{ border: "none" }}>
              <Tabs.Tab value="preview">Preview</Tabs.Tab>
              <Tabs.Tab value="openmockup">openmockup(.om)</Tabs.Tab>
              <Tabs.Tab value="code">Builder code</Tabs.Tab>
            </Tabs.List>
          </Box>

          {/* Preview — dotted background like mantine.dev */}
          <Tabs.Panel value="preview">
            <Box
              p="xl"
              style={{
                backgroundImage:
                  `radial-gradient(${
                    isDark ? "var(--mantine-color-dark-2)" : "var(--mantine-color-gray-4)"
                  } 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
                minHeight: 120,
                backgroundColor: isDark
                  ? "var(--mantine-color-dark-8)"
                  : "var(--mantine-color-white)",
              }}
            >
              <Box
                p="lg"
                style={{
                  backgroundColor: isDark
                    ? "var(--mantine-color-dark-5)"
                    : "var(--mantine-color-white)",
                  borderRadius: "var(--mantine-radius-md)",
                  display: "inline-block",
                  minWidth: "100%",
                  boxSizing: "border-box",
                }}
              >
                {(() => {
                  try {
                    return render(doc, mantineRenderer);
                  } catch (err) {
                    const msg = err instanceof Error ? err.message : String(err);
                    return (
                      <Text size="sm" c="red">
                        Render error: {msg}
                      </Text>
                    );
                  }
                })()}
              </Box>
            </Box>
          </Tabs.Panel>

          {/* OpenMockup JSX */}
          <Tabs.Panel value="openmockup">
            <CodeHighlight code={openmockupSrc} language="jsx" />
          </Tabs.Panel>

          {/* Builder code */}
          <Tabs.Panel value="code">
            <CodeHighlight code={code} language="typescript" />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Box>
  );
}
