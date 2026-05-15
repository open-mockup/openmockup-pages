import React from "react";
import { Alert, Badge, Divider, Stack, Text, Title } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { CodeHighlight } from "@mantine/code-highlight";
import { DemoBlock } from "../components/DemoBlock.js";
import { PropsTable, type PropRow } from "../components/PropsTable.js";
import {
  modalBasic,
  modalBasicCode,
  drawerRight,
  drawerRightCode,
  popoverBasic,
  popoverBasicCode,
} from "../examples/overlays.js";

const importCode = `import { modal, drawer, popover } from "@openmockup/dsl";`;

const modalProps: PropRow[] = [
  { name: "title",   type: "TextValue",  required: true, description: "Modal header text." },
  { name: "open",    type: "boolean",    required: false, description: "Render an open overlay snapshot when true; hide it when false; omit for the flat wireframe block." },
  { name: "content", type: "LayoutNode", required: true, description: "Body content (single node)." },
];

const drawerProps: PropRow[] = [
  { name: "side",    type: '"left" | "right"', required: true, description: "Which edge the drawer slides in from." },
  { name: "open",    type: "boolean",          required: false, description: "Render an open drawer snapshot when true; hide it when false; omit for the flat wireframe block." },
  { name: "content", type: "LayoutNode",       required: true, description: "Drawer body content." },
];

const popoverProps: PropRow[] = [
  { name: "content", type: "LayoutNode", required: true, description: "Popover body content." },
];

export function OverlayPage() {
  return (
    <Stack gap="xl">
      <div>
        <Badge mb="xs" variant="light" color="grape" size="sm">Overlays</Badge>
        <Title order={1} mb="xs">Overlays</Title>
        <Text c="dimmed" size="lg">
          Overlay nodes — <code>modal</code>, <code>drawer</code>, and <code>popover</code>.
          Without <code>open</code> they render as dashed panels to indicate their position in the layout.
          Use <code>open</code> for a static snapshot of an already-open overlay.
        </Text>
      </div>

      <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
        Use <code>open</code> for one-screen state snapshots. Use Flow transitions when the document
        needs click-through open/close behavior.
      </Alert>

      <Divider />

      <div>
        <Text fw={600} mb="xs">Import</Text>
        <CodeHighlight code={importCode} language="typescript" />
      </div>

      <Divider />

      {/* ── Modal ── */}
      <div>
        <Title order={2} mb="lg">Modal</Title>
        <DemoBlock title="Confirmation dialog" doc={modalBasic} code={modalBasicCode} />
        <Title order={3} mt="lg" mb="sm">Modal props</Title>
        <PropsTable rows={modalProps} />
      </div>

      <Divider />

      {/* ── Drawer ── */}
      <div>
        <Title order={2} mb="lg">Drawer</Title>
        <DemoBlock title="Right-side form drawer" doc={drawerRight} code={drawerRightCode} />
        <Title order={3} mt="lg" mb="sm">Drawer props</Title>
        <PropsTable rows={drawerProps} />
      </div>

      <Divider />

      {/* ── Popover ── */}
      <div>
        <Title order={2} mb="lg">Popover</Title>
        <DemoBlock title="Info popover" doc={popoverBasic} code={popoverBasicCode} />
        <Title order={3} mt="lg" mb="sm">Popover props</Title>
        <PropsTable rows={popoverProps} />
      </div>
    </Stack>
  );
}
