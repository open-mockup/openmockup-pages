import React from "react";
import { Badge, Code, Divider, Stack, Text, Title } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import { DemoBlock } from "../components/DemoBlock.js";
import { PropsTable, type PropRow } from "../components/PropsTable.js";
import {
  singleButton,
  singleButtonCode,
  buttonVariants,
  buttonVariantsCode,
  buttonActionBar,
  buttonActionBarCode,
  iconButtonRow,
  iconButtonRowCode,
  segmentedModes,
  segmentedModesCode,
  orderPage,
  orderPageCode,
} from "../examples/button.js";

const importCode = `import { button, iconButton, segmentedButton, segmentedItem, actionBar, linkAction } from "@openmockup/dsl";`;

const buttonProps: PropRow[] = [
  {
    name: "label",
    type: "TextValue",
    required: true,
    description: "Visible button text. Created with text().",
  },
  {
    name: "variant",
    type: '"primary" | "secondary" | "ghost"',
    description: 'Visual emphasis level. Defaults to "primary".',
  },
  {
    name: "action",
    type: "ActionRef",
    description:
      "Optional action identifier. Registered in the host application. Created with actionRef().",
  },
];

const actionBarProps: PropRow[] = [
  {
    name: "items",
    type: "[ButtonNode | LinkActionNode, ...]",
    required: true,
    description:
      "At least one button or link action. Tuple type enforces minimum of 1 at compile time.",
  },
];

const iconButtonProps: PropRow[] = [
  { name: "icon", type: "string", required: true, description: "Icon name token, e.g. \"search\"." },
  { name: "label", type: "TextValue", description: "Optional accessible label." },
  { name: "variant", type: '"primary" | "secondary" | "ghost"', description: "Visual button style." },
  { name: "action", type: "ActionRef", description: "Optional action identifier." },
];

const segmentedButtonProps: PropRow[] = [
  {
    name: "items",
    type: "[SegmentedButtonOption, ...]",
    required: true,
    description:
      'Segment options with key + label. In JSX, pass an object array: items={[{"key": "list", "label": "List"}]}.',
  },
  {
    name: "activeKey",
    type: "string",
    required: true,
    description: "Currently selected segment key.",
  },
];

export function ButtonPage() {
  return (
    <Stack gap="xl">
      {/* ── Title ── */}
      <div>
        <Badge mb="xs" variant="light" color="indigo" size="sm">
          Actions
        </Badge>
        <Title order={1} mb="xs">
          Button
        </Title>
        <Text c="dimmed" size="lg">
          A clickable element that triggers a registered action. Use{" "}
          <Code>actionBar</Code> to group multiple buttons horizontally.
        </Text>
      </div>

      <Divider />

      {/* ── Import ── */}
      <div>
        <Text fw={600} mb="xs">
          Import
        </Text>
        <CodeHighlight code={importCode} language="typescript" />
      </div>

      <Divider />

      {/* ── Demos ── */}
      <div>
        <Title order={2} mb="lg">
          Examples
        </Title>

        <DemoBlock
          title="Basic button"
          doc={singleButton}
          code={singleButtonCode}
        />

        <DemoBlock
          title="Variants"
          doc={buttonVariants}
          code={buttonVariantsCode}
        />

        <DemoBlock
          title="ActionBar with LinkAction"
          doc={buttonActionBar}
          code={buttonActionBarCode}
        />

        <DemoBlock
          title="ActionBar with IconButton"
          doc={iconButtonRow}
          code={iconButtonRowCode}
        />

        <DemoBlock
          title="Segmented Button"
          doc={segmentedModes}
          code={segmentedModesCode}
        />

        <DemoBlock
          title="Composed page — order detail"
          doc={orderPage}
          code={orderPageCode}
        />
      </div>

      <Divider />

      {/* ── Props ── */}
      <div>
        <Title order={2} mb="sm">
          Button props
        </Title>
        <PropsTable rows={buttonProps} />
      </div>

      <div>
        <Title order={2} mb="sm" mt="lg">
          ActionBar props
        </Title>
        <PropsTable rows={actionBarProps} />
      </div>

      <div>
        <Title order={2} mb="sm" mt="lg">
          IconButton props
        </Title>
        <PropsTable rows={iconButtonProps} />
      </div>

      <div>
        <Title order={2} mb="sm" mt="lg">
          SegmentedButton props
        </Title>
        <PropsTable rows={segmentedButtonProps} />
      </div>
    </Stack>
  );
}
