import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  Code,
  Divider,
  Group,
  Modal,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Title,
  useComputedColorScheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Editor from "@monaco-editor/react";
import { IconAlertCircle } from "@tabler/icons-react";
import * as dslApi from "@openmockup/dsl";
import { mantineRenderer, renderDsl } from "@openmockup/renderer-mantine";
import { renderIr } from "@openmockup/renderer-core";
import { parseJsx } from "@openmockup/parser-jsx";
import * as flowApi from "@openmockup/flow";
import type { FlowDsl, FlowRuntimeState } from "@openmockup/flow";

const initialJsxCode = `<Page title="User management">
  <Section title="Team members">
    <ActionBar>
      <Button variant="primary" action="invite-user">Invite user</Button>
      <Button variant="secondary" action="export-csv">Export CSV</Button>
    </ActionBar>
    <Table dataSource="teamMembers" columns={["Name", "Email", "Role", "Status"]} />
  </Section>
</Page>`;

const initialFlowCode = `flow({
  initial: flowFormRef("inventory"),
  forms: [
    flowForm({
      id: flowFormRef("inventory"),
      doc: dsl({
        page: page({
          title: text("Inventory"),
          layout: section({
            title: text("Products"),
            content: stack({
              direction: "vertical",
              gap: 12,
              children: [
                actionBar([
                  button({ label: text("Add item"), variant: "primary", action: actionRef("open-add-modal") }),
                  linkAction({ label: text("Audit trail"), action: actionRef("open-audit-modal") }),
                ]),
                table({
                  dataSource: dataSourceRef("inventoryRows"),
                  columns: [text("SKU"), text("Name"), text("Qty"), text("Status"), text("Updated at"), text("Actions")],
                }),
              ],
            }),
          }),
        }),
      }),
    }),
    flowForm({
      id: flowFormRef("details"),
      doc: dsl({
        page: page({
          title: text("Item details"),
          layout: form({
            fields: [
              field({ key: "sku", component: "textInput", label: text("SKU"), required: true }),
              field({ key: "name", component: "textInput", label: text("Name"), required: true }),
              field({ key: "qty", component: "numericInput", label: text("Quantity"), required: true }),
              field({ key: "status", component: "select", label: text("Status"), options: [text("Draft"), text("Active"), text("Archived")] }),
            ],
            actions: actionBar([
              button({ label: text("Save"), variant: "primary", action: actionRef("save-details") }),
              linkAction({ label: text("Back to table"), action: actionRef("back-from-details") }),
            ]),
          }),
        }),
      }),
    }),
    flowForm({
      id: flowFormRef("addItemModal"),
      doc: dsl({
        page: page({
          title: text("Add item"),
          layout: form({
            fields: [
              field({ key: "name", component: "textInput", label: text("Product name"), required: true }),
              field({ key: "sku", component: "textInput", label: text("SKU"), required: true }),
              field({ key: "qty", component: "numericInput", label: text("Initial quantity"), required: true }),
              field({ key: "status", component: "select", label: text("Status"), options: [text("Draft"), text("Active")] }),
            ],
            actions: actionBar([
              button({ label: text("Create"), variant: "primary", action: actionRef("submit-add-item") }),
              linkAction({ label: text("Cancel"), action: actionRef("cancel-add-item") }),
            ]),
          }),
        }),
      }),
    }),
    flowForm({
      id: flowFormRef("editItemModal"),
      doc: dsl({
        page: page({
          title: text("Edit selected row"),
          layout: form({
            fields: [
              field({ key: "name", component: "textInput", label: text("Product name"), required: true }),
              field({ key: "qty", component: "numericInput", label: text("Quantity"), required: true }),
              field({ key: "status", component: "select", label: text("Status"), options: [text("Active"), text("Paused"), text("Archived")] }),
            ],
            actions: actionBar([
              button({ label: text("Save changes"), variant: "primary", action: actionRef("submit-edit-item") }),
              linkAction({ label: text("Cancel"), action: actionRef("cancel-edit-item") }),
            ]),
          }),
        }),
      }),
    }),
    flowForm({
      id: flowFormRef("deleteItemModal"),
      doc: dsl({
        page: page({
          title: text("Delete row"),
          layout: section({
            title: text("Delete confirmation"),
            content: stack({
              direction: "vertical",
              gap: 10,
              children: [
                paragraph({ text: text("Selected row will be permanently removed from inventory.") }),
                actionBar([
                  button({ label: text("Delete row"), variant: "primary", action: actionRef("confirm-delete-item") }),
                  linkAction({ label: text("Cancel"), action: actionRef("cancel-delete-item") }),
                ]),
              ],
            }),
          }),
        }),
      }),
    }),
    flowForm({
      id: flowFormRef("auditModal"),
      doc: dsl({
        page: page({
          title: text("Audit trail"),
          layout: section({
            title: text("Recent events"),
            content: stack({
              direction: "vertical",
              gap: 10,
              children: [
                list({
                  dataSource: dataSourceRef("inventoryAudit"),
                  itemTemplate: text("{{user}} changed {{field}} from {{from}} to {{to}}"),
                }),
                actionBar([
                  linkAction({ label: text("Close"), action: actionRef("close-audit-modal") }),
                ]),
              ],
            }),
          }),
        }),
      }),
    }),
  ],
  transitions: [
    flowTransition({ from: flowFormRef("inventory"), action: actionRef("open-add-modal"), to: flowFormRef("addItemModal"), mode: "modal" }),
    flowTransition({ from: flowFormRef("inventory"), action: actionRef("open-audit-modal"), to: flowFormRef("auditModal"), mode: "modal" }),
    flowTransition({ from: flowFormRef("inventory"), action: actionRef("edit-row-1001"), to: flowFormRef("editItemModal"), mode: "modal" }),
    flowTransition({ from: flowFormRef("inventory"), action: actionRef("edit-row-2042"), to: flowFormRef("editItemModal"), mode: "modal" }),
    flowTransition({ from: flowFormRef("inventory"), action: actionRef("edit-row-3120"), to: flowFormRef("editItemModal"), mode: "modal" }),
    flowTransition({ from: flowFormRef("inventory"), action: actionRef("delete-row-1001"), to: flowFormRef("deleteItemModal"), mode: "modal" }),
    flowTransition({ from: flowFormRef("inventory"), action: actionRef("delete-row-2042"), to: flowFormRef("deleteItemModal"), mode: "modal" }),
    flowTransition({ from: flowFormRef("inventory"), action: actionRef("delete-row-3120"), to: flowFormRef("deleteItemModal"), mode: "modal" }),
    flowTransition({ from: flowFormRef("inventory"), action: actionRef("duplicate-row-1001"), to: flowFormRef("addItemModal"), mode: "modal" }),
    flowTransition({ from: flowFormRef("inventory"), action: actionRef("duplicate-row-2042"), to: flowFormRef("addItemModal"), mode: "modal" }),
    flowTransition({ from: flowFormRef("inventory"), action: actionRef("duplicate-row-3120"), to: flowFormRef("addItemModal"), mode: "modal" }),
    flowTransition({ from: flowFormRef("inventory"), action: actionRef("details-row-1001"), to: flowFormRef("details"), mode: "push" }),
    flowTransition({ from: flowFormRef("inventory"), action: actionRef("details-row-2042"), to: flowFormRef("details"), mode: "push" }),
    flowTransition({ from: flowFormRef("inventory"), action: actionRef("details-row-3120"), to: flowFormRef("details"), mode: "push" }),

    flowTransition({ from: flowFormRef("details"), action: actionRef("save-details"), to: flowFormRef("inventory"), mode: "replace" }),
    flowTransition({ from: flowFormRef("details"), action: actionRef("back-from-details"), mode: "back" }),

    flowTransition({ from: flowFormRef("addItemModal"), action: actionRef("submit-add-item"), mode: "back" }),
    flowTransition({ from: flowFormRef("addItemModal"), action: actionRef("cancel-add-item"), mode: "back" }),

    flowTransition({ from: flowFormRef("editItemModal"), action: actionRef("submit-edit-item"), mode: "back" }),
    flowTransition({ from: flowFormRef("editItemModal"), action: actionRef("cancel-edit-item"), mode: "back" }),

    flowTransition({ from: flowFormRef("deleteItemModal"), action: actionRef("confirm-delete-item"), mode: "back" }),
    flowTransition({ from: flowFormRef("deleteItemModal"), action: actionRef("cancel-delete-item"), mode: "back" }),

    flowTransition({ from: flowFormRef("auditModal"), action: actionRef("close-audit-modal"), mode: "back" }),
  ],
});
`;

