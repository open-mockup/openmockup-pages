import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Accordion,
  Alert,
  Badge,
  Box,
  Button,
  Code,
  Divider,
  Group,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Title,
  useComputedColorScheme,
} from "@mantine/core";
import Editor from "@monaco-editor/react";
import { IconAlertCircle } from "@tabler/icons-react";
import type { MockupDoc } from "@openmockup/dsl";
import * as dslApi from "@openmockup/dsl";
import { mantineRenderer } from "@openmockup/renderer-mantine";
import { renderDsl } from "@openmockup/renderer-mantine";
import { render } from "@openmockup/renderer-core";
import { parseJsx } from "@openmockup/parser-jsx";
import { useMediaQuery } from "@mantine/hooks";

const initialJsxCode = `<Page title="Playground form">
  <Form>
    <Field key="name" component="textInput" label="Full name" required placeholder="Jane Doe" />
    <Field key="role" component="select" label="Role" options={["Viewer", "Editor", "Admin"]} />
    <Field key="channels" component="multiSelect" label="Channels" options={["Email", "SMS", "Telegram"]} />
    <ActionBar>
      <Button variant="primary" action="save">Save</Button>
      <Button variant="secondary">Cancel</Button>
    </ActionBar>
  </Form>
</Page>`;

const initialTsCode = `dsl({
  page: page({
    title: text("Playground form"),
    layout: form({
      fields: [
        field({ key: "name", component: "textInput", label: text("Full name"), required: true }),
        field({ key: "role", component: "select", label: text("Role"), options: [text("Viewer"), text("Editor"), text("Admin")] }),
        field({ key: "channels", component: "multiSelect", label: text("Channels"), options: [text("Email"), text("SMS"), text("Telegram")] }),
      ],
      actions: actionBar([
        button({ label: text("Save"), variant: "primary" }),
        button({ label: text("Cancel"), variant: "secondary" }),
      ]),
    }),
  }),
});
`;

const componentGroups: Array<{ key: string; label: string; items: string[] }> = [
  {
    key: "layout",
    label: "Layout",
    items: ["Page", "Section", "Stack", "Grid", "Split", "Card"],
  },
  {
    key: "form",
    label: "Form",
    items: ["Form", "Field"],
  },
  {
    key: "actions",
    label: "Actions",
    items: ["Button", "IconButton", "SegmentedButton", "SegmentedItem", "ActionBar"],
  },
  {
    key: "navigation",
    label: "Navigation",
    items: ["Tabs", "SidebarNav", "TopNav", "NavItem", "Breadcrumb", "Pagination", "Menu", "MenuItem", "ContextMenu"],
  },
  {
    key: "data",
    label: "Data",
    items: ["Table", "List", "Tree", "Stat"],
  },
  {
    key: "feedback",
    label: "Feedback",
    items: ["Alert", "Tooltip", "Badge", "Progress", "EmptyState", "LoadingState"],
  },
  {
    key: "media",
    label: "Media",
    items: ["Image", "IconPlaceholder", "Avatar", "Chart", "Map"],
  },
];

