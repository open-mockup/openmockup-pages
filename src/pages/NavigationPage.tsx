import React from "react";
import { Badge, Divider, Stack, Text, Title } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import { DemoBlock } from "../components/DemoBlock.js";
import { PropsTable, type PropRow } from "../components/PropsTable.js";
import {
  tabsBasic,
  tabsBasicCode,
  breadcrumbBasic,
  breadcrumbBasicCode,
  paginationBasic,
  paginationBasicCode,
  sidebarNavBasic,
  sidebarNavBasicCode,
  topNavBasic,
  topNavBasicCode,
  menuBasic,
  menuBasicCode,
  contextMenuBasic,
  contextMenuBasicCode,
} from "../examples/navigation.js";

const importCode = `import { tabs, breadcrumb, pagination, sidebarNav, topNav, menu, contextMenu, navItem, menuItem } from "@openmockup/dsl";`;

const tabsProps: PropRow[] = [
  {
    name: "tabs",
    type: "[TextValue, ...] | [{ key, label, action? }, ...]",
    required: true,
    description:
      "Tab labels, or keyed tab items. Keyed items can include action, a flow action emitted when the tab is clicked.",
  },
  {
    name: "active",
    type: "number",
    description: "Legacy zero-based index of the initially active tab.",
  },
  {
    name: "activeKey",
    type: "string",
    description: "Key of the active tab when tabs uses keyed items.",
  },
];

const breadcrumbProps: PropRow[] = [
  { name: "items", type: "[TextValue, ...]", required: true, description: "Ordered list of crumb labels from root to current." },
];

const paginationProps: PropRow[] = [
  { name: "page",     type: "number", required: true, description: "Current page number (1-based)." },
  { name: "pageSize", type: "number", required: true, description: "Number of items per page." },
  { name: "total",    type: "number", required: true, description: "Total number of items. Drives the page count." },
];

const sidebarNavProps: PropRow[] = [
  { name: "items",     type: "[NavItem, ...]", required: true, description: "Navigation items. Each has { key, label }." },
  { name: "activeKey", type: "string",         required: true, description: "Key of the currently active item." },
];

const topNavProps: PropRow[] = [
  { name: "items", type: "[NavItem, ...]", required: true, description: "Horizontal navigation items." },
  { name: "activeKey", type: "string", required: true, description: "Selected item key." },
  { name: "brand", type: "TextValue", description: "Optional app/product name at the left side." },
];

const menuProps: PropRow[] = [
  { name: "items", type: "[MenuItem, ...]", required: true, description: "Vertical list of menu actions." },
];

const contextMenuProps: PropRow[] = [
  { name: "items", type: "[MenuItem, ...]", required: true, description: "Menu actions shown in context mode." },
  { name: "triggerLabel", type: "TextValue", description: "Optional trigger description." },
];

export function NavigationPage() {
  return (
    <Stack gap="xl">
      <div>
        <Badge mb="xs" variant="light" color="cyan" size="sm">Navigation</Badge>
        <Title order={1} mb="xs">Navigation</Title>
        <Text c="dimmed" size="lg">
          Wayfinding nodes: <code>tabs</code>, <code>breadcrumb</code>, <code>pagination</code>,
          <code>sidebarNav</code>, <code>topNav</code>, <code>menu</code>, and <code>contextMenu</code>.
        </Text>
      </div>

      <Divider />

      <div>
        <Text fw={600} mb="xs">Import</Text>
        <CodeHighlight code={importCode} language="typescript" />
      </div>

      <Divider />

      {/* ── Tabs ── */}
      <div>
        <Title order={2} mb="lg">Tabs</Title>
        <DemoBlock title="Basic tabs" doc={tabsBasic} code={tabsBasicCode} />
        <Text mt="lg" mb="xs">
          Flow-aware tabs use keyed object items. <code>action</code> is the
          flow action emitted when the tab is clicked; VS Code preview is the
          first renderer that implements the behavior.
        </Text>
        <CodeHighlight
          code={`<Tabs
  activeKey="strategy"
  tabs={[
    { key: "overview", label: "Обзор", action: "open-overview" },
    { key: "strategy", label: "Стратегия", action: "open-strategy" }
  ]}
/>`}
          language="jsx"
        />
        <Title order={3} mt="lg" mb="sm">Tabs props</Title>
        <PropsTable rows={tabsProps} />
      </div>

      <Divider />

      {/* ── Breadcrumb ── */}
      <div>
        <Title order={2} mb="lg">Breadcrumb</Title>
        <DemoBlock title="4-level breadcrumb" doc={breadcrumbBasic} code={breadcrumbBasicCode} />
        <Title order={3} mt="lg" mb="sm">Breadcrumb props</Title>
        <PropsTable rows={breadcrumbProps} />
      </div>

      <Divider />

      {/* ── Pagination ── */}
      <div>
        <Title order={2} mb="lg">Pagination</Title>
        <DemoBlock title="Page 3 of 10" doc={paginationBasic} code={paginationBasicCode} />
        <Title order={3} mt="lg" mb="sm">Pagination props</Title>
        <PropsTable rows={paginationProps} />
      </div>

      <Divider />

      {/* ── SidebarNav ── */}
      <div>
        <Title order={2} mb="lg">SidebarNav</Title>
        <DemoBlock title="App sidebar" doc={sidebarNavBasic} code={sidebarNavBasicCode} />
        <Title order={3} mt="lg" mb="sm">SidebarNav props</Title>
        <PropsTable rows={sidebarNavProps} />
      </div>

      <Divider />

      <div>
        <Title order={2} mb="lg">TopNav</Title>
        <DemoBlock title="Header navigation" doc={topNavBasic} code={topNavBasicCode} />
        <Title order={3} mt="lg" mb="sm">TopNav props</Title>
        <PropsTable rows={topNavProps} />
      </div>

      <Divider />

      <div>
        <Title order={2} mb="lg">Menu</Title>
        <DemoBlock title="Basic menu" doc={menuBasic} code={menuBasicCode} />
        <Title order={3} mt="lg" mb="sm">Menu props</Title>
        <PropsTable rows={menuProps} />
      </div>

      <Divider />

      <div>
        <Title order={2} mb="lg">ContextMenu</Title>
        <DemoBlock title="Row context actions" doc={contextMenuBasic} code={contextMenuBasicCode} />
        <Title order={3} mt="lg" mb="sm">ContextMenu props</Title>
        <PropsTable rows={contextMenuProps} />
      </div>
    </Stack>
  );
}