export function FlowPage() {
  const isDark = useComputedColorScheme("light") === "dark";
  const isNarrow = useMediaQuery("(max-width: 62em)");
  const completionRegistered = useRef(false);
  const [showCodePanel, setShowCodePanel] = useState(true);
  const [editorMode, setEditorMode] = useState<"jsx" | "ts">("jsx");
  const [jsxCode, setJsxCode] = useState(initialJsxCode);
  const [tsCode, setTsCode] = useState(initialFlowCode);

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
      const result = evaluateFlowTs(tsCode);
      if (!isFlowLike(result)) {
        return { doc: null, error: "TS code must evaluate to flow({...}) result." };
      }
      return { doc: result as FlowDsl, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid flow TS";
      return { doc: null, error: message };
    }
  }, [tsCode]);

  const [runtime, setRuntime] = useState<FlowRuntimeState | null>(null);

  useEffect(() => {
    if (parsedTs.doc === null) {
      setRuntime(null);
      return;
    }
    setRuntime(flowApi.createFlowRuntime(parsedTs.doc));
  }, [parsedTs.doc]);

  const activeFlow = parsedTs.doc;
  const activeRuntime = runtime;
  const activeActions =
    activeFlow && activeRuntime
      ? flowApi.listAvailableActions(activeFlow, activeRuntime)
      : [];

  const trigger = (action: string) => {
    if (!activeFlow) return;
    setRuntime((prev) => {
      if (prev === null) return prev;
      return flowApi.triggerAction(activeFlow, prev, action);
    });
  };

  const baseForm =
    activeFlow && activeRuntime
      ? flowApi.getBaseForm(activeFlow, activeRuntime)
      : null;

  const modalForm =
    activeFlow && activeRuntime
      ? flowApi.getActiveModal(activeFlow, activeRuntime)
      : null;

  const activeFormId =
    activeFlow && activeRuntime
      ? flowApi.getActiveFormId(activeRuntime)
      : null;

  const jsxPreview = useMemo(() => {
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
  }, [parsedJsx.ir]);

  return (
    <Stack gap="xl">
      <div>
        <Badge mb="xs" variant="light" color="violet" size="sm">
          Flow
        </Badge>
        <Title order={1} mb="xs">
          Flow Editor
        </Title>
        <Text c="dimmed" size="lg">
          Start with a single <Code>openmockup(.om)</Code> screen or switch to Flow TS to describe multi-screen transitions.
        </Text>
      </div>

      <Divider />

      <Group>
        <Button variant="default" onClick={() => setJsxCode(initialJsxCode)}>
          Reset JSX sample
        </Button>
        <Button variant="default" onClick={() => setTsCode(initialFlowCode)}>
          Reset flow sample
        </Button>
        <Button variant="default" onClick={() => setShowCodePanel((value) => !value)}>
          {showCodePanel ? "Hide code panel" : "Show code panel"}
        </Button>
      </Group>

      <Box style={{ display: "grid", gridTemplateColumns: !showCodePanel || isNarrow ? "1fr" : "minmax(360px, 1fr) minmax(360px, 1fr)", gap: 12 }}>
        {showCodePanel && (
          <Paper withBorder radius="md" p="md" style={{ minHeight: 760, height: 760, overflow: "hidden" }}>
            <Stack gap="sm" style={{ height: "100%" }}>
              <Group justify="space-between">
                <Text fw={600}>Editor</Text>
                <SegmentedControl
                  size="xs"
                  value={editorMode}
                  onChange={(value) => setEditorMode(value as "jsx" | "ts")}
                  data={[
                    { label: "openmockup(.om)", value: "jsx" },
                    { label: "Flow TS", value: "ts" },
                  ]}
                />
              </Group>

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
                      registerFlowCompletion(monaco);
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
                <Text size="xs" c="dimmed">
                  Use <Code>flow</Code>, <Code>flowForm</Code>, <Code>flowTransition</Code> and DSL builders.
                </Text>
              )}
            </Stack>
          </Paper>
        )}

        <Paper withBorder radius="md" style={{ minHeight: 760, height: 760, overflow: "auto" }}>
          <Stack gap={0}>
            <Box p="md" style={{ borderBottom: `1px solid ${isDark ? "var(--mantine-color-dark-4)" : "var(--mantine-color-gray-3)"}` }}>
              <Group justify="space-between">
                <Text fw={600}>
                  {editorMode === "jsx" ? "Preview" : "Runtime Preview"}
                </Text>
                {editorMode === "ts" && activeFormId !== null && <Code>{activeFormId}</Code>}
              </Group>
            </Box>

            {editorMode === "jsx" ? (
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
                  {jsxPreview}
                </Box>
              </Box>
            ) : (
              <Stack p="md" gap="sm">
                {activeRuntime !== null && (
                  <Text size="xs" c="dimmed">
                    Stack: {activeRuntime.stack.join(" -> ")}
                    {activeRuntime.modalStack.length > 0 ? ` | Modals: ${activeRuntime.modalStack.join(" -> ")}` : ""}
                  </Text>
                )}

                <Group gap="xs">
                  {activeActions.map((action) => (
                    <Button
                      key={action}
                      size="xs"
                      variant="light"
                      onClick={() => trigger(action)}
                    >
                      {String(action)}
                    </Button>
                  ))}
                  {activeActions.length === 0 && <Text size="xs" c="dimmed">No actions for current form.</Text>}
                </Group>

                <Divider />

                {baseForm !== null ? (
                  <Box p="lg" style={{ borderRadius: 8, backgroundColor: isDark ? "var(--mantine-color-dark-6)" : "var(--mantine-color-gray-0)" }}>
                    {renderIr(baseForm.doc, mantineRenderer)}
                  </Box>
                ) : (
                  <Text size="sm" c="dimmed">Flow is not parsed yet.</Text>
                )}
              </Stack>
            )}
          </Stack>
        </Paper>
      </Box>

      {editorMode === "ts" && (
        <Modal
          opened={modalForm !== null}
          onClose={() => {
            if (!activeFlow || modalForm === null) return;
            setRuntime((prev) => {
              if (prev === null) return prev;
              const closeTransition = activeFlow.transitions.find(
                (item) => item.from === modalForm.id && item.mode === "back"
              );
              if (!closeTransition) return prev;
              return flowApi.triggerAction(activeFlow, prev, closeTransition.on);
            });
          }}
          title={modalForm?.doc.title}
          centered
        >
          {modalForm !== null && renderIr(modalForm.doc, mantineRenderer)}
        </Modal>
      )}
    </Stack>
  );
}

