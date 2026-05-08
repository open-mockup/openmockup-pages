import React from "react";
import {
  Alert,
  Badge,
  Box,
  Divider,
  List,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import { IconRobot } from "@tabler/icons-react";

/* ── helpers ─────────────────────────────────────────────────────────── */

function H2({ children }: { children: React.ReactNode }) {
  return (
    <Title order={2} mt="xl" mb="sm">
      {children}
    </Title>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <Title order={3} mt="lg" mb={6}>
      {children}
    </Title>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <Text mb="xs" style={{ lineHeight: 1.7 }}>
      {children}
    </Text>
  );
}

function Code({ lang, code }: { lang: string; code: string }) {
  return (
    <Box mb="md">
      <CodeHighlight code={code.trim()} language={lang} />
    </Box>
  );
}

function PropTable({ rows }: { rows: string[][] }) {
  const header = rows[0]!;
  const body = rows.slice(1);
  return (
    <Box mb="md" style={{ overflowX: "auto" }}>
      <Table striped withTableBorder withColumnBorders fz="sm">
        <Table.Thead>
          <Table.Tr>
            {header.map((h) => (
              <Table.Th key={h}>{h}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {body.map((row, i) => (
            <Table.Tr key={i}>
              {row.map((cell, j) => (
                <Table.Td key={j}>
                  <Text size="sm" ff="monospace">
                    {cell}
                  </Text>
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
}

/* ── page ─────────────────────────────────────────────────────────────── */

export function LlmReferencePage() {
  return (
    <Stack gap={0}>
      {/* header */}
      <Box>
        <Badge mb="xs" variant="light" color="violet" size="sm">
          LLM Reference
        </Badge>
        <Title order={1} mb="xs">
          Open Mockup — LLM Reference
        </Title>
        <Text c="dimmed" size="lg" mb="md">
          Single-page reference for AI agents. Covers JSX syntax, all
          components, Flow navigation, and Obsidian code fences.
        </Text>
        <Alert
          variant="light"
          color="blue"
          icon={<IconRobot size={16} />}
          mb="xl"
        >
          Stable endpoint:{" "}
          <Text span ff="monospace" size="sm">
            /llm-reference
          </Text>{" "}
          — paste this URL into your system prompt so the model can look up any
          component or syntax rule on demand.
        </Alert>
      </Box>

      <Divider mb="xl" />

      {/* ── formats ───────────────────────────────────────────────── */}
      <H2>Formats at a glance</H2>
      <PropTable
        rows={[
          ["Extension", "Description"],
          [".openmockup", "Single-screen JSX mockup"],
          [".omx", "Same as above, flow-aware (for multi-screen projects)"],
          [".flow.omx", "Multi-screen navigation graph"],
          [".dsl.ts", "TypeScript builder source"],
          [".uidsl.json", "Canonical JSON IR (machine output)"],
        ]}
      />
      <P>
        All formats share the same component vocabulary. JSX files (
        <code>.openmockup</code>, <code>.omx</code>) are the primary authoring
        format.
      </P>

      <Divider my="xl" />

      {/* ── JSX syntax ───────────────────────────────────────────── */}
      <H2>JSX syntax</H2>
      <P>
        Files are JSX without <code>import</code> or <code>export</code>. The
        root element is always <code>&lt;Page&gt;</code>.
      </P>
      <Code
        lang="jsx"
        code={`<Page title="Screen name">
  {/* content */}
</Page>`}
      />
      <P>
        <code>title</code> is required. Self-closing{" "}
        <code>{'<Page title="T" />'}</code> is valid for an empty screen.
      </P>

      <H3>Prop encoding</H3>
      <Code
        lang="jsx"
        code={`string       →  label="text"
number       →  gap={8}
true         →  required              (shorthand, never ={true})
false        →  required={false}      (explicit when needed)
string[]     →  tabs={["A", "B", "C"]}
object[]     →  items={[{"key": "a", "label": "A"}]}`}
      />

      <Divider my="xl" />

      {/* ── Layout ───────────────────────────────────────────────── */}
      <H2>Layout components</H2>

      <H3>Stack</H3>
      <P>Primary container. Vertical or horizontal.</P>
      <Code
        lang="jsx"
        code={`<Stack direction="vertical" gap={8}>
  <Label text="Item A" />
  <Label text="Item B" />
</Stack>

<Stack direction="horizontal" gap={4}>
  <Button label="Save" variant="primary" />
  <LinkAction label="Cancel" />
</Stack>`}
      />
      <PropTable
        rows={[
          ["Prop", "Type", "Values", "Default"],
          ["direction", "string", '"vertical" "horizontal"', '"vertical"'],
          ["gap", "number", "px", "8"],
        ]}
      />

      <H3>Grid</H3>
      <P>Uniform grid with a fixed column count.</P>
      <Code
        lang="jsx"
        code={`<Grid columns={3}>
  <Card title="Card 1">…</Card>
  <Card title="Card 2">…</Card>
  <Card title="Card 3">…</Card>
</Grid>`}
      />
      <PropTable
        rows={[
          ["Prop", "Type", "Default"],
          ["columns", "number", "2"],
        ]}
      />

      <H3>Split</H3>
      <P>Two side-by-side panels with a width ratio. Requires exactly two children.</P>
      <Code
        lang="jsx"
        code={`<Split ratio={0.3}>
  <Section title="Sidebar">…</Section>
  <Section title="Content">…</Section>
</Split>`}
      />
      <PropTable
        rows={[
          ["Prop", "Type", "Description"],
          ["ratio", "number", 'Left fraction (0–1). 0.3 = 30 % / 70 %'],
        ]}
      />

      <H3>Section</H3>
      <P>Named block with a title and border.</P>
      <Code
        lang="jsx"
        code={`<Section title="Order details">
  <Form>…</Form>
</Section>`}
      />

      <H3>Card</H3>
      <P>Card with a title. For metrics, widgets, summary blocks.</P>
      <Code
        lang="jsx"
        code={`<Card title="Revenue">
  <Stat label="This month" value="$48 000" />
  <Stat label="Last month"  value="$41 200" />
</Card>`}
      />

      <Divider my="xl" />

      {/* ── Actions ──────────────────────────────────────────────── */}
      <H2>Action components</H2>

      <H3>Button</H3>
      <Code
        lang="jsx"
        code={`<Button label="Save"    variant="primary" />
<Button label="Cancel"  variant="secondary" />
<Button label="Delete"  variant="danger" />
<Button label="More"    variant="ghost" />`}
      />
      <PropTable
        rows={[
          ["Prop", "Values"],
          ["label", "string"],
          ["variant", '"primary" "secondary" "danger" "ghost"'],
        ]}
      />

      <H3>IconButton</H3>
      <P>
        Icon-only button. <code>label</code> is the aria-label (not visible).
      </P>
      <Code
        lang="jsx"
        code={`<IconButton icon="search" label="Search" variant="secondary" />`}
      />
      <P>
        <code>icon</code> values:{" "}
        <code>"search" "map" "chart" "user" "photo"</code>
      </P>

      <H3>LinkAction</H3>
      <Code lang="jsx" code={`<LinkAction label="View details" />`} />

      <H3>ActionBar</H3>
      <P>Horizontal button group, typically at the bottom of a form or section.</P>
      <Code
        lang="jsx"
        code={`<ActionBar>
  <Button label="Confirm"    variant="primary" />
  <Button label="Save draft" variant="secondary" />
  <LinkAction label="Cancel" />
</ActionBar>`}
      />

      <H3>SegmentedButton</H3>
      <Code
        lang="jsx"
        code={`<SegmentedButton
  items={[{"key": "list", "label": "List"}, {"key": "grid", "label": "Grid"}]}
  activeKey="list"
/>`}
      />

      <Divider my="xl" />

      {/* ── Form ─────────────────────────────────────────────────── */}
      <H2>Form components</H2>

      <H3>Form</H3>
      <P>Container for fields. Renders as a vertical stack.</P>

      <H3>Field</H3>
      <P>
        Single form field. Type is set by <code>component</code>.
      </P>
      <Code
        lang="jsx"
        code={`<Field name="title"    label="Title"     component="textInput"   placeholder="…" required />
<Field name="notes"    label="Notes"     component="textArea" />
<Field name="status"   label="Status"    component="select"      options={["Active", "Inactive"]} />
<Field name="tags"     label="Tags"      component="multiSelect" options={["Bug", "Feature", "Docs"]} />
<Field name="agree"    label="I agree"   component="checkbox" />
<Field name="plan"     label="Plan"      component="radioGroup"  options={["Free", "Pro", "Enterprise"]} />
<Field name="notify"   label="Notify"    component="switch" />
<Field name="due"      label="Due date"  component="dateInput" />
<Field name="pass"     label="Password"  component="passwordInput" required />
<Field name="query"    label="Search"    component="searchInput" placeholder="Find…" />
<Field name="amount"   label="Amount"    component="numericInput" />`}
      />
      <PropTable
        rows={[
          ["Prop", "Description"],
          ["name", "Unique key within the form"],
          ["label", "Field label"],
          ["component", "Field type (see above)"],
          ["required", "Boolean shorthand"],
          ["placeholder", "Hint text"],
          ["options", 'String array for select, multiSelect, radioGroup'],
        ]}
      />

      <Divider my="xl" />

      {/* ── Data ─────────────────────────────────────────────────── */}
      <H2>Data components</H2>

      <H3>Table</H3>
      <P>Simple (text only):</P>
      <Code
        lang="jsx"
        code={`<Table
  columns="ID / Customer / Status / Total"
  rows="1 / John Doe / Active / $1 200\\n2 / J. Smith / Inactive / $50"
/>`}
      />
      <P>With interactive columns:</P>
      <Code
        lang="jsx"
        code={`<Table rows="John Doe / Active\\nJ. Smith / Inactive">
  <Column header="Name" />
  <Column header="Status" />
  <Column header="Actions">
    <Button label="Edit" variant="secondary" />
  </Column>
</Table>`}
      />
      <P>
        Rows: cells separated by <code> / </code>, rows separated by{" "}
        <code>\n</code>.
      </P>

      <H3>Stat</H3>
      <Code
        lang="jsx"
        code={`<Stat label="Monthly Revenue" value="$48 000" />
<Stat label="Open Tickets"    value={142} />`}
      />

      <H3>List</H3>
      <Code
        lang="jsx"
        code={`<List dataSource="orders" itemTemplate="#{id} — {customer}" />`}
      />

      <H3>Tree</H3>
      <Code lang="jsx" code={`<Tree dataSource="categories" />`} />

      <H3>Progress</H3>
      <Code lang="jsx" code={`<Progress value={75} />`} />

      <H3>Pagination</H3>
      <Code
        lang="jsx"
        code={`<Pagination page={1} pageSize={20} total={243} />`}
      />

      <Divider my="xl" />

      {/* ── Navigation ───────────────────────────────────────────── */}
      <H2>Navigation components</H2>

      <H3>Tabs</H3>
      <Code
        lang="jsx"
        code={`<Tabs tabs={["All", "Active", "Closed"]} active={0} />`}
      />

      <H3>TopNav</H3>
      <Code
        lang="jsx"
        code={`<TopNav
  brand="MyApp"
  items={[{"key": "home", "label": "Home"}, {"key": "orders", "label": "Orders"}]}
  activeKey="orders"
/>`}
      />

      <H3>SidebarNav</H3>
      <Code
        lang="jsx"
        code={`<SidebarNav
  items={[{"key": "dashboard", "label": "Dashboard"}, {"key": "clients", "label": "Clients"}]}
  activeKey="dashboard"
/>`}
      />

      <H3>Breadcrumb</H3>
      <Code
        lang="jsx"
        code={`<Breadcrumb items={["Home", "Clients", "John Doe"]} />`}
      />

      <H3>Menu / ContextMenu</H3>
      <Code
        lang="jsx"
        code={`<Menu items={[{"key": "edit", "label": "Edit"}, {"key": "delete", "label": "Delete"}]} />

<ContextMenu
  triggerLabel="Actions"
  items={[{"key": "view", "label": "View"}, {"key": "archive", "label": "Archive"}]}
/>`}
      />

      <Divider my="xl" />

      {/* ── Feedback ─────────────────────────────────────────────── */}
      <H2>Feedback components</H2>

      <H3>Alert</H3>
      <Code
        lang="jsx"
        code={`<Alert variant="info"    text="Your changes have been saved." />
<Alert variant="success" text="Order confirmed." />
<Alert variant="warning" text="This action cannot be undone." />
<Alert variant="error"   text="Connection failed. Please try again." />`}
      />

      <H3>Badge / Tooltip</H3>
      <Code
        lang="jsx"
        code={`<Badge text="New" />
<Tooltip text="Click to expand the section" />`}
      />

      <H3>EmptyState / LoadingState</H3>
      <Code
        lang="jsx"
        code={`<EmptyState title="No orders yet" description="Create your first order to get started." />
<LoadingState label="Loading orders…" />`}
      />

      <Divider my="xl" />

      {/* ── Media ────────────────────────────────────────────────── */}
      <H2>Media components</H2>

      <H3>Image</H3>
      <Code
        lang="jsx"
        code={`<Image aspectRatio="16:9" label="Product photo" />`}
      />
      <P>
        <code>aspectRatio</code>: <code>"16:9"</code> <code>"4:3"</code>{" "}
        <code>"1:1"</code>
      </P>

      <H3>Avatar</H3>
      <Code lang="jsx" code={`<Avatar name="Jane Doe" size="md" />`} />
      <P>
        <code>size</code>: <code>"xs"</code> <code>"sm"</code>{" "}
        <code>"md"</code> <code>"lg"</code> <code>"xl"</code>
      </P>

      <H3>Chart</H3>
      <Code
        lang="jsx"
        code={`<Chart chartType="bar"  title="Revenue by month" />
<Chart chartType="line" />
<Chart chartType="pie"  title="Distribution" />
<Chart chartType="area" />`}
      />

      <H3>Map / IconPlaceholder</H3>
      <Code
        lang="jsx"
        code={`<Map label="Office location" />
<IconPlaceholder icon="photo" />`}
      />

      <Divider my="xl" />

      {/* ── Overlays ─────────────────────────────────────────────── */}
      <H2>Overlay components</H2>
      <P>
        Overlays render as labelled flat blocks in wireframes, not as floating
        layers.
      </P>

      <H3>Modal</H3>
      <Code
        lang="jsx"
        code={`<Modal title="Confirm deletion">
  <Paragraph text="This action cannot be undone." />
  <ActionBar>
    <Button label="Delete" variant="danger" />
    <Button label="Cancel" variant="secondary" />
  </ActionBar>
</Modal>`}
      />

      <H3>Drawer</H3>
      <Code
        lang="jsx"
        code={`<Drawer side="right">
  <Form>…</Form>
</Drawer>`}
      />
      <P>
        <code>side</code>: <code>"left"</code> <code>"right"</code>{" "}
        <code>"top"</code> <code>"bottom"</code>
      </P>

      <H3>Popover</H3>
      <Code
        lang="jsx"
        code={`<Popover>
  <Field name="status" label="" component="radioGroup" options={["All", "Active", "Closed"]} />
</Popover>`}
      />

      <Divider my="xl" />

      {/* ── Text ─────────────────────────────────────────────────── */}
      <H2>Text components</H2>
      <Code
        lang="jsx"
        code={`<Heading   text="Order Summary" level={2} />
<Paragraph text="A longer description that may span multiple lines." />
<Label     text="Created by John Doe" />`}
      />
      <P>
        <code>level</code>: 1–6
      </P>

      <Divider my="xl" />

      {/* ── CustomComponent ──────────────────────────────────────── */}
      <H2>CustomComponent</H2>
      <P>
        For project-specific widgets with no matching core node. Never invent
        new core element names.
      </P>
      <Code
        lang="jsx"
        code={`<CustomComponent component="RichTextEditor" />
<CustomComponent component="SignaturePad" />`}
      />

      <Divider my="xl" />

      {/* ── Flow ─────────────────────────────────────────────────── */}
      <H2>Flow — multi-screen navigation</H2>

      <H3>File types</H3>
      <PropTable
        rows={[
          ["File", "Purpose"],
          ["screen.omx", "Single page, authored in JSX"],
          ["app.flow.omx", "Navigation graph referencing pages"],
        ]}
      />

      <H3>Flow file</H3>
      <Code
        lang="jsx"
        code={`<Flow initial="contact">

  <!-- external files -->
  <Page id="contact"    src="./contact.omx" />
  <Page id="shipping"   src="./shipping.omx" />
  <Page id="help-modal" src="./help-modal.omx" />

  <!-- inline page (small auxiliary screens) -->
  <Page id="done">
    <Heading>Order placed!</Heading>
  </Page>

  <!-- transitions scoped to each page -->
  <Page id="contact">
    <Go on="submit" to="shipping" />
    <Go on="help"   to="help-modal" modal />
  </Page>

  <Page id="shipping">
    <Go on="submit" to="done" />
    <Go on="back"   back />
  </Page>

  <Page id="help-modal">
    <Go on="close" closeModal />
  </Page>

  <!-- global: fires from any page -->
  <Go on="help" to="help-modal" modal />

</Flow>`}
      />

      <H3>{"<Go>"} element</H3>
      <Code
        lang="jsx"
        code={`<Go on="submit" to="shipping" />         <!-- push (default) -->
<Go on="help"   to="help-modal" modal /> <!-- open as modal -->
<Go on="back"   back />                  <!-- pop stack -->
<Go on="close"  closeModal />            <!-- close modal -->
<Go on="retry"  to="form" replace />     <!-- replace current screen -->`}
      />
      <PropTable
        rows={[
          ["Prop", "Description"],
          ["on", 'Action name emitted by a button (action="submit")'],
          ["to", "Target page id"],
          ["modal", "Open as a modal overlay"],
          ["back", "Pop navigation stack (to not needed)"],
          ["closeModal", "Close the topmost modal (to not needed)"],
          ["replace", "Replace current screen without adding to stack"],
        ]}
      />
      <P>
        <code>&lt;Go&gt;</code> inside <code>{"<Page id=\"x\">"}</code> is
        scoped to that page. <code>&lt;Go&gt;</code> at the{" "}
        <code>&lt;Flow&gt;</code> level is global — fires from any active page.
      </P>

      <H3>Page resolution order</H3>
      <Code
        lang="text"
        code={`1. src="./path.omx"              → explicit file
2. name="x" in same document     → local named block
3. name="x" anywhere in vault    → global search
4. not found                     → error: "page 'x' not found"`}
      />

      <Divider my="xl" />

      {/* ── Obsidian ─────────────────────────────────────────────── */}
      <H2>Obsidian / Markdown code fences</H2>
      <P>
        Use <code>```omx</code> as the language identifier. The{" "}
        <code>name=""</code> attribute makes a block addressable by any flow.
      </P>
      <Code
        lang="markdown"
        code={`\`\`\`omx name="contact" actions="submit, help"
<Page title="Contact">
  <Form>
    <Field name="email" label="Email" component="textInput" required />
    <ActionBar>
      <Button action="submit" variant="primary" label="Continue" />
      <Button action="help"   variant="ghost"   label="Help" />
    </ActionBar>
  </Form>
</Page>
\`\`\``}
      />
      <P>Reference it from a flow in any document:</P>
      <Code
        lang="jsx"
        code={`<Page id="contact" />   <!-- resolves to name="contact" -->`}
      />

      <H3>uses — explicit dependencies</H3>
      <Code
        lang="markdown"
        code={`\`\`\`omx name="checkout-flow" uses="contact, shipping, help-modal"
<Flow initial="contact">
  <Page id="contact" />
  <Page id="shipping" />
  <Page id="help-modal" />
</Flow>
\`\`\``}
      />
      <P>
        <code>uses</code> speeds up resolution and creates Obsidian backlinks
        from the flow to each page.
      </P>

      <H3>actions — action contract</H3>
      <Code
        lang="markdown"
        code={`\`\`\`omx name="contact" actions="submit, help"
…
\`\`\``}
      />
      <P>
        The flow parser warns if a declared action is not handled by any{" "}
        <code>&lt;Go&gt;</code>. Omit <code>actions</code> to skip validation
        for that page.
      </P>

      <H3>Editor setup for .omx files</H3>
      <P>
        <strong>VS Code</strong> — <code>.vscode/settings.json</code>:
      </P>
      <Code
        lang="json"
        code={`{ "files.associations": { "*.omx": "javascriptreact" } }`}
      />
      <P>
        <strong>IntelliJ / WebStorm</strong>: Settings → Editor → File Types →
        JSX → add <code>*.omx</code>.
      </P>

      <Divider my="xl" />

      {/* ── Full examples ─────────────────────────────────────────── */}
      <H2>Full example — single screen</H2>
      <Code
        lang="jsx"
        code={`<Page title="Order Details">
  <Breadcrumb items={["Orders", "ORD-1042"]} />
  <Tabs tabs={["Details", "Items", "History"]} active={0} />

  <Split ratio={0.65}>
    <Section title="Order info">
      <Form>
        <Field name="customer" label="Customer" component="select"
               options={["Acme Corp", "Globex"]} required />
        <Field name="status"   label="Status"   component="select"
               options={["Draft", "Confirmed", "Shipped"]} />
        <Field name="note"     label="Note"     component="textArea" />
      </Form>
    </Section>

    <Stack direction="vertical" gap={16}>
      <Card title="Summary">
        <Stat label="Items" value={3} />
        <Stat label="Total" value="$1 480" />
      </Card>
      <Alert variant="warning" text="Payment not received yet." />
    </Stack>
  </Split>

  <Section title="Line items">
    <Table
      columns="SKU / Product / Qty / Unit price / Total"
      rows="A-001 / Widget Pro / 2 / $240 / $480\\nB-012 / Bracket Kit / 10 / $18 / $180"
    />
  </Section>

  <ActionBar>
    <Button label="Confirm order" variant="primary" />
    <Button label="Save draft"    variant="secondary" />
    <LinkAction label="Cancel" />
  </ActionBar>
</Page>`}
      />

      <H2>Full example — multi-screen flow</H2>
      <P>
        <strong>contact.omx</strong>
      </P>
      <Code
        lang="jsx"
        code={`<Page title="Contact info">
  <Form>
    <Field name="name"  label="Full name" component="textInput" required />
    <Field name="email" label="Email"     component="textInput" required />
    <Field name="phone" label="Phone"     component="textInput" />
    <ActionBar>
      <Button action="submit" variant="primary" label="Continue" />
      <Button action="help"   variant="ghost"   label="Help" />
    </ActionBar>
  </Form>
</Page>`}
      />
      <P>
        <strong>shipping.omx</strong>
      </P>
      <Code
        lang="jsx"
        code={`<Page title="Shipping">
  <Form>
    <Field name="address" label="Address" component="textInput" required />
    <Field name="city"    label="City"    component="select"
           options={["Moscow", "Saint Petersburg", "Kazan"]} />
    <ActionBar>
      <Button action="submit" variant="primary"   label="Place order" />
      <Button action="back"   variant="secondary" label="Back" />
    </ActionBar>
  </Form>
</Page>`}
      />
      <P>
        <strong>checkout.flow.omx</strong>
      </P>
      <Code
        lang="jsx"
        code={`<Flow initial="contact">
  <Page id="contact"    src="./contact.omx" />
  <Page id="shipping"   src="./shipping.omx" />
  <Page id="help-modal" src="./help-modal.omx" />

  <Page id="done">
    <Heading>Order placed!</Heading>
  </Page>

  <Page id="contact">
    <Go on="submit" to="shipping" />
  </Page>

  <Page id="shipping">
    <Go on="submit" to="done" />
    <Go on="back"   back />
  </Page>

  <Page id="help-modal">
    <Go on="close" closeModal />
  </Page>

  <Go on="help" to="help-modal" modal />
</Flow>`}
      />

      <Divider my="xl" />

      {/* ── CLI ──────────────────────────────────────────────────── */}
      <H2>CLI</H2>
      <Code
        lang="bash"
        code={`openmockup page.openmockup          # validate — print title and node count
openmockup fmt page.openmockup      # normalise and pretty-print JSX
openmockup fmt page.openmockup -o out.openmockup
openmockup ir  page.openmockup      # dump IR as JSON
openmockup ir  page.openmockup | jq .title`}
      />

      <Divider my="xl" />

      {/* ── TypeScript DSL ───────────────────────────────────────── */}
      <H2>TypeScript DSL</H2>
      <P>For programmatic use or pipelines.</P>
      <Code
        lang="bash"
        code={`npm install @openmockup/dsl @openmockup/renderer-core @openmockup/renderer-mantine`}
      />
      <Code
        lang="typescript"
        code={`import { page, section, form, field, actionBar, button, linkAction } from "@openmockup/dsl";
import { render } from "@openmockup/renderer-core";
import { mantineRenderer } from "@openmockup/renderer-mantine";

const doc = page("New Order", [
  section("Order details", [
    form([
      field("customer", "Customer", "select", { options: ["Acme Corp", "Globex"], required: true }),
      field("due",  "Due date", "dateInput"),
      field("note", "Note",     "textArea"),
    ]),
  ]),
  actionBar([
    button("Create order", "primary"),
    button("Save draft",   "secondary"),
    linkAction("Cancel"),
  ]),
]);

const element = render(doc, mantineRenderer); // React.ReactElement`}
      />

      <Divider my="xl" />

      {/* ── Generation rules ─────────────────────────────────────── */}
      <H2>Generation rules</H2>
      <P>
        Follow these when producing <code>.openmockup</code> or{" "}
        <code>.omx</code> files:
      </P>
      <List spacing="xs" mb="md">
        <List.Item>
          Root is always <code>{"<Page title=\"…\">"}</code>.
        </List.Item>
        <List.Item>
          Use <code>CustomComponent</code> for unknown widgets — never invent
          new core element names.
        </List.Item>
        <List.Item>
          <code>Split</code> requires exactly two children.
        </List.Item>
        <List.Item>
          <code>boolean true</code> props use shorthand: <code>required</code>,
          not <code>required={"{true}"}</code>.
        </List.Item>
        <List.Item>
          <code>action</code> refs on{" "}
          <code>{"<Button action=\"…\">"}</code> use{" "}
          <code>verb-object</code> style:{" "}
          <code>save-order</code>, <code>open-filter</code>,{" "}
          <code>row-edit</code>.
        </List.Item>
        <List.Item>
          Table cell separator: <code> / </code> (space-slash-space). Row
          separator: <code>\n</code>.
        </List.Item>
        <List.Item>
          Run <code>openmockup path/to/file.openmockup</code> to validate
          output.
        </List.Item>
      </List>
    </Stack>
  );
}