export function PlaygroundPage() {
  const isDark = useComputedColorScheme("light") === "dark";
  const isNarrow = useMediaQuery("(max-width: 62em)");
  const splitRef = useRef<HTMLDivElement | null>(null);
  const [leftPaneWidth, setLeftPaneWidth] = useState(64);
  const [showCodePanel, setShowCodePanel] = useState(true);
  const completionRegistered = useRef(false);
  const [editorMode, setEditorMode] = useState<"jsx" | "ts">("jsx");
  const [jsxCode, setJsxCode] = useState(initialJsxCode);
  const [tsCode, setTsCode] = useState(initialTsCode);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);

  const parsedJsx = useMemo(() => {
    try {
      const raw = parseJsx(jsxCode);
      // parseJsx wraps in a "page" root; renderDsl expects the layout node
      const ir = raw.root.dslType === "page" && "children" in raw.root && raw.root.children.length > 0
        ? { ...raw, root: raw.root.children[0]! }
        : raw;
      return { ir, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Parse error";
      return { ir: null, error: message };
    }
  }, [jsxCode]);

  const parsedTs = useMemo(() => {
    try {
      const doc = evaluateDslTs(tsCode);
      if (!isDslLike(doc)) {
        return {
          doc: null,
          error: "TS code must produce a valid DSL object in variable `doc`.",
        };
      }
      return { doc: doc as MockupDoc, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : "TS evaluation error";
      return { doc: null, error: message };
    }
  }, [tsCode]);

  const preview = useMemo(() => {
    if (editorMode === "jsx") {
      if (parsedJsx.ir === null) return null;
      try {
        return renderDsl(parsedJsx.ir);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Render error";
        return (
          <Alert variant="light" color="red" icon={<IconAlertCircle size={16} />}>
            Failed to render: {message}
          </Alert>
        );
      }
    } else {
      if (parsedTs.doc === null) return null;
      try {
        return render(parsedTs.doc, mantineRenderer);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Render error";
        return (
          <Alert variant="light" color="red" icon={<IconAlertCircle size={16} />}>
            Failed to render DSL: {message}
          </Alert>
        );
      }
    }
  }, [editorMode, parsedJsx.ir, parsedTs.doc]);

  const handleSplitDrag = useCallback((clientX: number) => {
    const host = splitRef.current;
    if (host === null) return;
    const rect = host.getBoundingClientRect();
    if (rect.width <= 0) return;
    const raw = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(20, Math.min(88, raw));
    setLeftPaneWidth(clamped);
  }, []);

  useEffect(() => {
    if (!isDraggingSplit) return undefined;
    const onMove = (event: MouseEvent) => handleSplitDrag(event.clientX);
    const onUp = () => setIsDraggingSplit(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDraggingSplit, handleSplitDrag]);

  return (
    <Stack gap="xl">
      <div>
        <Badge mb="xs" variant="light" color="teal" size="sm">
          Playground
        </Badge>
        <Title order={1} mb="xs">
          Live DSL Editor
        </Title>
        <Text c="dimmed" size="lg">
          Edit .openmockup JSX or TypeScript on the left. Preview updates immediately on the right.
        </Text>
      </div>

      <Divider />

      <Group>
        <Button variant="default" onClick={() => setJsxCode(initialJsxCode)}>
          Reset JSX sample
        </Button>
        <Button variant="default" onClick={() => setTsCode(initialTsCode)}>
          Reset TS snippet
        </Button>
        <Button variant="default" onClick={() => setShowCodePanel((value) => !value)}>
          {showCodePanel ? "Hide code panel" : "Show code panel"}
        </Button>
      </Group>

      <Box
        ref={splitRef}
        style={{
          display: "flex",
          gap: 0,
          alignItems: "stretch",
          flexDirection: isNarrow ? "column" : "row",
        }}
      >
        {showCodePanel && (
          <Paper
            withBorder
            radius="md"
            p="md"
            style={{
              width: isNarrow ? "100%" : `${leftPaneWidth}%`,
              minHeight: 760,
              height: 760,
              resize: "vertical",
              overflow: "hidden",
            }}
          >
            <Stack gap="sm" style={{ height: "100%" }}>
              <Group justify="space-between">
                <Text fw={600}>Editor</Text>
                <SegmentedControl
                  size="xs"
                  value={editorMode}
                  onChange={(value) => setEditorMode(value as "jsx" | "ts")}
                  data={[
                    { label: ".openmockup", value: "jsx" },
                    { label: "Builder (TS)", value: "ts" },
                  ]}
                />
              </Group>

              <Accordion variant="separated" radius="md">
                <Accordion.Item value="components">
                  <Accordion.Control>
                    <Text size="sm" fw={600}>Components</Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="xs">
                      {componentGroups.map((group) => (
                        <Box key={group.key}>
                          <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb={4}>
                            {group.label}
                          </Text>
                          <Box style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {group.items.map((item) => (
                              <Code key={item}>{editorMode === "jsx" ? `<${item}>` : item.charAt(0).toLowerCase() + item.slice(1)}</Code>
                            ))}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>

              <Box style={{ flex: 1, minHeight: 0 }}>
                {editorMode === "jsx" ? (
                  <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    value={jsxCode}
                    onChange={(value) => setJsxCode(value ?? "")}
                    theme={isDark ? "vs-dark" : "light"}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      tabSize: 2,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />
                ) : (
                  <Editor
                    height="100%"
                    defaultLanguage="typescript"
                    value={tsCode}
                    onChange={(value) => setTsCode(value ?? "")}
                    onMount={(_, monaco) => {
                      if (completionRegistered.current) return;
                      completionRegistered.current = true;
                      registerDslCompletion(monaco);
                    }}
                    theme={isDark ? "vs-dark" : "light"}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      tabSize: 2,
                      quickSuggestions: true,
                      wordBasedSuggestions: "off",
                      suggestOnTriggerCharacters: true,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />
                )}
              </Box>

              {editorMode === "jsx" && parsedJsx.error !== null && (
                <Alert variant="light" color="red" icon={<IconAlertCircle size={16} />}>
                  {parsedJsx.error}
                </Alert>
              )}
              {editorMode === "ts" && parsedTs.error !== null && (
                <Alert variant="light" color="red" icon={<IconAlertCircle size={16} />}>
                  {parsedTs.error}
                </Alert>
              )}
              {editorMode === "ts" && (
                <Text size="xs" c="dimmed">TS editor supports syntax highlighting, DSL autocomplete, and live preview.</Text>
              )}
            </Stack>
          </Paper>
        )}

        {showCodePanel && !isNarrow && (
          <Box
            onMouseDown={(event) => {
              event.preventDefault();
              setIsDraggingSplit(true);
              handleSplitDrag(event.clientX);
            }}
            style={{
              width: 10,
              cursor: "col-resize",
              background: isDraggingSplit
                ? (isDark ? "var(--mantine-color-blue-9)" : "var(--mantine-color-blue-2)")
                : "transparent",
              borderLeft: `1px solid ${isDark ? "var(--mantine-color-dark-4)" : "var(--mantine-color-gray-3)"}`,
              borderRight: `1px solid ${isDark ? "var(--mantine-color-dark-4)" : "var(--mantine-color-gray-3)"}`,
              userSelect: "none",
            }}
          />
        )}

        <Paper
          withBorder
          radius="md"
          style={{
            flex: 1,
            minHeight: 760,
            height: 760,
            resize: "vertical",
            overflow: "auto",
          }}
        >
          <Stack gap={0}>
            <Box p="md" style={{ borderBottom: `1px solid ${isDark ? "var(--mantine-color-dark-4)" : "var(--mantine-color-gray-3)"}` }}>
              <Text fw={600}>Preview</Text>
            </Box>
            <Box
              p="xl"
              style={{
                backgroundImage: `radial-gradient(${isDark ? "var(--mantine-color-dark-2)" : "var(--mantine-color-gray-4)"} 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
                minHeight: 700,
                backgroundColor: isDark ? "var(--mantine-color-dark-8)" : "var(--mantine-color-white)",
              }}
            >
              <Box
                p="lg"
                style={{
                  backgroundColor: isDark ? "var(--mantine-color-dark-5)" : "var(--mantine-color-white)",
                  borderRadius: "var(--mantine-radius-md)",
                  minHeight: 620,
                }}
              >
                {preview}
              </Box>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}

function registerDslCompletion(monaco: typeof import("monaco-editor")) {
  const functions = [
    "dsl", "page", "section", "stack", "grid", "split", "card",
    "form", "field",
    "table", "list", "tree", "stat",
    "tabs", "sidebarNav", "topNav", "navItem", "breadcrumb", "pagination",
    "menu", "menuItem", "contextMenu",
    "button", "iconButton", "segmentedButton", "segmentedItem", "linkAction", "actionBar",
    "alert", "tooltip", "badge", "progress", "emptyState", "loadingState",
    "modal", "drawer", "popover",
    "image", "iconPlaceholder", "avatar", "chart", "map",
    "label", "heading", "paragraph", "text", "actionRef", "dataSourceRef",
  ];

  monaco.languages.registerCompletionItemProvider("typescript", {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      return {
        suggestions: functions.map((fn) => ({
          label: fn,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: `${fn}($1)`,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
        })),
      };
    },
  });
}

function isDslLike(value: unknown): value is MockupDoc {
  if (typeof value !== "object" || value === null) return false;
  const doc = value as { version?: unknown; page?: { layout?: unknown } };
  return doc.version === "0.1" && typeof doc.page === "object" && doc.page !== null && "layout" in doc.page;
}

function evaluateDslTs(source: string): unknown {
  const stripped = source
    .replace(/^\s*import[\s\S]*?from\s+["'][^"']+["'];?\s*$/gm, "")
    .replace(/^\s*export\s+/gm, "");

  const names = Object.keys(dslApi).filter((key) => key !== "default");
  const expressionCandidate = stripped.trim().replace(/;\s*$/, "");

  try {
    const expressionFactory = new Function(
      "dslApi",
      `"use strict";
const { ${names.join(", ")} } = dslApi;
return (${expressionCandidate});
`
    );
    return expressionFactory(dslApi as unknown as Record<string, unknown>);
  } catch {
    const statementFactory = new Function(
      "dslApi",
      `"use strict";
const { ${names.join(", ")} } = dslApi;
${stripped}
if (typeof doc !== "undefined") return doc;
if (typeof result !== "undefined") return result;
throw new Error("Write DSL as expression (e.g. dsl({...})) or define \`doc\` / \`result\`.");
`
    );
    return statementFactory(dslApi as unknown as Record<string, unknown>);
  }
}