function evaluateFlowTs(source: string): unknown {
  const stripped = source
    .replace(/^\s*import[\s\S]*?from\s+["'][^"']+["'];?\s*$/gm, "")
    .replace(/^\s*export\s+/gm, "");

  const scope: Record<string, unknown> = {
    ...dslApi,
    ...flowApi,
  };

  const names = Object.keys(scope).filter((key) => key !== "default");
  const expressionCandidate = stripped.trim().replace(/;\s*$/, "");

  try {
    const expressionFactory = new Function(
      "scope",
      `"use strict";
const { ${names.join(", ")} } = scope;
return (${expressionCandidate});
`
    );
    return expressionFactory(scope);
  } catch {
    const statementFactory = new Function(
      "scope",
      `"use strict";
const { ${names.join(", ")} } = scope;
${stripped}
if (typeof doc !== "undefined") return doc;
if (typeof result !== "undefined") return result;
throw new Error("Write flow as expression (e.g. flow({...})) or define \`doc\` / \`result\`.");
`
    );
    return statementFactory(scope);
  }
}

function isFlowLike(value: unknown): value is FlowDsl {
  if (typeof value !== "object" || value === null) return false;
  const flow = value as {
    initial?: unknown;
    forms?: unknown;
    transitions?: unknown;
  };

  return (
    typeof flow.initial === "string"
    && Array.isArray(flow.forms)
    && flow.forms.length > 0
    && Array.isArray(flow.transitions)
  );
}

function registerFlowCompletion(monaco: typeof import("monaco-editor")) {
  const functions = [
    "dsl",
    "page",
    "form",
    "field",
    "actionBar",
    "button",
    "linkAction",
    "text",
    "actionRef",
    "flow",
    "flowForm",
    "flowFormRef",
    "flowTransition",
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
